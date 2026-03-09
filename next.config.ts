import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["fuse.js"]
  }
};

export default nextConfig;
