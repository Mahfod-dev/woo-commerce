// lib/woo.ts
import { cache } from 'react';

// Types pour les API WooCommerce
export interface WooProduct {
	sku: string;
	id: number;
	name: string;
	slug: string;
	permalink: string;
	date_created: string;
	description: string;
	short_description: string;
	price: string;
	regular_price: string;
	sale_price: string;
	on_sale: boolean;
	status: string;
	featured: boolean;
	catalog_visibility: string;
	categories: WooCategory[];
	tags: WooTag[];
	images: WooImage[];
	attributes: WooAttribute[];
	variations: number[];
	stock_status: 'instock' | 'outofstock' | 'onbackorder';
	stock_quantity: number | null;
	average_rating: string;
	rating_count: number;
}

export interface WooCategory {
	id: number;
	name: string;
	slug: string;
	image: {
		id?: number;
		src: string;
		alt?: string;
	} | null;
	count?: number;
}

export interface WooTag {
	id: number;
	name: string;
	slug: string;
}

export interface WooImage {
	id: number;
	src: string;
	alt: string;
	name: string;
}

export interface WooAttribute {
	id: number;
	name: string;
	position: number;
	visible: boolean;
	variation: boolean;
	options: string[];
}

export interface WooCustomer {
	id: number;
	email: string;
	first_name: string;
	last_name: string;
	role: string;
	billing: WooAddress;
	shipping: WooAddress;
}

export interface WooAddress {
	first_name: string;
	last_name: string;
	company: string;
	address_1: string;
	address_2: string;
	city: string;
	state: string;
	postcode: string;
	country: string;
	email?: string;
	phone?: string;
}

export interface WooOrder {
	id: number;
	parent_id: number;
	status: string;
	currency: string;
	prices_include_tax: boolean;
	date_created: string;
	date_modified: string;
	discount_total: string;
	shipping_total: string;
	total: string;
	customer_id: number;
	customer_note: string;
	billing: WooAddress;
	shipping: WooAddress;
	payment_method: string;
	payment_method_title: string;
	line_items: WooOrderItem[];
}

export interface WooOrderItem {
	id: number;
	name: string;
	product_id: number;
	variation_id: number;
	quantity: number;
	tax_class: string;
	subtotal: string;
	subtotal_tax: string;
	total: string;
	total_tax: string;
	taxes: any[];
	meta_data: any[];
	sku: string;
	price: number;
}

export interface WooFetchOptions extends RequestInit {
	cacheTime?: number; // En secondes
}

/**
 * Configuration pour les requêtes WooCommerce
 */
class WooCommerceAPI {
	private baseUrl: string;
	private consumerKey: string;
	private consumerSecret: string;
	private cache: Map<string, { data: any; timestamp: number }>;

	constructor() {
		this.baseUrl = process.env.URL_WORDPRESS || '';
		this.consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
		this.consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';
		this.cache = new Map();

		console.log(
			'WooCommerceAPI',
			this.baseUrl,
			this.consumerKey,
			this.consumerSecret
		);

		if (!this.baseUrl.startsWith('http')) {
			throw new Error(
				`Invalid baseUrl. Assurez-vous d'avoir URL_WORDPRESS dans .env.local.`
			);
		}
	}

	/**
	 * Méthode principale pour appeler l'API WooCommerce avec gestion du cache
	 */
	async fetch<T>(
		endpoint: string,
		options: WooFetchOptions = {}
	): Promise<T> {
		const { cacheTime = 300, ...requestOptions } = options; // 5 minutes par défaut
		const url = this.buildUrl(endpoint);
		const cacheKey = `${url.toString()}${JSON.stringify(requestOptions)}`;

		// Vérifier le cache
		const cachedItem = this.cache.get(cacheKey);
		const now = Date.now();

		if (cachedItem && now - cachedItem.timestamp < cacheTime * 1000) {
			console.log(`[WooCommerce] Cache hit for ${endpoint}`);
			return cachedItem.data as T;
		}

		// Appel à l'API
		console.log(`[WooCommerce] Fetching ${endpoint}`);
		try {
			const res = await fetch(url.toString(), {
				...requestOptions,
				headers: {
					'Content-Type': 'application/json',
					...(requestOptions.headers || {}),
				},
			});

			if (!res.ok) {
				throw new Error(
					`Erreur WooCommerce: ${res.statusText} (${res.status})`
				);
			}

			const data = await res.json();

			// Mise en cache
			this.cache.set(cacheKey, { data, timestamp: now });

			return data as T;
		} catch (error: any) {
			console.error(
				`[WooCommerce] Error fetching ${endpoint}:`,
				error.message
			);
			throw error;
		}
	}

	/**
	 * Construit l'URL complète pour l'API WooCommerce
	 */
	private buildUrl(endpoint: string): URL {
		const url = new URL(`${this.baseUrl}/wp-json/wc/v3/${endpoint}`);
		url.searchParams.set('consumer_key', this.consumerKey);
		url.searchParams.set('consumer_secret', this.consumerSecret);
		return url;
	}

