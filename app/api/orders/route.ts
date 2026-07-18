/**
 * Orders API Route
 * Handles CRUD operations for orders
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createOrderSchema, paginationSchema } from '@/lib/validations'
import { getTenant, unauthorized, forbidden } from '@/lib/auth'
import { z } from 'zod'

// GET /api/orders - List orders
export async function GET(request: NextRequest) {
  try {
    const tenant = await getTenant()
    if (!tenant) return unauthorized()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const paymentStatus = searchParams.get('paymentStatus') || ''
    const customerId = searchParams.get('customerId') || ''
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const skip = (page - 1) * limit

    const where: any = {
      businessId: tenant.businessId,
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus
    }

    if (customerId) {
      where.customerId = customerId
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

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              whatsappNumber: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
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
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        limit,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create order
export async function POST(request: NextRequest) {
  try {
    const tenant = await getTenant()
    if (!tenant) return unauthorized()

    const body = await request.json()
    const validatedData = createOrderSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validatedData.error.errors },
        { status: 400 }
      )
    }

    const { customerId, items, notes, paymentMethod } = validatedData.data

    // Verify customer exists and belongs to this business
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    if (customer.businessId !== tenant.businessId) {
      return forbidden('Customer does not belong to your business')
    }

    // Calculate order totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 404 }
        )
      }

      if (product.inventory < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient inventory for ${product.name}` },
          { status: 400 }
        )
      }

      const total = product.price * item.quantity
      subtotal += total

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        total,
      })
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId,
        items: {
          create: orderItems,
        },
        subtotal,
        total: subtotal,
        notes,
        paymentMethod: paymentMethod || 'WHATSAPP_PAY',
        businessId: customer.businessId,
        createdById: tenant.userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    })

    // Update product inventory
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          inventory: {
            decrement: item.quantity,
          },
        },
      })
    }

    // Update customer stats
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        totalSpent: {
          increment: subtotal,
        },
        totalOrders: {
          increment: 1,
        },
        lastOrderAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: order,
    }, { status: 201 })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}