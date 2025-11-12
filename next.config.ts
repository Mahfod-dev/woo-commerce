import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				hostname: 'selectura.shop',
			},
			{
				hostname: 'selectura.co',
			},
		],
	},
};

export default nextConfig;
