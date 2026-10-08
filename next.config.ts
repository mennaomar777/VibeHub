import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "route-posts.routemisr.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
