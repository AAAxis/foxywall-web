/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TODO: Fix type errors and remove this flag
    ignoreBuildErrors: true,
  },
  images: {
    // Enable Next.js image optimization for better Core Web Vitals
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
}

export default nextConfig