/**
 * Calls API Route
 * Handles call logging and management
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createCallSchema } from '@/lib/validations'
import { getTenant, unauthorized, forbidden } from '@/lib/auth'

// GET /api/calls - List calls
export async function GET(request: NextRequest) {
  try {
    const tenant = await getTenant()
    if (!tenant) return unauthorized()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const direction = searchParams.get('direction') || ''
    const status = searchParams.get('status') || ''
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const skip = (page - 1) * limit

    const where: any = {
      businessId: tenant.businessId,
    }

    if (direction) {
      where.direction = direction
    }

    if (status) {
      where.status = status
    }

    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo)
      }
    }

    const [calls, total] = await Promise.all([
      prisma.call.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
              whatsappNumber: true,
            },
          },
          business: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.call.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: calls,
      pagination: {
        total,
        page,
        limit,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('Get calls error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calls' },
      { status: 500 }
    )
  }
}

// POST /api/calls - Create call record
export async function POST(request: NextRequest) {
  try {
    const tenant = await getTenant()
    if (!tenant) return unauthorized()

    const body = await request.json()
    const validatedData = createCallSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validatedData.error.errors },
        { status: 400 }
      )
    }

    // Ensure the referenced customer belongs to this business
    const customer = await prisma.customer.findFirst({
      where: { id: validatedData.data.customerId, businessId: tenant.businessId },
      select: { id: true },
    })

    if (!customer) {
      return forbidden('Customer does not belong to your business')
    }

    const call = await prisma.call.create({
      data: {
        ...validatedData.data,
        businessId: tenant.businessId,
        callId: `CALL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        from: 'system',
        userId: tenant.userId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: call,
    }, { status: 201 })
  } catch (error) {
    console.error('Create call error:', error)
    return NextResponse.json(
      { error: 'Failed to create call record' },
      { status: 500 }
    )
  }
}