/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uxwing.com',
        port: '',
        pathname: '/**'
      }
    ]

  }
}

module.exports = nextConfig
