import nextPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  // pwa options هنا مباشرة
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
