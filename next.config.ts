import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3", "bcrypt"],
  images: {
    localPatterns: [
      { pathname: "/uploads/**" },
      { pathname: "/**" },
    ],
  },
};

export default nextConfig;
