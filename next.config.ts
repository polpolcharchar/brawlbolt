import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disables ESLint errors from blocking production builds
    ignoreDuringBuilds: true,
  },
  /* other config options here */
};

export default nextConfig;
