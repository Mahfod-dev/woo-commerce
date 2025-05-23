'use client';

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { getProductById, WooProduct } from '@/lib/woo';

// Define types for cart items
interface CartItem {
	id: number;
	key: string;
	name: string;
	price: string;
	regular_price?: string;
	sale_price?: string;
	quantity: number;
	image: string;
}

// Define the cart context type
interface CartContextType {
	items: CartItem[];
	itemCount: number;
	subtotal: number;
	isLoading: boolean;
	error: string | null;
	addToCart: (
		productId: number,
		quantity?: number
	) => Promise<{ success: boolean }>;
	updateQuantity: (itemKey: string, quantity: number) => Promise<void>;
	removeFromCart: (itemKey: string) => Promise<void>;
	clearCart: () => Promise<void>;
}

// Create the context with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook for using the cart context
export function useCart() {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error('useCart must be used within a CartProvider');
	}
	return context;
}

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Calculate total items and subtotal
	const itemCount = items.reduce((total, item) => total + item.quantity, 0);
	const subtotal = items.reduce(
		(total, item) => total + parseFloat(item.price) * item.quantity,
		0
	);
	
	// Helper function to get a valid image URL from a WooCommerce product
	const getProductImageUrl = (product: WooProduct): string => {
		if (product.images && product.images.length > 0) {
			return product.images[0].src;
		}
		return '/images/placeholder.jpg';
	};

	// Simulate loading the cart initially
	useEffect(() => {
		// This function simulates retrieving the cart from local storage
		// In a real implementation, you would make an API call to your backend
		const loadCart = () => {
			try {
				const savedCart = localStorage.getItem('cart');
				if (savedCart) {
					setItems(JSON.parse(savedCart));
				}
			} catch (err) {
				console.error('Error loading cart:', err);
			}
		};

		loadCart();
	}, []);

	// Save cart when it changes
	useEffect(() => {
		try {
			localStorage.setItem('cart', JSON.stringify(items));
		} catch (err) {
			console.error('Error saving cart:', err);
		}
	}, [items]);

	// Function to add a product to cart with real data from the WordPress backend
	const addToCart = async (productId: number, quantity = 1) => {
		setIsLoading(true);
		setError(null);

		try {
			// Create a unique key for this item
			const itemKey = `item_${productId}_${Date.now()}`;

			// Fetch the real product data from the WordPress backend
			const product = await getProductById(productId);

			if (!product) {
				throw new Error(`Product with ID ${productId} not found`);
			}

			// Use the real product data
			const productData: CartItem = {
				id: product.id,
				key: itemKey,
				name: product.name,
				price: product.price,
				regular_price: product.regular_price,
				sale_price: product.sale_price,
				quantity: quantity,
				image: getProductImageUrl(product),
			};

			setItems((prevItems) => [...prevItems, productData]);
			return { success: true };
		} catch (err) {
			console.error('Error adding product to cart:', err);
			setError('Erreur lors de l\'ajout au panier');

			// Fallback to mock data in case of error (for development)
			if (process.env.NODE_ENV === 'development') {
				// Create a unique key for this item
				const itemKey = `item_${productId}_${Date.now()}`;

				// Calculer un prix réaliste (entre 19.99€ et 129.99€)
				const basePrice = (productId % 11) * 10 + 19.99;

				// Fallback product data
				const productData: CartItem = {
					id: productId,
					key: itemKey,
					name: `Product #${productId}`,
					price: basePrice.toFixed(2),
					quantity: quantity,
					image: '/images/placeholder.jpg',
				};

				setItems((prevItems) => [...prevItems, productData]);
				return { success: true };
			}

			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	// Function to update the quantity of an item
	const updateQuantity = async (itemKey: string, quantity: number) => {
		if (quantity < 1) return;

		setIsLoading(true);
		setError(null);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 400));

			setItems((prevItems) =>
				prevItems.map((item) =>
					item.key === itemKey ? { ...item, quantity } : item
				)
			);
		} catch (err) {
			setError('Error updating quantity');
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	// Function to remove an item from the cart
	const removeFromCart = async (itemKey: string) => {
		setIsLoading(true);
		setError(null);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 400));

			setItems((prevItems) =>
				prevItems.filter((item) => item.key !== itemKey)
			);
		} catch (err) {
			setError('Error removing item');
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	// Function to clear the cart
	const clearCart = async () => {
		setIsLoading(true);
		setError(null);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 600));

			setItems([]);
		} catch (err) {
			setError('Error clearing cart');
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	// Value to expose via the context
	const value: CartContextType = {
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