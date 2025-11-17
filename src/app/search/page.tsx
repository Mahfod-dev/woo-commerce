import { Suspense } from 'react';
import { Metadata } from 'next';
import SearchPageContent from '@/components/SearchPageContent';
import { getProducts } from '@/lib/woo';

// Pas de cache statique pour les résultats de recherche
export const dynamic = 'force-dynamic';

// Interface pour les paramètres de recherche
interface SearchPageProps {
	searchParams: Promise<{
		q?: string;
	}>;
}

// Métadonnées dynamiques
export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
	const params = await searchParams;
	const query = params.q || '';

	return {
		title: query ? `Recherche: ${query} | Selectura` : 'Recherche | Selectura',
		description: `Résultats de recherche pour "${query}" - Trouvez les produits que vous cherchez dans notre catalogue.`,
		robots: 'noindex, follow', // Pas d'indexation des pages de recherche
	};
}

// Composant de chargement
function SearchLoading() {
	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
			<div className='animate-pulse'>
				<div className='h-10 bg-gray-200 max-w-md mb-4 rounded'></div>
				<div className='h-4 bg-gray-200 max-w-xl rounded mb-8'></div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					{[...Array(6)].map((_, i) => (
						<div
							key={i}
							className='bg-white rounded-xl overflow-hidden shadow-sm'>
							<div className='aspect-square bg-gray-200'></div>
							<div className='p-4 space-y-3'>
								<div className='h-4 bg-gray-200 rounded w-3/4'></div>
								<div className='h-4 bg-gray-200 rounded w-1/2'></div>
								<div className='h-10 bg-gray-200 rounded'></div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
	const params = await searchParams;
	const query = params.q || '';

	// Récupérer tous les produits
	const allProducts = await getProducts('?per_page=100');

	// Filtrer les produits selon la recherche
	const filteredProducts = query
		? allProducts.filter((product) => {
				const searchTerm = query.toLowerCase();
				return (
					product.name.toLowerCase().includes(searchTerm) ||
					product.description.toLowerCase().includes(searchTerm) ||
					product.short_description.toLowerCase().includes(searchTerm) ||
					product.categories.some((cat) =>
						cat.name.toLowerCase().includes(searchTerm)
					) ||
					product.tags.some((tag) =>
						tag.name.toLowerCase().includes(searchTerm)
					)
				);
		  })
		: [];

	return (
		<Suspense fallback={<SearchLoading />}>
			<SearchPageContent products={filteredProducts} query={query} />
		</Suspense>
	);
}
