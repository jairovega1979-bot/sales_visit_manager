
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Para despliegue en Netlify - Configuración condicional
  output: process.env.NETLIFY ? 'export' : undefined,
  trailingSlash: true,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
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
      }
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable optimizations that cause chunking issues
  swcMinify: false,
  reactStrictMode: false,
  // Variables de entorno
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
  }
};

module.exports = nextConfig;
