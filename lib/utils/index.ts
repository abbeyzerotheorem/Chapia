/**
 * Utility functions for WhatsApp Sales AI SaaS Platform
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import numeral from 'numeral'
import { format, parseISO } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

// ===========================================
// Class Name Utilities
// ===========================================
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ===========================================
// Format Utilities
// ===========================================
export function formatCurrency(
  amount: number,
  currency: string = 'NGN',
  locale: string = 'en-NG'
): string {
  const currencySymbols: Record<string, string> = {
    NGN: '₦',
    KES: 'KSh',
    GHS: '₵',
    ZAR: 'R',
    UGX: 'UGX',
    TZS: 'TSH',
    WALLET: '',
  }

  const symbol = currencySymbols[currency] || currency

  if (currency === 'WALLET') {
    return numeral(amount).format('0,0.00')
  }

  return `${symbol} ${numeral(amount).format('0,0.00')}`
}

export function formatNumber(value: number, locale: string = 'en-NG'): string {
  return numeral(value).format('0,0')
}

export function formatPercent(value: number): string {
  return numeral(value).format('0.0%')
}

export function formatDate(
  date: Date | string | number,
  formatStr: string = 'DD/MM/YYYY',
  timezone?: string
): string {
  let dateObj: Date

  if (typeof date === 'string') {
    dateObj = parseISO(date)
  } else {
    dateObj = new Date(date)
  }

  if (timezone) {
    const zonedDate = toZonedTime(dateObj, timezone)
    return format(zonedDate, formatStr)
  }

  return format(dateObj, formatStr)
}

export function formatDateTime(
  date: Date | string | number,
  timezone?: string
): string {
  return formatDate(date, 'DD/MM/YYYY HH:mm', timezone)
}

export function formatTime(
  date: Date | string | number,
  timezone?: string
): string {
  return formatDate(date, 'HH:mm', timezone)
}

export function formatDistance(
  from: Date | string,
  to: Date | string = new Date()
): string {
  const fromDate = typeof from === 'string' ? parseISO(from) : from
  const toDate = typeof to === 'string' ? parseISO(to) : to
  const diffMs = Math.abs(toDate.getTime() - fromDate.getTime())
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffHours >= 24) {
    return `${Math.floor(diffHours / 24)} days ago`
  }

  if (diffHours > 0) {
    return `${diffHours} hours ago`
  }

  return `${diffMinutes} minutes ago`
}

// ===========================================
// Time Utilities
// ===========================================
export function getTimezoneOffsetHours(timezone: string): number {
  const now = new Date()
  const tzOffset = now.getTimezoneOffset()
  return -tzOffset / 60
}

export function convertToTimezone(
  date: Date | string,
  fromTimezone: string,
  toTimezone: string
): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  // Implementation would use date-fns-tz for proper timezone conversion
  return dateObj
}

// ===========================================
// String Utilities
// ===========================================
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function capitalize(text: string): string {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function titleCase(text: string): string {
  return text
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ')
}

export function truncate(text: string, length: number = 50, suffix: string = '...'): string {
  if (text.length <= length) return text
  return text.substring(0, length - suffix.length) + suffix
}

export function generateSlug(name: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${slugify(name)}-${timestamp}-${random}`
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// ===========================================
// Number Utilities
// ===========================================
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return (value / total) * 100
}

export function calculateDiscount(originalPrice: number, discountPercent: number): number {
  return originalPrice * (1 - discountPercent / 100)
}

export function formatPhoneNumber(phone: string): string {
  // Format phone numbers for various African countries
  const cleanPhone = phone.replace(/\+|^0/, '')

  // Detect country code and format accordingly
  if (phone.startsWith('+234')) {
    // Nigeria
    return `+234 ${cleanPhone.slice(3, 5)} ${cleanPhone.slice(5, 8)} ${cleanPhone.slice(8)}`
  } else if (phone.startsWith('+254')) {
    // Kenya
    return `+254 ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`
  } else if (phone.startsWith('+233')) {
    // Ghana
    return `+233 ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`
  }

  return phone
}

// ===========================================
// URL Utilities
// ===========================================
export function absoluteUrl(path: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${path}`
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
  }
  return `http://localhost:3000${path}`
}

// ===========================================
// Validation Utilities
// ===========================================
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[0-9]{10,15}$/
  return phoneRegex.test(phone)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// ===========================================
// File Utilities
// ===========================================
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export function isImageUrl(url: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  const ext = getFileExtension(url)
  return imageExtensions.includes(ext)
}

export function isVideoUrl(url: string): boolean {
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi']
  const ext = getFileExtension(url)
  return videoExtensions.includes(ext)
}

// ===========================================
// Storage Utilities
// ===========================================
export function getFromStorage(key: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function setToStorage(key: string, value: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Storage not available
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Storage not available
  }
}

// ===========================================
// Copy to Clipboard
// ===========================================
export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }

  // Fallback for older browsers
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    return successful
  } catch {
    document.body.removeChild(textArea)
    return false
  }
}

// ===========================================
// Color Utilities
// ===========================================
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  )
}

// ===========================================
// Array Utilities
// ===========================================
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set<T[keyof T]>()
  const result: T[] = []
  for (const item of array) {
    const value = item[key]
    if (!seen.has(value)) {
      seen.add(value)
      result.push(item)
    }
  }
  return result
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key])
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {} as Record<string, T[]>)
}

export function sumBy<T>(array: T[], key: keyof T): number {
  return array.reduce((sum, item) => sum + (Number(item[key]) || 0), 0)
}

// ===========================================
// Debounce and Throttle
// ===========================================
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}