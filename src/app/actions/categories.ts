'use server';

import { getProductsByCategory, getFeaturedProducts } from '@/lib/woo';

export interface SimplifiedProduct {
	id: number;
	name: string;
	slug: string;
	image: string;
}

export async function getCategoryProducts(categoryId: number): Promise<SimplifiedProduct[]> {
	try {
		// Récupérer les produits de la catégorie
		let products = await getProductsByCategory(categoryId);

		// Si pas de produits, utiliser les produits en vedette
		if (products.length === 0) {
			products = await getFeaturedProducts(4);
		} else {
			// Limiter à 4 produits
			products = products.slice(0, 4);
		}

		// Transformer les produits dans un format simplifié
		const simplifiedProducts: SimplifiedProduct[] = products.map((product) => ({
			id: product.id,
			name: product.name,
			slug: product.slug,
			image:
				product.images && product.images.length > 0
					? product.images[0].src
					: '/images/placeholder.jpg',
		}));

		return simplifiedProducts;
	} catch (error) {
		console.error('Error fetching category products:', error);
		return [];
	}
}
