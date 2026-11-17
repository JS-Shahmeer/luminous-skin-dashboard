import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Admin lesson uploads (video/PDF) go through a Server Action, which
      // defaults to a 1MB body limit — far below a real treatment video.
      bodySizeLimit: "500mb",
    },
  },
};

export default nextConfig;
