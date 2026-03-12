import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["fuse.js"]
  },
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;
