/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pino"],
  experimental: {
    nodeMiddleware: true,
  },
};

export default nextConfig;
