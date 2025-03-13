'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { WooCategory } from '@/lib/woo';

interface ProductFiltersSidebarProps {
	categories: WooCategory[];
	currentCategory: string;
	searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProductFiltersSidebar({
	categories,
	currentCategory,
	searchParams,
}: ProductFiltersSidebarProps) {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [priceRange, setPriceRange] = useState({
		min: parseInt((searchParams.min_price as string) || '0'),
		max: parseInt((searchParams.max_price as string) || '1000'),
	});
	const [featured, setFeatured] = useState(searchParams.featured === 'true');
	const [onSale, setOnSale] = useState(searchParams.on_sale === 'true');

	// Convertir les paramètres de recherche en un objet URL pour manipulation facile
	const createQueryString = (updates: Record<string, string | null>) => {
		const params = new URLSearchParams();

		// Copier tous les paramètres existants
		Object.entries(searchParams).forEach(([key, value]) => {
			if (value) {
				params.set(key, value as string);
			}
		});

		// Appliquer les mises à jour
		Object.entries(updates).forEach(([key, value]) => {
			if (value === null) {
				params.delete(key);
			} else {
				params.set(key, value);
			}
		});

		return params.toString();
	};

	const handlePriceChange = () => {
		const query = createQueryString({
			min_price: priceRange.min.toString(),
			max_price: priceRange.max.toString(),
		});

		router.push(`/products?${query}`);
	};

	const handleFeaturedToggle = () => {
		const newFeatured = !featured;
		setFeatured(newFeatured);

		const query = createQueryString({
			featured: newFeatured ? 'true' : null,
		});

		router.push(`/products?${query}`);
	};

	const handleOnSaleToggle = () => {
		const newOnSale = !onSale;
		setOnSale(newOnSale);

		const query = createQueryString({
			on_sale: newOnSale ? 'true' : null,
		});

		router.push(`/products?${query}`);
	};

	const clearAllFilters = () => {
		router.push('/products');
		setPriceRange({ min: 0, max: 1000 });
		setFeatured(false);
		setOnSale(false);
	};

	const hasActiveFilters = () => {
		return (
			priceRange.min > 0 ||
			priceRange.max < 1000 ||
			featured ||
			onSale ||
			currentCategory
		);
	};

	return (
		<div className='bg-white rounded-lg shadow-sm p-4'>
			<div className='md:hidden mb-4'>
				<button
					onClick={() => setIsOpen(!isOpen)}
					className='w-full flex items-center justify-between p-2 bg-gray-100 rounded-md'>
					<span className='font-medium'>Filtres</span>
					<svg
						className={`h-5 w-5 transition-transform ${
							isOpen ? 'transform rotate-180' : ''
						}`}
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M19 9l-7 7-7-7'
						/>
					</svg>
				</button>
			</div>

			<div
				className={`${isOpen ? 'block' : 'hidden'} md:block space-y-6`}>
				{/* En-tête avec option de réinitialisation */}
				<div className='flex items-center justify-between'>
					<h3 className='text-lg font-medium text-gray-900'>
						Filtres
					</h3>
					{hasActiveFilters() && (
						<button
							onClick={clearAllFilters}
							className='text-sm text-indigo-600 hover:text-indigo-800'>
							Réinitialiser
						</button>
					)}
				</div>

				{/* Filtre par catégorie */}
				<div>
					<h4 className='text-sm font-medium text-gray-900 mb-3'>
						Catégories
					</h4>
					<div className='space-y-2 max-h-60 overflow-y-auto pr-2'>
						{categories.map((category) => {
							// Construire l'URL pour cette catégorie
							const query = createQueryString({
								category:
									currentCategory === category.id.toString()
										? null
										: category.id.toString(),
							});

							return (
								<Link
									key={category.id}
									href={`/products?${query}`}
									className={`block px-2 py-1.5 text-sm rounded-md transition-colors ${
										currentCategory ===
										category.id.toString()
											? 'bg-indigo-100 text-indigo-700 font-medium'
											: 'text-gray-600 hover:bg-gray-50'
									}`}>
									<div className='flex items-center justify-between'>
										<span>{category.name}</span>
										{category.count && (
											<span className='text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full'>
												{category.count}
											</span>
										)}
									</div>
								</Link>
							);
						})}
					</div>
				</div>

				{/* Filtre de prix */}
				<div>
					<h4 className='text-sm font-medium text-gray-900 mb-3'>
						Prix
					</h4>
					<div className='space-y-4'>
						<div className='flex justify-between items-center'>
							<span className='text-sm text-gray-500'>
								{priceRange.min}€ - {priceRange.max}€
							</span>
						</div>
						<div className='space-y-2'>
							<label
								htmlFor='min-price'
								className='text-xs text-gray-500'>
								Prix minimum
							</label>
							<input
								type='range'
								id='min-price'
								min='0'
								max='1000'
								step='10'
								value={priceRange.min}
								onChange={(e) =>
									setPriceRange({
										...priceRange,
										min: parseInt(e.target.value),
									})
								}
								className='w-full'
							/>
						</div>
						<div className='space-y-2'>
							<label
								htmlFor='max-price'
								className='text-xs text-gray-500'>
								Prix maximum
							</label>
							<input
								type='range'
								id='max-price'
								min='0'
								max='1000'
								step='10'
								value={priceRange.max}
								onChange={(e) =>
									setPriceRange({
										...priceRange,
										max: parseInt(e.target.value),
									})
								}
								className='w-full'
							/>
						</div>
						<button
							onClick={handlePriceChange}
							className='w-full bg-indigo-100 text-indigo-700 py-1.5 px-3 rounded-md text-sm font-medium hover:bg-indigo-200 transition-colors'>
							Appliquer
						</button>
					</div>
				</div>

				{/* Filtres à bascule */}
				<div>
					<h4 className='text-sm font-medium text-gray-900 mb-3'>
						Options
					</h4>
					<div className='space-y-2'>
						<div className='flex items-center'>
							<input
								id='featured'
								type='checkbox'
								checked={featured}
								onChange={handleFeaturedToggle}
								className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
							/>
							<label
								htmlFor='featured'
								className='ml-2 text-sm text-gray-600'>
								Produits mis en avant
							</label>
						</div>
						<div className='flex items-center'>
							<input
								id='on-sale'
								type='checkbox'
								checked={onSale}
								onChange={handleOnSaleToggle}
								className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
							/>
							<label
								htmlFor='on-sale'
								className='ml-2 text-sm text-gray-600'>
								Promotions
							</label>
						</div>
					</div>
				</div>

				{/* Aide à la navigation */}
				<div className='border-t pt-4'>
					<h4 className='text-sm font-medium text-gray-900 mb-3'>
						Besoin d&apos;aide ?
					</h4>
					<div className='space-y-2'>
						<Link
							href='/contact'
							className='text-sm text-indigo-600 hover:text-indigo-800 flex items-center'>
							<svg
								className='h-4 w-4 mr-1'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
								/>
							</svg>
							Nous contacter
						</Link>
						<Link
							href='/faq'
							className='text-sm text-indigo-600 hover:text-indigo-800 flex items-center'>
							<svg
								className='h-4 w-4 mr-1'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
								/>
							</svg>
							Aide & FAQ
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
