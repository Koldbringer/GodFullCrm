// import { createMDX } from 'fumadocs-mdx/next';

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
}

// export default withMDX(nextConfig);
export default nextConfig;
