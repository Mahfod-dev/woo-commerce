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
	parent?: number;
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

export interface CreateOrderData {
	payment_method: string;
	payment_method_title: string;
	set_paid?: boolean;
	customer_id?: number;
	billing: Partial<WooAddress>;
	shipping: Partial<WooAddress>;
	line_items: Array<{
		product_id: number;
		quantity: number;
		variation_id?: number;
	}>;
	shipping_lines?: Array<{
		method_id: string;
		method_title: string;
		total: string;
	}>;
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
		const defaultUrl = 'https://selectura.shop';
		this.baseUrl = process.env.URL_WORDPRESS || defaultUrl;
		this.consumerKey =
			process.env.WOOCOMMERCE_CONSUMER_KEY ||
			'ck_57120178580c5210e18439965e0ed3bba5003573';
		this.consumerSecret =
			process.env.WOOCOMMERCE_CONSUMER_SECRET ||
			'cs_04a583bcbe220c50f6eaf7012aa4cc2f2c284211';
		this.cache = new Map();

		// Avertissement si on utilise les valeurs par défaut
		if (this.baseUrl === defaultUrl) {
			console.log(
				'URL_WORDPRESS par défaut utilisée. Assurez-vous de définir URL_WORDPRESS dans votre .env.local pour la production.'
			);
		}

		console.log(
			'WooCommerceAPI',
			this.baseUrl,
			this.consumerKey,
			this.consumerSecret
		);
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
					`Error fetching ${endpoint}: ${res.status} ${res.statusText}`
				);
			}

			const data = await res.json();

			// Mettre en cache
			this.cache.set(cacheKey, { data, timestamp: now });

			return data as T;
		} catch (error) {
			console.error(`[WooCommerce] Error fetching ${endpoint}:`, error);
			throw error;
		}
	}

	/**
	 * Construire l'URL avec les paramètres d'authentification
	 */
	private buildUrl(endpoint: string): URL {
		const url = new URL(
			endpoint.startsWith('/')
				? `${this.baseUrl}/wp-json/wc/v3${endpoint}`
				: `${this.baseUrl}/wp-json/wc/v3/${endpoint}`
		);

		url.searchParams.append('consumer_key', this.consumerKey);
		url.searchParams.append('consumer_secret', this.consumerSecret);

		return url;
	}
}

// Instance unique de l'API WooCommerce
const wooInstance = new WooCommerceAPI();

/**
 * Récupérer des produits avec cache
 */
export const getProducts = cache(
	async (queryParams: string = ''): Promise<WooProduct[]> => {
		try {
			// Vérifier si queryParams commence déjà par un point d'interrogation
			// pour éviter le double point d'interrogation dans l'URL
			const separator = queryParams.startsWith('?') ? '' : '?';
			const products = await wooInstance.fetch<WooProduct[]>(
				`products${queryParams ? `${separator}${queryParams}` : ''}`
			);
			return products;
		} catch (error) {
			console.error('[woo] Error fetching products:', error);
			return [];
		}
	}
);

/**
 * Récupérer un produit par ID avec cache
 */
export const getProductById = cache(
	async (id: number): Promise<WooProduct | null> => {
		try {
			const product = await wooInstance.fetch<WooProduct>(
				`products/${id}`
			);
			return product;
		} catch (error) {
			console.error(`[woo] Error fetching product with id ${id}:`, error);
			return null;
		}
	}
);

/**
 * Récupérer des produits par IDs
 */
export const getProductsByIds = cache(
	async (ids: number[]): Promise<WooProduct[]> => {
		if (ids.length === 0) return [];

		try {
			const products = await wooInstance.fetch<WooProduct[]>(
				`products?include=${ids.join(',')}`
			);
			return products;
		} catch (error) {
			console.error(
				`[woo] Error fetching products with ids ${ids}:`,
				error
			);
			return [];
		}
	}
);

/**
 * Récupérer les catégories
 */
export const getCategories = cache(
	async (queryParams: string = ''): Promise<WooCategory[]> => {
		try {
			const separator = queryParams.startsWith('?') ? '' : '?';
			const categories = await wooInstance.fetch<WooCategory[]>(
				`products/categories${
					queryParams ? `${separator}${queryParams}` : ''
				}`
			);
			return categories;
		} catch (error) {
			console.error('[woo] Error fetching categories:', error);
			return [];
		}
	}
);

/**
 * Récupérer les sous-catégories d'une catégorie
 */
export const getSubcategories = cache(
	async (parentId: number): Promise<WooCategory[]> => {
		try {
			const categories = await wooInstance.fetch<WooCategory[]>(
				`products/categories?parent=${parentId}`
			);
			return categories;
		} catch (error) {
			console.error(
				`[woo] Error fetching subcategories for parent ${parentId}:`,
				error
			);
			return [];
		}
	}
);

/**
 * Récupérer les produits d'une catégorie
 */
