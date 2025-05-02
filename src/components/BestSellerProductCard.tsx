'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCart } from '@/components/CartProvider';

// Types pour le produit
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
	badge?: string;
	badgeColor?: string;
	slug: string;
	featured: boolean;
	on_sale: boolean;
	stock_status: string;
	categories: { id: number; name: string }[];
}

interface BestSellerProductCardProps {
	product: Product;
	index: number;
	onNotify: (message: string, type: string) => void;
}

export default function BestSellerProductCard({
	product,
	index,
	onNotify,
}: BestSellerProductCardProps) {
	const [isHovered, setIsHovered] = useState(false);
	const { addToCart, isLoading } = useCart();
	const [isAddingToCart, setIsAddingToCart] = useState(false);

	// Animation variants
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
			transition: {
				type: 'spring',
				stiffness: 300,
				damping: 20,
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

	// Gérer l'ajout au panier
	const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsAddingToCart(true);

		try {
			await addToCart(product.id, 1);
			onNotify(`${product.name} a été ajouté à votre panier`, 'success');
		} catch (error) {
			console.error("Erreur lors de l'ajout au panier:", error);
			onNotify(
				"Une erreur s'est produite lors de l'ajout au panier",
				'error'
			);
		} finally {
			setIsAddingToCart(false);
		}
	};

	// Rendu des étoiles pour les avis
	const renderStars = (rating: number) => {
		return (
			<div className='flex items-center star-rating'>
				{[...Array(5)].map((_, i) => (
					<svg
						key={i}
						className={`h-4 w-4 ${
							i < Math.floor(rating)
								? 'text-yellow-400'
								: 'text-gray-300'
						} star transition-transform duration-300`}
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

	// Vérifier si le stock est limité (pour créer un sentiment d'urgence)
	const hasLimitedStock = product.id % 2 === 0; // Simulation - dans un cas réel, cela viendrait de l'API

	return (
		<motion.div
			custom={index}
			variants={cardVariants}
			initial='hidden'
			whileInView='visible'
			whileHover='hover'
			viewport={{ once: true, margin: '-50px' }}
			className='bg-white rounded-xl shadow-sm overflow-hidden product-card'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}>
			<div className='relative'>
				{/* Image du produit */}
				<div className='relative aspect-square overflow-hidden image-container'>
					<Image
						src={product.image}
						alt={product.name}
						fill
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						className={`object-cover transition-transform duration-700 ${
							isHovered ? 'scale-110' : 'scale-100'
						}`}
					/>

					{/* Badge (Promo, Nouveau, etc.) */}
					{product.badge && (
						<div
							className={`absolute top-2 left-2 ${
								product.badgeColor || 'bg-indigo-600'
							} text-white text-xs font-bold px-2.5 py-1 rounded-full product-badge z-10`}>
							{product.badge}
						</div>
					)}

					{/* Overlay au survol avec bouton rapide */}
					<div
						className={`absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-opacity duration-300 ${
							isHovered ? 'opacity-100' : 'opacity-0'
						}`}>
						<Link
							href={`/products/${product.slug}`}
							className='bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors duration-300 rounded-full p-3 m-2 shadow-lg'>
							<svg
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
								/>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
								/>
							</svg>
						</Link>

						<button
							onClick={handleAddToCart}
							disabled={isAddingToCart || isLoading}
							className='bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300 rounded-full p-3 m-2 shadow-lg'>
							{isAddingToCart || isLoading ? (
								<svg
									className='animate-spin h-6 w-6'
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
							) : (
								<svg
									className='h-6 w-6'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
									/>
								</svg>
							)}
						</button>
					</div>
				</div>

				{/* Informations produit */}
				<div className='p-5'>
					{/* Catégorie */}
					{product.categories && product.categories.length > 0 && (
						<div className='text-xs text-indigo-600 font-medium uppercase tracking-wider mb-1'>
							{product.categories[0].name}
						</div>
					)}

					{/* Nom du produit */}
					<Link href={`/products/${product.slug}`}>
						<h3 className='text-lg font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors line-clamp-2 min-h-[3.5rem]'>
							{product.name}
						</h3>
					</Link>

					{/* Note et avis */}
					<div className='mb-3'>
						{renderStars(product.rating)}
						<span className='text-xs text-gray-500'>
							{product.reviews} avis
						</span>
					</div>

					{/* Prix */}
					<div className='flex items-baseline mb-4'>
						<span className='text-2xl font-bold text-indigo-600'>
							{product.sale_price
								? formatPrice(product.sale_price)
								: formatPrice(product.price)}
						</span>

						{product.on_sale && (
							<span className='ml-2 text-sm text-gray-500 line-through'>
								{formatPrice(product.regular_price)}
							</span>
						)}
					</div>

					{/* Indicateur de stock (sentiment d'urgence) */}
					{hasLimitedStock && (
						<div className='mb-4 text-sm text-red-500 font-medium flex items-center animate-pulse'>
							<svg
								className='h-4 w-4 mr-1'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
								/>
							</svg>
							Plus que quelques exemplaires en stock
						</div>
					)}

					{/* Bouton d'ajout au panier */}
					<button
						onClick={handleAddToCart}
						disabled={isAddingToCart || isLoading}
						className='w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg cta-button flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed'>
						{isAddingToCart || isLoading ? (
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
					</button>
				</div>
			</div>
		</motion.div>
	);
}
