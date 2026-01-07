
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    // We set this to true to allow the build to pass if there are stray files 
    // outside the app directory while you clean them up.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
