/**
 * Prisma Client Singleton
 * Used for database access in the WhatsApp Sales AI SaaS Platform
 */

import { PrismaClient } from '@prisma/client'

declare global {
  // allow global `var` for PrismaClient in development
  // this prevents multiple instances of PrismaClient in hot reload
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

// Export types for use in API routes
export type PrismaClientType = typeof prisma