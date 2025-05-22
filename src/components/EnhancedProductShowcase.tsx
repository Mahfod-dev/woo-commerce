'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useCart } from '@/components/CartProvider';

// Types pour le produit mis en avant
interface Product {
	id: number;
	name: string;
	description: string;
	price: string;
	sale_price?: string;
	regular_price: string;
	rating: number;
	reviews: number;
	image: string;
	slug: string;
	features?: string[];
	benefits?: string[];
}

interface EnhancedProductShowcaseProps {
	product: Product;
	ctaText?: string;
	ctaLink?: string;
}

export default function EnhancedProductShowcase({
	product,
	ctaText = 'Découvrir ce produit',
	ctaLink,
}: EnhancedProductShowcaseProps) {
	const [isLoading, setIsLoading] = useState(false);
	const { addToCart } = useCart();
	const sectionRef = useRef<HTMLDivElement>(null);
	const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
	const [activeTab, setActiveTab] = useState<
		'description' | 'features' | 'benefits'
	>('description');

	// Link to use
	const productLink = ctaLink || `/products/${product.slug}`;

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.3,
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

	// Formatage du prix
	const formatPrice = (price: string) => {
		return parseFloat(price).toLocaleString('fr-FR', {
			style: 'currency',
			currency: 'EUR',
		});
	};

	// Rendu des étoiles pour les avis
	const renderStars = (rating: number) => {
		return (
			<div className='flex items-center'>
				{[...Array(5)].map((_, i) => (
					<svg
						key={i}
						className={`h-5 w-5 ${
							i < Math.floor(rating)
								? 'text-yellow-400'
								: 'text-gray-300'
						}`}
						fill='currentColor'
						viewBox='0 0 20 20'>
						<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
					</svg>
				))}
				<span className='ml-2 text-gray-600'>
					{rating.toFixed(1)} ({product.reviews} avis)
				</span>
			</div>
		);
	};

	// Gérer l'ajout au panier
	const handleAddToCart = async () => {
		setIsLoading(true);
		try {
			await addToCart(product.id, 1);
			// Notification de succès (peut être amélioré)
			alert('Produit ajouté au panier');
		} catch (error) {
			console.error("Erreur lors de l'ajout au panier:", error);
			alert("Une erreur s'est produite");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			ref={sectionRef}
			className='py-20 bg-gradient-to-b from-gray-50 to-white'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<motion.div
					variants={containerVariants}
					initial='hidden'
					animate={isInView ? 'visible' : 'hidden'}
					className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
					{/* Image du produit avec animations */}
					<motion.div
						variants={itemVariants}
						className='relative'>
						<div className='relative aspect-square overflow-hidden rounded-2xl shadow-xl'>
							<Image
								src={product.image}
								alt={product.name}
								fill
								sizes='(max-width: 768px) 100vw, 50vw'
								className='object-cover transition-transform duration-700 hover:scale-105'
								priority
							/>
							{product.sale_price && (
								<div className='absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full transform rotate-3 shadow-md'>
									Promo
								</div>
							)}
						</div>
						{/* Élément décoratif */}
						<div className='absolute -bottom-6 -left-6 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-30 z-0 animate-blob'></div>
						<div className='absolute -top-6 -right-6 w-64 h-64 bg-purple-100 rounded-full filter blur-3xl opacity-30 z-0 animate-blob animation-delay-2000'></div>
					</motion.div>

					{/* Informations produit */}
					<motion.div
						variants={itemVariants}
						className='flex flex-col space-y-6'>
						<h2 className='text-3xl font-bold text-gray-900'>
							{product.name}
						</h2>

						<div className='flex items-center'>
							{renderStars(product.rating)}
						</div>

						<div className='flex items-baseline'>
							<span className='text-3xl font-bold text-indigo-600'>
								{product.sale_price
									? formatPrice(product.sale_price)
									: formatPrice(product.price)}
							</span>
							{product.sale_price && (
								<span className='ml-4 text-lg text-gray-500 line-through'>
									{formatPrice(product.regular_price)}
								</span>
							)}
						</div>

						{/* Onglets d'information */}
						<div className='pt-4'>
							<div className='border-b border-gray-200'>
								<nav className='flex space-x-8'>
									<button
										onClick={() =>
											setActiveTab('description')
										}
										className={`pb-3 font-medium text-sm transition-colors ${
											activeTab === 'description'
												? 'border-b-2 border-indigo-600 text-indigo-600'
												: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
										}`}>
										Description
									</button>
									{product.features && (
										<button
											onClick={() =>
												setActiveTab('features')
											}
											className={`pb-3 font-medium text-sm transition-colors ${
												activeTab === 'features'
													? 'border-b-2 border-indigo-600 text-indigo-600'
													: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
											}`}>
											Caractéristiques
										</button>
									)}
									{product.benefits && (
										<button
											onClick={() =>
												setActiveTab('benefits')
											}
											className={`pb-3 font-medium text-sm transition-colors ${
												activeTab === 'benefits'
													? 'border-b-2 border-indigo-600 text-indigo-600'
													: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
											}`}>
											Avantages
										</button>
									)}
								</nav>
							</div>

							<div className='py-4'>
								{activeTab === 'description' && (
									<p className='text-gray-600'>
										{product.description}
									</p>
								)}
								{activeTab === 'features' &&
									product.features && (
										<ul className='space-y-2'>
											{product.features.map(
												(feature, index) => (
													<li
														key={index}
														className='flex items-start'>
														<svg
															className='h-5 w-5 text-indigo-600 mt-0.5 mr-2'
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
														<span className='text-gray-600'>
															{feature}
														</span>
													</li>
												)
											)}
										</ul>
									)}
								{activeTab === 'benefits' &&
									product.benefits && (
										<ul className='space-y-2'>
											{product.benefits.map(
												(benefit, index) => (
													<li
														key={index}
														className='flex items-start'>
														<svg
															className='h-5 w-5 text-green-500 mt-0.5 mr-2'
															fill='none'
															viewBox='0 0 24 24'
															stroke='currentColor'>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth={2}
																d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
															/>
														</svg>
														<span className='text-gray-600'>
															{benefit}
														</span>
													</li>
												)
											)}
										</ul>
									)}
							</div>
						</div>

						{/* Labels de confiance */}
						<div className='flex flex-wrap gap-4 py-4'>
							<div className='bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700 flex items-center'>
								<svg
									className='h-4 w-4 text-green-500 mr-1'
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
								Livraison gratuite
							</div>
							<div className='bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700 flex items-center'>
								<svg
									className='h-4 w-4 text-green-500 mr-1'
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
								Garantie 3 ans
							</div>
							<div className='bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700 flex items-center'>
								<svg
									className='h-4 w-4 text-green-500 mr-1'
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
								Retours sous 14 jours
							</div>
						</div>

						{/* Boutons d'action */}
						<div className='flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4'>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleAddToCart}
								disabled={isLoading}
								className='flex-1 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-70'>
								{isLoading ? (
									<>
										<svg
											className='animate-spin -ml-1 mr-2 h-5 w-5 text-white'
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
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

							<Link
								href={productLink}
								className='flex-1 py-3 px-6 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium rounded-lg transition-colors duration-300 flex items-center justify-center'>
								{ctaText}
								<svg
									className='ml-2 h-5 w-5'
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
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}
