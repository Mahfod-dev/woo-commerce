// lib/wooClient.ts
// Ce fichier contient les fonctions d'API WooCommerce utilisables côté client

// Définition des interfaces utilisées côté client
export interface CartItem {
	id: number;
	name: string;
	price: string;
	regular_price?: string;
	quantity: number;
	image: string;
	key: string; // La clé unique de l'article dans le panier
}

export interface CartTotals {
	total_items: number;
	total_items_tax: string;
	total_fees: string;
	total_fees_tax: string;
	total_discount: string;
	total_discount_tax: string;
	total_shipping: string;
	total_shipping_tax: string;
	total_price: string;
	total_tax: string;
	tax_lines: any[];
	currency_code: string;
	currency_symbol: string;
	currency_minor_unit: number;
	currency_decimal_separator: string;
	currency_thousand_separator: string;
	currency_prefix: string;
	currency_suffix: string;
}

export interface Cart {
	items: CartItem[];
	item_count: number;
	items_weight: number;
	coupons: any[];
	needs_payment: boolean;
	needs_shipping: boolean;
	shipping: any;
	fees: any[];
	totals: CartTotals;
	errors: any[];
}

// Utiliser les variables d'environnement publiques ou une valeur par défaut
const defaultUrl = 'https://white-ostrich-747526.hostingersite.com';
const baseUrl = process.env.NEXT_PUBLIC_URL_WORDPRESS || defaultUrl;
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

// Log pour débogage
console.log('[WooClient] Initialisation avec baseUrl:', baseUrl);

// Vérification de la présence de l'URL
if (baseUrl === defaultUrl) {
  console.log('URL_WORDPRESS par défaut utilisée. Assurez-vous de définir NEXT_PUBLIC_URL_WORDPRESS dans votre .env.local pour la production.');
}

/**
 * Récupérer le contenu du panier actuel
 */
export const getCart = async (): Promise<Cart> => {
	try {
		const response = await fetch(`${baseUrl}/wp-json/wc/store/v1/cart`, {
			credentials: 'include',
			cache: 'no-store',
			mode: 'no-cors',
		});

		if (!response.ok) {
			if (isTestMode)
				console.error(
					'[WooClient] Erreur panier:',
					response.statusText
				);
			throw new Error(
				`Erreur lors de la récupération du panier: ${response.statusText}`
			);
		}

		const data = await response.json();
		if (isTestMode) console.log('[WooClient] Panier récupéré:', data);
		return data;
	} catch (error) {
		console.error('[WooClient] Erreur de récupération du panier:', error);
		// Retourner un panier vide en cas d'erreur
		return {
			items: [],
			item_count: 0,
			items_weight: 0,
			coupons: [],
			needs_payment: false,
			needs_shipping: false,
			shipping: null,
			fees: [],
			totals: {
				total_items: 0, // Corrigé ici: number au lieu de string
				total_items_tax: '0',
				total_fees: '0',
				total_fees_tax: '0',
				total_discount: '0',
				total_discount_tax: '0',
				total_shipping: '0',
				total_shipping_tax: '0',
				total_price: '0',
				total_tax: '0',
				tax_lines: [],
				currency_code: 'EUR',
				currency_symbol: '€',
				currency_minor_unit: 2,
				currency_decimal_separator: ',',
				currency_thousand_separator: ' ',
				currency_prefix: '',
				currency_suffix: ' €',
			},
			errors: [],
		};
	}
};

/**
 * Ajouter un produit au panier
 */
export const addToCart = async (
	productId: number,
	quantity: number = 1,
	variation = {}
): Promise<Cart> => {
	try {
		const response = await fetch(
			`${baseUrl}/wp-json/wc/store/v1/cart/add-item`,
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: productId,
					quantity,
					variation,
				}),
			}
		);

		if (!response.ok) {
			if (isTestMode)
				console.error(
					'[WooClient] Erreur ajout panier:',
					response.statusText
				);
			throw new Error(
				`Erreur lors de l'ajout au panier: ${response.statusText}`
			);
		}

		const data = await response.json();
		if (isTestMode)
			console.log('[WooClient] Produit ajouté au panier:', data);
		return data;
	} catch (error) {
		console.error("[WooClient] Erreur d'ajout au panier:", error);
		throw error;
	}
};

/**
 * Mettre à jour la quantité d'un article du panier
 */
export const updateCartItem = async (
	cartItemKey: string,
	quantity: number
): Promise<Cart> => {
	try {
		const response = await fetch(
			`${baseUrl}/wp-json/wc/store/v1/cart/update-item`,
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					key: cartItemKey,
					quantity,
				}),
			}
		);

		if (!response.ok) {
			if (isTestMode)
				console.error(
					'[WooClient] Erreur mise à jour panier:',
					response.statusText
				);
			throw new Error(
				`Erreur lors de la mise à jour du panier: ${response.statusText}`
			);
		}

		const data = await response.json();
		if (isTestMode) console.log('[WooClient] Panier mis à jour:', data);
		return data;
	} catch (error) {
		console.error('[WooClient] Erreur de mise à jour du panier:', error);
		throw error;
	}
};

