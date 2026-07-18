/** @type {import('next').NextConfig} */

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
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/overview',
        permanent: false,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
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
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', process.env.NEXT_PUBLIC_APP_URL || ''],
    },
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
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
        ],
      },
    ]
  },
}

module.exports = nextConfig