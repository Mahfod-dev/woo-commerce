// lib/productUrl.ts
// Helper pour générer les URLs de produits de manière consistante

interface ProductUrlParams {
	id: number;
	slug: string;
}

/**
 * Génère l'URL canonique d'un produit au format /products/[id]-[slug]
 *
 * @param product - Objet avec id et slug du produit
 * @returns URL du produit (ex: /products/123-mon-produit)
 */
export function getProductUrl(product: ProductUrlParams): string {
	return `/products/${product.id}-${product.slug}`;
}

/**
 * Génère l'URL canonique d'un produit à partir d'un objet produit complet
 * Compatible avec les interfaces Product et WooProduct
 */
export function getProductUrlFromObject(product: { id: number; slug: string }): string {
	return getProductUrl({ id: product.id, slug: product.slug });
}
