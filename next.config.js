/** @type {import('next').NextConfig} */

// A baseline CSP. Scripts allow 'unsafe-inline' because Next.js injects
// its own inline bootstrap scripts; a stronger setup would emit a per-request
// nonce and restrict to 'self'. This still blocks loading scripts/styles/
// frames from attacker-controlled origins and disables plugins.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.unsplash.com https://avatars.githubusercontent.com https://lh3.googleusercontent.com https://res.cloudinary.com https://cdn.shopify.com https://platform-lookaside.fbsbx.com https://scontent.fapi-1.fna.fbcdn.net",
  "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
  "connect-src 'self' wss: ws: https://graph.facebook.com https://*.googleapis.com",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(), microphone=(), camera=()',
  },
  {
    key: 'X-Permitted-Cross-Domain-Policies',
    value: 'none',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: contentSecurityPolicy,
  },
]

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  devIndicators: {
    buildActivity: true,
    buildActivityText: 'WhatsApp Sales AI',
  },
  images: {
    domains: [
      'images.unsplash.com',
      'source.unsplash.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
      'cdn.shopify.com',
      'platform-lookaside.fbsbx.com',
      'scontent.fapi-1.fna.fbcdn.net',
    ],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'WhatsApp Sales AI',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_WHATSAPP_API_URL: process.env.NEXT_PUBLIC_WHATSAPP_API_URL || 'https://graph.facebook.com/v19.0',
  },
  async redirects() {
    return []
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        net: false,
        tls: false,
        zos: false,
        fs: false,
        child_process: false,
      }
    }
    return config
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
