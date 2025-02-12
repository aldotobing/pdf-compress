const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /pdf\.worker(\.min)?\.js$/,
      type: "asset/resource",
    });

    return config;
  },
};

module.exports = nextConfig;
