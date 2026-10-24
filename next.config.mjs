/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'russelm-pandesal-ordering.s3.ap-southeast-2.amazonaws.com',
            }
        ]
    }
}

export default nextConfig;