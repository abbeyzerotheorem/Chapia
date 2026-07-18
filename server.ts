/**
 * Server setup for WhatsApp Sales AI SaaS Platform
 * Includes Socket.io and custom server configuration
 */

import { createServer } from 'http'
import { parse } from 'url'
import { initializeSocketIO } from './lib/socket'
import { NextApiRequest, NextApiResponse } from 'next'

// This file is used for custom server setup with Socket.io
// For Next.js 14 App Router, this is typically not needed unless using custom server

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function server() {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true)
      const { pathname, query } = parsedUrl

      // Handle WebSocket upgrade
      if (pathname === '/api/socket') {
        // Socket.io will handle this
        return
      }

      // For App Router, requests are handled by Next.js
      res.writeHead(200)
      res.end('API response')
    } catch (err) {
      console.error('Server error:', err)
      res.writeHead(500)
      res.end('Internal Server Error')
    }
  })

  // Initialize Socket.io
  const io = initializeSocketIO(server)

  const port = parseInt(process.env.PORT || '3000', 10)
  const host = process.env.HOST || 'localhost'

  server.listen(port, () => {
    console.log(`> Ready on http://${host}:${port}`)
  })

  return { server, io }
}