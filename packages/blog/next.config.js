/** @type {import('next').NextConfig} */
const path = require('path');

/**
 * SSG Image CMPNT SETUP
 * based on https://github.com/vercel/next.js/discussions/19065
 */
const nextConfig = {
    reactStrictMode: true,
    images: {
        loader: "custom",
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    }
}

module.exports = nextConfig;
