import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				hostname: 'selectura.shop',
			},
		],
		unoptimized: true, // Désactive l'optimisation d'images pour éviter les erreurs 400
	},
};

export default nextConfig;
