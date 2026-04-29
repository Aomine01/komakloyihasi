/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
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
