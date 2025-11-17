'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { WooProduct } from '@/lib/woo';
import { formatPrice } from '@/lib/wooClient';
import { useRouter } from 'next/navigation';

interface SearchPageContentProps {
	products: WooProduct[];
	query: string;
}

export default function SearchPageContent({
	products,
	query,
}: SearchPageContentProps) {
	const router = useRouter();
	const [searchInput, setSearchInput] = useState(query);
	const [currentPage, setCurrentPage] = useState(1);
	const productsPerPage = 12;

	// Calculer la pagination
	const totalPages = Math.ceil(products.length / productsPerPage);
	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
	const currentProducts = products.slice(
		indexOfFirstProduct,
		indexOfLastProduct
	);

	// Réinitialiser la page quand les résultats changent
	useEffect(() => {
		setCurrentPage(1);
	}, [query]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchInput.trim()) {
			router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
		}
	};

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
		},
	};

	// Générer les numéros de pages
	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxPagesToShow = 5;

		if (totalPages <= maxPagesToShow) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);
			if (currentPage > 3) pages.push('...');
			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);
			for (let i = start; i <= end; i++) {
				pages.push(i);
			}
			if (currentPage < totalPages - 2) pages.push('...');
			if (totalPages > 1) pages.push(totalPages);
		}
		return pages;
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className='categories-content bg-gradient-to-b from-gray-50 to-white min-h-screen'>
			{/* Header avec barre de recherche */}
			<div className='categories-header relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 sm:py-20'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className='text-3xl md:text-5xl font-bold mb-6'>
						Recherche de produits
					</motion.h1>

					{/* Barre de recherche */}
					<form onSubmit={handleSearch} className='max-w-2xl'>
						<div className='relative'>
							<input
								type='text'
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								placeholder='Rechercher un produit...'
								className='w-full px-4 py-3 pl-12 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300'
								autoFocus
							/>
							<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
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
							<button
								type='submit'
								className='absolute inset-y-0 right-0 px-6 bg-indigo-700 hover:bg-indigo-800 rounded-r-lg transition-colors font-medium shadow-md hover:shadow-lg'>
								Rechercher
							</button>
						</div>
					</form>
				</div>

				{/* Éléments décoratifs */}
				<div className='absolute inset-0 overflow-hidden opacity-20'>
					<div className='absolute -top-20 -left-20 w-64 h-64 rounded-full bg-indigo-500' />
					<div className='absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-500' />
				</div>
			</div>

			{/* Résultats */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				{/* En-tête des résultats */}
				{query && (
					<div className='mb-8'>
						<h2 className='text-2xl font-bold text-gray-900 mb-2'>
							{products.length > 0
								? `${products.length} résultat${products.length > 1 ? 's' : ''} pour "${query}"`
								: `Aucun résultat pour "${query}"`}
						</h2>
						{products.length === 0 && (
							<p className='text-gray-600'>
								Essayez avec d'autres mots-clés ou parcourez nos{' '}
								<Link
									href='/categories'
									className='text-indigo-600 hover:text-indigo-800 font-medium'>
									catégories
								</Link>
							</p>
						)}
					</div>
				)}

				{!query && (
					<div className='text-center py-12'>
						<svg
							className='mx-auto h-16 w-16 text-gray-400'
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
						<h3 className='mt-4 text-xl font-semibold text-gray-900'>
							Recherchez un produit
						</h3>
						<p className='mt-2 text-gray-600'>
							Entrez un mot-clé pour trouver ce que vous cherchez
						</p>
					</div>
				)}

				{/* Grille de produits */}
				{currentProducts.length > 0 && (
					<>
						<motion.div
							variants={containerVariants}
							initial='hidden'
							animate='visible'
							className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
							{currentProducts.map((product) => (
								<motion.div
									key={product.id}
									variants={itemVariants}>
									<Link href={`/products/${product.id}-${product.slug}`} className='group block h-full'>
										<div className='product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border-2 border-gray-100 hover:border-indigo-300'>
											{/* Image */}
											<div className='relative aspect-square overflow-hidden bg-gray-100'>
												{product.images &&
												product.images.length > 0 ? (
													<Image
														src={product.images[0].src}
														alt={product.name}
														fill
														sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
														className='object-cover hover:scale-105 transition-transform duration-300'
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

												{/* Badge promo */}
												{product.on_sale && (
													<div className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold'>
														PROMO
													</div>
												)}
											</div>

											{/* Contenu */}
											<div className='p-4 flex-grow flex flex-col'>
												<h3 className='text-base font-semibold text-gray-900 mb-2 line-clamp-2 flex-grow'>
													{product.name}
												</h3>

												{/* Prix */}
												<div className='flex items-baseline gap-2 mb-3'>
													<span className='text-lg font-bold text-indigo-600'>
														{formatPrice(product.price)}
													</span>
													{product.on_sale &&
														product.regular_price && (
															<span className='text-sm text-gray-500 line-through'>
																{formatPrice(
																	product.regular_price
																)}
															</span>
														)}
												</div>

												{/* Stock status */}
												<div className='text-sm'>
													{product.stock_status ===
													'instock' ? (
														<span className='text-green-600 font-medium'>
															En stock
														</span>
													) : (
														<span className='text-red-600 font-medium'>
															Rupture de stock
														</span>
													)}
												</div>
											</div>
										</div>
									</Link>
								</motion.div>
							))}
						</motion.div>

						{/* Pagination */}
						{products.length > productsPerPage && totalPages > 1 && (
							<div className='mt-12 flex flex-col sm:flex-row justify-between items-center gap-4'>
								<p className='text-sm text-gray-700'>
									Affichage de{' '}
									<span className='font-medium'>
										{indexOfFirstProduct + 1}
									</span>
									{' à '}
									<span className='font-medium'>
										{Math.min(
											indexOfLastProduct,
											products.length
										)}
									</span>
									{' sur '}
									<span className='font-medium'>
										{products.length}
									</span>
									{' produits'}
								</p>
								<nav className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'>
									{/* Previous button */}
									<button
										onClick={() =>
											handlePageChange(currentPage - 1)
										}
										disabled={currentPage === 1}
										className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
											currentPage === 1
												? 'bg-gray-100 text-gray-400 cursor-not-allowed'
												: 'bg-white text-gray-700 hover:bg-gray-50'
										}`}>
										<svg
											className='h-5 w-5'
											fill='currentColor'
											viewBox='0 0 20 20'>
											<path
												fillRule='evenodd'
												d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
												clipRule='evenodd'
											/>
										</svg>
									</button>

									{/* Page numbers */}
									{getPageNumbers().map((page, index) =>
										page === '...' ? (
											<span
												key={`ellipsis-${index}`}
												className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700'>
												...
											</span>
										) : (
											<button
												key={page}
												onClick={() =>
													handlePageChange(
														page as number
													)
												}
												className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
													currentPage === page
														? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
														: 'bg-white text-gray-700 hover:bg-gray-50'
												}`}>
												{page}
											</button>
										)
									)}

									{/* Next button */}
									<button
										onClick={() =>
											handlePageChange(currentPage + 1)
										}
										disabled={currentPage === totalPages}
										className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
											currentPage === totalPages
												? 'bg-gray-100 text-gray-400 cursor-not-allowed'
												: 'bg-white text-gray-700 hover:bg-gray-50'
										}`}>
										<svg
											className='h-5 w-5'
											fill='currentColor'
											viewBox='0 0 20 20'>
											<path
												fillRule='evenodd'
												d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
												clipRule='evenodd'
											/>
										</svg>
									</button>
								</nav>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
