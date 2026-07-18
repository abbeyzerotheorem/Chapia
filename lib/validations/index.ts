/**
 * Validation schemas using Zod for WhatsApp Sales AI SaaS Platform
 */

import { z } from 'zod'

// ===========================================
// Common Validation Schemas
// ===========================================
export const emailSchema = z.string().email('Please enter a valid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')

export const phoneSchema = z.string().optional().refine((val) => !val || /^\+?[0-9]{10,15}$/.test(val), {
  message: 'Please enter a valid phone number',
})

export const urlSchema = z.string().url('Please enter a valid URL').optional()

// ===========================================
// User Schemas
// ===========================================
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  businessName: z.string().min(2, 'Business name is required').max(100, 'Business name is too long'),
  industry: z.enum(['RETAIL', 'WHOLESALE', 'SERVICES', 'MANUFACTURING', 'AGRICULTURE', 'TOBACCO', 'OTHER']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long').optional(),
  email: emailSchema.optional(),
  phone: phoneSchema,
})

// ===========================================
// Business Schemas
// ===========================================
export const createBusinessSchema = z.object({
  name: z.string().min(2, 'Business name is required').max(100, 'Business name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  industry: z.enum(['RETAIL', 'WHOLESALE', 'SERVICES', 'MANUFACTURING', 'AGRICULTURE', 'TOBACCO', 'OTHER']).optional(),
  timezone: z.string().min(1, 'Timezone is required').optional(),
})

export const updateBusinessSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters').max(100, 'Business name is too long').optional(),
  description: z.string().max(500, 'Description is too long').optional(),
  industry: z.enum(['RETAIL', 'WHOLESALE', 'SERVICES', 'MANUFACTURING', 'AGRICULTURE', 'TOBACCO', 'OTHER']).optional(),
  timezone: z.string().optional(),
})

// ===========================================
// Product Schemas
// ===========================================
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255, 'Product name is too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug is too long'),
  description: z.string().max(2000, 'Description is too long').optional(),
  price: z.number().min(0, 'Price must be positive').max(999999999, 'Price is too high'),
  compareAtPrice: z.number().min(0, 'Compare at price must be positive').optional(),
  sku: z.string().max(100, 'SKU is too long').optional(),
  barcode: z.string().max(50, 'Barcode is too long').optional(),
  inventory: z.number().min(0, 'Inventory must be non-negative').default(0),
  lowStockThreshold: z.number().min(0, 'Low stock threshold must be non-negative').default(10),
  weight: z.number().min(0, 'Weight must be positive').optional(),
  dimensions: z.string().max(500, 'Dimensions description is too long').optional(),
  imageUrl: urlSchema,
  category: z.string().max(100, 'Category is too long').optional(),
  tags: z.array(z.string().max(50, 'Tag is too long')).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'DRAFT']).default('ACTIVE'),
})

export const createProductSchema = productSchema
export const updateProductSchema = productSchema.partial()

// ===========================================
// Order Schemas
// ===========================================
export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
})

export const createOrderSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  notes: z.string().max(1000, 'Notes are too long').optional(),
  paymentMethod: z.enum(['CASH', 'MOBILE_MONEY', 'BANK_TRANSFER', 'CREDIT_CARD', 'WHATSAPP_PAY', 'PAYPAL']).optional(),
})

export const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED', 'COMPLETED']),
  trackingNumber: z.string().max(100, 'Tracking number is too long').optional(),
  notes: z.string().max(1000, 'Notes are too long').optional(),
})

// ===========================================
// Customer Schemas
// ===========================================
export const customerSchema = z.object({
  name: z.string().min(1, 'Customer name is required').max(255, 'Customer name is too long'),
  email: emailSchema.optional().nullable(),
  phone: phoneSchema.optional().nullable(),
  whatsappNumber: phoneSchema.optional().nullable(),
  avatar: urlSchema,
  address: z.string().max(500, 'Address is too long').optional(),
  city: z.string().max(100, 'City is too long').optional(),
  state: z.string().max(100, 'State is too long').optional(),
  country: z.enum(['NG', 'KE', 'GH', 'ZA', 'UG', 'TZ', 'OTHER']).default('NG'),
  tags: z.array(z.string().max(50, 'Tag is too long')).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']).default('ACTIVE'),
})

export const createCustomerSchema = customerSchema
export const updateCustomerSchema = customerSchema.partial()

// ===========================================
// Template Schemas
// ===========================================
export const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100, 'Template name is too long'),
  category: z.enum(['ORDER_CONFIRMATION', 'ORDER_SHIPMENT', 'ORDER_DELIVERY', 'REMINDER', 'PROMOTIONAL', 'CUSTOM']),
  subject: z.string().max(200, 'Subject is too long').optional(),
  content: z.string().min(1, 'Template content is required').max(10000, 'Template content is too long'),
  variables: z.array(z.string().max(50, 'Variable name is too long')).optional(),
  isDefault: z.boolean().default(false),
})

// ===========================================
// WhatsApp Schemas
// ===========================================
export const sendMessageSchema = z.object({
  to: z.string().min(1, 'Recipient is required'),
  content: z.string().min(1, 'Message content is required').max(4096, 'Message is too long'),
  messageType: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'STICKER', 'LOCATION', 'CONTACT']).default('TEXT'),
  orderId: z.string().optional(),
  templateId: z.string().optional(),
})

export const webhookVerifySchema = z.object({
  'hub.mode': z.string().min(1, 'Hub mode is required'),
  'hub.verify_token': z.string().min(1, 'Verify token is required'),
  'hub.challenge': z.string().min(1, 'Challenge is required'),
})

// ===========================================
// Analytics Schemas
// ===========================================
export const analyticsQuerySchema = z.object({
  metricType: z.enum(['REVENUE', 'ORDERS', 'CUSTOMERS', 'CONVERSIONS', 'MESSAGES_SENT', 'MESSAGES_DELIVERED', 'MESSAGES_READ', 'CALL_DURATION', 'CONVERSION_RATE']),
  period: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']).default('DAILY'),
  dateFrom: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
  dateTo: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
})

// ===========================================
// Call Schemas
// ===========================================
export const createCallSchema = z.object({
  direction: z.enum(['INCOMING', 'OUTGOING']),
  to: z.string().min(1, 'Recipient is required'),
  businessId: z.string().min(1, 'Business ID is required'),
  customerId: z.string().min(1, 'Customer ID is required'),
  duration: z.number().min(0, 'Duration must be non-negative').default(0),
  recordingUrl: urlSchema,
  transcript: z.string().max(100000, 'Transcript is too long').optional(),
})

// ===========================================
// Notification Schemas
// ===========================================
export const notificationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  message: z.string().min(1, 'Message is required').max(1000, 'Message is too long'),
  type: z.enum(['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'ORDER_UPDATE', 'PAYMENT_UPDATE', 'SYSTEM']).default('INFO'),
  businessId: z.string().min(1, 'Business ID is required'),
  userId: z.string().min(1, 'User ID is required'),
})

// ===========================================
// Pagination Schemas
// ===========================================
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

// ===========================================
// Export all schemas
// ===========================================