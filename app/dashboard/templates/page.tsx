/**
 * Templates Dashboard Page
 * Lists WhatsApp message templates from the /api/templates endpoint.
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
import { Button } from '@/components/ui/button'
import { Loader2, FileText, Plus } from 'lucide-react'

interface Template {
  id: string
  name: string
  category: string
  content: string
  isDefault: boolean
}

async function fetchTemplates(): Promise<Template[]> {
  const res = await fetch('/api/templates')
  if (!res.ok) throw new Error('Failed to load templates')
  const json = await res.json()
  return json.data ?? []
}

export default function TemplatesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Templates</h2>
          <p className="text-muted-foreground">Reusable WhatsApp message templates</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-africa-primary" />
            Message Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <p className="py-12 text-center text-destructive">Failed to load templates.</p>
          ) : !data || data.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No templates yet. Create one to speed up your conversations.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((t) => (
                <div key={t.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">{t.name}</span>
                    {t.isDefault && <Badge variant="default">Default</Badge>}
                  </div>
                  <Badge variant="outline" className="mb-2">
                    {t.category}
                  </Badge>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{t.content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
