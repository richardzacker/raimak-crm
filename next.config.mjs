/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: '/raimak-crm',
  assetPrefix: '/raimak-crm',
};

export default nextConfig;