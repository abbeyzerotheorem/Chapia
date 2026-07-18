/**
 * Socket.io Setup for WhatsApp Sales AI SaaS Platform
 * Real-time communication for orders, messages, and notifications
 */

import { Server } from 'socket.io'
import { createServer } from 'http'
import { prisma } from './prisma'
import { verify } from 'jsonwebtoken'

interface SocketUser {
  id: string
  email: string
  businessId: string
  role: string
}

interface SocketData {
  user: SocketUser
  socketId: string
}

const connectedUsers: Map<string, SocketData> = new Map()

export function initializeSocketIO(server: ReturnType<typeof createServer>) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  })

  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1]

    if (!token) {
      return next(new Error('Authentication error'))
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET || 'your-jwt-secret') as SocketUser

      socket.data.user = decoded
      next()
    } catch (error) {
      return next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    const user = socket.data.user

    if (!user) {
      socket.disconnect()
      return
    }

    console.log(`User ${user.id} connected`)

    // Store user connection
    connectedUsers.set(user.id, {
      user,
      socketId: socket.id,
    })

    // Join business room
    socket.join(`business:${user.businessId}`)

    // Join user room
    socket.join(`user:${user.id}`)

    // Handle order updates
    socket.on('order:subscribe', () => {
      socket.join(`orders:${user.businessId}`)
    })

    // Handle message updates
    socket.on('messages:subscribe', () => {
      socket.join(`messages:${user.businessId}`)
    })

    // Handle notifications
    socket.on('notifications:subscribe', () => {
      socket.join(`notifications:${user.id}`)
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${user.id} disconnected`)
      connectedUsers.delete(user.id)
    })
  })

  return io
}

// ===========================================
// Socket Event Emitters
// ===========================================

export const emitOrderUpdate = (io: Server, orderId: string, businessId: string, data: any) => {
  io.to(`business:${businessId}`).emit('order:updated', {
    orderId,
    ...data,
  })
}

export const emitOrderCreated = (io: Server, orderId: string, businessId: string, data: any) => {
  io.to(`business:${businessId}`).emit('order:created', {
    orderId,
    ...data,
  })
}

export const emitMessageReceived = (io: Server, businessId: string, data: any) => {
  io.to(`business:${businessId}`).emit('message:received', data)
}

export const emitNotification = (io: Server, userId: string, data: any) => {
  io.to(`user:${userId}`).emit('notification:new', data)
}

export const emitCustomerUpdate = (io: Server, customerId: string, businessId: string, data: any) => {
  io.to(`business:${businessId}`).emit('customer:updated', {
    customerId,
    ...data,
  })
}

// ===========================================
// Helper function to get connected users
// ===========================================

export function getConnectedUsers(): SocketData[] {
  return Array.from(connectedUsers.values())
}

export function getUserSocketId(userId: string): string | undefined {
  return connectedUsers.get(userId)?.socketId
}

export function isUserConnected(userId: string): boolean {
  return connectedUsers.has(userId)
}

export default initializeSocketIO