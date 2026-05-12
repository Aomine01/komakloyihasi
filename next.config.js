/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    // Vercel supports image optimization out of the box
    // This enables automatic WebP/AVIF conversion + responsive sizing
  },
  poweredByHeader: false,
  experimental: {
    serverComponentsExternalPackages: ['formidable'],
    outputFileTracingExcludes: {
      '*': [
        './public/assets/komakchilar/**/*',
      ],
    },
  },
};

module.exports = nextConfig;
