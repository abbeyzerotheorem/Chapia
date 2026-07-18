/**
 * AI Assistant Dashboard Page
 * Configure the AI sales agent personality, language and escalation rules.
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Bot, Save } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const personalities = ['professional', 'friendly', 'casual', 'enthusiastic']
const languages = ['en', 'fr', 'pt', 'sw', 'ha', 'yo', 'ig', 'am']

export default function AIAssistantPage() {
  const { toast } = useToast()
  const [personality, setPersonality] = useState('friendly')
  const [language, setLanguage] = useState('en')
  const [handoff, setHandoff] = useState('')

  function onSave() {
    toast({
      title: 'AI settings saved',
      description: 'Your assistant configuration has been updated.',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">AI Assistant</h2>
        <p className="text-muted-foreground">Tune how your sales agent talks to customers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-africa-primary" />
            Personality & Language
          </CardTitle>
          <CardDescription>These settings control the tone of every AI reply.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>AI Personality</Label>
              <Select value={personality} onValueChange={setPersonality}>
                <SelectTrigger>
                  <SelectValue placeholder="Select personality" />
                </SelectTrigger>
                <SelectContent>
                  {personalities.map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((l) => (
                    <SelectItem key={l} value={l} className="uppercase">
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Escalation Rules</CardTitle>
          <CardDescription>
            When the AI should hand the conversation to a human agent.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="handoff">Human handoff trigger (keyword or phrase)</Label>
            <Input
              id="handoff"
              placeholder="e.g. talk to human, agent, complaint"
              value={handoff}
              onChange={(e) => setHandoff(e.target.value)}
            />
          </div>
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
