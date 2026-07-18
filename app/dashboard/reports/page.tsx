/**
 * Reports Dashboard Page
 * Summary reports scaffold with export actions.
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ClipboardList, Download } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

async function fetchOverview(): Promise<{ totalRevenue: number; totalOrders: number; totalCustomers: number; totalProducts: number }> {
  const res = await fetch('/api/analytics?metricType=REVENUE&period=DAILY')
  if (!res.ok) throw new Error('Failed to load')
  // The overview stats are not exposed via GET; fall back to zeros gracefully.
  return { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, totalProducts: 0 }
}

export default function ReportsPage() {
  const { isLoading } = useQuery({ queryKey: ['reports-overview'], queryFn: fetchOverview })

  const stats = [
    { label: 'Total Revenue', value: '—' },
    { label: 'Total Orders', value: '—' },
    { label: 'Total Customers', value: '—' },
    { label: 'Total Products', value: '—' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Exportable business summaries</p>
        </div>
        <Button variant="outline" disabled={isLoading}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-africa-primary" />
            Detailed Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : (
            <p>
              Detailed, filterable reports (sales, messages, conversions) are coming next.
              Use the Analytics page for live charts in the meantime.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
