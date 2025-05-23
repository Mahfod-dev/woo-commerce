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
	typescript: {
		// Temporaire pour NextAuth compatibility avec Next.js 15
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
