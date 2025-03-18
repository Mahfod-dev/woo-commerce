'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WooProduct } from '@/lib/woo';
import { formatPrice, calculateDiscount } from '@/lib/wooClient';
import { useCart } from '@/components/CartProvider';

interface ProductsGridProps {
	products: WooProduct[];
	columns?: 2 | 3 | 4;
	showAddToCart?: boolean;
	limit?: number;
}

export default function ProductsGrid({
	products,
	columns = 3,
	showAddToCart = true,
	limit,
}: ProductsGridProps) {
	const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
	const { addToCart, isLoading } = useCart();

	// Fonction pour ajouter au panier
	const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
		e.preventDefault(); // Empêcher la navigation vers la page du produit
		setSelectedProduct(productId);

		try {
			await addToCart(productId, 1);
			// Ici vous pourriez ajouter une notification
		} catch (error) {
			console.error("Erreur lors de l'ajout au panier:", error);
		} finally {
			setSelectedProduct(null);
		}
	};

	// Définir le nombre de colonnes en fonction de la propriété columns
	const gridCols = {
		2: 'grid-cols-1 sm:grid-cols-2',
		3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
		4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
	}[columns];

	// Limiter le nombre de produits si nécessaire
	const displayProducts = limit ? products.slice(0, limit) : products;

	return (
		<div className={`grid ${gridCols} gap-6`}>
			{displayProducts.map((product) => (
				<div
					key={product.id}
					className='bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:shadow-md hover:-translate-y-1 duration-300 group'>
					<Link
						href={`/products/${product.slug}`}
						className='block relative aspect-square overflow-hidden'>
						{product.images && product.images.length > 0 ? (
							<Image
								src={product.images[0].src}
								alt={product.name}
								fill
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
								className='object-cover transition-transform duration-500 group-hover:scale-105'
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
								-
								{calculateDiscount(
									product.regular_price,
									product.sale_price
								)}
								%
							</div>
						)}

						{/* Badge produit mis en avant */}
						{product.featured && (
							<div className='absolute top-2 left-2 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
								Populaire
							</div>
						)}
					</Link>

					<div className='p-4'>
						<Link
							href={`/products/${product.slug}`}
							className='block'>
							<h3 className='text-lg font-medium text-gray-900 mb-1 line-clamp-2 h-14'>
								{product.name}
							</h3>

							<div className='flex items-baseline mb-3'>
								<span className='text-lg font-bold text-indigo-600'>
									{formatPrice(product.price)}
								</span>

								{product.on_sale && product.regular_price && (
									<span className='ml-2 text-sm text-gray-500 line-through'>
										{formatPrice(product.regular_price)}
									</span>
								)}
							</div>
						</Link>

						{showAddToCart && (
							<button
								onClick={(e) => handleAddToCart(e, product.id)}
								disabled={
									isLoading || selectedProduct === product.id
								}
								className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70'>
								{isLoading && selectedProduct === product.id ? (
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
						)}
					</div>
				</div>
			))}
		</div>
	);
}
