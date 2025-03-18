// app/products/page.tsx
import React, { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/woo';
import FocusedProductsPage from '@/components/FocusedProductPage';

// Métadonnées pour le SEO
export const metadata = {
	title: 'Notre Collection Sélectionnée | Votre Boutique',
	description:
		'Découvrez notre collection exclusive de produits soigneusement sélectionnés pour leur qualité et leur durabilité.',
};

// Composant de chargement pour Suspense
function ProductsLoading() {
	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
			<div className='animate-pulse mb-12'>
				<div className='h-12 bg-gray-200 max-w-md mb-4 rounded'></div>
				<div className='h-6 bg-gray-200 max-w-xl rounded'></div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
				{[...Array(3)].map((_, i) => (
					<div
						key={i}
						className='bg-white rounded-lg shadow-md overflow-hidden'>
						<div className='bg-gray-200 animate-pulse h-64 w-full' />
						<div className='p-4 space-y-3'>
							<div className='h-6 bg-gray-200 animate-pulse rounded w-3/4' />
							<div className='h-4 bg-gray-200 animate-pulse rounded w-1/2' />
							<div className='h-10 bg-gray-200 animate-pulse rounded w-full' />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default async function ProductsPage() {
	// Récupération des données - avec une approche différente pour une curation limitée
	// On récupère seulement les produits principaux et les accessoires

	// Récupérer les produits principaux (non-accessoires)
	const mainProducts = await getProducts('?per_page=5&exclude_tag=accessory');

	// Récupérer les accessoires
	const accessories = await getProducts('?tag=accessory&per_page=10');

	return (
		<Suspense fallback={<ProductsLoading />}>
			<div className='font-sans'>
				<FocusedProductsPage
					products={mainProducts}
					accessories={accessories}
				/>
			</div>
		</Suspense>
	);
}
