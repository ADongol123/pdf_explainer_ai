// next.config.js
const nextConfig = {
  images: {
    domains: ["img.freepik.com", "veterinaire-tour-hassan.com"],
  },
  webpack: (config:any) => {
    config.module.rules.push({
      test: /\.node/,
      use: "raw-loader",
    });
return config;
  },
};
module.exports = nextConfig;