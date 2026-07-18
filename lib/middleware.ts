/**
 * Middleware for WhatsApp Sales AI SaaS Platform
 * Authentication, rate limiting, and validation middleware
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from './prisma'

// ===========================================
// Authentication Middleware
// ===========================================
export async function authMiddleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Verify JWT token (implementation depends on your auth strategy)
    // This is a placeholder - implement proper JWT verification
    const session = await prisma.session.findFirst({
      where: { sessionToken: token },
      include: { user: true },
    })

    if (!session || session.expires < new Date()) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}

// ===========================================
// Business Context Middleware
// ===========================================
export async function businessMiddleware(request: NextRequest) {
  const businessSlug = request.cookies.get('business_slug')?.value

  if (!businessSlug) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 })
  }

  const business = await prisma.business.findUnique({
    where: { slug: businessSlug },
  })

  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 })
  }

  // Add business to request headers
  request.headers.set('x-business-id', business.id)

  return NextResponse.next()
}

// ===========================================
// Rate Limiting Middleware
// ===========================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  windowMs: number = 900000, // 15 minutes
  max: number = 100
) {
  return (request: NextRequest) => {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const window = rateLimitMap.get(ip)

    if (window && window.resetTime < now) {
      rateLimitMap.delete(ip)
    }

    if (window && window.count >= max) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    if (window) {
      window.count++
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    }

    return NextResponse.next()
  }
}

// ===========================================
// Validation Middleware
// ===========================================
export function validateBody(schema: any) {
  return (request: NextRequest) => {
    try {
      const body = request.json()
      const result = schema.safeParse(body)

      if (!result.success) {
        return NextResponse.json(
          { error: 'Validation failed', errors: result.error.errors },
          { status: 400 }
        )
      }

      return NextResponse.next()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }
  }
}

// ===========================================
// Error Handling Middleware
// ===========================================
export function errorHandler(error: any, request: NextRequest) {
  console.error('API Error:', error)

  const status = error.status || 500
  const message = error.message || 'Internal Server Error'

  return NextResponse.json(
    {
      error: message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
    { status }
  )
}

// ===========================================
// CORS Middleware
// ===========================================
export function corsMiddleware(request: NextRequest) {
  const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    headers: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 1 day
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': corsOptions.origin,
        'Access-Control-Allow-Methods': corsOptions.methods.join(', '),
        'Access-Control-Allow-Headers': corsOptions.headers.join(', '),
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': corsOptions.maxAge.toString(),
      },
    })
  }

  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', corsOptions.origin)
  response.headers.set('Access-Control-Allow-Methods', corsOptions.methods.join(', '))
  response.headers.set('Access-Control-Allow-Headers', corsOptions.headers.join(', '))
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  return response
}