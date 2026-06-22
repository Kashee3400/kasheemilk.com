/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.kasheemilk.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
