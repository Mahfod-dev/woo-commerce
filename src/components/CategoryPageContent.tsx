'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { WooCategory, WooProduct } from '@/lib/woo';
import ProductsGrid from '@/components/ProductsGrid';

interface CategoryPageContentProps {
	category: WooCategory;
	products: WooProduct[];
	subcategories?: WooCategory[];
}

export default function CategoryPageContent({
	category,
	products,
	subcategories = [],
}: CategoryPageContentProps) {
	const [sortBy, setSortBy] = useState('popularity');
	const [filteredProducts, setFilteredProducts] = useState<WooProduct[]>([]);
	const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
	const [showFilters, setShowFilters] = useState(false);
	const [filterChanged, setFilterChanged] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	// États pour la pagination
	const [currentPage, setCurrentPage] = useState(1);
	const productsPerPage = 12;
	const productsListRef = useRef<HTMLDivElement>(null);

	// Filtrer et trier les produits
	useEffect(() => {
		let filtered = [...products];

		// Filtrer par recherche
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter((product) =>
				product.name.toLowerCase().includes(query) ||
				product.description.toLowerCase().includes(query) ||
				product.short_description.toLowerCase().includes(query)
			);
		}

		// Filtrer par prix
		filtered = filtered.filter((product) => {
			const price = parseFloat(product.price);
			return price >= priceRange.min && price <= priceRange.max;
		});

		// Trier les produits
		switch (sortBy) {
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
			case 'date':
				filtered.sort(
					(a, b) =>
						new Date(b.date_created).getTime() -
						new Date(a.date_created).getTime()
				);
				break;
			case 'rating':
				filtered.sort(
					(a, b) =>
						parseFloat(b.average_rating) -
						parseFloat(a.average_rating)
				);
				break;
			case 'popularity':
			default:
				// On suppose que les produits sont déjà triés par popularité via l'API
				break;
		}

		setFilteredProducts(filtered);
	}, [products, sortBy, priceRange, searchQuery]);

	// Calculer le prix maximum pour le filtre
	useEffect(() => {
		if (products.length > 0) {
			const max = Math.max(...products.map((p) => parseFloat(p.price)));
			// Si les filtres n'ont pas encore été changés manuellement, initialiser avec max calculé
			if (!filterChanged) {
				setPriceRange((prev) => ({
					min: prev.min,
					max: Math.ceil(max / 100) * 100,
				}));
			}
		}
	}, [products, filterChanged]);

	// Fonction pour réinitialiser les filtres
	const resetFilters = () => {
		const maxPrice =
			Math.ceil(
				Math.max(...products.map((p) => parseFloat(p.price))) / 100
			) * 100;
		setPriceRange({ min: 0, max: maxPrice });
		setSortBy('popularity');
		setSearchQuery('');
		setFilterChanged(false);
		setCurrentPage(1); // Retour à la page 1
	};

	// Mettre à jour la plage de prix avec suivi des changements
	const updatePriceRange = (
		min: number | null = null,
		max: number | null = null
	) => {
		setFilterChanged(true);
		setPriceRange((prev) => ({
			min: min !== null ? min : prev.min,
			max: max !== null ? max : prev.max,
		}));
		setCurrentPage(1); // Retour à la page 1 quand on filtre
	};

	// Réinitialiser à la page 1 quand on recherche
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery]);

	// Calcul de la pagination
	const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
	const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

	// Générer les numéros de pages à afficher
	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxPagesToShow = 5;

		if (totalPages <= maxPagesToShow) {
			// Afficher toutes les pages si moins de 5
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Toujours afficher la première page
			pages.push(1);

			if (currentPage > 3) {
				pages.push('...');
			}

			// Pages autour de la page courante
			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (currentPage < totalPages - 2) {
				pages.push('...');
			}

			// Toujours afficher la dernière page
			if (totalPages > 1) {
				pages.push(totalPages);
			}
		}

		return pages;
	};

	// Scroll vers la liste de produits lors du changement de page
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		// Scroller vers la section des produits au lieu du haut de la page
		if (productsListRef.current) {
			const yOffset = -100; // Offset pour tenir compte du header
			const y = productsListRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
			window.scrollTo({ top: y, behavior: 'smooth' });
		}
	};


	return (
		<div className='bg-gray-50 min-h-screen category-content' data-print-date={new Date().toLocaleDateString()}>
			{/* Header de la catégorie */}
			<div
				className='relative bg-gradient-to-r from-indigo-700 to-purple-700 text-white'
				style={{
					backgroundImage: category.image?.src
						? `linear-gradient(to right, rgba(79, 70, 229, 0.9), rgba(124, 58, 237, 0.9)), url(${category.image.src})`
						: 'linear-gradient(to right, rgba(79, 70, 229, 1), rgba(124, 58, 237, 1))',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10'>
					<div className='max-w-3xl'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}>
							<Link
								href='/categories'
								className='inline-flex items-center text-indigo-100 hover:text-white mb-4 transition-colors'>
								<svg
									className='w-4 h-4 mr-2'
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
								Toutes les catégories
							</Link>

							<h1 className='text-3xl md:text-5xl font-bold mb-4'>
								{category.name}
							</h1>
							<p className='text-indigo-100 text-lg'>
								{category.count} produits pour sublimer votre
								quotidien
							</p>
							{subcategories && subcategories.length > 0 && (
								<p className='text-indigo-100 text-sm mt-2'>
									Incluant {subcategories.length} sous-catégories pour un total de {products.length} produits
								</p>
							)}
						</motion.div>
					</div>
				</div>

				{/* Éléments décoratifs */}
				<div className='absolute inset-0 overflow-hidden opacity-20'>
					<div className='absolute -top-20 -left-20 w-64 h-64 rounded-full bg-indigo-500' />
					<div className='absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-500' />
				</div>
			</div>

			{/* Contenu principal */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Barre de filtres et tri */}
				<div className='bg-white rounded-lg shadow-sm mb-8 p-4 filters-section'>
					<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
						<div className='flex items-center mb-4 sm:mb-0'>
							<span className='text-gray-700 font-medium'>
								{filteredProducts.length} produit
								{filteredProducts.length !== 1 ? 's' : ''}
							</span>
							<button
								onClick={() => setShowFilters(!showFilters)}
								className='ml-4 md:hidden flex items-center text-indigo-600 hover:text-indigo-800 transition-colors'>
								<svg
									className='w-5 h-5 mr-1'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
									/>
								</svg>
								Filtrer
							</button>
						</div>

						{/* Tri des produits */}
						<div className='flex items-center'>
							<label
								htmlFor='sort'
								className='text-sm text-gray-700 mr-2 hidden sm:inline'>
								Trier par:
							</label>
							<select
								id='sort'
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2.5'>
								<option value='popularity'>Popularité</option>
								<option value='date'>Nouveautés</option>
								<option value='price-asc'>
									Prix croissant
								</option>
								<option value='price-desc'>
									Prix décroissant
								</option>
								<option value='rating'>Avis clients</option>
							</select>
						</div>
					</div>

					{/* Filtres mobiles */}
					{showFilters && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: 'auto', opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.3 }}
							className='mt-4 pt-4 border-t border-gray-200 md:hidden'>
							<h3 className='text-sm font-medium text-gray-900 mb-3'>
								Filtrer par prix
							</h3>
							<div className='space-y-2'>
								<div className='flex justify-between items-center'>
									<span className='text-sm text-gray-600'>
										{priceRange.min}€
									</span>
									<span className='text-sm text-gray-600'>
										{priceRange.max}€
									</span>
								</div>
								<input
									type='range'
									min='0'
									max={
										priceRange.max > 0
											? priceRange.max
											: 1000
									}
									value={priceRange.min}
									onChange={(e) =>
										updatePriceRange(
											parseInt(e.target.value),
											null
										)
									}
									className='w-full price-slider'
								/>
								<input
									type='range'
									min='0'
									max={
										priceRange.max > 0
											? priceRange.max * 2
											: 2000
									}
									value={priceRange.max}
									onChange={(e) =>
										updatePriceRange(
											null,
											parseInt(e.target.value)
										)
									}
									className='w-full price-slider'
								/>
								<button
									onClick={resetFilters}
									className='w-full mt-2 py-2 px-4 border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 transition-colors'>
									Réinitialiser les filtres
								</button>
							</div>
						</motion.div>
					)}
				</div>

				{/* Barre de recherche */}
				<div className='mb-6'>
					<div className='relative max-w-2xl'>
						<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
							<svg
								className='h-5 w-5 text-gray-400'
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
						<input
							type='text'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder='Rechercher un produit par nom ou description...'
							className='block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
						/>
						{searchQuery && (
							<button
								onClick={() => setSearchQuery('')}
								className='absolute inset-y-0 right-0 pr-3 flex items-center'>
								<svg
									className='h-5 w-5 text-gray-400 hover:text-gray-600'
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
							</button>
						)}
					</div>
					{searchQuery && (
						<p className='mt-2 text-sm text-gray-600'>
							{filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
						</p>
					)}
				</div>

				<div className='flex flex-col md:flex-row gap-8'>
					{/* Sidebar avec filtres (desktop) */}
					<div className='hidden md:block w-64 flex-shrink-0 filters-section'>
						<div className='bg-white rounded-lg shadow-sm p-6 sticky top-24'>
							<h3 className='text-lg font-medium text-gray-900 mb-4'>
								Filtres
							</h3>

							{/* Filtre de prix */}
							<div className='mb-6'>
								<h4 className='text-sm font-medium text-gray-700 mb-3'>
									Prix
								</h4>
								<div className='space-y-4'>
									<div className='flex justify-between'>
										<span className='text-sm text-gray-600'>
											{priceRange.min}€
										</span>
										<span className='text-sm text-gray-600'>
											{priceRange.max}€
										</span>
									</div>
									<input
										type='range'
										min='0'
										max={
											priceRange.max > 0
												? priceRange.max
												: 1000
										}
										value={priceRange.min}
										onChange={(e) =>
											updatePriceRange(
												parseInt(e.target.value),
												null
											)
										}
										className='w-full price-slider'
									/>
									<input
										type='range'
										min='0'
										max={
											priceRange.max > 0
												? priceRange.max * 2
												: 2000
										}
										value={priceRange.max}
										onChange={(e) =>
											updatePriceRange(
												null,
												parseInt(e.target.value)
											)
										}
										className='w-full price-slider'
									/>
								</div>
							</div>

							{/* En stock uniquement */}
							<div className='mb-6'>
								<label className='inline-flex items-center'>
									<input
										type='checkbox'
										className='rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
									/>
									<span className='ml-2 text-sm text-gray-700'>
										En stock uniquement
									</span>
								</label>
							</div>

							{/* Produits en promotion */}
							<div className='mb-6'>
								<label className='inline-flex items-center'>
									<input
										type='checkbox'
										className='rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
									/>
									<span className='ml-2 text-sm text-gray-700'>
										Promotions
									</span>
								</label>
							</div>

							{/* Bouton de réinitialisation */}
							<button
								onClick={resetFilters}
								className='w-full py-2 px-4 border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 transition-colors'>
								Réinitialiser les filtres
							</button>
						</div>
					</div>

					{/* Grille de produits */}
					<div ref={productsListRef} className='flex-grow'>
						{filteredProducts.length === 0 ? (
							<div className='bg-white rounded-lg shadow-sm p-8 text-center'>
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
									Aucun produit ne correspond à vos critères
									de recherche dans cette catégorie.
								</p>
								<button
									onClick={resetFilters}
									className='mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
									Réinitialiser les filtres
								</button>
							</div>
						) : (
							<ProductsGrid
								products={currentProducts}
							/>
						)}

						{/* Pagination dynamique */}
						{filteredProducts.length > productsPerPage && totalPages > 1 && (
							<div className='mt-8 flex flex-col sm:flex-row justify-between items-center gap-4'>
								<p className='text-sm text-gray-700'>
									Affichage de{' '}
									<span className='font-medium'>{indexOfFirstProduct + 1}</span>
									{' à '}
									<span className='font-medium'>
										{Math.min(indexOfLastProduct, filteredProducts.length)}
									</span>
									{' sur '}
									<span className='font-medium'>{filteredProducts.length}</span>
									{' produits'}
								</p>

								<nav className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px' aria-label='Pagination'>
									{/* Bouton Précédent */}
									<button
										onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
										disabled={currentPage === 1}
										className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
											currentPage === 1
												? 'bg-gray-100 text-gray-400 cursor-not-allowed'
												: 'bg-white text-gray-500 hover:bg-gray-50'
										}`}>
										<span className='sr-only'>Précédent</span>
										<svg className='h-5 w-5' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
											<path fillRule='evenodd' d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z' clipRule='evenodd' />
										</svg>
									</button>

									{/* Numéros de pages */}
									{getPageNumbers().map((page, index) => {
										if (page === '...') {
											return (
												<span
													key={`ellipsis-${index}`}
													className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700'>
													...
												</span>
											);
										}

										const pageNum = page as number;
										return (
											<button
												key={pageNum}
												onClick={() => handlePageChange(pageNum)}
												className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
													currentPage === pageNum
														? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
														: 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
												}`}>
												{pageNum}
											</button>
										);
									})}

									{/* Bouton Suivant */}
									<button
										onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
										disabled={currentPage === totalPages}
										className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
											currentPage === totalPages
												? 'bg-gray-100 text-gray-400 cursor-not-allowed'
												: 'bg-white text-gray-500 hover:bg-gray-50'
										}`}>
										<span className='sr-only'>Suivant</span>
										<svg className='h-5 w-5' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
											<path fillRule='evenodd' d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z' clipRule='evenodd' />
										</svg>
									</button>
								</nav>
							</div>
						)}
					</div>
				</div>

				{/* Section des sous-catégories */}
				{subcategories && subcategories.length > 0 && (
					<div className='mt-16 pt-8 border-t border-gray-200'>
						<h2 className='text-2xl font-bold text-gray-900 mb-6'>
							Sous-catégories
						</h2>
						<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
							{subcategories.map((subcat) => (
								<motion.div
									key={subcat.id}
									whileHover={{ y: -5 }}
									transition={{
										type: 'spring',
										stiffness: 300,
										damping: 10,
									}}
									className='bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-all duration-300 subcategory-card'>
									<Link
										href={`/categories/${subcat.slug}`}
										className='text-gray-900 hover:text-indigo-600 font-medium transition-colors block py-2'>
										{subcat.name}
										<span className="block text-sm text-gray-500 mt-1">{subcat.count} produits</span>
									</Link>
								</motion.div>
							))}
						</div>
						<div className="mt-6 text-center">
							<p className="text-gray-600 mb-4">Tous les produits de cette catégorie et ses sous-catégories sont affichés ci-dessus.</p>
						</div>
					</div>
				)}

				{/* Call to action */}
				<div className='mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 md:p-12 text-center text-white'>
					<h2 className='text-2xl md:text-3xl font-bold mb-4'>
						Vous ne trouvez pas ce que vous cherchez?
					</h2>
					<p className='text-indigo-100 max-w-2xl mx-auto mb-6'>
						Explorez d'autres catégories ou contactez-nous pour
						obtenir de l'aide personnalisée.
					</p>
					<div className='flex flex-col sm:flex-row justify-center gap-4'>
						<Link
							href='/categories'
							className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-8 transition-colors'>
							Toutes les catégories
						</Link>
						<Link
							href='/contact'
							className='inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-700 md:py-4 md:text-lg md:px-8 transition-colors'>
							Nous contacter
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}