import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['www.fbi.gov', 'via.placeholder.com'], // Add any other domains as needed
  },
};

export default nextConfig;

