/**
 * Products API Route
 * Handles CRUD operations for products
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productSchema, paginationSchema } from '@/lib/validations'
import { getTenant, unauthorized } from '@/lib/auth'
import { z } from 'zod'

// GET /api/products - List products
export async function GET(request: NextRequest) {
  try {
    const tenant = await getTenant()
    if (!tenant) return unauthorized()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    const inStock = searchParams.get('inStock') === 'true'

    const skip = (page - 1) * limit

    const where: any = {
      businessId: tenant.businessId,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.category = category
    }

    if (status) {
      where.status = status
    }

    if (inStock) {
      where.inventory = { gt: 0 }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
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
        },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create product
export async function POST(request: NextRequest) {
  try {
    const tenant = await getTenant()
    if (!tenant) return unauthorized()

    const body = await request.json()
    const validatedData = productSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validatedData.error.errors },
        { status: 400 }
      )
    }

    const { name, ...productData } = validatedData.data

    // Check if SKU exists
    if (productData.sku) {
      const existingProduct = await prisma.product.findUnique({
        where: { sku: productData.sku },
      })

      if (existingProduct) {
        return NextResponse.json(
          { error: 'SKU already exists' },
          { status: 409 }
        )
      }
    }

    // Generate slug
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`

    const product = await prisma.product.create({
      data: {
        ...productData,
        name,
        slug,
        businessId: tenant.businessId,
        createdById: tenant.userId,
      },
    })

    return NextResponse.json({
      success: true,
      data: product,
    }, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}