/** @type {import('next').NextConfig} */
// change strictMode to false when deploying to production
const nextConfig = {
  reactStrictMode: false,
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
