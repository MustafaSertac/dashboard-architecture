import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker icin kucuk, self-contained production cikti (.next/standalone).
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/v1.0/:path*",
          destination: "http://localhost:5295/api/v1.0/:path*",
        },
      ];
    }
    return [];
  },
}

export default withBundleAnalyzer(nextConfig)
