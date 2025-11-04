import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Suppress hydration warnings in development (caused by browser extensions)
  reactStrictMode: true,
  
  // Optional: Add logging to help debug
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
