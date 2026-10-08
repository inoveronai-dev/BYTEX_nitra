import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["bcrypt"],
  images: {
    localPatterns: [
      { pathname: "/uploads/**" },
      { pathname: "/**" },
    ],
  },
};

export default nextConfig;
