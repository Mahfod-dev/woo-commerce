'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatPrice, calculateDiscount } from '@/lib/wooClient';
import { useCart } from '@/components/CartProvider';

const AnimatedProductsGrid = ({ products, columns = 3 }) => {
	const { addToCart, isLoading } = useCart();
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [visibleProducts, setVisibleProducts] = useState([]);
	const gridRef = useRef(null);

	// Définir le nombre de colonnes
	const gridCols = {
		2: 'grid-cols-1 sm:grid-cols-2',
		3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
		4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
	}[columns];

	// Observer pour l'animation d'entrée
	useEffect(() => {
		if (!gridRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Charger les produits progressivement
						setVisibleProducts(products);
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.1 }
		);

		observer.observe(gridRef.current);

		return () => {
			if (gridRef.current) {
				observer.unobserve(gridRef.current);
			}
		};
	}, [products]);

	// Animation des variants pour les produits
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const productVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				stiffness: 120,
				damping: 15,
			},
		},
	};

	// Gérer l'ajout au panier
	const handleAddToCart = async (e, productId) => {
		e.preventDefault();
		setSelectedProduct(productId);

		try {
			await addToCart(productId, 1);
			// Animation de succès (à implémenter si besoin)
		} catch (error) {
			console.error("Erreur lors de l'ajout au panier:", error);
		} finally {
			setTimeout(() => {
				setSelectedProduct(null);
			}, 800);
		}
	};

	return (
		<motion.div
			ref={gridRef}
			className={`grid ${gridCols} gap-6`}
			variants={containerVariants}
			initial='hidden'
			animate='visible'>
			{visibleProducts.map((product) => (
				<motion.div
					key={product.id}
					className='group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300'
					variants={productVariants}
					whileHover={{ y: -5 }}>
					<Link
						href={`/products/${product.slug}`}
						className='block'>
						{/* Image avec overlay au survol */}
						<div className='relative aspect-square overflow-hidden bg-gray-100'>
							{product.images && product.images.length > 0 ? (
								<Image
									src={product.images[0].src}
									alt={product.name}
									fill
									sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
									className='object-cover transition-transform duration-700 group-hover:scale-110'
									priority={product.featured}
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

							{/* Overlay de produit au survol */}
							<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

							{/* Badges */}
							<div className='absolute top-3 left-3 flex flex-col gap-2'>
								{product.featured && (
									<span className='bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full'>
										Populaire
									</span>
								)}
								{product.on_sale && (
									<span className='bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full'>
										-
										{calculateDiscount(
											product.regular_price,
											product.sale_price
										)}
										%
									</span>
								)}
							</div>

							{/* Prix et bouton rapide qui apparaissent au survol */}
							<div className='absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300'>
								<div className='flex justify-between items-center'>
									<div>
										<span className='text-white font-bold text-lg drop-shadow-md'>
											{formatPrice(product.price)}
										</span>
										{product.on_sale &&
											product.regular_price && (
												<span className='ml-2 text-gray-300 text-sm line-through'>
													{formatPrice(
														product.regular_price
													)}
												</span>
											)}
									</div>
									<motion.button
										onClick={(e) =>
											handleAddToCart(e, product.id)
										}
										disabled={
											isLoading ||
											selectedProduct === product.id
										}
										className='bg-white text-indigo-600 rounded-full p-2 shadow-md hover:bg-indigo-600 hover:text-white transition-colors disabled:bg-gray-300 disabled:text-gray-500'
										whileTap={{ scale: 0.9 }}>
										{isLoading &&
										selectedProduct === product.id ? (
											<svg
												className='animate-spin h-5 w-5'
												viewBox='0 0 24 24'>
												<circle
													className='opacity-25'
													cx='12'
													cy='12'
													r='10'
													stroke='currentColor'
													strokeWidth='4'
													fill='none'
												/>
												<path
													className='opacity-75'
													fill='currentColor'
													d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
												/>
											</svg>
										) : (
											<svg
												className='h-5 w-5'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M12 6v6m0 0v6m0-6h6m-6 0H6'
												/>
											</svg>
										)}
									</motion.button>
								</div>
							</div>
						</div>

						{/* Informations produit */}
						<div className='p-4'>
							{product.categories &&
								product.categories.length > 0 && (
									<div className='text-xs text-indigo-600 font-medium uppercase tracking-wider mb-1'>
										{product.categories[0].name}
									</div>
								)}

							<h3 className='text-lg font-medium text-gray-900 line-clamp-2 min-h-[3.5rem]'>
								{product.name}
							</h3>

							{/* Étoiles de notation (si disponible) */}
							{product.average_rating &&
								parseFloat(product.average_rating) > 0 && (
									<div className='flex items-center mt-2'>
										<div className='flex text-yellow-400'>
											{[...Array(5)].map((_, i) => (
												<svg
													key={i}
													className={`h-4 w-4 ${
														i <
														Math.floor(
															parseFloat(
																product.average_rating
															)
														)
															? 'text-yellow-400'
															: 'text-gray-300'
													}`}
													fill='currentColor'
													viewBox='0 0 20 20'>
													<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
												</svg>
											))}
										</div>
										<span className='ml-1 text-xs text-gray-500'>
											({product.rating_count})
										</span>
									</div>
								)}
						</div>
					</Link>

					{/* Bouton d'ajout au panier */}
					<div className='px-4 pb-4'>
						<motion.button
							onClick={(e) => handleAddToCart(e, product.id)}
							disabled={
								isLoading || selectedProduct === product.id
							}
							className='w-full py-2 px-4 flex items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:text-gray-500'
							whileTap={{ scale: 0.97 }}>
							{isLoading && selectedProduct === product.id ? (
								<>
									<svg
										className='animate-spin h-5 w-5 mr-2'
										viewBox='0 0 24 24'>
										<circle
											className='opacity-25'
											cx='12'
											cy='12'
											r='10'
											stroke='currentColor'
											strokeWidth='4'
											fill='none'
										/>
										<path
											className='opacity-75'
											fill='currentColor'
											d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
										/>
									</svg>
									Ajout en cours...
								</>
							) : (
								<>
									<svg
										className='h-5 w-5 mr-2'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
										/>
									</svg>
									Ajouter au panier
								</>
							)}
						</motion.button>
					</div>
				</motion.div>
			))}
		</motion.div>
	);
};

export default AnimatedProductsGrid;
