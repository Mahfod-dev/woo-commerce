'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCart } from '@/components/CartProvider';
import BestSellersSchema from './BestSellersSchema';

// Types pour les produits best-sellers
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
	badge: string;
	badgeColor: string;
	slug: string;
	featured: boolean;
	on_sale: boolean;
	stock_status: string;
	categories: { id: number; name: string }[];
}

interface Category {
	id: string;
	name: string;
	description: string;
	products: Product[];
}

interface Testimonial {
	id: number;
	content: string;
	author: string;
	role: string;
	image: string;
}

interface Feature {
	icon: string;
	title: string;
	description: string;
}

interface Stat {
	value: string;
	label: string;
}

interface FaqItem {
	question: string;
	answer: string;
}

interface BestSellersData {
	heroSection: {
		title: string;
		description: string;
	};
	categories: Category[];
	testimonials: Testimonial[];
	features: Feature[];
	stats: {
		title: string;
		description: string;
		items: Stat[];
	};
	faq: {
		title: string;
		questions: FaqItem[];
	};
}

interface BestSellersContentProps {
	bestSellersData: BestSellersData;
}

export default function BestSellersContent({
	bestSellersData,
}: BestSellersContentProps) {
	// États pour le panier et autres fonctionnalités interactives
	const [selectedProductId, setSelectedProductId] = useState<number | null>(
		null
	);
	const [activeTestimonial, setActiveTestimonial] = useState<number>(0);
	const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
	const { addToCart, isLoading } = useCart();
	const [notification, setNotification] = useState({
		show: false,
		message: '',
		type: '',
	});
	const bestSellersRef = useRef<HTMLDivElement>(null);

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

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: i * 0.1,
				duration: 0.5,
			},
		}),
		hover: {
			y: -10,
			boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
		},
	};

	// Rendu d'icônes en fonction du type
	const renderIcon = (iconType: string) => {
		switch (iconType) {
			case 'quality':
				return (
					<svg
						className='h-8 w-8 text-indigo-600'
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
				);
			case 'delivery':
				return (
					<svg
						className='h-8 w-8 text-indigo-600'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
						/>
					</svg>
				);
			case 'guarantee':
				return (
					<svg
						className='h-8 w-8 text-indigo-600'
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
				);
			case 'support':
				return (
					<svg
						className='h-8 w-8 text-indigo-600'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
						/>
					</svg>
				);
			default:
				return (
					<svg
						className='h-8 w-8 text-indigo-600'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M13 10V3L4 14h7v7l9-11h-7z'
						/>
					</svg>
				);
		}
	};

	// Formatage du prix en euros
	const formatPrice = (price: string) => {
		return parseFloat(price).toLocaleString('fr-FR', {
			style: 'currency',
			currency: 'EUR',
		});
	};

	// Gérer l'ajout au panier
	const handleAddToCart = async (
		e: React.MouseEvent,
		productId: number,
		productName: string
	) => {
		e.preventDefault();
		setSelectedProductId(productId);

		try {
			await addToCart?.(productId, 1);
			setNotification({
				show: true,
				message: `${productName} a été ajouté au panier`,
				type: 'success',
			});

			// Masquer la notification après 3 secondes
			setTimeout(() => {
				setNotification((prev) => ({ ...prev, show: false }));
			}, 3000);
		} catch (error) {
			setNotification({
				show: true,
				message: "Une erreur s'est produite",
				type: 'error',
			});
			console.error("Erreur lors de l'ajout au panier:", error);

			setTimeout(() => {
				setNotification((prev) => ({ ...prev, show: false }));
			}, 3000);
		} finally {
			setSelectedProductId(null);
		}
	};

	// Rendu des étoiles pour les avis
	const renderStars = (rating: number) => {
		return (
			<div className='flex items-center'>
				{[...Array(5)].map((_, i) => (
					<svg
						key={i}
						className={`h-4 w-4 ${
							i < Math.floor(rating)
								? 'text-yellow-400'
								: 'text-gray-300'
						}`}
						fill='currentColor'
						viewBox='0 0 20 20'>
						<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
					</svg>
				))}
				<span className='ml-2 text-gray-600 text-sm'>
					({rating.toFixed(1)})
				</span>
			</div>
		);
	};

	// Basculer l'état des FAQs
	const toggleFaq = (index: number) => {
		setOpenFaqIndex(openFaqIndex === index ? null : index);
	};

	// Récupérer tous les produits de toutes les catégories
	const allProducts = bestSellersData.categories.flatMap(
		(category) => category.products
	);

	return (
		<div className='bg-gray-50 min-h-screen font-sans bestsellers-content'>
			{/* Ajouter le schéma JSON-LD */}
			<BestSellersSchema
				organizationName='Votre Boutique'
				url='https://votreboutique.com/best-sellers'
				products={allProducts}
			/>

			{/* Notification d'ajout au panier */}
			{notification.show && (
				<div
					className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
						notification.type === 'success'
							? 'bg-green-50 border-l-4 border-green-500'
							: 'bg-red-50 border-l-4 border-red-500'
					}`}>
					<div className='flex'>
						<div className='flex-shrink-0'>
							{notification.type === 'success' ? (
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
							) : (
								<svg
									className='h-5 w-5 text-red-500'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M6 18L18 6M6 6l12 12'
									/>
								</svg>
							)}
						</div>
						<div className='ml-3'>
							<p
								className={`text-sm ${
									notification.type === 'success'
										? 'text-green-800'
										: 'text-red-800'
								}`}>
								{notification.message}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Hero section */}
			<div className='relative bg-gradient-to-r from-indigo-700 to-purple-700 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className='text-center max-w-3xl mx-auto'>
						<h1 className='text-3xl md:text-5xl font-bold mb-4'>
							{bestSellersData.heroSection.title}
						</h1>
						<p className='text-xl text-indigo-100'>
							{bestSellersData.heroSection.description}
						</p>
						<div className='mt-8'>
							<a
								href='#bestsellers'
								onClick={(e) => {
									e.preventDefault();
									bestSellersRef.current?.scrollIntoView({
										behavior: 'smooth',
										block: 'start',
									});
								}}
								className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 transition-colors'>
								Découvrir nos best-sellers
								<svg
									className='ml-2 h-5 w-5'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M19 9l-7 7-7-7'
									/>
								</svg>
							</a>
						</div>
					</motion.div>
				</div>

				{/* Éléments décoratifs */}
				<div className='absolute inset-0 overflow-hidden opacity-20'>
					<div className='absolute -top-20 -left-20 w-64 h-64 rounded-full bg-indigo-500' />
					<div className='absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-500' />
				</div>
			</div>

			{/* Caractéristiques des best-sellers */}
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.6 }}
					className='bg-white rounded-xl shadow-lg p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
					{bestSellersData.features.map((feature, index) => (
						<div
							key={index}
							className='flex items-start'>
							<div className='flex-shrink-0 bg-indigo-100 rounded-full p-3'>
								{renderIcon(feature.icon)}
							</div>
							<div className='ml-4'>
								<h3 className='text-lg font-medium text-gray-900'>
									{feature.title}
								</h3>
								<p className='mt-1 text-gray-600 text-sm'>
									{feature.description}
								</p>
							</div>
						</div>
					))}
				</motion.div>
			</div>

			{/* Statistiques */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, margin: '-50px' }}
					className='text-center'>
					<motion.h2
						variants={itemVariants}
						className='text-3xl font-bold text-gray-900 mb-4'>
						{bestSellersData.stats.title}
					</motion.h2>
					<motion.p
						variants={itemVariants}
						className='text-xl text-gray-600 max-w-3xl mx-auto mb-12'>
						{bestSellersData.stats.description}
					</motion.p>

					<motion.div
						variants={containerVariants}
						className='grid grid-cols-2 md:grid-cols-4 gap-8 mt-12'>
						{bestSellersData.stats.items.map((stat, index) => (
							<motion.div
								key={index}
								variants={itemVariants}
								className='text-center'>
								<p className='text-4xl md:text-5xl font-bold text-indigo-600'>
									{stat.value}
								</p>
								<p className='mt-2 text-gray-600'>
									{stat.label}
								</p>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</div>

			{/* Produits best-sellers par catégorie */}
			<div
				ref={bestSellersRef}
				id='bestsellers'
				className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, margin: '-50px' }}
					className='space-y-24'>
					{bestSellersData.categories.map((category) => (
						<div
							key={category.id}
							className='space-y-8'>
							<div className='text-center'>
								<motion.h2
									variants={itemVariants}
									className='text-3xl font-bold text-gray-900 mb-4'>
									{category.name}
								</motion.h2>
								<motion.p
									variants={itemVariants}
									className='text-gray-600 max-w-3xl mx-auto'>
									{category.description}
								</motion.p>
							</div>

							<motion.div
								variants={containerVariants}
								className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8'>
								{category.products.map((product, index) => (
									<motion.div
										key={product.id}
										custom={index}
										variants={cardVariants}
										whileHover='hover'
										className='bg-white rounded-xl shadow-sm overflow-hidden product-card'>
										<div className='md:flex h-full'>
											<div className='md:w-2/5 relative'>
												<div className='relative h-64 md:h-full w-full'>
													<Image
														src={product.image}
														alt={product.name}
														fill
														sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
														className='object-cover'
													/>
													{/* Badge */}
													<div
														className={`absolute top-2 left-2 ${product.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full z-10`}>
														{product.badge}
													</div>
												</div>
											</div>
											<div className='md:w-3/5 p-6 flex flex-col'>
												{/* Catégorie */}
												{product.categories &&
													product.categories.length >
														0 && (
														<div className='text-xs text-indigo-600 font-medium uppercase tracking-wider mb-1'>
															{
																product
																	.categories[0]
																	.name
															}
														</div>
													)}

												{/* Nom du produit */}
												<h3 className='text-xl font-bold text-gray-900 mb-2'>
													{product.name}
												</h3>

												{/* Étoiles */}
												<div className='mb-3'>
													{renderStars(
														product.rating
													)}
													<span className='text-xs text-gray-500'>
														{product.reviews} avis
													</span>
												</div>

												{/* Description */}
												<p className='text-gray-600 text-sm mb-4 flex-grow'>
													{product.description}
												</p>

												{/* Prix */}
												<div className='flex items-baseline mb-4'>
													<span className='text-2xl font-bold text-indigo-600'>
														{product.sale_price
															? formatPrice(
																	product.sale_price
															  )
															: formatPrice(
																	product.price
															  )}
													</span>

													{product.on_sale && (
														<span className='ml-2 text-sm text-gray-500 line-through'>
															{formatPrice(
																product.regular_price
															)}
														</span>
													)}
												</div>

												{/* Boutons */}
												<div className='flex space-x-2'>
													<Link
														href={`/products/${product.id}-${product.slug}`}
														className='flex-1 py-2 px-4 text-center border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors'>
														Voir les détails
													</Link>
													<button
														onClick={(e) =>
															handleAddToCart(
																e,
																product.id,
																product.name
															)
														}
														disabled={
															isLoading ||
															selectedProductId ===
																product.id
														}
														className='flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-70'>
														{isLoading &&
														selectedProductId ===
															product.id ? (
															<>
																<svg
																	className='animate-spin h-5 w-5 mr-2'
																	fill='none'
																	viewBox='0 0 24 24'>
																	<circle
																		className='opacity-25'
																		cx='12'
																		cy='12'
																		r='10'
																		stroke='currentColor'
																		strokeWidth='4'
																	/>
																	<path
																		className='opacity-75'
																		fill='currentColor'
																		d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
																	/>
																</svg>
																Ajout...
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
																		strokeWidth={
																			2
																		}
																		d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
																	/>
																</svg>
																Ajouter
															</>
														)}
													</button>
												</div>
											</div>
										</div>
									</motion.div>
								))}
							</motion.div>

							<div className='text-center'>
								<Link
									href={`/categories/${category.id}`}
									className='inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800'>
									Voir tous les produits{' '}
									{category.name.toLowerCase()}
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
						</div>
					))}
				</motion.div>
			</div>

			{/* Témoignages */}
			<div className='bg-gray-100 py-16'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<motion.div
						variants={containerVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true, margin: '-50px' }}
						className='text-center mb-12'>
						<motion.h2
							variants={itemVariants}
							className='text-3xl font-bold text-gray-900 mb-4'>
							Ce que nos clients en disent
						</motion.h2>
						<motion.p
							variants={itemVariants}
							className='text-xl text-gray-600 max-w-3xl mx-auto'>
							Découvrez les expériences de nos clients avec nos
							produits best-sellers.
						</motion.p>
					</motion.div>

					<div className='relative'>
						<div className='relative mx-auto max-w-3xl bg-white rounded-xl shadow-lg p-8 md:p-12 testimonial-card'>
							{bestSellersData.testimonials.map(
								(testimonial, index) => (
									<div
										key={testimonial.id}
										className={`${
											index === activeTestimonial
												? 'block'
												: 'hidden'
										}`}>
										<div className='flex flex-col md:flex-row md:items-center'>
											<div className='md:w-1/4 flex justify-center mb-6 md:mb-0'>
												<div className='relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden'>
													<Image
														src={testimonial.image}
														alt={testimonial.author}
														fill
														sizes='(max-width: 768px) 96px, 128px'
														className='object-cover'
													/>
												</div>
											</div>
											<div className='md:w-3/4 md:pl-8'>
												<blockquote>
													<p className='text-xl text-gray-700 italic'>
														&ldquo;
														{testimonial.content}
														&rdquo;
													</p>
													<footer className='mt-4'>
														<div className='flex items-center'>
															<p className='text-gray-900 font-medium'>
																{
																	testimonial.author
																}
															</p>
															<span className='mx-2 text-gray-400'>
																|
															</span>
															<p className='text-gray-600'>
																{
																	testimonial.role
																}
															</p>
														</div>
													</footer>
												</blockquote>
											</div>
										</div>
									</div>
								)
							)}

							{/* Contrôles des témoignages */}
							<div className='flex justify-center mt-8'>
								{bestSellersData.testimonials.map(
									(_, index) => (
										<button
											key={index}
											onClick={() =>
												setActiveTestimonial(index)
											}
											className={`h-3 w-3 mx-1 rounded-full focus:outline-none ${
												index === activeTestimonial
													? 'bg-indigo-600'
													: 'bg-gray-300'
											}`}
											aria-label={`Témoignage ${
												index + 1
											}`}
										/>
									)
								)}
							</div>

							{/* Flèches de navigation */}
							<div className='absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2'>
								<button
									onClick={() =>
										setActiveTestimonial(
											(prev) =>
												(prev -
													1 +
													bestSellersData.testimonials
														.length) %
												bestSellersData.testimonials
													.length
										)
									}
									className='h-10 w-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-gray-100'>
									<svg
										className='h-6 w-6'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M15 19l-7-7 7-7'
										/>
									</svg>
								</button>
							</div>
							<div className='absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2'>
								<button
									onClick={() =>
										setActiveTestimonial(
											(prev) =>
												(prev + 1) %
												bestSellersData.testimonials
													.length
										)
									}
									className='h-10 w-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-gray-100'>
									<svg
										className='h-6 w-6'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M9 5l7 7-7 7'
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* FAQ section */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, margin: '-50px' }}
					className='text-center mb-12'>
					<motion.h2
						variants={itemVariants}
						className='text-3xl font-bold text-gray-900 mb-4'>
						{bestSellersData.faq.title}
					</motion.h2>
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, margin: '-50px' }}
					className='max-w-3xl mx-auto bg-white rounded-xl shadow-sm'>
					{bestSellersData.faq.questions.map((item, index) => (
						<motion.div
							key={index}
							variants={itemVariants}
							className='border-b border-gray-200 last:border-b-0'>
							<button
								onClick={() => toggleFaq(index)}
								className='w-full flex justify-between items-center p-6 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
								<h3 className='text-lg font-medium text-gray-900'>
									{item.question}
								</h3>
								<svg
									className={`h-5 w-5 text-indigo-500 transition-transform ${
										openFaqIndex === index
											? 'transform rotate-180'
											: ''
									}`}
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M19 9l-7 7-7-7'
									/>
								</svg>
							</button>
							{openFaqIndex === index && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									transition={{
										duration: 0.3,
										ease: 'easeInOut',
									}}
									className='px-6 pb-6'>
									<p className='text-gray-600'>
										{item.answer}
									</p>
								</motion.div>
							)}
						</motion.div>
					))}
				</motion.div>
			</div>

			{/* CTA finale */}
			<div className='bg-indigo-600 py-12 mt-16'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<h2 className='text-2xl font-bold text-white mb-4'>
						Prêt à découvrir l&apos;excellence ?
					</h2>
					<p className='text-indigo-100 mb-8 max-w-3xl mx-auto'>
						Nos best-sellers n&apos;attendent que vous. Profitez
						d&apos;une expérience produit incomparable avec notre
						sélection premium.
					</p>
					<Link
						href='/products'
						className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white'>
						Explorer tous nos produits
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
			</div>

			{/* Back to top button */}
			<div className='fixed bottom-8 right-8 z-30'>
				<button
					onClick={() =>
						window.scrollTo({ top: 0, behavior: 'smooth' })
					}
					className='bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
					aria-label='Retour en haut'>
					<svg
						className='h-6 w-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M5 10l7-7m0 0l7 7m-7-7v18'
						/>
					</svg>
				</button>
			</div>
		</div>
	);
}
