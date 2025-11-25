// app/promotions/page.tsx
import { Suspense } from 'react';
import { getProducts } from '@/lib/woo';
import PromotionsContent from '@/components/PromotionsContent';
import { ItemListSchemaSSR, BreadcrumbSchemaSSR } from '@/components/schemas';

// Métadonnées pour le SEO
export const metadata = {
	title: 'Promotions | Votre Boutique',
	description:
		'Découvrez nos offres spéciales et faites des économies sur notre sélection de produits en promotion. Ne manquez pas ces occasions!',
};

// Composant de chargement pour Suspense
function PromotionsLoading() {
	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
			<div className='animate-pulse mb-12'>
				<div className='h-10 bg-gray-200 max-w-md mb-4 rounded'></div>
				<div className='h-4 bg-gray-200 max-w-xl rounded'></div>
			</div>

			<div className='animate-pulse mb-8'>
				<div className='h-6 bg-gray-200 w-1/3 mb-4 rounded'></div>
				<div className='h-24 bg-gray-200 rounded-lg w-full mb-8'></div>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className='animate-pulse bg-white rounded-lg shadow-sm overflow-hidden'>
						<div className='bg-gray-200 h-64 w-full'></div>
						<div className='p-4 space-y-3'>
							<div className='h-4 bg-gray-200 rounded w-1/4'></div>
							<div className='h-6 bg-gray-200 rounded w-3/4'></div>
							<div className='flex items-center space-x-2'>
								<div className='h-6 bg-gray-200 rounded w-1/4'></div>
								<div className='h-4 bg-gray-200 rounded w-1/5'></div>
							</div>
							<div className='h-10 bg-gray-200 rounded w-full'></div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default async function PromotionsPage() {
	// Récupérer les produits en promotion
	// Utiliser le paramètre on_sale=true pour récupérer les produits avec des réductions
	const products = await getProducts('?on_sale=true&per_page=30');

	return (
		<>
			<ItemListSchemaSSR
				products={products}
				listName="Promotions - Selectura"
				listUrl="https://selectura.co/promotions"
				description="Découvrez nos offres spéciales et faites des économies sur notre sélection de produits en promotion."
			/>
			<BreadcrumbSchemaSSR
				items={[{ name: 'Promotions', url: 'https://selectura.co/promotions' }]}
			/>
			<Suspense fallback={<PromotionsLoading />}>
				<PromotionsContent products={products} />
			</Suspense>
		</>
	);
}
