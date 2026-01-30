import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // ⚠️ Allows the build to complete even if TypeScript type errors are present.
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    // ⚠️ Allows SVG files to be used as images even though SVGs can carry security risks.
    dangerouslyAllowSVG: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
};

export default nextConfig;
