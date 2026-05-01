/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', 
  images: {
    unoptimized: true, // 👈 CRUCIAL: Stops the server from using CPU to resize images
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
      {
        protocol: "https",
        hostname: "wantsandneeds.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // 👇 ADD THIS SECTION to limit CPU usage on shared hosting
  experimental: {
    workerThreads: false,
    cpus: 1,
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

module.exports = nextConfig;