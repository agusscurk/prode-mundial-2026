import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        dynamicIO: true,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
};

export default nextConfig;