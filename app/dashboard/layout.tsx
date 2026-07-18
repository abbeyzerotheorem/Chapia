/**
 * Dashboard Layout for WhatsApp Sales AI SaaS Platform
 * Main dashboard shell with sidebar, header, and navigation
 */

'use client'

import { ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  BarChart3,
  Bell,
  Bot,
  Calendar,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  DollarSign,
  FileText,
  Home,
  LogOut,
  Menu,
  Package,
  Percent,
  PhoneCall,
  Settings,
  ShoppingCart,
  Users,
  MessageCircle,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAppStore } from '@/lib/store/app.store'

const sidebarConfig = [
  {
    item: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    item: 'Orders',
    href: '/dashboard/orders',
    icon: ShoppingCart,
  },
  {
    item: 'Products',
    href: '/dashboard/products',
    icon: Package,
  },
  {
    item: 'Customers',
    href: '/dashboard/customers',
    icon: Users,
  },
  {
    item: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    item: 'WhatsApp',
    href: '/dashboard/whatsapp',
    icon: MessageCircle,
  },
  {
    item: 'Calls',
    href: '/dashboard/calls',
    icon: PhoneCall,
  },
  {
    item: 'Templates',
    href: '/dashboard/templates',
    icon: FileText,
  },
  {
    item: 'AI Assistant',
    href: '/dashboard/ai-assistant',
    icon: Bot,
  },
  {
    item: 'Reports',
    href: '/dashboard/reports',
    icon: ClipboardList,
  },
  {
    item: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, sidebarOpen, toggleSidebar } = useAppStore()
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[240px] p-0"
        >
          <nav className="flex flex-col h-full">
            <div className="px-4 py-6">
              <Link href="/" className="text-xl font-bold text-africa-primary">
                WhatsApp Sales AI
              </Link>
            </div>
            <div className="flex-1 px-4 py-2 space-y-1">
              {sidebarConfig.map((item) => (
                <Link
                  key={item.item}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                    pathname === item.href
                      ? 'bg-africa-primary/10 text-africa-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.item}
                </Link>
              ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col w-[240px] bg-card border-r border-border',
          !sidebarOpen && 'md:hidden'
        )}
      >
        <div className="px-4 py-6">
          <Link href="/" className="text-xl font-bold text-africa-primary">
            WhatsApp Sales AI
          </Link>
        </div>
        <nav className="flex-1 px-4 py-2 space-y-1">
          {sidebarConfig.map((item) => (
            <Link
              key={item.item}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                pathname === item.href
                  ? 'bg-africa-primary/10 text-africa-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.item}
            </Link>
          ))}
        </nav>
        <div className="p-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <Link href="/dashboard/upgrade">
              <Percent className="mr-3 h-4 w-4" />
              Upgrade Plan
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="text-xl font-bold text-africa-primary">
            WhatsApp Sales AI
          </Link>
          <ThemeToggle />
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div>
            <h1 className="text-lg font-semibold">
              {sidebarConfig.find((item) => item.href === pathname)?.item || 'Dashboard'}
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {session?.user?.name || 'User'}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-africa-secondary" />
            </Button>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar>
                    <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                    <AvatarFallback>
                      {session?.user?.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{session?.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/api/auth/signout">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}