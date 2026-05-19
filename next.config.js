/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Brotli/gzip response compression
  compress: true,

  images: {
    remotePatterns: [],
    // Auto WebP/AVIF conversion + responsive sizing on Vercel
    formats: ['image/avif', 'image/webp'],
  },

  poweredByHeader: false,

  experimental: {
    serverComponentsExternalPackages: ['formidable'],
    outputFileTracingExcludes: {
      '*': [
        './public/assets/komakchilar/**/*',
      ],
    },
    // Tree-shake these packages — only import what's actually used
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      '@dnd-kit/core',
      '@dnd-kit/sortable',
    ],
  },
};

module.exports = nextConfig;

