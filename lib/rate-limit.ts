/**
 * Rate limiting for WhatsApp Sales AI SaaS Platform.
 *
 * Uses a Redis-backed fixed-window counter when REDIS_URL is configured
 * (required for correct behaviour across serverless instances / multiple
 * nodes). Falls back to an in-memory counter when Redis is unavailable
 * (single-instance / local dev only — NOT safe for horizontal scaling).
 *
 * On Redis errors we fail OPEN (allow the request) rather than risk locking
 * out legitimate users, but we log a warning so the gap is visible.
 */

import { createClient } from 'redis'

type RedisClient = ReturnType<typeof createClient>

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  /** Epoch ms when the current window resets. */
  reset: number
}

const DEFAULT_LIMIT = Number(process.env.RATE_LIMIT_MAX ?? 100)
const DEFAULT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 900_000)

// ---------------------------------------------------------------------------
// Redis client (lazy singleton)
// ---------------------------------------------------------------------------
let redisPromise: Promise<RedisClient> | null = null

function getRedis(): Promise<RedisClient> | null {
  const url = process.env.REDIS_URL
  if (!url) return null

  if (!redisPromise) {
    const client = createClient({ url })
    client.on('error', () => {
      // Errors are handled per-request via the try/catch in rateLimit().
    })
    redisPromise = client.connect().then(() => client)
  }
  return redisPromise
}

// ---------------------------------------------------------------------------
// In-memory fallback
// ---------------------------------------------------------------------------
const memoryStore = new Map<string, { count: number; expiresAt: number }>()

function memoryLimit(identifier: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const entry = memoryStore.get(identifier)

  if (!entry || entry.expiresAt <= now) {
    memoryStore.set(identifier, { count: 1, expiresAt: now + windowMs })
    return { success: true, limit, remaining: limit - 1, reset: now + windowMs }
  }

  entry.count += 1
  const success = entry.count <= limit
  return {
    success,
    limit,
    remaining: Math.max(0, limit - entry.count),
    reset: entry.expiresAt,
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export async function rateLimit(
  identifier: string,
  options?: { limit?: number; windowMs?: number }
): Promise<RateLimitResult> {
  const limit = options?.limit ?? DEFAULT_LIMIT
  const windowMs = options?.windowMs ?? DEFAULT_WINDOW_MS

  const redisConn = getRedis()

  if (redisConn) {
    try {
      const redis = await redisConn
      const key = `rl:${identifier}`
      const count = await redis.incr(key)
      if (count === 1) {
        await redis.pExpire(key, windowMs)
      }
      const ttl = await redis.pTTL(key)
      const reset = Date.now() + (ttl > 0 ? ttl : windowMs)
      return {
        success: count <= limit,
        limit,
        remaining: Math.max(0, limit - count),
        reset,
      }
    } catch (err) {
      console.warn('[rate-limit] Redis unavailable, failing open:', (err as Error).message)
      return { success: true, limit, remaining: limit, reset: Date.now() + windowMs }
    }
  }

  return memoryLimit(identifier, limit, windowMs)
}

/** Builds a 429 response that includes standard RateLimit headers. */
export function rateLimitedResponse(result: RateLimitResult, identifier: string) {
  const retryAfter = Math.max(0, Math.ceil((result.reset - Date.now()) / 1000))
  return new Response(
    JSON.stringify({ error: 'Too many requests, please try again later.' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.reset),
      },
    }
  )
}
