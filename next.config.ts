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
      // ✅ ADD YOUR UPLOAD CDN HERE (if using UploadThing, Cloudinary, etc)
      {
        protocol: "https",
        hostname: "utfs.io", // UploadThing
      },
      // OR
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary
      },
      // OR whatever CDN you're using for store logos/covers
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