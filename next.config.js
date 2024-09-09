/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        config.module.rules.push({
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
          include: /node_modules/,
        });
        return config;
    },
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                hostname: 'api.campus.kpi.ua',
            },
        ],
    },
    rewrites: async () => {
        return [
            {
                source: '/sitemap',
                destination: `${process.env.NEXT_PUBLIC_API_URL}/intellect/v2/sitemap`,
            },
        ];
    },
};

module.exports = nextConfig;
