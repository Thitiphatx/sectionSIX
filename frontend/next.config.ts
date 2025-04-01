import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50gb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: process.env.NODE_ENV === "development" ? "http" : "http",
        hostname: '**', // Allows images from any hostname
      },
    ],
  },
};

export default nextConfig;
