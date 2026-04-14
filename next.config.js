/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      {
        source: "/dilekce/kira-artisi-itiraz-dilekcesi",
        destination: "/dilekce/kira-artisi-itiraz",
        permanent: true,
      },
      {
        source: "/dilekce/tahliye-itiraz-dilekcesi",
        destination: "/dilekce/tahliye-itiraz",
        permanent: true,
      },
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
