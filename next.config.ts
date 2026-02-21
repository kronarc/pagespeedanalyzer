import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
