/**
 * Type definitions for WhatsApp Sales AI SaaS Platform
 */

// ===========================================
// User Types
// ===========================================
export type UserRole = 'USER' | 'ADMIN' | 'SUPERADMIN'
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

// ===========================================
// Business Types
// ===========================================
export type Industry = 'RETAIL' | 'WHOLESALE' | 'SERVICES' | 'MANUFACTURING' | 'AGRICULTURE' | 'TOBACCO' | 'OTHER'
export type Currency = 'NGN' | 'KES' | 'GHS' | 'ZAR' | 'UGX' | 'TZS' | 'WALLET'
export type Country = 'NG' | 'KE' | 'GH' | 'ZA' | 'UG' | 'TZ' | 'OTHER'
export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE'
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING'

// ===========================================
// Product Types
// ===========================================
export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'DRAFT'

// ===========================================
// Order Types
// ===========================================
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED' | 'COMPLETED'
export type PaymentMethod = 'CASH' | 'MOBILE_MONEY' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'WHATSAPP_PAY' | 'PAYPAL'
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'

// ===========================================
// WhatsApp Message Types
// ===========================================
export type MessageDirection = 'INCOMING' | 'OUTGOING'
export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'STICKER' | 'REACTION' | 'LOCATION' | 'CONTACT'
export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' | 'PENDING'

// ===========================================
// Template Types
// ===========================================
export type TemplateCategory = 'ORDER_CONFIRMATION' | 'ORDER_SHIPMENT' | 'ORDER_DELIVERY' | 'REMINDER' | 'PROMOTIONAL' | 'CUSTOM'

// ===========================================
// Analytics Types
// ===========================================
export type MetricType = 'REVENUE' | 'ORDERS' | 'CUSTOMERS' | 'CONVERSIONS' | 'MESSAGES_SENT' | 'MESSAGES_DELIVERED' | 'MESSAGES_READ' | 'CALL_DURATION' | 'CONVERSION_RATE'
export type Period = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'

// ===========================================
// Call Types
// ===========================================
export type CallDirection = 'INCOMING' | 'OUTGOING'
export type CallStatus = 'COMPLETED' | 'MISSED' | 'BUSY' | 'FAILED' | 'REJECTED'

// ===========================================
// Notification Types
// ===========================================
export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ORDER_UPDATE' | 'PAYMENT_UPDATE' | 'SYSTEM'

// ===========================================
// API Response Types
// ===========================================
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

// ===========================================
// Pagination Types
// ===========================================
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ===========================================
// Filter Types
// ===========================================
export interface ProductFilters {
  search?: string
  category?: string
  status?: ProductStatus
  inStock?: boolean
  minPrice?: number
  maxPrice?: number
  tags?: string[]
}

export interface OrderFilters {
  search?: string
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  dateFrom?: Date
  dateTo?: Date
  customerId?: string
}

export interface CustomerFilters {
  search?: string
  status?: CustomerStatus
  dateFrom?: Date
  dateTo?: Date
  totalSpentMin?: number
  totalSpentMax?: number
}

// ===========================================
// Customer Types
// ===========================================
export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED'

// ===========================================
// Form Types
// ===========================================
export interface LoginFormValues {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterFormValues {
  name: string
  email: string
  phone?: string
  password: string
  confirmPassword: string
  businessName: string
  industry?: Industry
}

export interface ProductFormValues {
  name: string
  slug: string
  description?: string
  price: number
  compareAtPrice?: number
  sku?: string
  barcode?: string
  inventory: number
  lowStockThreshold: number
  weight?: number
  dimensions?: string
  imageUrl?: string
  category?: string
  tags?: string[]
  status?: ProductStatus
}

export interface OrderFormValues {
  customerId: string
  items: Array<{
    productId: string
    quantity: number
  }>
  notes?: string
  paymentMethod?: PaymentMethod
}

export interface CustomerFormValues {
  name: string
  email?: string
  phone?: string
  whatsappNumber?: string
  avatar?: string
  address?: string
  city?: string
  state?: string
  country?: Country
  tags?: string[]
  status?: CustomerStatus
}

// ===========================================
// WhatsApp Types
// ===========================================
export interface WhatsAppContact {
  id: string
  name: string
  phone: string
  email?: string
}

export interface WhatsAppTemplate {
  id: string
  name: string
  category: TemplateCategory
  language: string
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'DISABLED'
  categoryDisplay?: string
  subCategory?: string
  languageSettings?: {
    language: string
    category: string
  }
}

export interface WhatsAppWebhookEvent {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      value: {
        messaging_product: string
        metadata: {
          display_phone_number: string
          phone_number_id: string
        }
        contacts?: Array<{
          profile: {
            name: string
          }
          wa_id: string
        }>
        messages?: Array<{
          from: string
          id: string
          timestamp: string
          text?: {
            body: string
          }
          type: string
          media?: {
            id: string
            filename: string
            link?: string
          }
        }>
        statuses?: Array<{
          id: string
          status: string
          timestamp: string
          recipient_id?: string
          errors?: Array<{
            code: number
            title: string
            message: string
          }>
        }>
      }
      field: string
    }>
  }>
}

// ===========================================
// UI State Types
// ===========================================
export interface AppState {
  user: User | null
  business: Business | null
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  notifications: Notification[]
}

export interface User {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role: UserRole
}

export interface Business {
  id: string
  name: string
  slug: string
  currency: Currency
  subscriptionPlan: SubscriptionPlan
  subscriptionStatus: SubscriptionStatus
}

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  createdAt: string
}

// ===========================================
// Chart Types
// ===========================================
export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
    tension?: number
    fill?: boolean
  }>
}

export interface TimeSeriesData {
  date: string
  value: number
  [key: string]: string | number
}