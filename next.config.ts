/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      // ✅ ADD THIS - FOR USER UPLOADED IMAGES
      {
        protocol: "https",
        hostname: "wantsandneeds.com",
      },
      // ✅ ADD WILDCARD FOR ANY DOMAIN (USE WITH CAUTION)
      // This allows images from any source - good for development
      // Remove in production if you want strict control
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

module.exports = nextConfig;