/**
 * Tailwind CSS Configuration
 * African-inspired color palette for WhatsApp Sales AI SaaS Platform
 */

import { join } from 'path'

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - inspired by African heritage
        'africa-primary': {
          DEFAULT: '#3B82F6', // Blue (like sky over savanna)
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        'africa-secondary': {
          DEFAULT: '#F59E0B', // Gold (like West African gold)
          50: '#FFFAEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45F04',
          800: '#92400E',
          900: '#78350F',
        },
        'africa-accent': {
          DEFAULT: '#10B981', // Emerald (like West African markets)
          50: '#ECFDF5',
          100: '#DDFDFB',
          200: '#BCF7ED',
          300: '#99F6E4',
          400: '#5EEAD4',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },

        // Traditional African colors
        'kente-blue': {
          DEFAULT: '#0F172A', // Deep indigo
          50: '#F1F5F9',
          100: '#E2E8F0',
          200: '#CBD5E1',
          300: '#94A3B8',
          400: '#64748B',
          500: '#0F172A',
          600: '#0C2235',
          700: '#0F172A',
          800: '#1E293B',
          900: '#0F172A',
        },
        'kente-gold': {
          DEFAULT: '#FACC15', // Bright gold
          50: '#FEF9C3',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#FACC15',
          600: '#EAB308',
          700: '#CA8A04',
          800: '#A16207',
          900: '#854D0E',
        },
        'kente-red': {
          DEFAULT: '#EF4444', // Vibrant red
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A0',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        'kente-green': {
          DEFAULT: '#22C55E', // Forest green
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#17432E',
        },
        'kente-yellow': {
          DEFAULT: '#FACC15', // Sun yellow
          50: '#FFFDF0',
          100: '#FFF9E6',
          200: '#FEF3C7',
          300: '#FDE68A',
          400: '#FCD34D',
          500: '#FACC15',
          600: '#EAB308',
          700: '#CA8A04',
          800: '#A16207',
          900: '#854D0E',
        },

        // African earth tones
        'earth-terracotta': {
          DEFAULT: '#EA580C',
          50: '#FFF7ED',
          100: '#FFEFD5',
          200: '#FFDBDB',
          300: '#C2410C',
          400: '#EA580C',
          500: '#EA580C',
          600: '#C2410C',
          700: '#9C421B',
          800: '#7A2E17',
          900: '#581C17',
        },
        'earth-sand': {
          DEFAULT: '#FACC15',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#FACC15',
          600: '#EAB308',
          700: '#CA8A04',
          800: '#A16207',
          900: '#854D0E',
        },
        'earth-ochre': {
          DEFAULT: '#A855F7', // Purple (maasai inspiration)
          50: '#F5F3FF',
          100: '#EDEDFE',
          200: '#DDD7FF',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#A855F7',
          600: '#7C3AED',
          700: '#5B21B6',
          800: '#4C1D95',
          900: '#3D1069',
        },

        // WhatsApp inspired colors
        'whatsapp-green': {
          DEFAULT: '#25D366',
          50: '#ECFDF5',
          100: '#DDFDFB',
          200: '#BCF7ED',
          300: '#99F6E4',
          400: '#5EEAD4',
          500: '#25D366',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#17432E',
        },

        // Neutral colors
        'neutral-50': '#F8FAFC',
        'neutral-100': '#F1F5F9',
        'neutral-200': '#E2E8F0',
        'neutral-300': '#CBD5E1',
        'neutral-400': '#94A3B8',
        'neutral-500': '#64748B',
        'neutral-600': '#475569',
        'neutral-700': '#334155',
        'neutral-800': '#1E293B',
        'neutral-900': '#0F172A',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'display': ['Playfair Display', 'ui-serif', 'serif'],
        'arabic': ['Cairo', 'ui-serif', 'serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slight': 'bounce 1s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
      },
      boxShadow: {
        'africa': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'africa-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'whatsapp': '0 4px 12px rgba(37, 211, 102, 0.25)',
      },
      keyframes: {
        'wave': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(-8deg)' },
        },
        'bounce-slight': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
      perspective: {
        1000: '1000px',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'width': 'width',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addBase }) {
      addBase({
        '@font-face': {
          fontFamily: 'Inter',
          src: 'url("/fonts/inter-variable.woff2") format("woff2")',
          fontWeight: '100 900',
          fontDisplay: 'swap',
        },
      })
    },
  ],
  safelist: [
    'bg-africa-primary',
    'bg-africa-secondary',
    'bg-africa-accent',
    'text-africa-primary',
    'text-africa-secondary',
    'border-africa-primary',
    'border-africa-secondary',
    'ring-africa-primary',
    'ring-africa-secondary',
  ],
}