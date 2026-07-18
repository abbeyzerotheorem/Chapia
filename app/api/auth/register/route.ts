/**
 * Register API Route
 * Creates a new user account (and an initial business for that user).
 * Called by the signup page (POST /api/auth/register).
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'
import { hash } from 'bcryptjs'
import { generateSlug } from '@/lib/utils'
import { rateLimit, rateLimitedResponse } from '@/lib/rate-limit'
import type { Industry, Currency } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    // Throttle signup abuse (account farming / enumeration) per IP.
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
    const rl = await rateLimit(`register:${clientIp}`, {
      limit: 10,
      windowMs: 60 * 60 * 1000, // 10 signups / hour per IP
    })
    if (!rl.success) {
      return rateLimitedResponse(rl, `register:${clientIp}`)
    }

    const body = await request.json()
    const validated = registerSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.errors },
        { status: 400 }
      )
    }

    const { name, email, phone, password, businessName, industry } = validated.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        businesses: businessName
          ? {
              create: {
                name: businessName,
                slug: generateSlug(businessName),
                industry: (industry as Industry) || undefined,
                currency: 'NGN' as Currency,
                timezone: 'Africa/Lagos',
              },
            }
          : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      { success: true, data: user, message: 'Account created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
