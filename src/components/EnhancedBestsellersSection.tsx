'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BestSellerProductCard from './BestSellerProductCard';

// Types pour les données de best-sellers
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

interface BestsellersCategory {
	id: string;
	name: string;
	products: Product[];
}

interface EnhancedBestsellersSectionProps {
	categories: BestsellersCategory[];
	title: string;
	description?: string;
}

export default function EnhancedBestsellersSection({
	categories,
	title,
	description,
}: EnhancedBestsellersSectionProps) {
	const [activeCategory, setActiveCategory] = useState<string>(
		categories[0]?.id || ''
	);
	const [notification, setNotification] = useState({
		show: false,
		message: '',
		type: '',
	});
	const sectionRef = useRef<HTMLDivElement>(null);

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

	// Gérer les notifications du panier
	const handleNotification = (message: string, type: string) => {
		setNotification({
			show: true,
			message,
			type,
		});

		setTimeout(() => {
			setNotification((prev) => ({ ...prev, show: false }));
		}, 3000);
	};

	// Trouver les produits de la catégorie active
	const activeProducts =
		categories.find((cat) => cat.id === activeCategory)?.products || [];

	return (
		<section
			ref={sectionRef}
			className='py-16 bg-gradient-to-b from-gray-50 to-white bestsellers-section relative'>
			{/* Notification toast */}
			{notification.show && (
				<div
					className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md cart-notification ${
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

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* En-tête de section */}
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, margin: '-50px' }}
					className='text-center mb-12'>
					<motion.h2
						variants={itemVariants}
						className='text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 inline-block'>
						{title}
					</motion.h2>
					<div className='h-1 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mt-4 rounded-full'></div>
					{description && (
						<motion.p
							variants={itemVariants}
							className='mt-4 text-gray-600 max-w-2xl mx-auto'>
							{description}
						</motion.p>
					)}
				</motion.div>

				{/* Navigation des catégories */}
				{categories.length > 1 && (
					<motion.div
						variants={itemVariants}
						className='flex flex-wrap justify-center gap-2 mb-8'>
						{categories.map((category) => (
							<button
								key={category.id}
								onClick={() => setActiveCategory(category.id)}
								className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
									activeCategory === category.id
										? 'bg-indigo-600 text-white shadow-md'
										: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
								}`}>
								{category.name}
							</button>
						))}
					</motion.div>
				)}

				{/* Grille de produits */}
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, margin: '-50px' }}
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
					{activeProducts.map((product, index) => (
						<BestSellerProductCard
							key={product.id}
							product={product}
							index={index}
							onNotify={handleNotification}
						/>
					))}
				</motion.div>

				{/* Bouton "Voir tous les produits" */}
				<div className='text-center mt-12'>
					<Link
						href='/products'
						className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg'>
						Découvrir tous nos produits
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

			{/* Éléments décoratifs */}
			<div className='absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none'>
				<div className='absolute top-20 left-5 w-64 h-64 rounded-full bg-indigo-300 mix-blend-multiply filter blur-3xl'></div>
				<div className='absolute bottom-40 right-10 w-72 h-72 rounded-full bg-purple-300 mix-blend-multiply filter blur-3xl'></div>
			</div>
		</section>
	);
}
