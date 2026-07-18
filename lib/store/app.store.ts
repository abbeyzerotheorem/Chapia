/**
 * Zustand Store for WhatsApp Sales AI SaaS Platform
 * Global state management using Zustand
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { type User, type Business, type Notification } from '../types'

interface AppState {
  // User state
  user: User | null
  business: Business | null
  businesses: Business[]

  // UI state
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  activeTab: string

  // Notifications
  notifications: Notification[]
  unreadNotificationsCount: number

  // Loading states
  isLoading: boolean
  loadingMessages: string[]

  // Selected items
  selectedOrders: any[]
  selectedCustomers: any[]
  selectedProducts: any[]

  // Actions
  setUser: (user: User | null) => void
  setBusiness: (business: Business | null) => void
  setBusinesses: (businesses: Business[]) => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleSidebar: () => void
  setActiveTab: (tab: string) => void
  addNotification: (notification: Notification) => void
  markNotificationAsRead: (id: string) => void
  clearNotifications: () => void
  setLoading: (loading: boolean) => void
  setLoadingMessage: (key: string, loading: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  toggleOrderSelection: (order: any) => void
  clearOrderSelection: () => void
  toggleCustomerSelection: (customer: any) => void
  clearCustomerSelection: () => void
  toggleProductSelection: (product: any) => void
  clearProductSelection: () => void
  reset: () => void
}

type PersistentState = {
  theme: 'light' | 'dark'
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        business: null,
        businesses: [],
        theme: 'light',
        sidebarOpen: true,
        activeTab: 'overview',
        notifications: [],
        unreadNotificationsCount: 0,
        isLoading: false,
        loadingMessages: [],
        selectedOrders: [],
        selectedCustomers: [],
        selectedProducts: [],

        // Actions
        setUser: (user) => set({ user }),

        setBusiness: (business) => set({ business }),

        setBusinesses: (businesses) => set({ businesses }),

        setTheme: (theme) =>
          set({
            theme,
            ...(theme === 'dark' && typeof window !== 'undefined'
              ? document.documentElement.classList.add('dark')
              : theme === 'light' && typeof window !== 'undefined'
              ? document.documentElement.classList.remove('dark')
              : {}),
          }),

        toggleSidebar: () =>
          set((state) => ({
            sidebarOpen: !state.sidebarOpen,
          })),

        setActiveTab: (tab) => set({ activeTab: tab }),

        addNotification: (notification) =>
          set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadNotificationsCount: state.unreadNotificationsCount + 1,
          })),

        markNotificationAsRead: (id) =>
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
            unreadNotificationsCount: Math.max(0, state.unreadNotificationsCount - 1),
          })),

        clearNotifications: () =>
          set({
            notifications: [],
            unreadNotificationsCount: 0,
          }),

        setLoading: (loading) => set({ isLoading: loading }),

        setIsLoading: (isLoading) => set({ isLoading }),

        setLoadingMessage: (key, loading) =>
          set((state) => ({
            loadingMessages: loading
              ? [...state.loadingMessages, key]
              : state.loadingMessages.filter((k) => k !== key),
          })),

        toggleOrderSelection: (order) =>
          set((state) => {
            const isSelected = state.selectedOrders.find((o) => o.id === order.id)
            return {
              selectedOrders: isSelected
                ? state.selectedOrders.filter((o) => o.id !== order.id)
                : [...state.selectedOrders, order],
            }
          }),

        clearOrderSelection: () => set({ selectedOrders: [] }),

        toggleCustomerSelection: (customer) =>
          set((state) => {
            const isSelected = state.selectedCustomers.find((c) => c.id === customer.id)
            return {
              selectedCustomers: isSelected
                ? state.selectedCustomers.filter((c) => c.id !== customer.id)
                : [...state.selectedCustomers, customer],
            }
          }),

        clearCustomerSelection: () => set({ selectedCustomers: [] }),

        toggleProductSelection: (product) =>
          set((state) => {
            const isSelected = state.selectedProducts.find((p) => p.id === product.id)
            return {
              selectedProducts: isSelected
                ? state.selectedProducts.filter((p) => p.id !== product.id)
                : [...state.selectedProducts, product],
            }
          }),

        clearProductSelection: () => set({ selectedProducts: [] }),

        reset: () => {
          // Preserve theme in localStorage
          const theme = get().theme
          set({
            user: null,
            business: null,
            businesses: [],
            theme,
            sidebarOpen: true,
            activeTab: 'overview',
            notifications: [],
            unreadNotificationsCount: 0,
            isLoading: false,
            loadingMessages: [],
            selectedOrders: [],
            selectedCustomers: [],
            selectedProducts: [],
          })
        },
      }),
      {
        name: 'whatsapp-sales-ai-storage',
        partialize: (state) => ({
          theme: state.theme,
        }),
      }
    )
  )
)