// app/products/page.tsx
import React, { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/woo';
import ProductFiltersSidebar from '@/components/ProductFiltersSidebar';
import ProductsPageClient from '@/components/ProductsPageClient';

// Métadonnées pour le SEO
export const metadata = {
	title: 'Tous nos produits | Votre Boutique',
	description:
		'Découvrez notre collection de produits exclusifs et innovants.',
};

// Composant de chargement pour Suspense
function ProductsLoading() {
	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
				{[...Array(6)].map((_, i) => (
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

export default async function ProductsPage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	// 🔹 On "résout" searchParams avant de les lire
	const sp = await Promise.resolve(searchParams);

	// Construction des paramètres de recherche pour l'API WooCommerce
	const page = sp.page || '1';
	const perPage = sp.per_page || '12';
	const category = sp.category || '';
	const orderby = sp.orderby || 'date';
	const order = sp.order || 'desc';
	const minPrice = sp.min_price || '';
	const maxPrice = sp.max_price || '';
	const featured = sp.featured || '';
	const onSale = sp.on_sale || '';
	const search = sp.search || '';

	// Construction de la requête
	let queryString = `?per_page=${perPage}&page=${page}&orderby=${orderby}&order=${order}`;

	if (category) queryString += `&category=${category}`;
	if (minPrice) queryString += `&min_price=${minPrice}`;
	if (maxPrice) queryString += `&max_price=${maxPrice}`;
	if (featured === 'true') queryString += `&featured=true`;
	if (onSale === 'true') queryString += `&on_sale=true`;
	if (search) queryString += `&search=${search}`;

	// Récupération des données
	const productsPromise = getProducts(queryString);
	const categoriesPromise = getCategories();

	// Récupération parallèle avec Promise.all pour de meilleures performances
	const [products, categories] = await Promise.all([
		productsPromise,
		categoriesPromise,
	]);

	// Filtrage des catégories pour exclure "Non catégorisé"
	const filteredCategories = categories.filter(
		(cat) => cat.name !== 'Uncategorized' && cat.name !== 'Non classé'
	);

	return (
		<div className='bg-gray-50 min-h-screen'>
			{/* Bannière catégorie */}
			<div className='relative bg-gradient-to-r from-indigo-700 to-purple-700 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10'>
					<h1 className='text-3xl md:text-4xl font-bold mb-4'>
						Tous nos produits
					</h1>
					<p className='text-indigo-100 max-w-2xl text-lg'>
						Découvrez notre sélection de produits exceptionnels,
						soigneusement choisis pour vous offrir qualité et
						innovation.
					</p>
				</div>
				{/* Éléments décoratifs */}
				<div className='absolute inset-0 overflow-hidden opacity-10'>
					<div className='absolute -top-20 -left-20 w-96 h-96 rounded-full bg-indigo-500' />
					<div className='absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-500' />
				</div>
			</div>

			{/* Contenu principal */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='flex flex-col md:flex-row gap-8'>
					{/* Sidebar avec filtres */}
					<div className='w-full md:w-64 flex-shrink-0'>
						<Suspense
							fallback={<div>Chargement des filtres...</div>}>
							<ProductFiltersSidebar
								categories={filteredCategories}
								currentCategory={String(category)}
								searchParams={searchParams}
							/>
						</Suspense>
					</div>

					{/* Liste des produits */}
					<div className='flex-grow'>
						<Suspense fallback={<ProductsLoading />}>
							<ProductsPageClient
								products={products}
								searchParams={searchParams}
							/>
						</Suspense>
					</div>
				</div>
			</div>
		</div>
	);
}
