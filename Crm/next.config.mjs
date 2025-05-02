import withPWA from '@ducanh2912/next-pwa';
import { createMDX } from 'fumadocs-mdx/next';

// Create MDX plugin for documentation
const withMDX = createMDX();

/**
 * Next.js configuration with optimizations for performance and security
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Disable ESLint and TypeScript checking during build for faster builds
  // These should be run separately in CI/CD pipeline
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image optimization settings
  images: {
    // Use Next.js image optimization in production
    unoptimized: process.env.NODE_ENV === 'development',
    // Add remote image domains if needed
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'acfyvozuelayjdhmdtky.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      }
    ],
  },

  // Performance optimizations
  reactStrictMode: true, // Enable React strict mode for better development experience

  // Add compression for better performance
  compress: true,

  // Add headers for better security and PWA support
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
        },
      ],
    },
    // Cache static assets for better performance
    {
      source: '/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        }
      ],
    },
    // Cache images for better performance
    {
      source: '/images/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400, stale-while-revalidate=31536000',
        }
      ],
    },
  ],

  // Experimental features for better performance
  experimental: {
    // Enable server actions (updated for Next.js 15)
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
    // Enable optimistic updates
    optimisticClientCache: true,
  },
}

// PWA configuration
const pwaOptions = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Customize the service worker
  sw: '/sw.js',
  // Exclude specific files from the service worker
  buildExcludes: [
    /middleware-manifest\.json$/,
    /\.map$/,
    /^workbox-[a-zA-Z0-9]+\.js$/
  ],
  // Add additional manifests if needed
  // additionalManifestEntries: [],
};

// Apply both MDX and PWA plugins
export default withPWA(pwaOptions)(withMDX(nextConfig));