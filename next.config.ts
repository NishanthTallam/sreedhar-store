import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization for Vercel Blob Storage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "cdn.rodeodigital.com",
      }
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Optimize large package imports for faster cold starts
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@heroicons/react",
      "date-fns",
      "recharts",
    ],
  },

  // Enable HTTP Keep-Alive for Neon DB connection pooling
  httpAgentOptions: {
    keepAlive: true,
  },

  // Compression handled by Vercel CDN, but ensure static assets are cached
  poweredByHeader: false,
};

export default nextConfig;
