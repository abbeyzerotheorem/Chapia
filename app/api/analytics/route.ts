/**
 * Analytics API Route
 * Handles analytics data fetching and aggregation
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { analyticsQuerySchema } from '@/lib/validations'
import { getTenant, unauthorized } from '@/lib/auth'
import { subDays, startOfDay, endOfDay } from 'date-fns'

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const tenant = await getTenant()
    if (!tenant) return unauthorized()

    const { searchParams } = new URL(request.url)
    const metricType = searchParams.get('metricType') || 'REVENUE'
    const period = searchParams.get('period') || 'DAILY'
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Default date range: last 30 days
    const endDate = dateTo ? new Date(dateTo) : new Date()
    const startDate = dateFrom ? new Date(dateFrom) : subDays(endDate, 30)

    const data = await fetchAnalyticsData(metricType, period, startDate, endDate, tenant.businessId)

    return NextResponse.json({
      success: true,
      data,
      filters: {
        metricType,
        period,
        dateFrom: startDate.toISOString(),
        dateTo: endDate.toISOString(),
      },
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

// Helper function to fetch analytics data
async function fetchAnalyticsData(
  metricType: string,
  period: string,
  startDate: Date,
  endDate: Date,
  businessId: string
): Promise<{ labels: string[]; data: number[] }> {
  const labels: string[] = []
  const data: number[] = []

  switch (metricType) {
    case 'REVENUE':
      return await fetchRevenueData(period, startDate, endDate, businessId)
    case 'ORDERS':
      return await fetchOrdersData(period, startDate, endDate, businessId)
    case 'CUSTOMERS':
      return await fetchCustomersData(period, startDate, endDate, businessId)
    case 'CONVERSIONS':
      return await fetchConversionsData(period, startDate, endDate, businessId)
    default:
      return { labels: [], data: [] }
  }
}

async function fetchRevenueData(period: string, startDate: Date, endDate: Date, businessId: string): Promise<{ labels: string[]; data: number[] }> {
  const orders = await prisma.order.findMany({
    where: {
      businessId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      paymentStatus: 'COMPLETED',
    },
    select: {
      total: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  const grouped: Record<string, number> = {}

  orders.forEach((order) => {
    const key = period === 'DAILY' ? order.createdAt.toISOString().split('T')[0] :
                period === 'WEEKLY' ? getWeekKey(order.createdAt) :
                period === 'MONTHLY' ? getMonthKey(order.createdAt) :
                order.createdAt.toISOString().split('T')[0]

    if (!grouped[key]) {
      grouped[key] = 0
    }
    grouped[key] += order.total
  })

  return {
    labels: Object.keys(grouped),
    data: Object.values(grouped),
  }
}

async function fetchOrdersData(period: string, startDate: Date, endDate: Date, businessId: string): Promise<{ labels: string[]; data: number[] }> {
  const orders = await prisma.order.findMany({
    where: {
      businessId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  const grouped: Record<string, number> = {}

  orders.forEach((order) => {
    const key = period === 'DAILY' ? order.createdAt.toISOString().split('T')[0] :
                period === 'WEEKLY' ? getWeekKey(order.createdAt) :
                period === 'MONTHLY' ? getMonthKey(order.createdAt) :
                order.createdAt.toISOString().split('T')[0]

    grouped[key] = (grouped[key] || 0) + 1
  })

  return {
    labels: Object.keys(grouped),
    data: Object.values(grouped),
  }
}

async function fetchCustomersData(period: string, startDate: Date, endDate: Date, businessId: string): Promise<{ labels: string[]; data: number[] }> {
  const customers = await prisma.customer.findMany({
    where: {
      businessId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  const grouped: Record<string, number> = {}

  customers.forEach((customer) => {
    const key = period === 'DAILY' ? customer.createdAt.toISOString().split('T')[0] :
                period === 'WEEKLY' ? getWeekKey(customer.createdAt) :
                period === 'MONTHLY' ? getMonthKey(customer.createdAt) :
                customer.createdAt.toISOString().split('T')[0]

    grouped[key] = (grouped[key] || 0) + 1
  })

  return {
    labels: Object.keys(grouped),
    data: Object.values(grouped),
  }
}

async function fetchConversionsData(period: string, startDate: Date, endDate: Date, businessId: string): Promise<{ labels: string[]; data: number[] }> {
  const orders = await prisma.order.findMany({
    where: {
      businessId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      createdAt: true,
      status: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  const grouped: Record<string, { total: number; converted: number }> = {}

  orders.forEach((order) => {
    const key = period === 'DAILY' ? order.createdAt.toISOString().split('T')[0] :
                period === 'WEEKLY' ? getWeekKey(order.createdAt) :
                period === 'MONTHLY' ? getMonthKey(order.createdAt) :
                order.createdAt.toISOString().split('T')[0]

    if (!grouped[key]) {
      grouped[key] = { total: 0, converted: 0 }
    }
    grouped[key].total += 1
    if (order.status === 'DELIVERED' || order.status === 'COMPLETED') {
      grouped[key].converted += 1
    }
  })

  const labels = Object.keys(grouped)
  const data = labels.map((label) => {
    const item = grouped[label]
    return item.total > 0 ? (item.converted / item.total) * 100 : 0
  })

  return { labels, data }
}

// Helper functions
function getWeekKey(date: Date): string {
  const start = startOfDay(date)
  const weekStart = subDays(start, start.getDay())
  return weekStart.toISOString().split('T')[0]
}

function getMonthKey(date: Date): string {
  return date.toISOString().slice(0, 7)
}

// GET /api/analytics/overview - Get overview stats
export async function HEAD(request: NextRequest) {
  try {
    const tenant = await getTenant()
    if (!tenant) return unauthorized()

    const [totalRevenue, totalOrders, totalCustomers, totalProducts] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: { businessId: tenant.businessId, paymentStatus: 'COMPLETED' },
      }),
      prisma.order.count({ where: { businessId: tenant.businessId } }),
      prisma.customer.count({ where: { businessId: tenant.businessId } }),
      prisma.product.count({ where: { businessId: tenant.businessId } }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: totalRevenue._sum.total || 0,
        totalOrders: totalOrders,
        totalCustomers: totalCustomers,
        totalProducts: totalProducts,
      },
    })
  } catch (error) {
    console.error('Analytics overview error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics overview' },
      { status: 500 }
    )
  }
}