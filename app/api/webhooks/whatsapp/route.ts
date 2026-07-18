/**
 * WhatsApp Webhook API Route
 * Handles incoming WhatsApp webhook events.
 *
 * Security:
 *  - GET (verification) is matched against WHATSAPP_WEBHOOK_SECRET.
 *  - POST payloads are authenticated via the `x-hub-signature-256` HMAC
 *    signature. Requests with a missing/invalid signature are rejected (403).
 *  - The business is resolved from the verified payload's phone number id,
 *    never from request headers (which are attacker-controlled).
 */

import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { prisma } from '@/lib/prisma'
import { whatsappService } from '@/lib/services/whatsapp.service'
import { rateLimit, rateLimitedResponse } from '@/lib/rate-limit'

export const runtime = 'nodejs'

// GET /api/webhooks/whatsapp - Verify webhook subscription
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const result = await whatsappService.verifyWebhook(mode || '', token || '', challenge || '')

  return new Response(result.body, { status: result.status })
}

/**
 * Constant-time comparison of the expected and received HMAC signatures.
 * Returns false when the secret or signature is missing, or they don't match.
 */
function verifySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.WHATSAPP_WEBHOOK_SECRET
  if (!secret || !signature) {
    return false
  }

  const expected = 'sha256=' + createHmac('sha256', secret).update(rawBody).digest('base64')
  const expectedBuf = Buffer.from(expected)
  const receivedBuf = Buffer.from(signature)

  if (expectedBuf.length !== receivedBuf.length) {
    return false
  }

  return timingSafeEqual(expectedBuf, receivedBuf)
}

// POST /api/webhooks/whatsapp - Handle webhook events
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()

    // Reject any request that isn't signed with our secret
    const signature = request.headers.get('x-hub-signature-256')
    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    // Cheap abuse protection per source IP (signature is still required)
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
    const rl = await rateLimit(`webhook:${clientIp}`, {
      limit: 200,
      windowMs: 60 * 1000, // 200 requests / minute per IP
    })
    if (!rl.success) {
      return rateLimitedResponse(rl, `webhook:${clientIp}`)
    }

    const body = JSON.parse(rawBody)

    // Identify which business this event belongs to via the phone number id
    const phoneNumberId =
      body?.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id

    if (!phoneNumberId) {
      // Not a message/status event (e.g. a subscription test) — acknowledge it
      return NextResponse.json({ status: 'ok' })
    }

    const business = await prisma.business.findFirst({
      where: { whatsappPhoneNumberId: phoneNumberId },
      select: { id: true },
    })

    if (!business) {
      // Unknown number: nothing to do, but acknowledge so Meta stops retrying
      return NextResponse.json({ status: 'ignored' }, { status: 200 })
    }

    await whatsappService.handleWebhookEvent(body, business.id)

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
