/**
 * Business Onboard API Route
 * Creates or updates the current user's business during the onboarding wizard.
 * Called by the onboarding page (POST /api/business/onboard).
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { generateSlug } from '@/lib/utils'
import type { Industry, Currency } from '@/lib/types'

const onboardSchema = z.object({
  businessName: z.string().min(2, 'Business name is required').max(100),
  industry: z.string().optional(),
  description: z.string().max(500).optional(),
  country: z.string().optional(),
  currency: z.string().default('NGN'),
  timezone: z.string().default('Africa/Lagos'),
  primaryColor: z.string().optional(),
  aiPersonality: z.string().optional(),
  language: z.string().optional(),
  whatsappPhoneNumberId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'You must be signed in to set up a business' }, { status: 401 })
    }

    const body = await request.json()
    const validated = onboardSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.errors },
        { status: 400 }
      )
    }

    const { businessName, description, industry, currency, timezone, whatsappPhoneNumberId } = validated.data

    // Fall back to the configured WhatsApp number id when not provided
    const resolvedPhoneNumberId =
      whatsappPhoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID || undefined

    const existing = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
    })

    const business = existing
      ? await prisma.business.update({
          where: { id: existing.id },
          data: {
            name: businessName,
            description,
            industry: (industry as Industry) || undefined,
            currency: (currency as Currency) || 'NGN',
            timezone,
            whatsappPhoneNumberId: resolvedPhoneNumberId,
          },
        })
      : await prisma.business.create({
          data: {
            name: businessName,
            slug: generateSlug(businessName),
            description,
            industry: (industry as Industry) || undefined,
            currency: (currency as Currency) || 'NGN',
            timezone,
            whatsappPhoneNumberId: resolvedPhoneNumberId,
            ownerId: session.user.id,
          },
        })

    return NextResponse.json({ success: true, data: business })
  } catch (error) {
    console.error('Onboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