	/**
	 * Invalider le cache pour un endpoint spécifique
	 */
	invalidateCache(endpoint: string): void {
		const urlPattern = this.buildUrl(endpoint).toString();

		for (const key of this.cache.keys()) {
			if (key.startsWith(urlPattern)) {
				this.cache.delete(key);
			}
		}

		console.log(`[WooCommerce] Cache invalidated for ${endpoint}`);
	}
}

// Instance singleton
const wooAPI = new WooCommerceAPI();

/**
 * API Products
 */
export const getProducts = cache(
	async (queryString = ''): Promise<WooProduct[]> => {
		return wooAPI.fetch<WooProduct[]>(`products${queryString}`);
	}
);

export const getProductById = cache(
	async (productId: string): Promise<WooProduct> => {
		return wooAPI.fetch<WooProduct>(`products/${productId}`);
	}
);

export const getFeaturedProducts = cache(
	async (limit = 6): Promise<WooProduct[]> => {
		return wooAPI.fetch<WooProduct[]>(
			`products?featured=true&per_page=${limit}`
		);
	}
);

export const getProductsByCategory = cache(
	async (categoryId: number, limit = 10): Promise<WooProduct[]> => {
		return wooAPI.fetch<WooProduct[]>(
			`products?category=${categoryId}&per_page=${limit}`
		);
	}
);

export const searchProducts = cache(
	async (term: string, limit = 10): Promise<WooProduct[]> => {
		return wooAPI.fetch<WooProduct[]>(
			`products?search=${encodeURIComponent(term)}&per_page=${limit}`
		);
	}
);

/**
 * API Categories
 */
export const getCategories = cache(
	async (params = ''): Promise<WooCategory[]> => {
		return wooAPI.fetch<WooCategory[]>(`products/categories${params}`);
	}
);

export const getCategoryById = cache(
	async (categoryId: number): Promise<WooCategory> => {
		return wooAPI.fetch<WooCategory>(`products/categories/${categoryId}`);
	}
);

export const getTopLevelCategories = cache(
	async (limit = 10): Promise<WooCategory[]> => {
		return wooAPI.fetch<WooCategory[]>(
			`products/categories?parent=0&per_page=${limit}`
		);
	}
);

/**
 * API Orders
 */
export const createOrder = async (orderData: any): Promise<WooOrder> => {
	return wooAPI.fetch<WooOrder>('orders', {
		method: 'POST',
		body: JSON.stringify(orderData),
		// Ne pas mettre en cache les opérations d'écriture
		cacheTime: 0,
	});
};

export const getOrderById = async (orderId: number): Promise<WooOrder> => {
	return wooAPI.fetch<WooOrder>(`orders/${orderId}`);
};

export const updateOrder = async (
	orderId: number,
	orderData: any
): Promise<WooOrder> => {
	return wooAPI.fetch<WooOrder>(`orders/${orderId}`, {
		method: 'PUT',
		body: JSON.stringify(orderData),
		cacheTime: 0,
	});
};

/**
 * API Customer
 */
export const getCustomer = async (customerId: number): Promise<WooCustomer> => {
	return wooAPI.fetch<WooCustomer>(`customers/${customerId}`);
};

export const createCustomer = async (
	customerData: any
): Promise<WooCustomer> => {
	return wooAPI.fetch<WooCustomer>('customers', {
		method: 'POST',
		body: JSON.stringify(customerData),
		cacheTime: 0,
	});
};

/**
 * API Cart (utilisation du plugin WooCommerce Store API)
 * Nécessite l'installation du plugin WooCommerce API Extensions
 */
export const getCart = async () => {
	// Utilisez le Store API endpoint
	try {
		const response = await fetch(
			`${process.env.URL_WORDPRESS}/wp-json/wc/store/v1/cart`,
			{
				credentials: 'include', // Important pour les cookies de session
			}
		);

		if (!response.ok) {
			throw new Error(
				`Erreur lors de la récupération du panier: ${response.statusText}`
			);
		}

		return response.json();
	} catch (error) {
		console.error('Erreur de panier:', error);
		throw error;
	}
};

export const addToCart = async (
	productId: number,
	quantity: number = 1,
	variation = {}
) => {
	try {
		const response = await fetch(
			`${process.env.URL_WORDPRESS}/wp-json/wc/store/v1/cart/add-item`,
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
			throw new Error(
				`Erreur lors de l'ajout au panier: ${response.statusText}`
			);
		}

		return response.json();
	} catch (error) {
		console.error("Erreur d'ajout au panier:", error);
		throw error;
	}
};

/**
 * Utilitaires complémentaires
 */
