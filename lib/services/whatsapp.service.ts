/**
 * WhatsApp Business API Service
 * Handles WhatsApp messaging, templates, and webhooks
 */

import axios, { type AxiosInstance } from 'axios'
import { prisma } from '../prisma'
import { type WhatsAppWebhookEvent, type WhatsAppContact } from '../types'

interface WhatsAppConfig {
  accessToken: string
  phoneNumberId: string
  apiUrl: string
  verifyToken: string
}

class WhatsAppService {
  private config: WhatsAppConfig
  private client: AxiosInstance

  constructor() {
    this.config = {
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      apiUrl: process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v19.0',
      verifyToken: process.env.WHATSAPP_WEBHOOK_SECRET || '',
    }

    this.client = axios.create({
      baseURL: this.config.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.accessToken}`,
      },
      timeout: 30000,
    })
  }

  /**
   * Verify webhook subscription
   */
  async verifyWebhook(mode: string, token: string, challenge: string): Promise<{ status: number; body: string }> {
    if (mode === 'subscribe' && token === this.config.verifyToken) {
      return {
        status: 200,
        body: challenge,
      }
    }
    return {
      status: 403,
      body: 'Forbidden',
    }
  }

  /**
   * Handle incoming webhook events.
   *
   * The business is resolved from the verified webhook payload by the route
   * handler; we look up its owner here so messages are attributed correctly.
   */
  async handleWebhookEvent(event: WhatsAppWebhookEvent, businessId: string): Promise<void> {
    const entry = event.entry[0]
    const changes = entry.changes[0]
    const value = changes.value

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { ownerId: true },
    })
    const userId = business?.ownerId || 'system'

    // Handle messages
    if (value.messages) {
      for (const message of value.messages) {
        await this.processIncomingMessage(message, userId, businessId)
      }
    }

    // Handle status updates
    if (value.statuses) {
      for (const status of value.statuses) {
        await this.updateMessageStatus(status, businessId)
      }
    }
  }

  /**
   * Process incoming message
   */
  private async processIncomingMessage(message: any, userId: string, businessId: string): Promise<void> {
    const customer = await prisma.customer.upsert({
      where: {
        whatsappNumber: message.from,
      },
      update: {},
      create: {
        name: message.profile?.name || '',
        whatsappNumber: message.from,
        businessId,
        createdById: userId,
      },
    })

    await prisma.whatsAppMessage.create({
      data: {
        messageId: message.id,
        direction: 'INCOMING',
        from: message.from,
        to: message.to || message.id,
        content: message.text?.body || '',
        messageType: message.type as any,
        mediaUrl: message.media?.link,
        status: 'SENT',
        businessId,
        customerId: customer.id,
        userId,
      },
    })
  }

  /**
   * Update message status
   */
  private async updateMessageStatus(status: any, businessId: string): Promise<void> {
    const statuses: Record<string, any> = {
      sent: 'SENT',
      delivered: 'DELIVERED',
      read: 'READ',
      failed: 'FAILED',
    }

    const prismaStatus = statuses[status.status] || 'SENT'

    await prisma.whatsAppMessage.updateMany({
      where: {
        messageId: status.id,
        businessId,
      },
      data: {
        status: prismaStatus as any,
        deliveredAt: status.status === 'delivered' ? new Date() : undefined,
        readAt: status.status === 'read' ? new Date() : undefined,
      },
    })
  }

  /**
   * Send a text message
   */
  async sendMessage(to: string, content: string, businessId: string, userId: string, orderId?: string): Promise<any> {
    try {
      const response = await this.client.post(
        `/${this.config.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: {
            preview_url: false,
            body: content,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
          },
        }
      )

      const customer = await prisma.customer.upsert({
        where: {
          whatsappNumber: to,
        },
        update: {},
        create: {
          name: '',
          whatsappNumber: to,
          businessId,
          createdById: userId,
        },
      })

      await prisma.whatsAppMessage.create({
        data: {
          messageId: response.data.messages[0].id,
          direction: 'OUTGOING',
          from: this.config.phoneNumberId,
          to,
          content,
          messageType: 'TEXT',
          status: 'SENT',
          businessId,
          customerId: customer.id,
          userId,
          orderId,
        },
      })

      return response.data
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error)
      throw error
    }
  }

  /**
   * Send a template message
   */
  async sendTemplateMessage(
    to: string,
    templateId: string,
    templateData: Record<string, any>,
    businessId: string,
    userId: string
  ): Promise<any> {
    try {
      const response = await this.client.post(
        `/${this.config.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'template',
          template: {
            name: templateId,
            language: {
              code: 'en',
            },
            components: this.formatTemplateComponents(templateData),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
          },
        }
      )

      return response.data
    } catch (error) {
      console.error('Failed to send WhatsApp template message:', error)
      throw error
    }
  }

  /**
   * Format template components from data
   */
  private formatTemplateComponents(data: Record<string, any>): any[] {
    const components: any[] = []

    // Body components
    const bodyItems = Object.entries(data)
      .filter(([key]) => !['header', 'footer'].includes(key))
      .map(([, value], index) => ({
        type: 'body',
        parameters: [{ type: 'text', text: String(value) }],
      }))

    if (bodyItems.length > 0) {
      components.push({
        type: 'body',
        parameters: Object.values(data).map((v) => ({ type: 'text', text: String(v) })),
      })
    }

    return components
  }

  /**
   * Get message template
   */
  async getTemplates(): Promise<any> {
    try {
      const response = await this.client.get(`/${this.config.phoneNumberId}/message_templates`)
      return response.data
    } catch (error) {
      console.error('Failed to get WhatsApp templates:', error)
      throw error
    }
  }

  /**
   * Get conversation depth
   */
  async getConversationDepth(to: string): Promise<any> {
    try {
      const response = await this.client.get(
        `/${this.config.phoneNumberId}/conversations`,
        {
          params: {
            messaging_product: 'whatsapp',
            phone_number_id: this.config.phoneNumberId,
            'phone-number-id': to,
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Failed to get conversation depth:', error)
      throw error
    }
  }

  /**
   * Send order confirmation
   */
  async sendOrderConfirmation(orderId: string, customerId: string, businessId: string, userId: string): Promise<any> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        items: {
          include: { product: true },
        },
      },
    })

    if (!order) {
      throw new Error('Order not found')
    }

    const content = `📦 Order Confirmation\n\nOrder #${order.orderNumber}\n\nItems:\n${order.items.map((item) => `- ${item.product.name} x${item.quantity}`).join('\n')}\n\nTotal: ${order.total}\n\nThank you for your order!`

    return this.sendMessage(
      order.customer.whatsappNumber || order.customer.phone || '',
      content,
      businessId,
      userId,
      orderId
    )
  }

  /**
   * Send payment reminder
   */
  async sendPaymentReminder(orderId: string, businessId: string, userId: string): Promise<any> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    })

    if (!order || order.paymentStatus !== 'PENDING') {
      throw new Error('Order not found or payment already processed')
    }

    const content = `💰 Payment Reminder\n\nHi ${order.customer.name},\n\nPlease complete your payment for order #${order.orderNumber}.\nTotal: ${order.total}\n\nTap to pay: https://wa.me/${order.customer.whatsappNumber || order.customer.phone}?text=I%20want%20to%20pay%20for%20order%20${order.orderNumber}`

    return this.sendMessage(
      order.customer.whatsappNumber || order.customer.phone || '',
      content,
      businessId,
      userId,
      orderId
    )
  }

  /**
   * Send bulk messages
   */
  async sendBulkMessages(
    messages: Array<{ to: string; content: string; orderId?: string }>,
    businessId: string,
    userId: string
  ): Promise<Array<{ success: boolean; error?: string }>> {
    const results = []

    for (const msg of messages) {
      try {
        await this.sendMessage(msg.to, msg.content, businessId, userId, msg.orderId)
        results.push({ success: true })
      } catch (error) {
        results.push({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    return results
  }
}

export const whatsappService = new WhatsAppService()
export default WhatsAppService