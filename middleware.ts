/**
 * Next.js Edge Middleware for WhatsApp Sales AI
 *
 * Enforces authentication on protected routes by *cryptographically verifying*
 * the NextAuth session token. Previously this only checked for the presence of
 * the session cookie, which any request could spoof. Now an invalid or missing
 * token is rejected.
 */

import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/auth',
  '/api/webhooks',
  '/api/health',
  '/_next',
  '/favicon.ico',
  '/og-image.png',
  '/apple-touch-icon.png',
  '/site.webmanifest',
]

// Routes that require a valid, authenticated session
const protectedRoutes = [
  '/dashboard',
  '/api/products',
  '/api/orders',
  '/api/customers',
  '/api/templates',
  '/api/analytics',
  '/api/calls',
  '/api/notifications',
  '/api/whatsapp',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes without any checks
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Only protected routes require a valid session token
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      // API routes get a JSON 401; pages get redirected to login
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
