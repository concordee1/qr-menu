import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.burgerking.com.tr',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
