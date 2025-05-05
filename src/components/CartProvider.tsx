'use client';

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';

// Define types for cart items
interface CartItem {
	id: number;
	key: string;
	name: string;
	price: string;
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

	// Function to add a product to cart
	const addToCart = async (productId: number, quantity = 1) => {
		setIsLoading(true);
		setError(null);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 800));

			// Create a unique key for this item
			const itemKey = `item_${productId}_${Date.now()}`;

			// Simulate product data (in a real app, this data would come from the API)
			const productData: CartItem = {
				id: productId,
				key: itemKey,
				name: `Product #${productId}`,
				price: (Math.random() * 100 + 10).toFixed(2),
				quantity: quantity,
				image: '/placeholder.jpg', // Default image
			};

			setItems((prevItems) => [...prevItems, productData]);
			return { success: true };
		} catch (err) {
			setError('Error adding to cart');
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
