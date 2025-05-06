// app/categories/[slug]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getCategories, getProductsByCategory, getSubcategories } from '@/lib/woo';
import CategoryPageContent from '@/components/CategoryPageContent';
import '../../styles/categories.css';

// Interface pour les propriétés de la page
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Composant de chargement
function CategoryLoading() {
	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
			<div className='animate-pulse'>
				<div className='h-10 bg-gray-200 max-w-md mb-4 rounded'></div>
				<div className='h-4 bg-gray-200 max-w-xl rounded mb-8'></div>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
					{[...Array(6)].map((_, i) => (
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
		</div>
	);
}

// Génération des métadonnées dynamiques pour SEO
export async function generateMetadata({ params }: PageProps) {
	const { slug } = await params;
	const categories = await getCategories(`?slug=${slug}`);

	if (!categories || categories.length === 0) {
		return {
			title: 'Catégorie non trouvée | Votre Boutique',
			description: "La catégorie que vous recherchez n'existe pas.",
		};
	}

	const category = categories[0];

	return {
		title: `${category.name} | Votre Boutique`,
		description: `Découvrez notre collection ${category.name.toLowerCase()} - ${
			category.count
		} produits exceptionnels sélectionnés pour vous.`,
	};
}

// Génération des chemins statiques
export async function generateStaticParams() {
	try {
		const categories = await getCategories('?per_page=100');
		return categories.map((category) => ({
			slug: category.slug,
		}));
	} catch (error) {
		console.error(
			'Erreur lors de la génération des chemins statiques:',
			error
		);
		return [];
	}
}

export default async function CategoryPage({ params }: PageProps) {
	const { slug } = await params;

	// Récupération des données de la catégorie
	const categories = await getCategories(`?slug=${slug}`);

	if (!categories || categories.length === 0) {
		notFound();
	}

	const category = categories[0];

	// Récupération des sous-catégories
	const subcategories = await getSubcategories(category.id);
	
	// Récupération des produits de la catégorie et de ses sous-catégories
	const products = await getProductsByCategory(category.id, true);

	return (
		<Suspense fallback={<CategoryLoading />}>
			<CategoryPageContent
				category={category}
				products={products}
				subcategories={subcategories}
			/>
		</Suspense>
	);
}