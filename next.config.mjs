/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode:false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'persanalytics.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.9',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '172.20.10.4',
        port: '',
        pathname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Specify the source path pattern
        destination: 'https://persanalytics.com/doutya/api/:path*', // Corrected the destination to include /api/
      },
    ];
  },
  // output: "export",
};

export default nextConfig;
