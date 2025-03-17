'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { WooProduct } from '@/lib/woo';
import { formatPrice } from '@/lib/wooClient';

interface PromotionsContentProps {
	products: WooProduct[];
}

export default function PromotionsContent({
	products,
}: PromotionsContentProps) {
	const [selectedDiscount, setSelectedDiscount] = useState<string>('all');
	const [selectedCategory, setSelectedCategory] = useState<string>('all');
	const [displayedProducts, setDisplayedProducts] =
		useState<WooProduct[]>(products);
	const [sortOrder, setSortOrder] = useState<string>('discount');
	const [visibleProductCount, setVisibleProductCount] = useState<number>(9);
	const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
	const [promoCode, setPromoCode] = useState<string>('');
	const [countdown, setCountdown] = useState({
		days: 3,
		hours: 8,
		minutes: 45,
		seconds: 30,
	});
	const [showPromoSuccess, setShowPromoSuccess] = useState<boolean>(false);

	// Organiser les produits par catégorie
	const uniqueCategories = Array.from(
		new Set(
			products.flatMap((product) =>
				product.categories.map((cat) => cat.name)
			)
		)
	).sort();

	// Calculer des tranches de réduction
	const discountRanges = [
		{ label: 'Petits prix (-20%)', min: 0, max: 20 },
		{ label: 'Bonnes affaires (-50%)', min: 20, max: 50 },
		{ label: 'Grosses promos (-70%)', min: 50, max: 100 },
	];

	// Calculer le pourcentage de réduction
	const calculateDiscount = (
		regularPrice: string,
		salePrice: string
	): number => {
		const regular = parseFloat(regularPrice);
		const sale = parseFloat(salePrice);

		if (!regular || !sale || regular <= 0) return 0;

		return Math.round(((regular - sale) / regular) * 100);
	};

	// Filtrer les produits
	useEffect(() => {
		let filtered = [...products];

		// Filtrer par catégorie
		if (selectedCategory !== 'all') {
			filtered = filtered.filter((product) =>
				product.categories.some((cat) => cat.name === selectedCategory)
			);
		}

		// Filtrer par plage de réduction
		if (selectedDiscount !== 'all') {
			const range = discountRanges.find(
				(r) => r.label === selectedDiscount
			);
			if (range) {
				filtered = filtered.filter((product) => {
					const discount = calculateDiscount(
						product.regular_price,
						product.sale_price
					);
					return discount >= range.min && discount < range.max;
				});
			}
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
			case 'discount':
				filtered.sort(
					(a, b) =>
						calculateDiscount(b.regular_price, b.sale_price) -
						calculateDiscount(a.regular_price, a.sale_price)
				);
				break;
			case 'name':
				filtered.sort((a, b) => a.name.localeCompare(b.name));
				break;
		}

		setDisplayedProducts(filtered);
		// Réinitialiser le nombre de produits visibles lors d'un changement de filtre
		setVisibleProductCount(Math.min(9, filtered.length));
	}, [products, selectedCategory, selectedDiscount, sortOrder]);

	// Mettre à jour le compte à rebours
	useEffect(() => {
		const timer = setInterval(() => {
			setCountdown((prev) => {
				// Décrémenter les secondes
				if (prev.seconds > 0) {
					return { ...prev, seconds: prev.seconds - 1 };
				}
				// Si secondes est 0, décrémenter les minutes
				else if (prev.minutes > 0) {
					return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
				}
				// Si minutes est 0, décrémenter les heures
				else if (prev.hours > 0) {
					return {
						...prev,
						hours: prev.hours - 1,
						minutes: 59,
						seconds: 59,
					};
				}
				// Si heures est 0, décrémenter les jours
				else if (prev.days > 0) {
					return {
						...prev,
						days: prev.days - 1,
						hours: 23,
						minutes: 59,
						seconds: 59,
					};
				}
				// Sinon réinitialiser le compteur (ou faire autre chose)
				else {
					return { days: 3, hours: 0, minutes: 0, seconds: 0 };
				}
			});
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	// Gérer la soumission du code promo
	const handlePromoSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (promoCode.trim()) {
			// Simuler la validation d'un code promo
			setShowPromoSuccess(true);
			setTimeout(() => setShowPromoSuccess(false), 5000);
			setPromoCode('');
		}
	};

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

	return (
		<div className='bg-gray-50 min-h-screen'>
			{/* En-tête */}
			<div className='relative bg-gradient-to-r from-red-600 to-pink-600 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}>
						<h1 className='text-3xl md:text-5xl font-bold mb-4'>
							Offres Spéciales & Promotions
						</h1>
						<p className='text-red-100 max-w-2xl text-lg'>
							Découvrez notre sélection de produits à prix
							réduits. Ne manquez pas ces offres spéciales pour
							faire de bonnes affaires !
						</p>
					</motion.div>
				</div>

				{/* Éléments décoratifs */}
				<div className='absolute inset-0 overflow-hidden opacity-20'>
					<div className='absolute -top-20 -left-20 w-64 h-64 rounded-full bg-red-500' />
					<div className='absolute bottom-0 right-0 w-80 h-80 rounded-full bg-pink-500' />
				</div>
			</div>

			{/* Compte à rebours */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20'>
				<motion.div
					initial={{ y: 50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className='bg-white rounded-xl shadow-lg overflow-hidden'>
					<div className='bg-gradient-to-r from-red-600 to-pink-600 px-6 py-3 text-white'>
						<h2 className='text-lg font-bold'>
							⏰ Offres à durée limitée - Ne tardez pas !
						</h2>
					</div>
					<div className='p-6 flex flex-col md:flex-row items-center justify-between gap-6'>
						<div>
							<p className='font-medium text-gray-700 mb-2'>
								Ces promotions se terminent dans :
							</p>
							<div className='flex space-x-4 text-center'>
								<div className='flex flex-col'>
									<span className='text-3xl font-bold text-red-600'>
										{countdown.days}
									</span>
									<span className='text-xs text-gray-500'>
										Jours
									</span>
								</div>
								<div className='flex flex-col'>
									<span className='text-3xl font-bold text-red-600'>
										{countdown.hours
											.toString()
											.padStart(2, '0')}
									</span>
									<span className='text-xs text-gray-500'>
										Heures
									</span>
								</div>
								<div className='flex flex-col'>
									<span className='text-3xl font-bold text-red-600'>
										{countdown.minutes
											.toString()
											.padStart(2, '0')}
									</span>
									<span className='text-xs text-gray-500'>
										Minutes
									</span>
								</div>
								<div className='flex flex-col'>
									<span className='text-3xl font-bold text-red-600'>
										{countdown.seconds
											.toString()
											.padStart(2, '0')}
									</span>
									<span className='text-xs text-gray-500'>
										Secondes
									</span>
								</div>
							</div>
						</div>

						<div className='w-full md:w-auto'>
							<form
								onSubmit={handlePromoSubmit}
								className='flex'>
								<input
									type='text'
									value={promoCode}
									onChange={(e) =>
										setPromoCode(e.target.value)
									}
									placeholder='Entrez votre code promo'
									className='px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 flex-grow'
								/>
								<button
									type='submit'
									className='px-4 py-2 bg-red-600 text-white font-medium rounded-r-md hover:bg-red-700 transition-colors'>
									Appliquer
								</button>
							</form>

							<AnimatePresence>
								{showPromoSuccess && (
									<motion.p
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: 'auto' }}
										exit={{ opacity: 0, height: 0 }}
										className='text-sm text-green-600 mt-2'>
										Code promo appliqué avec succès ! -10%
										supplémentaires sur votre commande.
									</motion.p>
								)}
							</AnimatePresence>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Contenu principal */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Filtres et tri */}
				<div className='bg-white rounded-lg shadow-sm p-6 mb-8'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
						{/* Filtre par plage de réduction */}
						<div>
							<label
								htmlFor='discount-filter'
								className='block text-sm font-medium text-gray-700 mb-2'>
								Réduction
							</label>
							<select
								id='discount-filter'
								value={selectedDiscount}
								onChange={(e) =>
									setSelectedDiscount(e.target.value)
								}
								className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'>
								<option value='all'>
									Toutes les réductions
								</option>
								{discountRanges.map((range) => (
									<option
										key={range.label}
										value={range.label}>
										{range.label}
									</option>
								))}
							</select>
						</div>

						{/* Filtre par catégorie */}
						<div>
							<label
								htmlFor='category-filter'
								className='block text-sm font-medium text-gray-700 mb-2'>
								Catégorie
							</label>
							<select
								id='category-filter'
								value={selectedCategory}
								onChange={(e) =>
									setSelectedCategory(e.target.value)
								}
								className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'>
								<option value='all'>
									Toutes les catégories
								</option>
								{uniqueCategories.map((category) => (
									<option
										key={category}
										value={category}>
										{category}
									</option>
								))}
							</select>
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
								className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'>
								<option value='discount'>
									Réduction (décroissante)
								</option>
								<option value='price-asc'>
									Prix (croissant)
								</option>
								<option value='price-desc'>
									Prix (décroissant)
								</option>
								<option value='name'>Nom</option>
							</select>
						</div>

						{/* Résumé des résultats */}
						<div className='flex items-end'>
							<div>
								<h2 className='text-lg font-bold text-gray-900'>
									{displayedProducts.length} articles en
									promotion
								</h2>
								<p className='text-sm text-gray-600'>
									Jusqu'à{' '}
									{Math.max(
										...products.map((p) =>
											calculateDiscount(
												p.regular_price,
												p.sale_price
											)
										)
									)}
									% de réduction
								</p>
							</div>
						</div>
					</div>
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
							Aucun produit ne correspond à vos critères de
							recherche dans les promotions actuelles.
						</p>
						<button
							onClick={() => {
								setSelectedCategory('all');
								setSelectedDiscount('all');
							}}
							className='mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
							Voir toutes les promotions
						</button>
					</div>
				) : (
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
												product.images.length > 0 ? (
													<Image
														src={
															product.images[0]
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
																strokeWidth={2}
																d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
															/>
														</svg>
													</div>
												)}
											</div>

											{/* Badge de réduction */}
											<div className='absolute top-0 right-0 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-bl-lg'>
												-
												{calculateDiscount(
													product.regular_price,
													product.sale_price
												)}
												%
											</div>
										</div>

										<div className='p-4'>
											{product.categories &&
												product.categories.length >
													0 && (
													<div className='text-xs text-red-600 font-medium uppercase tracking-wider mb-1'>
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

											<div className='flex items-center space-x-2'>
												<span className='text-xl font-bold text-red-600'>
													{formatPrice(
														parseFloat(
															product.sale_price
														)
													)}
												</span>
												<span className='text-sm text-gray-500 line-through'>
													{formatPrice(
														parseFloat(
															product.regular_price
														)
													)}
												</span>
												<span className='bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded'>
													Économisez{' '}
													{formatPrice(
														parseFloat(
															product.regular_price
														) -
															parseFloat(
																product.sale_price
															)
													)}
												</span>
											</div>
										</div>
									</Link>

									{/* Bouton d'ajout rapide */}
									<div className='px-4 pb-4'>
										<button className='w-full py-2 px-4 flex items-center justify-center bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'>
											<svg
												className='w-5 h-5 mr-2'
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
										</button>
									</div>
								</motion.div>
							))}
					</motion.div>
				)}

				{/* Bouton "Charger plus" */}
				{visibleProductCount < displayedProducts.length && (
					<div className='mt-12 text-center'>
						<button
							onClick={loadMoreProducts}
							disabled={isLoadingMore}
							className='inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70'>
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
									Voir plus de promotions
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

				{/* Bannières promotionnelles */}
				<div className='mt-24 grid grid-cols-1 md:grid-cols-2 gap-8'>
					<motion.div
						whileHover={{ y: -5 }}
						transition={{
							type: 'spring',
							stiffness: 300,
							damping: 10,
						}}
						className='bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl overflow-hidden shadow-lg text-white p-6 flex flex-col justify-between h-full'>
						<div>
							<h3 className='text-xl md:text-2xl font-bold mb-2'>
								Offre flash du jour
							</h3>
							<p className='mb-4 text-yellow-100'>
								Économisez 30% supplémentaires sur une sélection
								de produits uniquement aujourd'hui !
							</p>
						</div>
						<Link
							href='/flash-sale'
							className='mt-4 inline-flex items-center px-4 py-2 bg-white text-yellow-600 rounded-lg font-medium hover:bg-yellow-50 transition-colors self-start'>
							Découvrir l'offre
							<svg
								className='ml-2 w-4 h-4'
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
						</Link>
					</motion.div>

					<motion.div
						whileHover={{ y: -5 }}
						transition={{
							type: 'spring',
							stiffness: 300,
							damping: 10,
						}}
						className='bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl overflow-hidden shadow-lg text-white p-6 flex flex-col justify-between h-full'>
						<div>
							<h3 className='text-xl md:text-2xl font-bold mb-2'>
								Livraison gratuite
							</h3>
							<p className='mb-4 text-teal-100'>
								Profitez de la livraison gratuite sur toutes vos
								commandes de plus de 50€ !
							</p>
						</div>
						<Link
							href='/shipping'
							className='mt-4 inline-flex items-center px-4 py-2 bg-white text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition-colors self-start'>
							En savoir plus
							<svg
								className='ml-2 w-4 h-4'
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
						</Link>
					</motion.div>
				</div>

				{/* FAQ section */}
				<div className='mt-16 bg-white rounded-xl shadow-sm p-8'>
					<h2 className='text-2xl font-bold text-gray-900 mb-6'>
						Questions fréquentes sur nos promotions
					</h2>

					<div className='space-y-6'>
						{[
							{
								question:
									'Quelle est la durée des promotions ?',
								answer: 'La durée de nos promotions varie selon les offres. Les durées sont clairement indiquées sur chaque produit en promotion. Certaines offres sont limitées dans le temps, comme indiqué par notre compte à rebours en haut de la page.',
							},
							{
								question:
									'Les promotions sont-elles cumulables avec les codes promo ?',
								answer: 'Oui, la plupart de nos promotions sont cumulables avec les codes promo, sauf mention contraire. Vous pouvez entrer votre code promo dans le champ prévu à cet effet lors du paiement.',
							},
							{
								question:
									'Les produits en promotion sont-ils éligibles aux retours ?',
								answer: "Absolument ! Tous les produits en promotion bénéficient de notre politique de retour standard de 30 jours. Si vous n'êtes pas satisfait, vous pouvez renvoyer le produit dans son état d'origine.",
							},
							{
								question:
									'Comment être informé des nouvelles promotions ?',
								answer: 'Inscrivez-vous à notre newsletter pour recevoir en avant-première nos offres spéciales et promotions. Vous pouvez également nous suivre sur les réseaux sociaux où nous annonçons régulièrement nos nouveaux bons plans.',
							},
						].map((item, index) => (
							<div
								key={index}
								className='border-b border-gray-200 pb-6 last:border-0 last:pb-0'>
								<h3 className='text-lg font-medium text-gray-900 mb-2'>
									{item.question}
								</h3>
								<p className='text-gray-600'>{item.answer}</p>
							</div>
						))}
					</div>
				</div>

				{/* Call to Action */}
				<div className='mt-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-8 md:p-12 text-center text-white'>
					<h2 className='text-2xl md:text-3xl font-bold mb-4'>
						Ne manquez pas nos promotions !
					</h2>
					<p className='text-red-100 max-w-2xl mx-auto mb-6'>
						Inscrivez-vous à notre newsletter pour recevoir en
						avant-première nos offres spéciales et bénéficier de
						remises exclusives.
					</p>
					<form className='max-w-md mx-auto flex flex-col sm:flex-row'>
						<input
							type='email'
							placeholder='Votre adresse email'
							className='px-4 py-3 rounded-l-lg sm:rounded-r-none text-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-white'
						/>
						<button
							type='submit'
							className='mt-2 sm:mt-0 px-6 py-3 bg-white text-red-600 font-medium rounded-r-lg sm:rounded-l-none hover:bg-gray-100 transition-colors'>
							S'inscrire
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
