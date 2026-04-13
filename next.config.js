/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "itirazdilekcesi.com",
          },
        ],
        destination: "https://www.itirazdilekcesi.com/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
