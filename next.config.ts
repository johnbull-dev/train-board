import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    // SWC compiler options
    // You can enable styled-components support if needed
    styledComponents: false,
    // Remove console.log statements in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable the React Compiler (optional)
  experimental: {
    // Uncomment the line below if you want to try the React Compiler
    // reactCompiler: true,
  },
};

export default nextConfig;
