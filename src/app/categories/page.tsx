// app/categories/page.tsx
import { Suspense } from 'react';
import { getCategories } from '@/lib/woo';
import CategoriesPageContent from '@/components/CategoriesPageContent';
import '../styles/categories.css';

// Métadonnées pour le SEO
export const metadata = {
	title: 'Catégories | Votre Boutique',
	description:
		'Explorez toutes nos catégories de produits et trouvez exactement ce que vous cherchez.',
};

// Composant de chargement
function CategoriesLoading() {
	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
			<div className='animate-pulse mb-8'>
				<div className='h-10 bg-gray-200 max-w-md mb-4 rounded'></div>
				<div className='h-4 bg-gray-200 max-w-xl rounded'></div>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className='animate-pulse'>
						<div className='bg-gray-200 rounded-xl h-64 w-full mb-4'></div>
						<div className='h-6 bg-gray-200 w-1/2 rounded mb-2'></div>
						<div className='h-4 bg-gray-200 w-1/4 rounded'></div>
					</div>
				))}
			</div>
		</div>
	);
}

export default async function CategoriesPage() {
	// Récupération des catégories
	const categories = await getCategories(
		'?per_page=100&exclude=uncategorized'
	);

	return (
		<Suspense fallback={<CategoriesLoading />}>
			<CategoriesPageContent categories={categories} />
		</Suspense>
	);
}
