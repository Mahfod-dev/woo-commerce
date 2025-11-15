'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/wooClient';
import { useCart } from '@/components/CartProvider';

// Type pour les produits
interface Product {
	id: number;
	name: string;
	slug: string;
	price: string;
	regular_price?: string;
	sale_price?: string;
	on_sale?: boolean;
	images: { src: string; alt: string }[];
	categories: { id: number; name: string; slug: string }[];
}

interface ProductRecommendationsProps {
	relatedProducts: Product[];
	currentProductId: number;
}

export default function ProductRecommendations({
	relatedProducts,
	currentProductId,
}: ProductRecommendationsProps) {
	const [isAddingToCart, setIsAddingToCart] = useState<number | null>(null);
	const [showNotification, setShowNotification] = useState(false);
	const { addToCart } = useCart();

	// Filtrer pour ne pas afficher le produit actuel
	const filteredProducts = relatedProducts.filter(
		(p) => p.id !== currentProductId
	);

	// Si aucun produit à afficher, ne pas rendre le composant
	if (!filteredProducts.length) {
		return null;
	}

	// Gérer l'ajout au panier
	const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
		e.preventDefault();
		e.stopPropagation();

		setIsAddingToCart(productId);

		try {
			await addToCart(productId, 1);
			setShowNotification(true);

			// Masquer la notification après 3 secondes
			setTimeout(() => {
				setShowNotification(false);
			}, 3000);
		} catch (error) {
			console.error("Erreur lors de l'ajout au panier:", error);
		} finally {
			setIsAddingToCart(null);
		}
	};

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				stiffness: 100,
				damping: 15,
			},
		},
	};

	return (
		<div className='bg-gray-50 py-16'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Titre de section */}
				<div className='flex items-baseline justify-between mb-8'>
					<h2 className='text-2xl font-bold text-gray-900'>
						Vous pourriez aussi aimer
					</h2>
					<Link
						href='/products'
						className='text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center'>
						Voir tous les produits
						<svg
							className='ml-1 h-5 w-5'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M14 5l7 7m0 0l-7 7m7-7H3'
							/>
						</svg>
					</Link>
				</div>

				{/* Grille de produits */}
				<motion.div
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, margin: '-50px' }}>
					{filteredProducts.map((product) => (
						<motion.div
							key={product.id}
							variants={itemVariants}
							whileHover={{ y: -8 }}
							className='group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300'>
							<Link
								href={`/products/${product.id}-${product.slug}`}
								className='block'>
								<div className='relative aspect-square overflow-hidden bg-gray-100'>
									{product.images &&
									product.images.length > 0 ? (
										<Image
											src={product.images[0].src}
											alt={product.name}
											fill
											sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
											className='object-cover transition-transform duration-500 group-hover:scale-110'
										/>
									) : (
										<div className='w-full h-full flex items-center justify-center'>
											<svg
												className='h-16 w-16 text-gray-300'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
												/>
											</svg>
										</div>
									)}

									{/* Badge promo */}
									{product.on_sale && (
										<div className='absolute top-2 right-2 bg-red-500 text-xs font-bold text-white px-2 py-1 rounded-full'>
											Promo
										</div>
									)}

									{/* Bouton rapide */}
									<div className='absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
										<button
											onClick={(e) =>
												handleAddToCart(e, product.id)
											}
											disabled={
												isAddingToCart === product.id
											}
											className='bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg'>
											{isAddingToCart === product.id ? (
												<svg
													className='w-6 h-6 animate-spin'
													viewBox='0 0 24 24'>
													<circle
														className='opacity-25'
														cx='12'
														cy='12'
														r='10'
														stroke='currentColor'
														strokeWidth='4'></circle>
													<path
														className='opacity-75'
														fill='currentColor'
														d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
												</svg>
											) : (
												<svg
													className='w-6 h-6'
													fill='none'
													viewBox='0 0 24 24'
													stroke='currentColor'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
													/>
												</svg>
											)}
										</button>
									</div>
								</div>

								<div className='p-4'>
									<h3 className='text-sm font-medium text-gray-900 mb-1 line-clamp-2 h-10'>
										{product.name}
									</h3>
									<div className='flex items-baseline mb-2'>
										<span className='text-lg font-bold text-indigo-600'>
											{formatPrice(product.price)}
										</span>

										{product.on_sale &&
											product.regular_price && (
												<span className='ml-2 text-sm text-gray-500 line-through'>
													{formatPrice(
														product.regular_price
													)}
												</span>
											)}
									</div>

									<div className='flex items-center justify-between'>
										<Link
											href={`/products/${product.id}-${product.slug}`}
											className='text-xs text-indigo-600 hover:text-indigo-800 font-medium'>
											Voir le produit
										</Link>

										<button
											onClick={(e) =>
												handleAddToCart(e, product.id)
											}
											disabled={
												isAddingToCart === product.id
											}
											className='text-xs font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-2 py-1 rounded transition-colors'>
											Ajouter
										</button>
									</div>
								</div>
							</Link>
						</motion.div>
					))}
				</motion.div>

				{/* Notification d'ajout au panier */}
				{showNotification && (
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
						className='fixed bottom-4 right-4 bg-green-50 text-green-800 border-l-4 border-green-500 p-4 rounded shadow-lg z-50'>
						<div className='flex'>
							<div className='flex-shrink-0'>
								<svg
									className='h-5 w-5 text-green-500'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M5 13l4 4L19 7'
									/>
								</svg>
							</div>
							<div className='ml-3'>
								<p className='text-sm font-medium'>
									Produit ajouté au panier
								</p>
							</div>
						</div>
					</motion.div>
				)}
			</div>
		</div>
	);
}
