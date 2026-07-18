/**
 * Dashboard Overview Page
 * Main dashboard with analytics and quick actions
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, DollarSign, ShoppingCart, Users, Package, MessageCircle, Bot } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { type ChartData } from '@/lib/types'
// Note: Recharts may need to be installed separately. Uses Chart.js as fallback.

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface OverviewData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  monthlyRevenue: number
  conversionRate: number
}

interface RevenueData {
  month: string
  revenue: number
}

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  change?: number
  changeText?: string
  icon?: React.ReactNode
}

function StatsCard({
  title,
  value,
  description,
  change,
  changeText,
  icon,
}: StatsCardProps) {
  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {change !== undefined && changeText && (
          <p className="text-xs text-green-600">
            {change}% {changeText}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

async function fetchOverviewData(): Promise<OverviewData> {
  // This would be a server action or fetched from the API
  return {
    totalRevenue: 125000,
    totalOrders: 342,
    totalCustomers: 156,
    totalProducts: 89,
    monthlyRevenue: 28500,
    conversionRate: 12.5,
  }
}

async function fetchRevenueData(): Promise<RevenueData[]> {
  return [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 19000 },
    { month: 'Mar', revenue: 15000 },
    { month: 'Apr', revenue: 18000 },
    { month: 'May', revenue: 22000 },
    { month: 'Jun', revenue: 28500 },
  ]
}

export default function DashboardOverview() {
  const { data: overview, isLoading: isLoadingOverview } = useQuery({
    queryKey: ['overview'],
    queryFn: fetchOverviewData,
    staleTime: 60 * 1000,
  })

  const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['revenue-data'],
    queryFn: fetchRevenueData,
    staleTime: 60 * 1000,
  })

  if (isLoadingOverview || isLoadingRevenue) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Here's what's happening with your WhatsApp Sales AI platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(overview?.totalRevenue || 0)}
          description="All time revenue"
          change={12}
          changeText="from last month"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Orders"
          value={overview?.totalOrders?.toLocaleString() || '0'}
          description="Total orders placed"
          change={8}
          changeText="from last month"
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Customers"
          value={overview?.totalCustomers?.toLocaleString() || '0'}
          description="Active customers"
          change={15}
          changeText="from last month"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Products"
          value={overview?.totalProducts?.toLocaleString() || '0'}
          description="Active products"
          icon={<Package className="h-4 w-4" />}
        />
      </div>

      {/* Revenue Chart */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>Monthly revenue for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${formatCurrency(value)}`, 'Revenue']} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Start a new sale or view recent activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start">
              <a href="/dashboard/orders">
                <ShoppingCart className="mr-2 h-4 w-4" />
                New Order
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <a href="/dashboard/whatsapp">
                <MessageCircle className="mr-2 h-4 w-4" />
                Send WhatsApp Message
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <a href="/dashboard/products">
                <Package className="mr-2 h-4 w-4" />
                Manage Products
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <a href="/dashboard/ai-assistant">
                <Bot className="mr-2 h-4 w-4" />
                AI Assistant
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* This would be populated with actual order data */}
            <div className="text-center py-8 text-muted-foreground">
              No recent orders
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}