'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { WooCategory } from '@/lib/woo';

interface CategoriesPageContentProps {
	categories: WooCategory[];
}

export default function CategoriesPageContent({
	categories,
}: CategoriesPageContentProps) {
	// Variants d'animation
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				when: 'beforeChildren',
				staggerChildren: 0.08,
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
		<div className='bg-gradient-to-b from-gray-50 to-white min-h-screen'>
			{/* Header Banner */}
			<div className='relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20'>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className='text-3xl md:text-5xl font-bold mb-4'>
						Explorez nos catégories
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className='text-indigo-100 max-w-2xl text-lg'>
						Découvrez notre sélection soigneusement organisée pour
						faciliter votre shopping.
					</motion.p>
				</div>
			</div>

			{/* Grille de catégories simplifiée */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				{categories.length > 0 ? (
					<motion.div
						variants={containerVariants}
						initial='hidden'
						animate='visible'
						className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
						{categories.map((category) => (
							<motion.div
								key={category.id}
								variants={itemVariants}>
								<Link
									href={`/categories/${category.slug}`}
									className='group block'>
									<div className='relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-indigo-300'>
										{/* Image */}
										<div className='relative h-48 bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden'>
											{category.image?.src ? (
												<>
													<div className='absolute inset-0 bg-gradient-to-t from-indigo-900/70 via-indigo-600/30 to-transparent z-10 group-hover:from-indigo-900/80 transition-all duration-300'></div>
													<Image
														src={category.image.src}
														alt={category.name}
														fill
														className='object-cover group-hover:scale-110 transition-transform duration-500'
													/>
												</>
											) : (
												<div className='absolute inset-0 flex items-center justify-center'>
													<svg
														className='w-16 h-16 text-indigo-300'
														fill='none'
														viewBox='0 0 24 24'
														stroke='currentColor'>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={1.5}
															d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
														/>
													</svg>
												</div>
											)}
										</div>

										{/* Contenu */}
										<div className='p-5 relative z-20'>
											<h3 className='text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors'>
												{category.name}
											</h3>
											<div className='flex items-center justify-between'>
												<span className='text-sm text-gray-600'>
													{category.count ?? 0}{' '}
													{(category.count ?? 0) > 1
														? 'produits'
														: 'produit'}
												</span>
												<svg
													className='w-5 h-5 text-indigo-600 transform group-hover:translate-x-1 transition-transform'
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
											</div>
										</div>
									</div>
								</Link>
							</motion.div>
						))}
					</motion.div>
				) : (
					<div className='text-center py-20'>
						<svg
							className='mx-auto h-16 w-16 text-gray-400'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
							/>
						</svg>
						<h3 className='mt-4 text-xl font-semibold text-gray-900'>
							Aucune catégorie disponible
						</h3>
						<p className='mt-2 text-gray-600'>
							Revenez plus tard pour découvrir nos produits.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
