/**
 * Customers API Route
 * Handles CRUD operations for customers
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { customerSchema, paginationSchema } from '@/lib/validations'
import { getTenant, unauthorized } from '@/lib/auth'

// GET /api/customers - List customers
export async function GET(request: NextRequest) {
  try {
    const tenant = await getTenant()
    if (!tenant) return unauthorized()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const minSpent = searchParams.get('minSpent')
    const maxSpent = searchParams.get('maxSpent')

    const skip = (page - 1) * limit

    const where: any = {
      businessId: tenant.businessId,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { whatsappNumber: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (minSpent || maxSpent) {
      where.totalSpent = {}
      if (minSpent) {
        where.totalSpent.gte = parseFloat(minSpent)
      }
      if (maxSpent) {
        where.totalSpent.lte = parseFloat(maxSpent)
      }
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          business: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              orders: true,
              whatsappMessages: true,
            },
          },
        },
      }),
      prisma.customer.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: customers,
      pagination: {
        total,
        page,
        limit,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('Get customers error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

// POST /api/customers - Create customer
export async function POST(request: NextRequest) {
  try {
    const tenant = await getTenant()
    if (!tenant) return unauthorized()

    const body = await request.json()
    const validatedData = customerSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validatedData.error.errors },
        { status: 400 }
      )
    }

    const { name, email, phone, whatsappNumber, ...customerData } = validatedData.data

    // Check if phone or WhatsApp number already exists
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        businessId: tenant.businessId,
        OR: [
          phone ? { phone } : {},
          whatsappNumber ? { whatsappNumber } : {},
        ].filter(Boolean),
      },
    })

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Customer with this phone or WhatsApp number already exists' },
        { status: 409 }
      )
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        whatsappNumber,
        businessId: tenant.businessId,
        createdById: tenant.userId,
        ...customerData,
      },
    })

    return NextResponse.json({
      success: true,
      data: customer,
    }, { status: 201 })
  } catch (error) {
    console.error('Create customer error:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}