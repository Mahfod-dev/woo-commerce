// app/products/page.tsx
import { Suspense } from 'react';
import FocusedProductsPage from '@/components/FocusedProductPage';
import { getProducts, WooProduct } from '@/lib/woo';

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
	// Récupérer tous les produits principaux (en excluant les accessoires pour cette page)
	const allProducts = await getProducts(
		'?per_page=24&orderby=date&order=desc'
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