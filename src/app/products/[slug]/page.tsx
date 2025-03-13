// app/products/[slug]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProducts } from '@/lib/woo';
import ProductDetailContent from '@/components/ProductDetailContent';

// Métadonnées dynamiques pour SEO
export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}) {
	try {
		const { slug } = await Promise.resolve(params);
		const products = await getProducts(`?slug=${slug}`);

		if (!products || products.length === 0) {
			return {
				title: 'Produit non trouvé',
			};
		}

		const product = products[0];

		return {
			title: `${product.name} | Votre Boutique`,
			description: product.short_description
				.replace(/<[^>]*>/g, '')
				.slice(0, 160),
			openGraph: {
				title: product.name,
				description: product.short_description
					.replace(/<[^>]*>/g, '')
					.slice(0, 160),
				images:
					product.images.length > 0
						? [{ url: product.images[0].src }]
						: [],
			},
		};
	} catch (error) {
		console.error('Erreur lors de la génération des métadonnées:', error);
		return {
			title: 'Détail produit | Votre Boutique',
		};
	}
}

// Génération des chemins statiques à la compilation
export async function generateStaticParams() {
	try {
		const products = await getProducts('?per_page=100');
		return products.map((product) => ({
			slug: product.slug,
		}));
	} catch (error) {
		console.error(
			'Erreur lors de la génération des chemins statiques:',
			error
		);
		return [];
	}
}

export default async function ProductPage({
	params,
}: {
	params: { slug: string };
}) {
	try {
		const { slug } = await Promise.resolve(params);
		// Récupération des données du produit
		const products = await getProducts(`?slug=${slug}`);

		if (!products || products.length === 0) {
			notFound();
		}

		const product = products[0];

		return (
			<div className='bg-white'>
				<Suspense fallback={<ProductSkeleton />}>
					<ProductDetailContent product={product} />
				</Suspense>
			</div>
		);
	} catch (error) {
		console.error('Erreur de chargement du produit:', error);
		throw error;
	}
}

// Composant de chargement
function ProductSkeleton() {
	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
			<div className='flex flex-col md:flex-row gap-8'>
				<div className='md:w-1/2'>
					<div className='bg-gray-200 rounded-lg aspect-square animate-pulse'></div>
					<div className='mt-4 grid grid-cols-4 gap-2'>
						{[...Array(4)].map((_, i) => (
							<div
								key={i}
								className='bg-gray-200 rounded-lg aspect-square animate-pulse'></div>
						))}
					</div>
				</div>
				<div className='md:w-1/2 space-y-4'>
					<div className='h-8 bg-gray-200 rounded w-3/4 animate-pulse'></div>
					<div className='h-6 bg-gray-200 rounded w-1/4 animate-pulse'></div>
					<div className='space-y-2'>
						<div className='h-4 bg-gray-200 rounded animate-pulse'></div>
						<div className='h-4 bg-gray-200 rounded animate-pulse'></div>
						<div className='h-4 bg-gray-200 rounded animate-pulse'></div>
					</div>
					<div className='h-12 bg-gray-200 rounded-full w-1/3 animate-pulse'></div>
				</div>
			</div>
		</div>
	);
}
