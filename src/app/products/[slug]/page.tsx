// app/products/[slug]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProducts } from '@/lib/woo';
import ProductDetailContent from '@/components/ProductDetailContent';

// Composant de chargement
function ProductDetailLoading() {
	return (
		<div className='bg-gray-50 min-h-screen'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<div className='flex flex-col lg:flex-row gap-10'>
					{/* Partie gauche - Galerie */}
					<div className='w-full lg:w-3/5'>
						<div className='bg-gray-200 h-96 rounded-xl animate-pulse mb-4'></div>
						<div className='flex gap-2 overflow-x-auto'>
							{[...Array(4)].map((_, i) => (
								<div
									key={i}
									className='bg-gray-200 w-24 h-24 rounded-lg flex-shrink-0 animate-pulse'></div>
							))}
						</div>
					</div>

					{/* Partie droite - Infos produit */}
					<div className='w-full lg:w-2/5 space-y-6'>
						<div className='h-8 bg-gray-200 rounded w-3/4 animate-pulse'></div>
						<div className='h-6 bg-gray-200 rounded w-1/3 animate-pulse'></div>
						<div className='space-y-2'>
							<div className='h-4 bg-gray-200 rounded animate-pulse'></div>
							<div className='h-4 bg-gray-200 rounded animate-pulse'></div>
							<div className='h-4 bg-gray-200 rounded animate-pulse'></div>
						</div>
						<div className='h-10 bg-gray-200 rounded animate-pulse'></div>
						<div className='h-12 bg-gray-200 rounded animate-pulse'></div>
					</div>
				</div>
			</div>
		</div>
	);
}

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

// Génération des chemins statiques - plus efficace avec un catalogue limité
export async function generateStaticParams() {
	try {
		// Avec un catalogue limité, on peut récupérer tous les produits sans paginer
		const products = await getProducts();
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

		// Récupérer tous les produits en une seule requête (efficace avec un catalogue limité)
		const allProducts = await getProducts();

		// Filtrer les produits pour obtenir les accessoires (avec le tag "accessory")
		const accessories = allProducts
			.filter(
				(p) => p.tags && p.tags.some((tag) => tag.name === 'accessory')
			)
			.slice(0, 4);

		// Vérifier s'il existe une version premium
		let premiumVariant = null;
		if (
			product.tags &&
			product.tags.some((tag) => tag.name === 'standard')
		) {
			const premiumProducts = allProducts.filter(
				(p) => p.tags && p.tags.some((tag) => tag.name === 'premium')
			);
			if (premiumProducts.length > 0) {
				premiumVariant = premiumProducts[0];
			}
		}

		// Récupérer des produits similaires (même catégorie que le produit actuel)
		let similarProducts = [];
		if (product.categories && product.categories.length > 0) {
			similarProducts = allProducts
				.filter(
					(p) =>
						p.id !== product.id &&
						p.categories &&
						p.categories.some((cat) =>
							product.categories.some(
								(prodCat) => prodCat.id === cat.id
							)
						)
				)
				.slice(0, 3);
		}

		// Si on a très peu de produits, on peut simplement montrer les autres produits
		if (similarProducts.length === 0 && allProducts.length <= 5) {
			similarProducts = allProducts
				.filter((p) => p.id !== product.id)
				.slice(0, 3);
		}

		return (
			<Suspense fallback={<ProductDetailLoading />}>
				<ProductDetailContent
					product={product}
					accessories={accessories}
					premiumVariant={premiumVariant}
					similarProducts={similarProducts}
				/>
			</Suspense>
		);
	} catch (error) {
		console.error('Erreur de chargement du produit:', error);
		throw error;
	}
}
