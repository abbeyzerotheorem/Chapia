/**
 * Theme Provider Component for WhatsApp Sales AI SaaS Platform
 * Provides light/dark theme support with system preference
 */

'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ReactNode } from 'react'

interface ThemeProviderProps {
  children: ReactNode
  attribute?: string
  defaultTheme?: 'light' | 'dark' | 'system'
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

export { ThemeProvider }