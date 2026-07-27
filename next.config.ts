import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  allowedDevOrigins: ["192.168.29.244", "localhost", "192.168.0.167", "192.168.1.14"],
  experimental: {
    optimizePackageImports: ["next-sanity"],
  },
};

export default nextConfig;
