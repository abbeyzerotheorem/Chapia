/**
 * Settings Dashboard Page
 * Business profile configuration. Reuses /api/business/onboard to persist.
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Save, Settings } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const industries = ['RETAIL', 'WHOLESALE', 'SERVICES', 'MANUFACTURING', 'AGRICULTURE', 'TOBACCO', 'OTHER']
const currencies = ['NGN', 'KES', 'GHS', 'ZAR', 'UGX', 'TZS']
const timezones = ['Africa/Lagos', 'Africa/Nairobi', 'Africa/Accra', 'Africa/Johannesburg', 'Africa/Kampala', 'Africa/Dar_es_Salaam']

export default function SettingsPage() {
  const { toast } = useToast()
  const [businessName, setBusinessName] = useState('')
  const [industry, setIndustry] = useState('RETAIL')
  const [currency, setCurrency] = useState('NGN')
  const [timezone, setTimezone] = useState('Africa/Lagos')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  async function onSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/business/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, industry, currency, timezone, description }),
      })
      if (!res.ok) throw new Error('Failed to save')
      toast({ title: 'Settings saved', description: 'Your business profile has been updated.' })
    } catch {
      toast({
        title: 'Could not save',
        description: 'Make sure you are signed in and try again.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your business profile</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-africa-primary" />
            Business Profile
          </CardTitle>
          <CardDescription>Update your company details and regional preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Business Name</Label>
            <Input id="name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your business name" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((i) => (
                    <SelectItem key={i} value={i}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue placeholder="Timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <textarea
              id="desc"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Tell customers about your business..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button onClick={onSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
