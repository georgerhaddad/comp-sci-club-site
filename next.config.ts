import type { NextConfig } from "next";
import "./src/env.js";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
  },
  images: {
      remotePatterns: [new URL("https://zrok0qz92a.ufs.sh/f/**")]
  }
};

export default nextConfig;