/**
 * Supprimer un article du panier
 */
export const removeCartItem = async (cartItemKey: string): Promise<Cart> => {
	try {
		const response = await fetch(
			`${baseUrl}/wp-json/wc/store/v1/cart/remove-item`,
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					key: cartItemKey,
				}),
			}
		);

		if (!response.ok) {
			if (isTestMode)
				console.error(
					'[WooClient] Erreur suppression article:',
					response.statusText
				);
			throw new Error(
				`Erreur lors de la suppression de l'article: ${response.statusText}`
			);
		}

		const data = await response.json();
		if (isTestMode)
			console.log('[WooClient] Article supprimé du panier:', data);
		return data;
	} catch (error) {
		console.error("[WooClient] Erreur de suppression d'article:", error);
		throw error;
	}
};

/**
 * Vider le panier
 */
export const clearCart = async (): Promise<Cart> => {
	try {
		const response = await fetch(
			`${baseUrl}/wp-json/wc/store/v1/cart/items`,
			{
				method: 'DELETE',
				credentials: 'include',
			}
		);

		if (!response.ok) {
			if (isTestMode)
				console.error(
					'[WooClient] Erreur vidage panier:',
					response.statusText
				);
			throw new Error(
				`Erreur lors du vidage du panier: ${response.statusText}`
			);
		}

		const data = await response.json();
		if (isTestMode) console.log('[WooClient] Panier vidé:', data);
		return data;
	} catch (error) {
		console.error('[WooClient] Erreur de vidage du panier:', error);
		throw error;
	}
};

/**
 * Appliquer un coupon au panier
 */
export const applyCoupon = async (couponCode: string): Promise<Cart> => {
	try {
		const response = await fetch(
			`${baseUrl}/wp-json/wc/store/v1/cart/apply-coupon`,
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					code: couponCode,
				}),
			}
		);

		if (!response.ok) {
			if (isTestMode)
				console.error(
					'[WooClient] Erreur application coupon:',
					response.statusText
				);
			throw new Error(
				`Erreur lors de l'application du coupon: ${response.statusText}`
			);
		}

		const data = await response.json();
		if (isTestMode) console.log('[WooClient] Coupon appliqué:', data);
		return data;
	} catch (error) {
		console.error("[WooClient] Erreur d'application du coupon:", error);
		throw error;
	}
};

/**
 * Retirer un coupon du panier
 */
export const removeCoupon = async (couponCode: string): Promise<Cart> => {
	try {
		const response = await fetch(
			`${baseUrl}/wp-json/wc/store/v1/cart/remove-coupon`,
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					code: couponCode,
				}),
			}
		);

		if (!response.ok) {
			if (isTestMode)
				console.error(
					'[WooClient] Erreur suppression coupon:',
					response.statusText
				);
			throw new Error(
				`Erreur lors de la suppression du coupon: ${response.statusText}`
			);
		}

		const data = await response.json();
		if (isTestMode) console.log('[WooClient] Coupon supprimé:', data);
		return data;
	} catch (error) {
		console.error('[WooClient] Erreur de suppression du coupon:', error);
		throw error;
	}
};

/**
 * Rechercher des produits (requête directe à l'API)
 * Note: Cette fonction utilise l'API publique et ne requiert pas d'authentification
 */
export const searchProducts = async (term: string, limit: number = 10) => {
	try {
		const response = await fetch(
			`${baseUrl}/wp-json/wc/v3/products?search=${encodeURIComponent(
				term
			)}&per_page=${limit}&consumer_key=${
				process.env.NEXT_PUBLIC_WOOCOMMERCE_KEY || ''
			}`
		);

		if (!response.ok) {
			throw new Error(`Erreur de recherche: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error('[WooClient] Erreur de recherche produits:', error);
		return [];
	}
};

/**
 * Formatage du prix pour l'affichage
 */
export const formatPrice = (price: string | number): string => {
	const numPrice = typeof price === 'string' ? parseFloat(price) : price;
	return new Intl.NumberFormat('fr-FR', {
		style: 'currency',
		currency: 'EUR',
	}).format(numPrice);
};

/**
 * Calcul du pourcentage de remise
 */
export const calculateDiscount = (
	regularPrice: string | number,
	salePrice: string | number
): number => {
	const regular =
		typeof regularPrice === 'string'
			? parseFloat(regularPrice)
			: regularPrice;
	const sale =
		typeof salePrice === 'string' ? parseFloat(salePrice) : salePrice;

	if (!regular || !sale || regular <= 0) return 0;

	const discount = ((regular - sale) / regular) * 100;
	return Math.round(discount);
};