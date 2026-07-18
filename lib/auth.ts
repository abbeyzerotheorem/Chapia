/**
 * Central authentication module for WhatsApp Sales AI SaaS Platform.
 *
 * Single source of truth for:
 *  - NextAuth options (also consumed by the [...nextauth] route handler)
 *  - Server-side session verification
 *  - Tenant (business) resolution for multi-tenant data isolation
 *
 * Every protected API route should call `getTenant()` and scope its Prisma
 * queries by the returned `businessId`. This guarantees a user can only ever
 * read or write data that belongs to their own business.
 */

import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { rateLimit } from '@/lib/rate-limit'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Throttle brute-force / credential-stuffing attempts per IP + email.
        const clientIp = getClientIp(req)
        const rl = await rateLimit(`login:${clientIp}:${credentials.email}`, {
          limit: 10,
          windowMs: 10 * 60 * 1000, // 10 attempts / 10 minutes
        })
        if (!rl.success) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.role = (token.role as string) || 'USER'
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/signup',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

/** The authenticated caller and the business they operate within. */
export interface Tenant {
  userId: string
  businessId: string
  role: string
}

/** Returns the current session, or null if unauthenticated. */
export function getSession() {
  return getServerSession(authOptions)
}

/**
 * Resolves the authenticated user and the business they belong to.
 *
 * Returns null when:
 *  - there is no valid session, or
 *  - the user has not completed business onboarding yet.
 *
 * Because the business is resolved from the verified session (never from a
 * request header), it is safe to use `businessId` to scope every query.
 */
export async function getTenant(): Promise<Tenant | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return null
  }

  const business = await prisma.business.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true },
  })

  if (!business) {
    return null
  }

  return {
    userId: session.user.id,
    businessId: business.id,
    role: session.user.role ?? 'USER',
  }
}

/** 401 response for unauthenticated requests. */
export function unauthorized(message = 'Authentication required') {
  return NextResponse.json({ error: message }, { status: 401 })
}

/** 403 response for authenticated-but-forbidden requests. */
export function forbidden(message = 'You do not have access to this resource') {
  return NextResponse.json({ error: message }, { status: 403 })
}

/**
 * Extracts the client IP from a NextAuth request object.
 * NextAuth v4 passes the (Node) request as the second arg to `authorize`.
 */
function getClientIp(req: unknown): string {
  const headers = (req as { headers?: Record<string, string | string[] | undefined> })?.headers
  if (headers) {
    const fwd = headers['x-forwarded-for']
    if (typeof fwd === 'string' && fwd.length > 0) {
      return fwd.split(',')[0].trim()
    }
  }
  const socket = (req as { socket?: { remoteAddress?: string } })?.socket
  return socket?.remoteAddress || 'unknown'
}
