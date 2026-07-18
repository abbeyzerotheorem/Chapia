/**
 * Templates API Route
 * Handles message template CRUD operations
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { templateSchema } from '@/lib/validations'
import { getTenant, unauthorized } from '@/lib/auth'

// GET /api/templates - List templates
export async function GET(request: NextRequest) {
  try {
    const tenant = await getTenant()
    if (!tenant) return unauthorized()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || ''
    const isDefault = searchParams.get('isDefault')

    const where: any = {
      businessId: tenant.businessId,
    }

    if (category) {
      where.category = category
    }

    if (isDefault !== null) {
      where.isDefault = isDefault === 'true'
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        business: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: templates,
    })
  } catch (error) {
    console.error('Get templates error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// POST /api/templates - Create template
export async function POST(request: NextRequest) {
  try {
    const tenant = await getTenant()
    if (!tenant) return unauthorized()

    const body = await request.json()
    const validatedData = templateSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validatedData.error.errors },
        { status: 400 }
      )
    }

    // If setting as default, unset other defaults
    if (validatedData.data.isDefault) {
      await prisma.template.updateMany({
        where: { category: validatedData.data.category, businessId: tenant.businessId },
        data: { isDefault: false },
      })
    }

    const template = await prisma.template.create({
      data: {
        ...validatedData.data,
        businessId: tenant.businessId,
        createdById: tenant.userId,
      },
    })

    return NextResponse.json({
      success: true,
      data: template,
    }, { status: 201 })
  } catch (error) {
    console.error('Create template error:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}