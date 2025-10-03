/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pino"],
  experimental: {
    nodeMiddleware: true,
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
};

export default nextConfig;
