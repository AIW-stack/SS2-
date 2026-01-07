
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Ensuring the build proceeds even if there are leftover Vite type issues
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
