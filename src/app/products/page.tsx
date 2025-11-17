import { Suspense } from 'react';
import { Metadata } from 'next';
import FocusedProductsPage from '@/components/FocusedProductPage';
import { getProducts, WooProduct } from '@/lib/woo';

// Configuration de revalidation - régénère la page toutes les 30 minutes
export const revalidate = 1800;

export const metadata: Metadata = {
	title: 'Nos Produits | Catalogue Premium Selectura - Sélection Experte',
	description: 'Explorez notre catalogue soigneusement sélectionné de produits de qualité supérieure. Chaque produit est testé et approuvé par nos experts pour sa qualité exceptionnelle et sa durabilité.',
	keywords: [
		'catalogue produits premium',
		'sélection qualité supérieure', 
		'produits testés experts',
		'qualité exceptionnelle',
		'high-tech premium',
		'accessoires qualité',
		'durabilité garantie',
		'expertise produits'
	],
	openGraph: {
		title: 'Catalogue Produits Premium | Selectura',
		description: 'Découvrez notre sélection rigoureuse de produits exceptionnels. Qualité testée, expertise garantie.',
		type: 'website',
		images: [
			{
				url: '/images/collections.png',
				width: 1200,
				height: 630,
				alt: 'Catalogue de produits premium Selectura',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Catalogue Produits Premium | Selectura',
		description: 'Sélection rigoureuse de produits exceptionnels. Qualité testée par nos experts.',
		images: ['/images/collections.png'],
	},
	alternates: {
		canonical: 'https://selectura.co/products',
	},
};

// Interface pour le type Product utilisé dans FocusedProductPage
interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price?: string;
  sale_price?: string;
  on_sale?: boolean;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  stock_quantity?: number;
  short_description: string;
  description: string;
  images: { src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
  average_rating?: string;
  rating_count?: number;
  featured?: boolean;
  tags: { id: number; name: string; slug: string }[];
}

// Fonction pour convertir WooProduct en Product
function convertToProduct(wooProduct: WooProduct): Product {
  return {
    ...wooProduct,
    stock_quantity: wooProduct.stock_quantity ?? undefined
  };
}

// Composant de chargement
function ProductsLoading() {
	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
			<div className='animate-pulse'>
				<div className='h-16 bg-gray-200 rounded mb-10'></div>
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

// ID constants
const CATEGORY_IDS = {
	FEATURED: 18,
	ACCESSORIES: 31,
};

export default async function ProductsPage() {
	// Récupérer tous les produits (augmenté à 100 pour avoir tous les produits)
	const allProducts = await getProducts(
		'?per_page=100&orderby=date&order=desc'
	);

	// Filtrer les accessoires
	const mainProducts = allProducts.filter(
		(product) =>
			!product.categories.some(
				(cat) => cat.id === CATEGORY_IDS.ACCESSORIES
			)
	);

	// Récupérer les accessoires séparément si nécessaire
	// const accessories = await getProducts(
	// 	`?category=${ACCESSORIES_CATEGORY_ID}&per_page=10`
	// );

	// Convertir les produits WooProduct en Product
	const convertedMainProducts = mainProducts.map(convertToProduct);

	return (
		<Suspense fallback={<ProductsLoading />}>
			<div className='font-sans'>
				<FocusedProductsPage
					products={convertedMainProducts}
					accessories={[]}
				/>
			</div>
		</Suspense>
	);
}