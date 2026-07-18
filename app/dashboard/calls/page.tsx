/**
 * Calls Dashboard Page
 * Lists call logs from the /api/calls endpoint.
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, PhoneCall } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Call {
  id: string
  direction: string
  to: string
  duration: number
  status: string
  createdAt: string
  customer?: { name: string } | null
}

async function fetchCalls(): Promise<Call[]> {
  const res = await fetch('/api/calls?limit=100')
  if (!res.ok) throw new Error('Failed to load calls')
  const json = await res.json()
  return json.data ?? []
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export default function CallsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['calls'],
    queryFn: fetchCalls,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Calls</h2>
        <p className="text-muted-foreground">Call logs and recordings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PhoneCall className="h-5 w-5 text-africa-primary" />
            Call History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <p className="py-12 text-center text-destructive">Failed to load calls.</p>
          ) : !data || data.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No calls logged yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 pr-4 font-medium">Direction</th>
                    <th className="py-3 pr-4 font-medium">Customer</th>
                    <th className="py-3 pr-4 font-medium">To</th>
                    <th className="py-3 pr-4 font-medium">Duration</th>
                    <th className="py-3 pr-4 font-medium">Date</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((c) => (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="py-3 pr-4">
                        <Badge variant={c.direction === 'INCOMING' ? 'default' : 'secondary'}>
                          {c.direction}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 font-medium">{c.customer?.name || '—'}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{c.to}</td>
                      <td className="py-3 pr-4">{formatDuration(c.duration)}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{formatDate(c.createdAt)}</td>
                      <td className="py-3">
                        <Badge variant={c.status === 'COMPLETED' ? 'default' : 'outline'}>
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
