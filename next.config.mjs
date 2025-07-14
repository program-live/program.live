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
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://youtube.com/@programislive',
        permanent: false, // Use 307 (temporary redirect) instead of 301
      },
    ]
  },
}

export default nextConfig
