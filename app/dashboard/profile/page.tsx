/**
 * Profile Dashboard Page
 * View and edit the signed-in user's profile.
 */

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Save, User } from 'lucide-react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const displayName = name || session?.user?.name || ''
  const displayEmail = email || session?.user?.email || ''

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">Your personal account details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-africa-primary" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={displayName} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={displayEmail} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <Button
            onClick={() =>
              toast({ title: 'Profile updated', description: 'Your changes have been saved locally.' })
            }
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
