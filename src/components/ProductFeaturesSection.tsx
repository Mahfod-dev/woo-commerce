'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Types pour les fonctionnalités
interface Feature {
	icon: string;
	title: string;
	description: string;
}

interface ProductFeaturesSectionProps {
	features: Feature[];
	title?: string;
	description?: string;
	bgColor?: string;
}

export default function ProductFeaturesSection({
	features,
	title = 'Nos engagements qualité',
	description = 'Des produits rigoureusement sélectionnés pour vous offrir le meilleur',
	bgColor = 'bg-white',
}: ProductFeaturesSectionProps) {
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

	// Rendu des icônes
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
			case 'shipping':
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
							d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
						/>
					</svg>
				);
			case 'return':
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
							d='M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z'
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

	return (
		<section className={`py-16 ${bgColor}`}>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* En-tête de section */}
				{(title || description) && (
					<motion.div
						variants={containerVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true, margin: '-50px' }}
						className='text-center mb-12'>
						{title && (
							<motion.h2
								variants={itemVariants}
								className='text-3xl font-bold text-gray-900 mb-4'>
								{title}
							</motion.h2>
						)}
						{description && (
							<motion.p
								variants={itemVariants}
								className='text-xl text-gray-600 max-w-3xl mx-auto'>
								{description}
							</motion.p>
						)}
					</motion.div>
				)}

				{/* Grille de fonctionnalités */}
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, margin: '-50px' }}
					className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
					{features.map((feature, index) => (
						<motion.div
							key={index}
							variants={itemVariants}
							whileHover={{
								y: -5,
								boxShadow:
									'0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
							}}
							className='bg-white rounded-xl p-6 shadow-sm transition-all duration-300 feature-icon-container'>
							<div className='flex flex-col items-center text-center'>
								<div className='bg-indigo-100 rounded-full p-3 mb-4 flex items-center justify-center'>
									<div className='feature-icon'>
										{renderIcon(feature.icon)}
									</div>
								</div>
								<h3 className='text-lg font-bold text-gray-900 mb-2'>
									{feature.title}
								</h3>
								<p className='text-gray-600 text-sm'>
									{feature.description}
								</p>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