export const getProductsByCategory = cache(
	async (
		categoryId: number,
		includeSubcategories: boolean = false
	): Promise<WooProduct[]> => {
		try {
			if (!includeSubcategories) {
				// Comportement original - uniquement les produits de cette catégorie
				const products = await wooInstance.fetch<WooProduct[]>(
					`products?category=${categoryId}`
				);
				return products;
			} else {
				// Récupérer les sous-catégories
				const subcategories = await getSubcategories(categoryId);
				const categoryIds = [
					categoryId,
					...subcategories.map((cat) => cat.id),
				];

				// Construire une requête pour récupérer les produits de toutes les catégories
				if (categoryIds.length === 1) {
					// Cas où il n'y a pas de sous-catégories
					const products = await wooInstance.fetch<WooProduct[]>(
						`products?category=${categoryId}`
					);
					return products;
				} else {
					// Cas où il y a des sous-catégories
					// Utiliser plusieurs requêtes pour éviter les limites d'URL trop longues
					const productPromises = categoryIds.map((id) =>
						wooInstance.fetch<WooProduct[]>(
							`products?category=${id}`
						)
					);
					const productsArrays = await Promise.all(productPromises);

					// Fusionner tous les tableaux de produits et supprimer les doublons
					const allProducts = productsArrays.flat();
					const uniqueProducts = [
						...new Map(
							allProducts.map((product) => [product.id, product])
						).values(),
					];

					return uniqueProducts;
				}
			}
		} catch (error) {
			console.error(
				`[woo] Error fetching products for category ${categoryId}:`,
				error
			);
			return [];
		}
	}
);

/**
 * Récupérer les produits mis en avant
 */
export const getFeaturedProducts = cache(
	async (limit: number = 10): Promise<WooProduct[]> => {
		try {
			const products = await wooInstance.fetch<WooProduct[]>(
				`products?featured=true&per_page=${limit}`
			);
			return products;
		} catch (error) {
			console.error('[woo] Error fetching featured products:', error);
			return [];
		}
	}
);

/**
 * Récupérer les produits en promotion
 */
export const getSaleProducts = cache(
	async (limit: number = 10): Promise<WooProduct[]> => {
		try {
			const products = await wooInstance.fetch<WooProduct[]>(
				`products?on_sale=true&per_page=${limit}`
			);
			return products;
		} catch (error) {
			console.error('[woo] Error fetching sale products:', error);
			return [];
		}
	}
);

/**
 * Récupérer les nouveaux produits (triés par date)
 */
export const getNewProducts = cache(
	async (limit: number = 10): Promise<WooProduct[]> => {
		try {
			const products = await wooInstance.fetch<WooProduct[]>(
				`products?orderby=date&order=desc&per_page=${limit}`
			);
			return products;
		} catch (error) {
			console.error('[woo] Error fetching new products:', error);
			return [];
		}
	}
);

/**
 * Récupérer les produits les mieux notés
 */
export const getTopRatedProducts = cache(
	async (limit: number = 10): Promise<WooProduct[]> => {
		try {
			const products = await wooInstance.fetch<WooProduct[]>(
				`products?orderby=rating&order=desc&per_page=${limit}`
			);
			return products;
		} catch (error) {
			console.error('[woo] Error fetching top rated products:', error);
			return [];
		}
	}
);

/**
 * Récupérer les produits les plus vendus
 */
export const getBestSellingProducts = cache(
	async (limit: number = 10): Promise<WooProduct[]> => {
		try {
			const products = await wooInstance.fetch<WooProduct[]>(
				`products?orderby=popularity&order=desc&per_page=${limit}`
			);
			return products;
		} catch (error) {
			console.error('[woo] Error fetching best selling products:', error);
			return [];
		}
	}
);

/**
 * Récupérer les produits liés à un produit
 */
export const getRelatedProducts = cache(
	async (productId: number, limit: number = 4): Promise<WooProduct[]> => {
		try {
			const products = await wooInstance.fetch<WooProduct[]>(
				`products/${productId}/related?per_page=${limit}`
			);
			return products;
		} catch (error) {
			console.error(
				`[woo] Error fetching related products for product ${productId}:`,
				error
			);
			return [];
		}
	}
);

/**
 * Récupérer les tags de produit
 */
export const getProductTags = cache(
	async (queryParams: string = ''): Promise<WooTag[]> => {
		try {
			const separator = queryParams.startsWith('?') ? '' : '?';
			const tags = await wooInstance.fetch<WooTag[]>(
				`products/tags${
					queryParams ? `${separator}${queryParams}` : ''
				}`
			);
			return tags;
		} catch (error) {
			console.error('[woo] Error fetching product tags:', error);
			return [];
		}
	}
);

/**
 * Récupérer les produits par tag
 */
export const getProductsByTag = cache(
	async (tagId: number): Promise<WooProduct[]> => {
		try {
			const products = await wooInstance.fetch<WooProduct[]>(
				`products?tag=${tagId}`
			);
			return products;
		} catch (error) {
			console.error(
				`[woo] Error fetching products for tag ${tagId}:`,
				error
			);
			return [];
		}
	}
);

/**
 * Récupérer les attributs de produit
 */
