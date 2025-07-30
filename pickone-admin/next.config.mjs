/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/admin',
    assetPrefix: '/admin',
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**", // Allow all domains
            },
            {
                protocol: "http",
                hostname: "**", // Allow all domains for http
            },
        ],
    },
 
    // reactStrictMode: false,
};

export default nextConfig;