export const formatPrice = (price: string | number): string => {
	const numPrice = typeof price === 'string' ? parseFloat(price) : price;
	return new Intl.NumberFormat('fr-FR', {
		style: 'currency',
		currency: 'EUR',
	}).format(numPrice);
};

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

export const sortProducts = (
	products: WooProduct[],
	sortBy: string
): WooProduct[] => {
	const sortedProducts = [...products];

	switch (sortBy) {
		case 'price-asc':
			return sortedProducts.sort(
				(a, b) => parseFloat(a.price) - parseFloat(b.price)
			);
		case 'price-desc':
			return sortedProducts.sort(
				(a, b) => parseFloat(b.price) - parseFloat(a.price)
			);
		case 'date':
			return sortedProducts.sort(
				(a, b) =>
					new Date(b.date_created).getTime() -
					new Date(a.date_created).getTime()
			);
		case 'popularity':
			return sortedProducts.sort(
				(a, b) =>
					parseInt(b.average_rating) - parseInt(a.average_rating)
			);
		case 'rating':
			return sortedProducts.sort(
				(a, b) =>
					parseInt(b.average_rating) - parseInt(a.average_rating)
			);
		default:
			return sortedProducts;
	}
};

export const filterProductsByPriceRange = (
	products: WooProduct[],
	minPrice: number,
	maxPrice: number
): WooProduct[] => {
	return products.filter((product) => {
		const price = parseFloat(product.price);
		return price >= minPrice && price <= maxPrice;
	});
};

export const getRelatedProducts = cache(
	async (productId: string, limit = 4): Promise<WooProduct[]> => {
		return wooAPI.fetch<WooProduct[]>(
			`products/${productId}/related?per_page=${limit}`
		);
	}
);

export const getProductVariations = cache(
	async (productId: string): Promise<any[]> => {
		return wooAPI.fetch<any[]>(`products/${productId}/variations`);
	}
);

/**
 * Fonctions supplémentaires pour la gestion du panier
 */
export const updateCartItem = async (cartItemKey: string, quantity: number) => {
	try {
		const response = await fetch(
			`${process.env.URL_WORDPRESS}/wp-json/wc/store/v1/cart/update-item`,
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
			throw new Error(
				`Erreur lors de la mise à jour du panier: ${response.statusText}`
			);
		}

		return response.json();
	} catch (error) {
		console.error('Erreur de mise à jour du panier:', error);
		throw error;
	}
};

export const removeCartItem = async (cartItemKey: string) => {
	try {
		const response = await fetch(
			`${process.env.URL_WORDPRESS}/wp-json/wc/store/v1/cart/remove-item`,
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
			throw new Error(
				`Erreur lors de la suppression de l'article: ${response.statusText}`
			);
		}

		return response.json();
	} catch (error) {
		console.error("Erreur de suppression d'article:", error);
		throw error;
	}
};

export const clearCart = async () => {
	try {
		const response = await fetch(
			`${process.env.URL_WORDPRESS}/wp-json/wc/store/v1/cart/items`,
			{
				method: 'DELETE',
				credentials: 'include',
			}
		);

		if (!response.ok) {
			throw new Error(
				`Erreur lors du vidage du panier: ${response.statusText}`
			);
		}

		return response.json();
	} catch (error) {
		console.error('Erreur de vidage du panier:', error);
		throw error;
	}
};

/**
 * API Reviews
 */
export const getProductReviews = cache(
	async (productId: string): Promise<any[]> => {
		return wooAPI.fetch<any[]>(`products/reviews?product=${productId}`);
	}
);

export const createProductReview = async (
	productId: string,
	reviewData: any
): Promise<any> => {
	return wooAPI.fetch<any>('products/reviews', {
		method: 'POST',
		body: JSON.stringify({
			product_id: parseInt(productId),
			...reviewData,
		}),
		cacheTime: 0,
	});
};

/**
 * API Shipping
 */
export const getShippingZones = cache(async (): Promise<any[]> => {
	return wooAPI.fetch<any[]>('shipping/zones');
});

export const getShippingMethods = cache(
	async (zoneId: number): Promise<any[]> => {
		return wooAPI.fetch<any[]>(`shipping/zones/${zoneId}/methods`);
	}
);

/**
 * API Coupons
 */
export const validateCoupon = async (code: string): Promise<any> => {
	// Cette fonction vérifie si un coupon est valide
	try {
		const coupons = await wooAPI.fetch<any[]>(`coupons?code=${code}`);
		if (coupons.length === 0) {
			throw new Error('Coupon non valide');
		}
		return coupons[0];
	} catch (error) {
		console.error('Erreur de validation du coupon:', error);
		throw error;
	}
};

/**
 * API Payment Gateways
 */
export const getPaymentGateways = cache(async (): Promise<any[]> => {
	return wooAPI.fetch<any[]>('payment_gateways');
});

// Export de l'objet API complet pour des usages plus avancés
export const wooCommerceAPI = wooAPI;
