/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          { key: 'Content-Type', value: 'text/plain' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
        ],
      },
    ];
  },
}

export default nextConfig