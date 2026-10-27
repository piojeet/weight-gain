import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/v1/:path*", destination: "http://localhost:3001/v1/:path*" },
      { source: "/uploads/:path*", destination: "http://localhost:3001/uploads/:path*" },
    ];
  },
};

export default nextConfig;
