
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Simplified deployment configuration
  output: process.env.NETLIFY ? 'export' : undefined,
  trailingSlash: true,
  
  // External packages configuration
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  
  // Image optimization settings
  images: {
    unoptimized: process.env.NETLIFY ? true : false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  
  // Build settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Performance optimizations (conservative approach)
  swcMinify: true,
  reactStrictMode: false,
};

module.exports = nextConfig;
