/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default nextConfig
