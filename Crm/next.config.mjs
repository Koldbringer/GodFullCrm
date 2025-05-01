// import { createMDX } from 'fumadocs-mdx/next';
import withPWA from '@ducanh2912/next-pwa';

// const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
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
      ],
    },
  ],
}

const pwaOptions = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Optionally, you can customize the service worker
  sw: '/sw.js',
  // Optionally, you can add additional manifests
  // buildExcludes: [/middleware-manifest\.json$/],
};

// export default withMDX(nextConfig);
export default withPWA(pwaOptions)(nextConfig);
