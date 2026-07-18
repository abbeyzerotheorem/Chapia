/**
 * Analytics Dashboard Page
 * Revenue / orders / customer charts from the /api/analytics endpoint.
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
import { Button } from '@/components/ui/button'
import { Loader2, BarChart3 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const METRICS = [
  { key: 'REVENUE', label: 'Revenue' },
  { key: 'ORDERS', label: 'Orders' },
  { key: 'CUSTOMERS', label: 'Customers' },
] as const

interface AnalyticsData {
  labels: string[]
  data: number[]
}

async function fetchAnalytics(metric: string): Promise<AnalyticsData> {
  const res = await fetch(`/api/analytics?metricType=${metric}&period=DAILY`)
  if (!res.ok) throw new Error('Failed to load analytics')
  const json = await res.json()
  return json.data ?? { labels: [], data: [] }
}

export default function AnalyticsPage() {
  const [metric, setMetric] = useState<(typeof METRICS)[number]['key']>('REVENUE')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics', metric],
    queryFn: () => fetchAnalytics(metric),
  })

  const chartData = (data?.labels ?? []).map((label: string, i: number) => ({
    label,
    value: data?.data?.[i] ?? 0,
  }))

  const total = (data?.data ?? []).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Performance over the last 30 days</p>
        </div>
        <div className="flex gap-2">
          {METRICS.map((m) => (
            <Button
              key={m.key}
              size="sm"
              variant={metric === m.key ? 'default' : 'outline'}
              onClick={() => setMetric(m.key)}
            >
              {m.label}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-africa-primary" />
            {metric.charAt(0) + metric.slice(1).toLowerCase()} Trend
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Total: {metric === 'REVENUE' ? formatCurrency(total) : total.toLocaleString()}
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <p className="py-12 text-center text-destructive">Failed to load analytics.</p>
          ) : chartData.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No data available yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  formatter={(value: number) => [metric === 'REVENUE' ? formatCurrency(value) : value, metric]}
                  contentStyle={{
                    background: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#grad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
