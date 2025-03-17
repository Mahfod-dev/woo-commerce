'use client';

import { useState, useEffect } from 'react';
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
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredCategories, setFilteredCategories] = useState<WooCategory[]>(
		[]
	);
	const [featuredCategories, setFeaturedCategories] = useState<WooCategory[]>(
		[]
	);
	const [regularCategories, setRegularCategories] = useState<WooCategory[]>(
		[]
	);

	// Filtrer et organiser les catégories
	useEffect(() => {
		// Filtrer les catégories en fonction de la recherche
		const filtered = categories.filter((cat) =>
			cat.name.toLowerCase().includes(searchTerm.toLowerCase())
		);

		// Sélectionner quelques catégories mises en avant (les 3 premières avec le plus grand nombre de produits)
		const featured = [...filtered]
			.sort((a, b) => (b.count || 0) - (a.count || 0))
			.slice(0, 3);

		// Toutes les autres catégories
		const regular = filtered.filter((cat) => !featured.includes(cat));

		setFilteredCategories(filtered);
		setFeaturedCategories(featured);
		setRegularCategories(regular);
	}, [categories, searchTerm]);

	// Variants d'animation
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				when: 'beforeChildren',
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
		<div className='bg-gradient-to-b from-gray-50 to-white min-h-screen'>
			{/* Header Banner */}
			<div className='relative bg-gradient-to-r from-indigo-700 to-purple-700 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10'>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className='text-3xl md:text-5xl font-bold mb-4 max-w-3xl'>
						Explorez nos catégories
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className='text-indigo-100 max-w-2xl text-lg'>
						Découvrez notre sélection soigneusement organisée pour
						faciliter votre shopping et trouver ce que vous
						cherchez.
					</motion.p>

					{/* Barre de recherche */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className='mt-8 max-w-lg'>
						<div className='relative'>
							<input
								type='text'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder='Rechercher une catégorie...'
								className='w-full pl-12 pr-4 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50'
							/>
							<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
								<svg
									className='h-5 w-5 text-white/70'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
									/>
								</svg>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Éléments décoratifs */}
				<div className='absolute inset-0 overflow-hidden opacity-20'>
					<div className='absolute -top-20 -left-20 w-64 h-64 rounded-full bg-indigo-500' />
					<div className='absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-500' />
				</div>
			</div>

			{/* Contenu principal */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				{/* Résumé des résultats */}
				<div className='mb-8'>
					<h2 className='text-2xl font-bold text-gray-900 mb-2'>
						{filteredCategories.length} catégories{' '}
						{searchTerm && (
							<span className='font-normal text-gray-600'>
								pour "
								<span className='italic'>{searchTerm}</span>"
							</span>
						)}
					</h2>
					<p className='text-gray-600'>
						Explorez nos collections classées par thèmes et styles
					</p>
				</div>

				{filteredCategories.length === 0 ? (
					<div className='text-center py-16 bg-gray-50 rounded-xl'>
						<svg
							className='mx-auto h-16 w-16 text-gray-400'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
						<h3 className='mt-4 text-lg font-medium text-gray-900'>
							Aucune catégorie trouvée
						</h3>
						<p className='mt-2 text-gray-500'>
							Essayez avec des termes de recherche différents ou
							parcourez toutes nos catégories.
						</p>
						<button
							onClick={() => setSearchTerm('')}
							className='mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'>
							Voir toutes les catégories
						</button>
					</div>
				) : (
					<>
						{/* Catégories mises en avant */}
						{featuredCategories.length > 0 && !searchTerm && (
							<div className='mb-16'>
								<h3 className='text-xl font-bold text-gray-900 mb-6'>
									Catégories populaires
								</h3>

								<motion.div
									variants={containerVariants}
									initial='hidden'
									animate='visible'
									className='grid grid-cols-1 md:grid-cols-3 gap-6'>
									{featuredCategories.map((category) => (
										<motion.div
											key={category.id}
											variants={itemVariants}
											whileHover={{ y: -8 }}
											className='relative h-80 rounded-xl overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl'>
											<Link
												href={`/categories/${category.slug}`}
												className='block h-full'>
												{/* Image de fond */}
												<div className='absolute inset-0 bg-gradient-to-b from-transparent to-black/70'>
													<Image
														src={
															category.image
																?.src ||
															'/images/default-category.jpg'
														}
														alt={category.name}
														fill
														sizes='(max-width: 768px) 100vw, 33vw'
														className='object-cover'
													/>
												</div>

												{/* Contenu */}
												<div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
													<h3 className='text-2xl font-bold mb-2'>
														{category.name}
													</h3>
													<div className='flex items-center justify-between'>
														<span className='text-sm opacity-80'>
															{category.count}{' '}
															produits
														</span>
														<div className='flex items-center text-indigo-300 hover:text-white transition-colors'>
															<span className='text-sm font-medium'>
																Explorer
															</span>
															<svg
																className='ml-1 w-5 h-5'
																fill='none'
																stroke='currentColor'
																viewBox='0 0 24 24'>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	strokeWidth='2'
																	d='M9 5l7 7-7 7'></path>
															</svg>
														</div>
													</div>
												</div>
											</Link>
										</motion.div>
									))}
								</motion.div>
							</div>
						)}

						{/* Toutes les catégories */}
						<motion.div
							variants={containerVariants}
							initial='hidden'
							animate='visible'
							className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
							{regularCategories.map((category) => (
								<motion.div
									key={category.id}
									variants={itemVariants}
									whileHover={{ y: -5 }}
									className='bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group'>
									<Link
										href={`/categories/${category.slug}`}
										className='block'>
										<div className='relative h-48 overflow-hidden'>
											<Image
												src={
													category.image?.src ||
													'/images/default-category.jpg'
												}
												alt={category.name}
												fill
												sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
												className='object-cover transition-transform duration-500 group-hover:scale-105'
											/>
											<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70'></div>
										</div>

										<div className='p-6'>
											<h3 className='text-xl font-semibold text-gray-900 mb-2'>
												{category.name}
											</h3>
											<div className='flex items-center justify-between'>
												<span className='text-sm text-gray-600'>
													{category.count} produits
												</span>
												<span className='text-indigo-600 flex items-center text-sm font-medium group-hover:translate-x-1 transition-transform'>
													Découvrir
													<svg
														className='ml-1 w-4 h-4'
														fill='none'
														stroke='currentColor'
														viewBox='0 0 24 24'>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth='2'
															d='M9 5l7 7-7 7'></path>
													</svg>
												</span>
											</div>
										</div>
									</Link>
								</motion.div>
							))}
						</motion.div>
					</>
				)}
			</div>
		</div>
	);
}
