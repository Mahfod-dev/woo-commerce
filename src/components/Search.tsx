'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { searchProducts, WooProduct } from '@/lib/woo';
import { formatPrice } from '@/lib/wooClient';
import { FaSearch, FaSpinner, FaTimes } from 'react-icons/fa';

export default function Search() {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<WooProduct[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();
	const searchParams = useSearchParams();

	// Récupérer la requête des paramètres d'URL si présente
	useEffect(() => {
		const queryParam = searchParams?.get('q');
		if (queryParam) {
			setQuery(queryParam);
			performSearch(queryParam, true);
		}
	}, [searchParams]);

	// Fermer les résultats lors d'un clic à l'extérieur
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setShowResults(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Débounce pour éviter trop de requêtes pendant la saisie
	useEffect(() => {
		const debounceTimeout = setTimeout(() => {
			if (query.trim().length >= 2) {
				performSearch(query);
			} else {
				setResults([]);
			}
		}, 300);

		return () => {
			clearTimeout(debounceTimeout);
		};
	}, [query]);

	const performSearch = async (searchQuery: string, isPageLoad = false) => {
		if (!searchQuery.trim()) return;

		setIsSearching(true);

		try {
			const searchResults = await searchProducts(searchQuery);
			setResults(searchResults);
			setShowResults(!isPageLoad); // Ne pas afficher le dropdown si c'est chargé depuis l'URL
		} catch (error) {
			console.error('Erreur lors de la recherche:', error);
		} finally {
			setIsSearching(false);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			setShowResults(false);
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	};

	const clearSearch = () => {
		setQuery('');
		setResults([]);
		setShowResults(false);
		if (inputRef.current) {
			inputRef.current.focus();
		}
	};

	return (
		<div
			ref={searchRef}
			className='relative w-full max-w-2xl'>
			<form
				onSubmit={handleSubmit}
				className='relative'>
				<div className='relative'>
					<input
						ref={inputRef}
						type='text'
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onFocus={() =>
							query.trim().length >= 2 && setShowResults(true)
						}
						placeholder='Rechercher un produit...'
						className='w-full px-4 py-3 pl-12 pr-10 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
					/>
					<div className='absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none'>
						<FaSearch className='text-gray-400' />
					</div>
					{query.trim() && (
						<button
							type='button'
							onClick={clearSearch}
							className='absolute inset-y-0 right-0 flex items-center pr-4'>
							{isSearching ? (
								<FaSpinner className='w-5 h-5 text-gray-400 animate-spin' />
							) : (
								<FaTimes className='w-5 h-5 text-gray-400 hover:text-gray-600' />
							)}
						</button>
					)}
				</div>
			</form>

			{/* Résultats de recherche rapide */}
			{showResults && query.trim().length >= 2 && (
				<div className='absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl max-h-96 overflow-y-auto'>
					{isSearching ? (
						<div className='flex items-center justify-center p-6'>
							<FaSpinner className='w-6 h-6 text-indigo-600 animate-spin' />
							<span className='ml-2 text-gray-600'>
								Recherche en cours...
							</span>
						</div>
					) : results.length > 0 ? (
						<div>
							<div className='p-4 border-b border-gray-100'>
								<h3 className='text-sm font-medium text-gray-500'>
									{results.length} résultat
									{results.length > 1 ? 's' : ''} trouvé
									{results.length > 1 ? 's' : ''}
								</h3>
							</div>
							<ul>
								{results.slice(0, 5).map((product) => (
									<li
										key={product.id}
										className='border-b border-gray-100 last:border-0'>
										<Link
											href={`/products/${product.id}-${product.slug}`}
											className='flex items-center p-4 hover:bg-gray-50 transition-colors'
											onClick={() =>
												setShowResults(false)
											}>
											<div className='relative w-12 h-12 mr-4 bg-gray-100 rounded overflow-hidden flex-shrink-0'>
												{product.images &&
												product.images.length > 0 ? (
													<Image
														src={
															product.images[0]
																.src
														}
														alt={product.name}
														fill
														className='object-cover'
														sizes='48px'
													/>
												) : (
													<div className='w-full h-full flex items-center justify-center text-gray-400'>
														<span>No img</span>
													</div>
												)}
											</div>
											<div className='flex-grow min-w-0'>
												<h4 className='text-sm font-medium text-gray-800 truncate'>
													{product.name}
												</h4>
												<div className='flex items-baseline'>
													<span className='text-sm font-semibold text-indigo-600'>
														{formatPrice(
															product.price
														)}
													</span>
													{product.on_sale &&
														product.regular_price && (
															<span className='ml-2 text-xs text-gray-500 line-through'>
																{formatPrice(
																	product.regular_price
																)}
															</span>
														)}
												</div>
											</div>
										</Link>
									</li>
								))}
								{results.length > 5 && (
									<li className='p-3 text-center'>
										<button
											onClick={() => {
												setShowResults(false);
												router.push(
													`/search?q=${encodeURIComponent(
														query.trim()
													)}`
												);
											}}
											className='text-sm text-indigo-600 hover:text-indigo-800 font-medium'>
											Voir tous les {results.length}{' '}
											résultats
										</button>
									</li>
								)}
							</ul>
						</div>
					) : (
						<div className='p-6 text-center'>
							<p className='text-gray-500'>
								Aucun résultat trouvé pour &ldquo;{query}&rdquo;
							</p>
							<p className='mt-2 text-sm text-gray-400'>
								Essayez avec des mots-clés différents ou
								vérifiez l&apos;orthographe.
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

// Page de résultats de recherche complète
export function SearchResults({ searchQuery }: { searchQuery: string }) {
	const [products, setProducts] = useState<WooProduct[]>([]);
	const [loading, setLoading] = useState(true);
	const [sortBy, setSortBy] = useState('popularity');
	const [filters, setFilters] = useState({
		minPrice: 0,
		maxPrice: 1000,
		categories: [] as number[],
	});

	useEffect(() => {
		const fetchResults = async () => {
			if (!searchQuery) return;

			setLoading(true);
			try {
				const results = await searchProducts(searchQuery, 50);
				setProducts(results);
			} catch (error) {
				console.error('Erreur lors de la recherche:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchResults();
	}, [searchQuery]);

	// Logique de tri et de filtrage
	const filteredAndSortedProducts = () => {
		let result = [...products];

		// Filtrer par prix
		result = result.filter((product) => {
			const price = parseFloat(product.price);
			return price >= filters.minPrice && price <= filters.maxPrice;
		});

		// Filtrer par catégories si des catégories sont sélectionnées
		if (filters.categories.length > 0) {
			result = result.filter((product) =>
				product.categories.some((cat) =>
					filters.categories.includes(cat.id)
				)
			);
		}

		// Trier
		switch (sortBy) {
			case 'price-asc':
				result.sort(
					(a, b) => parseFloat(a.price) - parseFloat(b.price)
				);
				break;
			case 'price-desc':
				result.sort(
					(a, b) => parseFloat(b.price) - parseFloat(a.price)
				);
				break;
			case 'date':
				result.sort(
					(a, b) =>
						new Date(b.date_created).getTime() -
						new Date(a.date_created).getTime()
				);
				break;
			case 'rating':
				result.sort(
					(a, b) =>
						parseFloat(b.average_rating) -
						parseFloat(a.average_rating)
				);
				break;
			case 'popularity':
			default:
				// Supposons que la popularité est déjà triée par défaut avec l'API
				break;
		}

		return result;
	};

	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSortBy(e.target.value);
	};

	const handlePriceChange = (min: number, max: number) => {
		setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
	};

	const handleCategoryToggle = (categoryId: number) => {
		setFilters((prev) => {
			const newCategories = prev.categories.includes(categoryId)
				? prev.categories.filter((id) => id !== categoryId)
				: [...prev.categories, categoryId];

			return { ...prev, categories: newCategories };
		});
	};

	const sortedAndFilteredProducts = filteredAndSortedProducts();

	return (
		<div className='bg-white'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<div className='flex flex-col md:flex-row justify-between items-start mb-8'>
					<div>
						<h1 className='text-2xl font-bold text-gray-900'>
							Résultats de recherche pour &ldquo;{searchQuery}
							&rdquo;
						</h1>
						<p className='mt-1 text-gray-500'>
							{loading
								? 'Recherche en cours...'
								: `${
										sortedAndFilteredProducts.length
								  } résultat${
										sortedAndFilteredProducts.length > 1
											? 's'
											: ''
								  } trouvé${
										sortedAndFilteredProducts.length > 1
											? 's'
											: ''
								  }`}
						</p>
					</div>

					<div className='mt-4 md:mt-0'>
						<label
							htmlFor='sort-by'
							className='text-sm font-medium text-gray-700 mr-2'>
							Trier par:
						</label>
						<select
							id='sort-by'
							value={sortBy}
							onChange={handleSortChange}
							className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'>
							<option value='popularity'>Popularité</option>
							<option value='date'>Nouveautés</option>
							<option value='price-asc'>Prix croissant</option>
							<option value='price-desc'>Prix décroissant</option>
							<option value='rating'>Note moyenne</option>
						</select>
					</div>
				</div>

				<div className='flex flex-col md:flex-row'>
					{/* Filtres */}
					<div className='w-full md:w-64 flex-shrink-0 mb-6 md:mb-0 md:mr-8'>
						<div className='bg-gray-50 p-4 rounded-lg sticky top-24'>
							<h2 className='text-lg font-medium text-gray-900 mb-4'>
								Filtres
							</h2>

							{/* Filtre de prix */}
							<div className='mb-6'>
								<h3 className='text-sm font-medium text-gray-900 mb-2'>
									Prix
								</h3>
								<div className='space-y-2'>
									<div className='flex justify-between items-center'>
										<span className='text-sm text-gray-500'>
											{formatPrice(filters.minPrice)} -{' '}
											{formatPrice(filters.maxPrice)}
										</span>
									</div>
									<div className='flex space-x-4'>
										<input
											type='range'
											min='0'
											max='1000'
											step='10'
											value={filters.minPrice}
											onChange={(e) =>
												handlePriceChange(
													parseInt(e.target.value),
													filters.maxPrice
												)
											}
											className='w-full'
										/>
										<input
											type='range'
											min='0'
											max='1000'
											step='10'
											value={filters.maxPrice}
											onChange={(e) =>
												handlePriceChange(
													filters.minPrice,
													parseInt(e.target.value)
												)
											}
											className='w-full'
										/>
									</div>
								</div>
							</div>

							{/* Autres filtres (catégories, etc.) peuvent être ajoutés ici */}
							<div className='mb-6'>
								<h3 className='text-sm font-medium text-gray-900 mb-2'>
									Catégories
								</h3>
								<div className='space-y-2 max-h-60 overflow-y-auto'>
									{/* Liste des catégories disponibles serait dynamiquement générée ici */}
									{/* Exemple statique : */}
									<div className='flex items-center'>
										<input
											id='category-1'
											type='checkbox'
											checked={filters.categories.includes(
												1
											)}
											onChange={() =>
												handleCategoryToggle(1)
											}
											className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
										/>
										<label
											htmlFor='category-1'
											className='ml-2 text-sm text-gray-600'>
											Catégorie 1
										</label>
									</div>
									<div className='flex items-center'>
										<input
											id='category-2'
											type='checkbox'
											checked={filters.categories.includes(
												2
											)}
											onChange={() =>
												handleCategoryToggle(2)
											}
											className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
										/>
										<label
											htmlFor='category-2'
											className='ml-2 text-sm text-gray-600'>
											Catégorie 2
										</label>
									</div>
								</div>
							</div>

							<button
								onClick={() =>
									setFilters({
										minPrice: 0,
										maxPrice: 1000,
										categories: [],
									})
								}
								className='w-full py-2 px-4 border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50'>
								Réinitialiser les filtres
							</button>
						</div>
					</div>

					{/* Liste des produits */}
					<div className='flex-grow'>
						{loading ? (
							<div className='flex justify-center items-center h-64'>
								<FaSpinner className='w-8 h-8 text-indigo-600 animate-spin' />
							</div>
						) : sortedAndFilteredProducts.length > 0 ? (
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
								{sortedAndFilteredProducts.map((product) => (
									<Link
										key={product.id}
										href={`/products/${product.id}-${product.slug}`}
										className='group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300'>
										<div className='aspect-w-1 aspect-h-1 bg-gray-200 relative'>
											{product.images &&
											product.images.length > 0 ? (
												<Image
													src={product.images[0].src}
													alt={product.name}
													fill
													className='object-cover group-hover:scale-105 transition-transform duration-500'
													sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
												/>
											) : (
												<div className='w-full h-full flex items-center justify-center text-gray-400'>
													Image non disponible
												</div>
											)}
											{product.on_sale && (
												<div className='absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
													Promo
												</div>
											)}
										</div>
										<div className='p-4'>
											<h3 className='text-sm font-medium text-gray-900 mb-1 line-clamp-2'>
												{product.name}
											</h3>
											<div className='flex items-baseline mb-2'>
												<span className='text-lg font-semibold text-indigo-600'>
													{formatPrice(product.price)}
												</span>
												{product.on_sale &&
													product.regular_price && (
														<span className='ml-2 text-sm text-gray-500 line-through'>
															{formatPrice(
																product.regular_price
															)}
														</span>
													)}
											</div>

											{product.average_rating &&
												parseFloat(
													product.average_rating
												) > 0 && (
													<div className='flex items-center'>
														<div className='flex text-yellow-400'>
															{[...Array(5)].map(
																(_, i) => (
																	<svg
																		key={i}
																		className={`h-4 w-4 ${
																			i <
																			Math.floor(
																				parseFloat(
																					product.average_rating
																				)
																			)
																				? 'text-yellow-400'
																				: 'text-gray-300'
																		}`}
																		fill='currentColor'
																		viewBox='0 0 20 20'>
																		<path
																			fillRule='evenodd'
																			d='M10 15.585l-7.07 3.715 1.35-7.87-5.72-5.575 7.91-1.15L10 0l3.53 7.705 7.91 1.15-5.72 5.575 1.35 7.87z'
																			clipRule='evenodd'
																		/>
																	</svg>
																)
															)}
														</div>
														<span className='ml-1 text-xs text-gray-500'>
															(
															{
																product.rating_count
															}
															)
														</span>
													</div>
												)}
										</div>
									</Link>
								))}
							</div>
						) : (
							<div className='text-center py-12 bg-gray-50 rounded-lg'>
								<h3 className='text-lg font-medium text-gray-900 mb-2'>
									Aucun résultat trouvé
								</h3>
								<p className='text-gray-500 mb-6'>
									Aucun produit ne correspond à vos critères
									de recherche.
								</p>
								<button
									onClick={() =>
										setFilters({
											minPrice: 0,
											maxPrice: 1000,
											categories: [],
										})
									}
									className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700'>
									Réinitialiser les filtres
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
