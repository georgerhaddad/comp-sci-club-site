import type { NextConfig } from "next";
import "./src/env.js";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
