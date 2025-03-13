'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { WooProduct } from '@/lib/woo';
import { formatPrice, calculateDiscount } from '@/lib/wooClient';
import { useCart } from '@/components/CartProvider';

interface ProductsPageClientProps {
	products: WooProduct[];
	searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProductsPageClient({
	products,
	searchParams,
}: ProductsPageClientProps) {
	const [sortBy, setSortBy] = useState(
		(searchParams.orderby as string) || 'date'
	);
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
	const router = useRouter();
	const { addToCart, isLoading } = useCart();

	// Gestion des notifications
	const [notification, setNotification] = useState<{
		show: boolean;
		message: string;
		type: 'success' | 'error';
	}>({
		show: false,
		message: '',
		type: 'success',
	});

	// Fonction pour changer le tri
	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		setSortBy(value);

		// Construction des nouveaux paramètres de recherche
		const newParams = new URLSearchParams();

		// Copier tous les paramètres existants
		Object.entries(searchParams).forEach(([key, value]) => {
			if (key !== 'orderby' && value) {
				newParams.append(key, value as string);
			}
		});

		// Ajouter le nouveau paramètre de tri
		newParams.set('orderby', value);

		// Naviguer vers la nouvelle URL
		router.push(`/products?${newParams.toString()}`);
	};

	// Fonction pour ajouter au panier
	const handleAddToCart = async (productId: number) => {
		setSelectedProduct(productId);

		try {
			await addToCart(productId, 1);

			setNotification({
				show: true,
				message: 'Produit ajouté au panier !',
				type: 'success',
			});

			setTimeout(() => {
				setNotification({ ...notification, show: false });
			}, 3000);
		} catch (error) {
			console.error("Erreur lors de l'ajout au panier:", error);
			setNotification({
				show: true,
				message: "Erreur lors de l'ajout au panier",
				type: 'error',
			});

			setTimeout(() => {
				setNotification({ ...notification, show: false });
			}, 3000);
		} finally {
			setSelectedProduct(null);
		}
	};

