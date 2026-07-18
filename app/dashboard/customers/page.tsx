/**
 * Customers Dashboard Page
 * Lists customers from the /api/customers endpoint.
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
import { Loader2, Users, Search, Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Customer {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  country?: string
  totalSpent: number
  totalOrders: number
  status: string
  currency?: string
}

async function fetchCustomers(search: string): Promise<Customer[]> {
  const res = await fetch(`/api/customers?limit=100${search ? `&search=${encodeURIComponent(search)}` : ''}`)
  if (!res.ok) throw new Error('Failed to load customers')
  const json = await res.json()
  return json.data ?? []
}

export default function CustomersPage() {
  const [search, setSearch] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['customers', search],
    queryFn: () => fetchCustomers(search),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">Your CRM — contacts, spend and history</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-africa-primary" />
            All Customers
          </CardTitle>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or phone..."
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
            <p className="py-12 text-center text-destructive">Failed to load customers.</p>
          ) : !data || data.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No customers yet. They will appear here as you sell on WhatsApp.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 pr-4 font-medium">Name</th>
                    <th className="py-3 pr-4 font-medium">Contact</th>
                    <th className="py-3 pr-4 font-medium">Country</th>
                    <th className="py-3 pr-4 font-medium">Total Spent</th>
                    <th className="py-3 pr-4 font-medium">Orders</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((c) => (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium">{c.name}</td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {c.email || c.phone || '—'}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{c.country || '—'}</td>
                      <td className="py-3 pr-4">{formatCurrency(c.totalSpent, c.currency || 'NGN')}</td>
                      <td className="py-3 pr-4">{c.totalOrders}</td>
                      <td className="py-3">
                        <Badge variant={c.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {c.status}
                        </Badge>
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
