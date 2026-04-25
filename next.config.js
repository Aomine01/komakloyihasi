/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['formidable'],
  },
};

module.exports = nextConfig;
