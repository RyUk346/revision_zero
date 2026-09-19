/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Don't fail production builds on lint warnings (run `npm run lint` separately).
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Images are rendered with plain <img> tags so optimization config isn't
    // required, but this allows next/image with the source CDN if you switch.
    remotePatterns: [
      { protocol: "https", hostname: "revision-zero.com" },
      { protocol: "https", hostname: "www.revision-zero.com" },
    ],
  },
};

export default nextConfig;
