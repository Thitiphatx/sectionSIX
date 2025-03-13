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
        protocol: 'https',
        hostname: '**', // Allows images from any hostname
      },
    ],
  },
};

export default nextConfig;
