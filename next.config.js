/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.slingacademy.com',
                port: '',
                pathname: '/public/sample-photos/**',
            },
        ],
    },
}

module.exports = nextConfig
