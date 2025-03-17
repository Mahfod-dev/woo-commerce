// app/new-arrivals/page.tsx
import { Suspense } from 'react';
import { getProducts } from '@/lib/woo';
import NewArrivalsContent from '@/components/NewArrivalsContent';

// Métadonnées pour le SEO
export const metadata = {
	title: 'Nouveautés | Votre Boutique',
	description:
		'Découvrez nos derniers produits et restez à la pointe des tendances avec notre collection de nouveautés.',
};

// Composant de chargement pour Suspense
function NewArrivalsLoading() {
	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
			<div className='animate-pulse mb-8'>
				<div className='h-10 bg-gray-200 max-w-md mb-4 rounded'></div>
				<div className='h-4 bg-gray-200 max-w-xl rounded'></div>
			</div>

			<div className='animate-pulse mb-8'>
				<div className='h-6 bg-gray-200 w-1/4 mb-4 rounded'></div>
				<div className='flex gap-4 overflow-x-auto pb-4'>
					{[...Array(5)].map((_, i) => (
						<div
							key={i}
							className='flex-none w-40 h-10 bg-gray-200 rounded'></div>
					))}
				</div>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
				{[...Array(9)].map((_, i) => (
					<div
						key={i}
						className='bg-white rounded-lg shadow-sm overflow-hidden'>
						<div className='bg-gray-200 h-64 w-full'></div>
						<div className='p-4 space-y-3'>
							<div className='h-6 bg-gray-200 rounded w-3/4'></div>
							<div className='h-4 bg-gray-200 rounded w-1/2'></div>
							<div className='h-10 bg-gray-200 rounded w-full'></div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default async function NewArrivalsPage() {
	// Récupérer les produits les plus récents
	// Pour ce faire, nous trions par date et limitons aux 24 derniers produits
	const products = await getProducts('?orderby=date&per_page=24');

	return (
		<Suspense fallback={<NewArrivalsLoading />}>
			<NewArrivalsContent products={products} />
		</Suspense>
	);
}
