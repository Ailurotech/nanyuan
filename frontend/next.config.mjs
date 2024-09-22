/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,  
  output:'export',
  images: {
    domains: ['s2.loli.net', 'cdn.sanity.io'], 
    unoptimized:true
  },
};

export default nextConfig;