	return (
		<div>
			{/* Notification */}
			{notification.show && (
				<div
					className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${
						notification.type === 'success'
							? 'bg-green-100 border-l-4 border-green-500'
							: 'bg-red-100 border-l-4 border-red-500'
					} transition-all duration-300`}>
					<div className='flex items-center'>
						<div
							className={`flex-shrink-0 ${
								notification.type === 'success'
									? 'text-green-500'
									: 'text-red-500'
							}`}>
							{notification.type === 'success' ? (
								<svg
									className='h-5 w-5'
									fill='currentColor'
									viewBox='0 0 20 20'>
									<path
										fillRule='evenodd'
										d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
										clipRule='evenodd'
									/>
								</svg>
							) : (
								<svg
									className='h-5 w-5'
									fill='currentColor'
									viewBox='0 0 20 20'>
									<path
										fillRule='evenodd'
										d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
										clipRule='evenodd'
									/>
								</svg>
							)}
						</div>
						<div className='ml-3'>
							<p
								className={`text-sm ${
									notification.type === 'success'
										? 'text-green-700'
										: 'text-red-700'
								}`}>
								{notification.message}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* En-tête avec filtres et actions */}
			<div className='bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<h2 className='text-gray-700 font-medium'>
						{products.length} produit
						{products.length > 1 ? 's' : ''} trouvé
						{products.length > 1 ? 's' : ''}
					</h2>
				</div>

				<div className='flex flex-wrap items-center gap-4'>
					{/* Sélecteur de tri */}
					<div className='flex items-center'>
						<label
							htmlFor='sort-by'
							className='text-sm font-medium text-gray-700 mr-2'>
							Trier par :
						</label>
						<select
							id='sort-by'
							value={sortBy}
							onChange={handleSortChange}
							className='rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'>
							<option value='date'>Nouveautés</option>
							<option value='popularity'>Popularité</option>
							<option value='price'>Prix croissant</option>
							<option value='price-desc'>Prix décroissant</option>
							<option value='rating'>Note moyenne</option>
						</select>
					</div>

					{/* Sélecteur de vue */}
					<div className='flex border rounded-md overflow-hidden'>
						<button
							onClick={() => setViewMode('grid')}
							className={`p-2 ${
								viewMode === 'grid'
									? 'bg-indigo-100 text-indigo-600'
									: 'bg-white text-gray-500'
							}`}
							aria-label='Vue grille'>
							<svg
								className='h-5 w-5'
								fill='currentColor'
								viewBox='0 0 24 24'>
								<path d='M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z' />
							</svg>
						</button>
						<button
							onClick={() => setViewMode('list')}
							className={`p-2 ${
								viewMode === 'list'
									? 'bg-indigo-100 text-indigo-600'
									: 'bg-white text-gray-500'
							}`}
							aria-label='Vue liste'>
							<svg
								className='h-5 w-5'
								fill='currentColor'
								viewBox='0 0 24 24'>
								<path d='M4 4h16v4H4V4zm0 6h16v4H4v-4zm0 6h16v4H4v-4z' />
							</svg>
						</button>
					</div>
				</div>
			</div>

			{/* Liste des produits - Vue grille ou liste */}
			{products.length === 0 ? (
				<div className='bg-white p-8 rounded-lg shadow-sm text-center'>
					<svg
						className='h-16 w-16 text-gray-400 mx-auto mb-4'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
						/>
					</svg>
					<h3 className='text-lg font-medium text-gray-900 mb-2'>
						Aucun produit trouvé
					</h3>
					<p className='text-gray-500 mb-6'>
						Aucun produit ne correspond à vos critères de recherche.
					</p>
					<Link
						href='/products'
						className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
						Voir tous les produits
					</Link>
				</div>
			) : viewMode === 'grid' ? (
				// Vue grille
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
					{products.map((product) => (
						<div
							key={product.id}
							className='bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:shadow-md hover:-translate-y-1 duration-300'>
							<Link
								href={`/products/${product.slug}`}
								className='block relative h-48 md:h-64 overflow-hidden'>
								{product.images && product.images.length > 0 ? (
									<Image
										src={product.images[0].src}
										alt={product.name}
										fill
										sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
										className='object-cover'
									/>
								) : (
									<div className='w-full h-full flex items-center justify-center bg-gray-100'>
										<svg
											className='h-12 w-12 text-gray-400'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth='2'
												d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
											/>
										</svg>
									</div>
								)}

								{/* Badge de promotion */}
								{product.on_sale && (
									<div className='absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
										{calculateDiscount(
											product.regular_price,
											product.sale_price
										)}
										% OFF
									</div>
								)}
							</Link>

							<div className='p-4'>
								<Link
									href={`/products/${product.slug}`}
									className='block'>
									<h3 className='text-lg font-medium text-gray-900 mb-1 line-clamp-2'>
										{product.name}
									</h3>

									<div className='flex items-baseline mb-3'>
										<span className='text-lg font-bold text-indigo-600'>
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
								</Link>

								<button
									onClick={() => handleAddToCart(product.id)}
									disabled={
										isLoading ||
										selectedProduct === product.id
									}
									className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70'>
									{isLoading &&
									selectedProduct === product.id ? (
										<span className='flex items-center justify-center'>
											<svg
												className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
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
											Ajout...
										</span>
									) : (
										<span>Ajouter au panier</span>
									)}
								</button>
							</div>
						</div>
					))}
				</div>
			) : (
				// Vue liste
				<div className='space-y-4'>
					{products.map((product) => (
						<div
							key={product.id}
							className='bg-white rounded-lg shadow-sm overflow-hidden transition hover:shadow-md duration-300 flex flex-col sm:flex-row'>
							<Link
								href={`/products/${product.slug}`}
								className='block relative w-full sm:w-48 h-48'>
								{product.images && product.images.length > 0 ? (
									<Image
										src={product.images[0].src}
										alt={product.name}
										fill
										sizes='(max-width: 768px) 100vw, 192px'
										className='object-cover'
									/>
								) : (
									<div className='w-full h-full flex items-center justify-center bg-gray-100'>
										<svg
											className='h-12 w-12 text-gray-400'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth='2'
												d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
											/>
										</svg>
									</div>
								)}

								{/* Badge de promotion */}
								{product.on_sale && (
									<div className='absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
										{calculateDiscount(
											product.regular_price,
											product.sale_price
										)}
										% OFF
									</div>
								)}
							</Link>

							<div className='p-4 flex-grow flex flex-col'>
								<Link
									href={`/products/${product.slug}`}
									className='block flex-grow'>
									<h3 className='text-lg font-medium text-gray-900 mb-1'>
										{product.name}
									</h3>

									<div className='flex items-baseline mb-3'>
										<span className='text-lg font-bold text-indigo-600'>
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

									{/* Description courte */}
									<div
										className='text-sm text-gray-600 line-clamp-2 mb-4'
										dangerouslySetInnerHTML={{
											__html: product.short_description,
										}}
									/>
								</Link>

								<button
									onClick={() => handleAddToCart(product.id)}
									disabled={
										isLoading ||
										selectedProduct === product.id
									}
									className='w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70'>
									{isLoading &&
									selectedProduct === product.id ? (
										<span className='flex items-center justify-center'>
											<svg
												className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
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
											Ajout...
										</span>
									) : (
										<span>Ajouter au panier</span>
									)}
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Pagination */}
			<div className='mt-8 flex justify-center'>
				{/* Ajoutez ici votre composant de pagination */}
			</div>
		</div>
	);
}
