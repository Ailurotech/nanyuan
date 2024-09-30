/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,  
  images: {
    domains: ['s2.loli.net', 'cdn.sanity.io'], 
    unoptimized:true
  },
};

export default nextConfig;
