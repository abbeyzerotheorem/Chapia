/**
 * Notifications API Route
 * Handles notification CRUD operations
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notificationSchema } from '@/lib/validations'
import { getTenant, unauthorized } from '@/lib/auth'

// GET /api/notifications - List notifications
export async function GET(request: NextRequest) {
  try {
    const tenant = await getTenant()
    if (!tenant) return unauthorized()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const read = searchParams.get('read')
    const type = searchParams.get('type') || ''

    const skip = (page - 1) * limit

    const where: any = {
      businessId: tenant.businessId,
      userId: tenant.userId,
    }

    if (read !== null) {
      where.read = read === 'true'
    }

    if (type) {
      where.type = type
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { ...where, read: false } }),
    ])

    return NextResponse.json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page,
        limit,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      unreadCount,
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Create notification
export async function POST(request: NextRequest) {
  try {
    const tenant = await getTenant()
    if (!tenant) return unauthorized()

    const body = await request.json()
    const validatedData = notificationSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validatedData.error.errors },
        { status: 400 }
      )
    }

    // Never trust client-supplied business/user ids
    const notification = await prisma.notification.create({
      data: {
        ...validatedData.data,
        businessId: tenant.businessId,
        userId: tenant.userId,
      },
    })

    return NextResponse.json({
      success: true,
      data: notification,
    }, { status: 201 })
  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

// PUT /api/notifications/mark-all-read - Mark all as read
export async function PUT(request: NextRequest) {
  try {
    const tenant = await getTenant()
    if (!tenant) return unauthorized()

    await prisma.notification.updateMany({
      where: { read: false, businessId: tenant.businessId, userId: tenant.userId },
      data: { read: true },
    })

    return NextResponse.json({
      success: true,
      message: 'All notifications marked as read',
    })
  } catch (error) {
    console.error('Mark notifications as read error:', error)
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    )
  }
}