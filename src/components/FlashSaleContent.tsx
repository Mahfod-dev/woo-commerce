// src/components/FlashSaleContent.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCart } from '@/components/CartProvider';
import ImprovedFaqSection from './ImprovedFaqSection';

interface FlashSaleProduct {
	id: number;
	name: string;
	description: string;
	price: string;
	sale_price: string;
	regular_price: string;
	discount_percentage: number;
	rating: number;
	reviews: number;
	image: string;
	badge: string;
	badgeColor: string;
	slug: string;
	featured: boolean;
	on_sale: boolean;
	stock_status: string;
	stock_quantity: number;
	categories: { id: number; name: string }[];
}

interface FlashSaleData {
	heroSection: {
		title: string;
		subtitle: string;
		description: string;
		endDate: Date;
	};
	saleInfo: {
		title: string;
		description: string;
		points: string[];
	};
	products: FlashSaleProduct[];
	faqs: {
		question: string;
		answer: string;
	}[];
	cta: {
		title: string;
		description: string;
		buttonText: string;
		buttonLink: string;
	};
}

interface FlashSaleContentProps {
	flashSaleData: FlashSaleData;
}

export default function FlashSaleContent({
	flashSaleData,
}: FlashSaleContentProps) {
	// État pour le compte à rebours et les notifications
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const [notification, setNotification] = useState({
		show: false,
		message: '',
		type: '',
	});
	const [selectedProductId, setSelectedProductId] = useState<number | null>(
		null
	);

	const { addToCart, isLoading } = useCart();

	// Ref pour faire défiler vers les produits
	const productsRef = useRef<HTMLDivElement>(null);

	// Effet pour gérer le compte à rebours
	useEffect(() => {
		const calculateTimeLeft = () => {
			const difference =
				flashSaleData.heroSection.endDate.getTime() -
				new Date().getTime();

			if (difference <= 0) {
				return {
					days: 0,
					hours: 0,
					minutes: 0,
					seconds: 0,
				};
			}

			return {
				days: Math.floor(difference / (1000 * 60 * 60 * 24)),
				hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
				minutes: Math.floor((difference / 1000 / 60) % 60),
				seconds: Math.floor((difference / 1000) % 60),
			};
		};

		setTimeLeft(calculateTimeLeft());

		const timer = setInterval(() => {
			setTimeLeft(calculateTimeLeft());
		}, 1000);

		return () => clearInterval(timer);
	}, [flashSaleData.heroSection.endDate]);

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

	// Formatage du prix en euros
	const formatPrice = (price: string) => {
		return parseFloat(price).toLocaleString('fr-FR', {
			style: 'currency',
			currency: 'EUR',
		});
	};

	// Déterminer la classe de stock en fonction de la quantité
	const getStockClass = (quantity: number) => {
		if (quantity <= 3) return 'low';
		if (quantity <= 8) return 'medium';
		return '';
	};

	// Calculer le pourcentage de stock restant (pour la barre visuelle)
	const calculateStockPercentage = (quantity: number) => {
		// Supposons qu'un stock plein est de 20 unités
		const maxStock = 20;
		return Math.min(Math.round((quantity / maxStock) * 100), 100);
	};

	// Gérer l'ajout au panier
	const handleAddToCart = async (productId: number, productName: string) => {
		setSelectedProductId(productId);

		try {
			await addToCart(productId, 1);
			setNotification({
				show: true,
				message: `${productName} a été ajouté à votre panier`,
				type: 'success',
			});

			// Masquer la notification après 3 secondes
			setTimeout(() => {
				setNotification((prev) => ({ ...prev, show: false }));
			}, 3000);
		} catch (error) {
			setNotification({
				show: true,
				message: "Une erreur s'est produite lors de l'ajout au panier",
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

	const scrollToProducts = () => {
		productsRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	// Vérifier si la vente est terminée
	const isSaleEnded =
		timeLeft.days === 0 &&
		timeLeft.hours === 0 &&
		timeLeft.minutes === 0 &&
		timeLeft.seconds === 0;

	return (
		<div
			className='bg-gray-50 min-h-screen font-sans flash-sale-content'
			data-print-date={new Date().toLocaleDateString('fr-FR', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})}>
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

			{/* Hero Section avec compte à rebours */}
			<div className='relative bg-gradient-to-r from-red-600 to-pink-600 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className='text-center max-w-3xl mx-auto'>
						<h1 className='text-3xl md:text-5xl font-bold mb-2'>
							{flashSaleData.heroSection.title}
						</h1>
						<p className='text-xl text-pink-100 mb-4'>
							{flashSaleData.heroSection.subtitle}
						</p>
						<p className='text-white opacity-90 mb-8'>
							{flashSaleData.heroSection.description}
						</p>

						{/* Compte à rebours */}
						{!isSaleEnded ? (
							<div className='countdown-container flash-sale-countdown mb-8'>
								<div className='countdown-title'>
									Fin de l'offre dans :
								</div>
								<div className='countdown-digits'>
									<div className='countdown-digit-container'>
										<div className='countdown-digit'>
											{String(timeLeft.days).padStart(
												2,
												'0'
											)}
										</div>
										<div className='countdown-label'>
											Jours
										</div>
									</div>
									<div className='countdown-digit-container'>
										<div className='countdown-digit'>
											{String(timeLeft.hours).padStart(
												2,
												'0'
											)}
										</div>
										<div className='countdown-label'>
											Heures
										</div>
									</div>
									<div className='countdown-digit-container'>
										<div className='countdown-digit'>
											{String(timeLeft.minutes).padStart(
												2,
												'0'
											)}
										</div>
										<div className='countdown-label'>
											Minutes
										</div>
									</div>
									<div className='countdown-digit-container'>
										<div className='countdown-digit'>
											{String(timeLeft.seconds).padStart(
												2,
												'0'
											)}
										</div>
										<div className='countdown-label'>
											Secondes
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className='bg-red-800 text-white p-4 rounded-lg mb-8'>
								<p className='font-bold text-xl'>
									La vente flash est terminée !
								</p>
								<p className='mt-2'>
									Restez à l'affût de nos prochaines offres en
									vous inscrivant à notre newsletter.
								</p>
							</div>
						)}

						<button
							onClick={scrollToProducts}
							className='bg-white text-red-600 hover:bg-gray-100 transition-colors font-medium px-6 py-3 rounded-full shadow-lg inline-flex items-center'>
							Découvrir les offres
							<svg
								className='ml-2 h-5 w-5'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M19 14l-7 7m0 0l-7-7m7 7V3'
								/>
							</svg>
						</button>
					</motion.div>
				</div>

				{/* Éléments décoratifs */}
				<div className='absolute inset-0 overflow-hidden opacity-20'>
					<div className='absolute -top-20 -left-20 w-64 h-64 rounded-full bg-red-500' />
					<div className='absolute bottom-0 right-0 w-80 h-80 rounded-full bg-pink-500' />
				</div>
			</div>

			{/* Info sur la vente flash */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20'>
				<motion.div
					initial={{ y: 50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className='bg-white rounded-xl shadow-lg overflow-hidden p-8'>
					<div className='md:flex items-start gap-10'>
						<div className='md:w-1/2 mb-6 md:mb-0'>
							<h2 className='text-2xl font-bold text-gray-900 mb-4'>
								{flashSaleData.saleInfo.title}
							</h2>
							<p className='text-gray-600 mb-6'>
								{flashSaleData.saleInfo.description}
							</p>
						</div>
						<div className='md:w-1/2'>
							<ul className='space-y-4'>
								{flashSaleData.saleInfo.points.map(
									(point, index) => (
										<li
											key={index}
											className='flex items-start'>
											<svg
												className='h-6 w-6 text-red-500 flex-shrink-0 mr-2'
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
											<span className='text-gray-700'>
												{point}
											</span>
										</li>
									)
								)}
							</ul>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Produits en vente flash */}
			<div
				ref={productsRef}
				className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='text-2xl md:text-3xl font-bold text-center mb-12'>
					Offres exclusives en temps limité
				</motion.h2>

				<motion.div
					variants={containerVariants}
					initial='hidden'
					animate='visible'
					className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{flashSaleData.products.map((product) => (
						<motion.div
							key={product.id}
							variants={itemVariants}
							className='bg-white rounded-xl shadow-md overflow-hidden flash-product-card'>
							{/* Image du produit avec badges */}
							<div className='relative aspect-square overflow-hidden image-container'>
								<Image
									src={product.image}
									alt={product.name}
									fill
									sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
									className='object-cover transition-transform duration-700'
								/>

								{/* Badge catégorie */}
								<div
									className={`product-badge ${product.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
									{product.badge}
								</div>

								{/* Badge réduction */}
								<div className='discount-badge'>
									-{product.discount_percentage}%
								</div>

								{/* Tag "dernière chance" si le stock est bas */}
								{product.stock_quantity <= 3 && (
									<div className='last-chance-tag'>
										Dernière chance !
									</div>
								)}
							</div>

							{/* Informations produit */}
							<div className='p-6'>
								{product.categories &&
									product.categories.length > 0 && (
										<div className='text-xs text-pink-600 font-medium uppercase tracking-wider mb-1'>
											{product.categories[0].name}
										</div>
									)}

								<h3 className='text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]'>
									<Link href={`/products/${product.slug}`}>
										{product.name}
									</Link>
								</h3>

								<div className='mb-3'>
									{renderStars(product.rating)}
									<span className='text-xs text-gray-500'>
										{product.reviews} avis
									</span>
								</div>

								<p className='text-gray-600 text-sm mb-4 line-clamp-2'>
									{product.description}
								</p>

								{/* Prix avec comparaison */}
								<div className='price-comparison mb-2'>
									<span className='price-sale'>
										{formatPrice(product.sale_price)}
									</span>
									<span className='price-regular'>
										{formatPrice(product.regular_price)}
									</span>
									<span className='price-discount'>
										-{product.discount_percentage}%
									</span>
								</div>

								{/* Indicateur de stock */}
								<div className='stock-indicator'>
									<div className='stock-bar'>
										<div
											className={`stock-bar-fill ${getStockClass(
												product.stock_quantity
											)}`}
											style={{
												width: `${calculateStockPercentage(
													product.stock_quantity
												)}%`,
											}}></div>
									</div>
									<span
										className={`stock-text ${getStockClass(
											product.stock_quantity
										)}`}>
										{product.stock_quantity <= 3
											? 'Presque épuisé !'
											: product.stock_quantity <= 8
											? 'Stock limité'
											: `${product.stock_quantity} en stock`}
									</span>
								</div>

								{/* Boutons d'action */}
								<div className='flex space-x-2 mt-4'>
									<Link
										href={`/products/${product.slug}`}
										className='flex-1 py-2 px-4 text-center border border-pink-600 text-pink-600 rounded-md hover:bg-pink-50 transition-colors'>
										Détails
									</Link>
									<button
										onClick={() =>
											handleAddToCart(
												product.id,
												product.name
											)
										}
										disabled={
											isLoading ||
											selectedProductId === product.id
										}
										className='flex-1 py-2 px-4 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors flex items-center justify-center disabled:opacity-70'>
										{isLoading &&
										selectedProductId === product.id ? (
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
														strokeWidth={2}
														d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
													/>
												</svg>
												Ajouter
											</>
										)}
									</button>
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>

			{/* FAQ */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<ImprovedFaqSection
					faqs={flashSaleData.faqs}
					title='Questions fréquentes sur notre vente flash'
					description='Tout ce que vous devez savoir sur notre événement exclusif à durée limitée.'
					bgColor='bg-white'
					showContact={true}
				/>
			</div>

			{/* CTA Section */}
			<div className='cta-section'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10'>
					<h2 className='text-2xl font-bold text-white mb-4'>
						{flashSaleData.cta.title}
					</h2>
					<p className='text-white opacity-90 mb-8 max-w-3xl mx-auto'>
						{flashSaleData.cta.description}
					</p>
					<Link
						href={flashSaleData.cta.buttonLink}
						className='cta-button'>
						{flashSaleData.cta.buttonText}
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
			<div className='fixed bottom-8 right-8 z-30 back-to-top visible'>
				<button
					onClick={() =>
						window.scrollTo({ top: 0, behavior: 'smooth' })
					}
					className='bg-pink-600 text-white p-3 rounded-full shadow-lg hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2'
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
