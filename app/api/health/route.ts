/**
 * Health check endpoint for load balancers / uptime probes.
 * Intentionally public and dependency-free so it never fails due to
 * downstream services (DB, Redis, WhatsApp).
 */

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
}
