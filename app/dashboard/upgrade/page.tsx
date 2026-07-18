/**
 * Upgrade Dashboard Page
 * Subscription plans with current-plan indicator.
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Check, Percent } from 'lucide-react'

const plans = [
  { name: 'Free', price: '₦0', period: 'forever', popular: false, features: ['50 conversations/mo', 'Basic AI', '1 catalog', 'Email support'] },
  { name: 'Basic', price: '₦15,000', period: '/month', popular: true, features: ['500 conversations/mo', 'Advanced AI', 'Unlimited products', 'Order management', 'Analytics'] },
  { name: 'Pro', price: '₦45,000', period: '/month', popular: false, features: ['Unlimited conversations', 'CRM', 'Advanced reports', 'API access', 'Priority support'] },
  { name: 'Enterprise', price: 'Custom', period: '', popular: false, features: ['Everything in Pro', 'Dedicated model', 'SLA', 'White-label'] },
]

export default function UpgradePage() {
  const { toast } = useToast()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Upgrade Plan</h2>
        <p className="text-muted-foreground">You are currently on the <span className="font-medium">Free</span> plan.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.popular ? 'border-africa-primary/40 shadow-lg' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.popular && <Badge>Most Popular</Badge>}
              </div>
              <div className="text-2xl font-bold">
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-africa-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => toast({ title: `Selected ${plan.name}`, description: 'Checkout is not configured yet.' })}
              >
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Choose Plan'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
