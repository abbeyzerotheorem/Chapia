/**
 * Product Detail API Route
 * Handles GET, PUT, DELETE operations for individual products.
 * All operations are scoped to the authenticated user's business.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validations'
import { getTenant, unauthorized, forbidden } from '@/lib/auth'

// GET /api/products/[id] - Get single product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tenant = await getTenant()
    if (!tenant) return unauthorized()

    const product = await prisma.product.findFirst({
      where: { id: params.id, businessId: tenant.businessId },
      include: {
        business: {
          select: { id: true, name: true },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tenant = await getTenant()
    if (!tenant) return unauthorized()

    const body = await request.json()
    const validatedData = productSchema.partial().safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validatedData.error.errors },
        { status: 400 }
      )
    }

    const existingProduct = await prisma.product.findFirst({
      where: { id: params.id, businessId: tenant.businessId },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const { name, ...productData } = validatedData.data

    let slug = existingProduct.slug

    if (name && name !== existingProduct.name) {
      slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name && { name, slug }),
        ...productData,
      },
    })

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tenant = await getTenant()
    if (!tenant) return unauthorized()

    const existingProduct = await prisma.product.findFirst({
      where: { id: params.id, businessId: tenant.businessId },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
