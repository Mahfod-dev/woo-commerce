import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				hostname: 'white-ostrich-747526.hostingersite.com',
			},
		],
	},
};

export default nextConfig;
