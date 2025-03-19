'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { WooProduct } from '@/lib/woo';

interface NewArrivalsContentProps {
	products: WooProduct[];
}

export default function NewArrivalsContent({
	products,
}: NewArrivalsContentProps) {
	const [selectedCategory, setSelectedCategory] = useState<string>('all');
	const [displayedProducts, setDisplayedProducts] =
		useState<WooProduct[]>(products);
	const [sortOrder, setSortOrder] = useState<string>('date');
	const [visibleProductCount, setVisibleProductCount] = useState<number>(9);
	const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

	// Obtenir toutes les catégories uniques des produits
	const uniqueCategories = Array.from(
		new Set(
			products.flatMap((product) =>
				product.categories.map((cat) => cat.name)
			)
		)
	).sort();

	// Filtrer les produits en fonction de la catégorie sélectionnée
	useEffect(() => {
		let filtered = [...products];

		// Filtrer par catégorie si ce n'est pas 'all'
		if (selectedCategory !== 'all') {
			filtered = filtered.filter((product) =>
				product.categories.some((cat) => cat.name === selectedCategory)
			);
		}

		// Trier les produits
		switch (sortOrder) {
			case 'price-asc':
				filtered.sort(
					(a, b) => parseFloat(a.price) - parseFloat(b.price)
				);
				break;
			case 'price-desc':
				filtered.sort(
					(a, b) => parseFloat(b.price) - parseFloat(a.price)
				);
				break;
			case 'popularity':
				filtered.sort(
					(a, b) =>
						parseFloat(b.average_rating) -
						parseFloat(a.average_rating)
				);
				break;
			case 'date':
			default:
				filtered.sort(
					(a, b) =>
						new Date(b.date_created).getTime() -
						new Date(a.date_created).getTime()
				);
				break;
		}

		setDisplayedProducts(filtered);
		setVisibleProductCount(Math.min(9, filtered.length));
	}, [products, selectedCategory, sortOrder]);

	// Charger plus de produits
	const loadMoreProducts = () => {
		setIsLoadingMore(true);

		setTimeout(() => {
			setVisibleProductCount((prev) =>
				Math.min(prev + 9, displayedProducts.length)
			);
			setIsLoadingMore(false);
		}, 800); // Simuler un temps de chargement
	};

	// Animation variants
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

	// Déterminer depuis combien de temps un produit a été ajouté
	const getTimeSinceAdded = (dateCreated: string) => {
		const now = new Date();
		const created = new Date(dateCreated);
		const diffTime = Math.abs(now.getTime() - created.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return "Aujourd'hui";
		if (diffDays === 1) return 'Hier';
		if (diffDays < 7) return `Il y a ${diffDays} jours`;
		if (diffDays < 30)
			return `Il y a ${Math.floor(diffDays / 7)} semaine${
				Math.floor(diffDays / 7) > 1 ? 's' : ''
			}`;
		return `Il y a ${Math.floor(diffDays / 30)} mois`;
	};

	return (
		<div className='bg-gray-50 min-h-screen font-sans'>
			{/* En-tête */}
			<div className='relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}>
						<h1 className='text-3xl md:text-5xl font-bold mb-4'>
							Découvrez nos nouveautés
						</h1>
						<p className='text-indigo-100 max-w-2xl text-lg'>
							Explorez nos dernières arrivées et soyez les
							premiers à découvrir nos produits tendance. Mise à
							jour régulière pour vous offrir toujours plus de
							choix.
						</p>
					</motion.div>
				</div>

				{/* Éléments décoratifs */}
				<div className='absolute inset-0 overflow-hidden opacity-20'>
					<div className='absolute -top-20 -left-20 w-64 h-64 rounded-full bg-indigo-500' />
					<div className='absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-500' />
				</div>
			</div>

			{/* Contenu principal */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Filtres et tri */}
				<div className='bg-white rounded-lg shadow-sm p-6 mb-8'>
					<div className='flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0'>
						{/* Sélection de catégorie */}
						<div>
							<h2 className='text-lg font-medium text-gray-900 mb-3'>
								Filtrer par catégorie
							</h2>
							<div className='flex flex-wrap gap-2'>
								<button
									onClick={() => setSelectedCategory('all')}
									className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
										selectedCategory === 'all'
											? 'bg-indigo-600 text-white'
											: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
									}`}>
									Toutes
								</button>
								{uniqueCategories.map((category) => (
									<button
										key={category}
										onClick={() =>
											setSelectedCategory(category)
										}
										className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
											selectedCategory === category
												? 'bg-indigo-600 text-white'
												: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
										}`}>
										{category}
									</button>
								))}
							</div>
						</div>

						{/* Tri */}
						<div>
							<label
								htmlFor='sort-order'
								className='block text-sm font-medium text-gray-700 mb-2'>
								Trier par
							</label>
							<select
								id='sort-order'
								value={sortOrder}
								onChange={(e) => setSortOrder(e.target.value)}
								className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5'>
								<option value='date'>
									Date d'ajout (plus récent)
								</option>
								<option value='price-asc'>
									Prix (croissant)
								</option>
								<option value='price-desc'>
									Prix (décroissant)
								</option>
								<option value='popularity'>Popularité</option>
							</select>
						</div>
					</div>
				</div>

				{/* Résumé des résultats */}
				<div className='mb-8'>
					<h2 className='text-2xl font-bold text-gray-900'>
						{displayedProducts.length} nouveaux produits{' '}
						{selectedCategory !== 'all' && (
							<span className='font-normal text-gray-600'>
								dans{' '}
								<span className='text-indigo-600 font-medium'>
									{selectedCategory}
								</span>
							</span>
						)}
					</h2>
					<p className='text-gray-600 mt-1'>
						Découvrez nos dernières arrivées et restez à la pointe
						des tendances
					</p>
				</div>

				{/* Grille de produits */}
				{displayedProducts.length === 0 ? (
					<div className='bg-white rounded-lg shadow-sm p-8 text-center my-8'>
						<svg
							className='mx-auto h-12 w-12 text-gray-400'
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
							Aucun produit trouvé
						</h3>
						<p className='mt-2 text-gray-500'>
							Aucun nouveau produit n'est disponible dans cette
							catégorie pour le moment.
						</p>
						<button
							onClick={() => setSelectedCategory('all')}
							className='mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
							Voir toutes les nouveautés
						</button>
					</div>
				) : (
					<>
						<motion.div
							variants={containerVariants}
							initial='hidden'
							animate='visible'
							className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
							{displayedProducts
								.slice(0, visibleProductCount)
								.map((product) => (
									<motion.div
										key={product.id}
										variants={itemVariants}
										className='group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300'>
										<Link
											href={`/products/${product.slug}`}
											className='block'>
											<div className='relative'>
												<div className='relative aspect-square overflow-hidden bg-gray-100'>
													{product.images &&
													product.images.length >
														0 ? (
														<Image
															src={
																product
																	.images[0]
																	.src
															}
															alt={product.name}
															fill
															sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
															className='object-cover transition-transform duration-500 group-hover:scale-105'
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
																	strokeWidth={
																		2
																	}
																	d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
																/>
															</svg>
														</div>
													)}
												</div>

												{/* Badge "Nouveau" */}
												<div className='absolute top-3 left-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full'>
													Nouveau
												</div>

												{/* Badge "Temps depuis ajout" */}
												<div className='absolute top-3 right-3 bg-black bg-opacity-70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded'>
													{getTimeSinceAdded(
														product.date_created
													)}
												</div>
											</div>

											<div className='p-4'>
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

												<h3 className='text-lg font-medium text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]'>
													{product.name}
												</h3>

												<div className='flex items-baseline'>
													<span className='text-xl font-bold text-indigo-600'>
														{parseFloat(
															product.price
														).toLocaleString(
															'fr-FR',
															{
																style: 'currency',
																currency: 'EUR',
															}
														)}
													</span>

													{product.on_sale &&
														product.regular_price && (
															<span className='ml-2 text-sm text-gray-500 line-through'>
																{parseFloat(
																	product.regular_price
																).toLocaleString(
																	'fr-FR',
																	{
																		style: 'currency',
																		currency:
																			'EUR',
																	}
																)}
															</span>
														)}
												</div>
											</div>
										</Link>
									</motion.div>
								))}
						</motion.div>

						{/* Bouton "Charger plus" */}
						{visibleProductCount < displayedProducts.length && (
							<div className='mt-12 text-center'>
								<button
									onClick={loadMoreProducts}
									disabled={isLoadingMore}
									className='inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70'>
									{isLoadingMore ? (
										<>
											<svg
												className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
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
											Chargement...
										</>
									) : (
										<>
											Voir plus de produits
											<span className='ml-2'>
												(
												{displayedProducts.length -
													visibleProductCount}{' '}
												restants)
											</span>
										</>
									)}
								</button>
							</div>
						)}
					</>
				)}

				{/* Section de mise en avant */}
				<div className='mt-24 bg-white rounded-xl overflow-hidden shadow-lg'>
					<div className='md:flex'>
						<div className='md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 p-8 md:p-12 text-white'>
							<h2 className='text-2xl md:text-3xl font-bold mb-4'>
								Inscrivez-vous pour être informé des nouveautés
							</h2>
							<p className='text-indigo-100 mb-6'>
								Recevez en avant-première nos dernières
								collections et bénéficiez d'offres exclusives
								sur nos nouveautés.
							</p>
							<form className='space-y-4'>
								<div>
									<input
										type='email'
										placeholder='Votre adresse e-mail'
										className='w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white'
									/>
								</div>
								<button
									type='submit'
									className='w-full px-4 py-3 bg-white text-indigo-700 font-medium rounded-lg hover:bg-gray-100 transition-colors'>
									S'inscrire
								</button>
							</form>
						</div>
						<div className='md:w-1/2 p-8 md:p-12 flex flex-col justify-center'>
							<h3 className='text-xl font-bold text-gray-900 mb-4'>
								Avantages de notre newsletter
							</h3>
							<ul className='space-y-4'>
								{[
									'Soyez les premiers informés des nouveaux produits',
									'Accès à des offres exclusives et précommandes',
									'Invitations à des événements spéciaux',
									'Conseils et astuces personnalisés',
								].map((item, index) => (
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
										<span className='text-gray-700'>
											{item}
										</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
