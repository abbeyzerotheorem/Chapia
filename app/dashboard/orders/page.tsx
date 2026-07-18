/**
 * Orders Dashboard Page
 * Lists orders from the /api/orders endpoint.
 */

'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, ShoppingCart, Search, Plus } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
  paymentStatus: string
  currency?: string
  createdAt: string
  customer?: { name: string } | null
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PENDING: 'outline',
  PROCESSING: 'secondary',
  SHIPPED: 'secondary',
  DELIVERED: 'default',
  COMPLETED: 'default',
  CANCELLED: 'destructive',
  REFUNDED: 'destructive',
}

async function fetchOrders(search: string): Promise<Order[]> {
  const res = await fetch(`/api/orders?limit=100${search ? `&search=${encodeURIComponent(search)}` : ''}`)
  if (!res.ok) throw new Error('Failed to load orders')
  const json = await res.json()
  return json.data ?? []
}

export default function OrdersPage() {
  const [search, setSearch] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders', search],
    queryFn: () => fetchOrders(search),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">Track and manage customer orders</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-4">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-africa-primary" />
            Recent Orders
          </CardTitle>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search order number or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <p className="py-12 text-center text-destructive">Failed to load orders.</p>
          ) : !data || data.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No orders yet. Create one to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 pr-4 font-medium">Order #</th>
                    <th className="py-3 pr-4 font-medium">Customer</th>
                    <th className="py-3 pr-4 font-medium">Date</th>
                    <th className="py-3 pr-4 font-medium">Total</th>
                    <th className="py-3 pr-4 font-medium">Payment</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((o) => (
                    <tr key={o.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium">{o.orderNumber}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{o.customer?.name || '—'}</td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {formatDate(o.createdAt)}
                      </td>
                      <td className="py-3 pr-4">{formatCurrency(o.total, o.currency || 'NGN')}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={o.paymentStatus === 'COMPLETED' ? 'default' : 'outline'}>
                          {o.paymentStatus}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={statusVariant[o.status] || 'secondary'}>{o.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
