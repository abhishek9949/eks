/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: ["mui-tel-input"], // Ensure this is included
  images: {
    domains: ["localhost", "ttt-content-management.s3.us-west-1.amazonaws.com", "ttt-content-uploads.s3.us-west-1.amazonaws.com", "example.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
};

export default nextConfig;
