'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Création du contexte pour le panier
const CartContext = createContext(undefined);

// Hook pour utiliser le contexte
export function useCart() {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error('useCart must be used within a CartProvider');
	}
	return context;
}

// Provider qui encapsule les fonctionnalités du panier
export function CartProvider({ children }) {
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	// Calculer le nombre total d'articles et le sous-total
	const itemCount = items.reduce((total, item) => total + item.quantity, 0);
	const subtotal = items.reduce(
		(total, item) => total + parseFloat(item.price) * item.quantity,
		0
	);

	// Simuler le chargement initial du panier
	useEffect(() => {
		// Cette fonction simule la récupération du panier d'un stockage local
		// Dans une implémentation réelle, vous feriez un appel API à votre backend
		const loadCart = () => {
			try {
				const savedCart = localStorage.getItem('cart');
				if (savedCart) {
					setItems(JSON.parse(savedCart));
				}
			} catch (err) {
				console.error('Erreur lors du chargement du panier:', err);
			}
		};

		loadCart();
	}, []);

	// Sauvegarder le panier quand il change
	useEffect(() => {
		try {
			localStorage.setItem('cart', JSON.stringify(items));
		} catch (err) {
			console.error('Erreur lors de la sauvegarde du panier:', err);
		}
	}, [items]);

	// Fonction pour ajouter un produit au panier
	const addToCart = async (productId, quantity = 1) => {
		setIsLoading(true);
		setError(null);

		try {
			// Simuler un appel API
			await new Promise((resolve) => setTimeout(resolve, 800));

			// Créer une clé unique pour cet article
			const itemKey = `item_${productId}_${Date.now()}`;

			// Simulation de données d'un produit (dans une app réelle, ces données viendraient de l'API)
			const productData = {
				id: productId,
				key: itemKey,
				name: `Produit #${productId}`,
				price: (Math.random() * 100 + 10).toFixed(2),
				quantity: quantity,
				image: '/placeholder.jpg', // Image par défaut
			};

			setItems((prevItems) => [...prevItems, productData]);
			return { success: true };
		} catch (err) {
			setError("Erreur lors de l'ajout au panier");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	// Fonction pour mettre à jour la quantité d'un article
	const updateQuantity = async (itemKey, quantity) => {
		if (quantity < 1) return;

		setIsLoading(true);
		setError(null);

		try {
			// Simuler un appel API
			await new Promise((resolve) => setTimeout(resolve, 400));

			setItems((prevItems) =>
				prevItems.map((item) =>
					item.key === itemKey ? { ...item, quantity } : item
				)
			);
		} catch (err) {
			setError('Erreur lors de la mise à jour de la quantité');
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	// Fonction pour supprimer un article du panier
	const removeFromCart = async (itemKey) => {
		setIsLoading(true);
		setError(null);

		try {
			// Simuler un appel API
			await new Promise((resolve) => setTimeout(resolve, 400));

			setItems((prevItems) =>
				prevItems.filter((item) => item.key !== itemKey)
			);
		} catch (err) {
			setError("Erreur lors de la suppression de l'article");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	// Fonction pour vider le panier
	const clearCart = async () => {
		setIsLoading(true);
		setError(null);

		try {
			// Simuler un appel API
			await new Promise((resolve) => setTimeout(resolve, 600));

			setItems([]);
		} catch (err) {
			setError('Erreur lors du vidage du panier');
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	// Valeur à exposer via le contexte
	const value = {
		items,
		itemCount,
		subtotal,
		isLoading,
		error,
		addToCart,
		updateQuantity,
		removeFromCart,
		clearCart,
	};

	return (
		<CartContext.Provider value={value}>{children}</CartContext.Provider>
	);
}

export default CartContext;

// 'use client';

// import React, {
// 	createContext,
// 	useContext,
// 	useState,
// 	useEffect,
// 	ReactNode,
// } from 'react';
// import {
// 	getCart,
// 	addToCart as addToCartApi,
// 	updateCartItem,
// 	removeCartItem,
// 	clearCart,
// 	Cart,
// 	CartItem as WooCartItem,
// } from '@/lib/wooClient';

// interface CartItem {
// 	id: number;
// 	key: string;
// 	name: string;
// 	price: string;
// 	regular_price?: string;
// 	quantity: number;
// 	image: string;
// }

// interface CartContextType {
// 	items: CartItem[];
// 	itemCount: number;
// 	subtotal: number;
// 	isLoading: boolean;
// 	error: string | null;
// 	addToCart: (productId: number, quantity: number) => Promise<void>;
// 	removeFromCart: (itemKey: string) => Promise<void>;
// 	updateQuantity: (itemKey: string, quantity: number) => Promise<void>;
// 	clearCart: () => Promise<void>;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export function useCart() {
// 	const context = useContext(CartContext);
// 	if (context === undefined) {
// 		throw new Error('useCart must be used within a CartProvider');
// 	}
// 	return context;
// }

// export function CartProvider({ children }: { children: ReactNode }) {
// 	const [items, setItems] = useState<CartItem[]>([]);
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [error, setError] = useState<string | null>(null);

// 	// Calculer le nombre total d'articles et le sous-total
// 	const itemCount = items.reduce((total, item) => total + item.quantity, 0);
// 	const subtotal = items.reduce(
// 		(total, item) => total + parseFloat(item.price) * item.quantity,
// 		0
// 	);

// 	// Fonction pour formater les éléments du panier
// 	const formatCartItems = (cartData: Cart): CartItem[] => {
// 		if (!cartData.items || !Array.isArray(cartData.items)) return [];

// 		return cartData.items.map((item: WooCartItem) => ({
// 			id: item.id,
// 			key: item.key,
// 			name: item.name,
// 			price: item.price,
// 			regular_price: item.regular_price,
// 			quantity: item.quantity,
// 			image: item.image || '/placeholder.jpg',
// 		}));
// 	};

// 	// Charger le panier au chargement initial
// 	useEffect(() => {
// 		const fetchCart = async () => {
// 			try {
// 				setIsLoading(true);
// 				const cartData = await getCart();
// 				setItems(formatCartItems(cartData));
// 			} catch (err) {
// 				console.error('Erreur lors du chargement du panier:', err);
// 				setError(
// 					'Impossible de charger votre panier. Veuillez réessayer.'
// 				);
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		};

// 		fetchCart();
// 	}, []);

// 	// Ajouter un produit au panier
// 	const handleAddToCart = async (productId: number, quantity: number) => {
// 		try {
// 			setIsLoading(true);
// 			setError(null);

// 			const updatedCart = await addToCartApi(productId, quantity);
// 			setItems(formatCartItems(updatedCart));
// 		} catch (err) {
// 			console.error("Erreur lors de l'ajout au panier:", err);
// 			setError(
// 				"Impossible d'ajouter ce produit au panier. Veuillez réessayer."
// 			);
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	// Supprimer un article du panier
// 	const handleRemoveFromCart = async (itemKey: string) => {
// 		try {
// 			setIsLoading(true);
// 			setError(null);

// 			const updatedCart = await removeCartItem(itemKey);
// 			setItems(formatCartItems(updatedCart));
// 		} catch (err) {
// 			console.error('Erreur lors de la suppression du panier:', err);
// 			setError(
// 				'Impossible de supprimer cet article. Veuillez réessayer.'
// 			);
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	// Mettre à jour la quantité d'un article
// 	const handleUpdateQuantity = async (itemKey: string, quantity: number) => {
// 		if (quantity < 1) return;

// 		try {
// 			setIsLoading(true);
// 			setError(null);

// 			const updatedCart = await updateCartItem(itemKey, quantity);
// 			setItems(formatCartItems(updatedCart));
// 		} catch (err) {
// 			console.error('Erreur lors de la mise à jour de la quantité:', err);
// 			setError(
// 				'Impossible de mettre à jour la quantité. Veuillez réessayer.'
// 			);
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	// Vider le panier
// 	const handleClearCart = async () => {
// 		try {
// 			setIsLoading(true);
// 			setError(null);

// 			const updatedCart = await clearCart();
// 			setItems(formatCartItems(updatedCart));
// 		} catch (err) {
// 			console.error('Erreur lors du vidage du panier:', err);
// 			setError('Impossible de vider votre panier. Veuillez réessayer.');
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	return (
// 		<CartContext.Provider
// 			value={{
// 				items,
// 				itemCount,
// 				subtotal,
// 				isLoading,
// 				error,
// 				addToCart: handleAddToCart,
// 				removeFromCart: handleRemoveFromCart,
// 				updateQuantity: handleUpdateQuantity,
// 				clearCart: handleClearCart,
// 			}}>
// 			{children}
// 		</CartContext.Provider>
// 	);
// }
