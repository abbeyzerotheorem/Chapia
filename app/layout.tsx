/**
 * Root Layout for WhatsApp Sales AI SaaS Platform
 * Main application shell with providers and global styles
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: {
    default: 'WhatsApp Sales AI',
    template: `%s | WhatsApp Sales AI`,
  },
  description: 'AI-powered WhatsApp sales platform for African SMEs. Automate your sales, manage orders, and grow your business.',
  keywords: ['WhatsApp', 'Sales', 'AI', 'SaaS', 'Africa', 'SME', 'E-commerce'],
  authors: [
    {
      name: 'WhatsApp Sales AI Team',
      url: 'https://whatsappsales.ai',
    },
  ],
  creator: 'WhatsApp Sales AI',
  publisher: 'WhatsApp Sales AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://whatsappsales.ai',
    siteName: 'WhatsApp Sales AI',
    title: 'WhatsApp Sales AI',
    description: 'AI-powered WhatsApp sales platform for African SMEs.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WhatsApp Sales AI - AI-powered sales platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WhatsApp Sales AI',
    description: 'AI-powered WhatsApp sales platform for African SMEs.',
    creator: '@whatsappsales',
    images: '/og-image.png',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
  },
  viewport: 'width=device-width, initial-scale=1.0, viewport-fit=corner',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} font-sans antialiased`}
    >
      <head />
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">{children}</div>
              <Toaster />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}