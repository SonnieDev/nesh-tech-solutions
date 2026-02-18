import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "bwlvwwbmcuzvoymthnah.supabase.co",
      },
    ],
  },
};

export default nextConfig;
