/**
 * NextAuth API Route
 * Authentication endpoint for WhatsApp Sales AI SaaS Platform.
 *
 * Auth configuration lives in `@/lib/auth` so API routes and the middleware
 * can share the same options.
 */

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