export const getProductAttributes = cache(async (): Promise<WooAttribute[]> => {
	try {
		const attributes = await wooInstance.fetch<WooAttribute[]>(
			'products/attributes'
		);
		return attributes;
	} catch (error) {
		console.error('[woo] Error fetching product attributes:', error);
		return [];
	}
});

/**
 * Récupérer les termes d'un attribut
 */
export const getAttributeTerms = cache(
	async (attributeId: number): Promise<any[]> => {
		try {
			const terms = await wooInstance.fetch<any[]>(
				`products/attributes/${attributeId}/terms`
			);
			return terms;
		} catch (error) {
			console.error(
				`[woo] Error fetching terms for attribute ${attributeId}:`,
				error
			);
			return [];
		}
	}
);

/**
 * Récupérer les produits filtrés par attribut
 */
export const getProductsByAttribute = cache(
	async (attributeId: number, termId: number): Promise<WooProduct[]> => {
		try {
			const products = await wooInstance.fetch<WooProduct[]>(
				`products?attribute=${attributeId}&attribute_term=${termId}`
			);
			return products;
		} catch (error) {
			console.error(
				`[woo] Error fetching products for attribute ${attributeId} and term ${termId}:`,
				error
			);
			return [];
		}
	}
);

/**
 * Récupérer les variations d'un produit
 */
export const getProductVariations = cache(
	async (productId: number): Promise<any[]> => {
		try {
			const variations = await wooInstance.fetch<any[]>(
				`products/${productId}/variations`
			);
			return variations;
		} catch (error) {
			console.error(
				`[woo] Error fetching variations for product ${productId}:`,
				error
			);
			return [];
		}
	}
);

/**
 * Rechercher des produits
 */
export const searchProducts = cache(
	async (query: string, limit: number = 10): Promise<WooProduct[]> => {
		try {
			const products = await wooInstance.fetch<WooProduct[]>(
				`products?search=${query}&per_page=${limit}`
			);
			return products;
		} catch (error) {
			console.error(
				`[woo] Error searching products for "${query}":`,
				error
			);
			return [];
		}
	}
);

/**
 * Récupérer les clients (à utiliser avec précaution, authentification requise)
 */
export const getCustomers = cache(
	async (queryParams: string = ''): Promise<WooCustomer[]> => {
		try {
			const separator = queryParams.startsWith('?') ? '' : '?';
			const customers = await wooInstance.fetch<WooCustomer[]>(
				`customers${queryParams ? `${separator}${queryParams}` : ''}`
			);
			return customers;
		} catch (error) {
			console.error('[woo] Error fetching customers:', error);
			return [];
		}
	}
);

/**
 * Récupérer un client par ID
 */
export const getCustomerById = cache(
	async (id: number): Promise<WooCustomer | null> => {
		try {
			const customer = await wooInstance.fetch<WooCustomer>(
				`customers/${id}`
			);
			return customer;
		} catch (error) {
			console.error(
				`[woo] Error fetching customer with id ${id}:`,
				error
			);
			return null;
		}
	}
);

/**
 * Récupérer les commandes (à utiliser avec précaution, authentification requise)
 */
export const getOrders = cache(
	async (queryParams: string = ''): Promise<WooOrder[]> => {
		try {
			const separator = queryParams.startsWith('?') ? '' : '?';
			const orders = await wooInstance.fetch<WooOrder[]>(
				`orders${queryParams ? `${separator}${queryParams}` : ''}`
			);
			return orders;
		} catch (error) {
			console.error('[woo] Error fetching orders:', error);
			return [];
		}
	}
);

/**
 * Récupérer une commande par ID
 */
export const getOrderById = cache(
	async (id: number): Promise<WooOrder | null> => {
		try {
			const order = await wooInstance.fetch<WooOrder>(`orders/${id}`);
			return order;
		} catch (error) {
			console.error(`[woo] Error fetching order with id ${id}:`, error);
			return null;
		}
	}
);

/**
 * Créer une nouvelle commande dans WooCommerce
 */
export const createOrder = async (
	orderData: CreateOrderData
): Promise<WooOrder | null> => {
	try {
		// Log pour débogage
		console.log(
			'[woo] Creating order with data:',
			JSON.stringify(orderData, null, 2)
		);

		const order = await wooInstance.fetch<WooOrder>('orders', {
			method: 'POST',
			body: JSON.stringify(orderData),
			cacheTime: 0, // Pas de cache pour les créations
		});

		console.log('[woo] Order created successfully:', order.id);
		return order;
	} catch (error) {
		console.error('[woo] Error creating order:', error);
		return null;
	}
};

/**
 * Récupérer le lien de paiement pour une commande
 */
export const getPaymentLink = async (
	orderId: number
): Promise<string | null> => {
	try {
		const response = await wooInstance.fetch<{ payment_url: string }>(
			`orders/${orderId}`,
			{
				cacheTime: 0, // Pas de cache pour les informations de paiement
			}
		);

		if (response && response.payment_url) {
			return response.payment_url;
		}

		return null;
	} catch (error) {
		console.error(
			`[woo] Error getting payment URL for order ${orderId}:`,
			error
		);
		return null;
	}
};