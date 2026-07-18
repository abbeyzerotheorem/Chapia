/**
 * WhatsApp Dashboard Page
 * Conversations inbox scaffold. The backend webhook handler and
 * whatsapp.service exist; this is the agent-facing chat UI.
 */

'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { MessageCircle, Send, Smartphone, Settings2 } from 'lucide-react'

const conversations = [
  { id: '1', name: 'Amara Okafor', last: 'Thank you! When will it ship?', time: '10:31', unread: 2 },
  { id: '2', name: 'Kwame Mensah', last: 'Can I get the Ankara dress?', time: '09:15', unread: 0 },
]

export default function WhatsAppPage() {
  const [draft, setDraft] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">WhatsApp</h2>
          <p className="text-muted-foreground">Your AI-powered conversations inbox</p>
        </div>
        <Button variant="outline">
          <Settings2 className="mr-2 h-4 w-4" />
          Connection Settings
        </Button>
      </div>

      {/* Connection status */}
      <Card className="border-africa-primary/20 bg-africa-primary/5">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-africa-primary/10">
            <Smartphone className="h-5 w-5 text-africa-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Connect your WhatsApp Business number</p>
            <p className="text-xs text-muted-foreground">
              Link your number to start sending and receiving messages via the Cloud API.
            </p>
          </div>
          <Badge variant="outline">Not connected</Badge>
        </CardContent>
      </Card>

      <div className="grid h-[60vh] gap-4 md:grid-cols-[280px_1fr]">
        {/* Conversation list */}
        <Card className="overflow-hidden">
          <div className="border-b p-3">
            <Input placeholder="Search conversations..." />
          </div>
          <div className="divide-y overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">No conversations yet.</p>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  className="flex w-full items-center gap-3 p-3 text-left hover:bg-accent"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-africa-primary/10 text-sm font-medium text-africa-primary">
                    {c.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="truncate text-sm font-medium">{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.time}</span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{c.last}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-africa-primary text-xs text-white">
                      {c.unread}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Thread */}
        <Card className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b p-3">
            <MessageCircle className="h-5 w-5 text-africa-primary" />
            <span className="font-medium">Select a conversation</span>
          </div>
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Choose a chat to view the message thread.
          </div>
          <div className="flex items-center gap-2 border-t p-3">
            <Input
              placeholder="Type a message..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <Button size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
