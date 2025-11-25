// app/best-sellers/page.tsx
import { Suspense } from 'react';
import { getBestSellingProducts, getCategories, WooProduct } from '@/lib/woo';
import ProductsGrid from '@/components/ProductsGrid';
import ImprovedFaqSection from '@/components/ImprovedFaqSection';
import { ItemListSchemaSSR, BreadcrumbSchemaSSR } from '@/components/schemas';

// Configuration de revalidation
export const revalidate = 1800; // 30 minutes

// Métadonnées pour le SEO
export const metadata = {
	title: 'Produits Best-Sellers | Selectura',
	description:
		'Découvrez nos produits les plus populaires, plébiscités par nos clients pour leur qualité exceptionnelle et leur rapport qualité-prix.',
	keywords:
		'best-sellers, produits populaires, top ventes, produits premium, sélection, qualité',
};

// Composant de chargement
function BestSellersLoading() {
	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
			<div className='animate-pulse mb-12'>
				<div className='h-10 bg-gray-200 max-w-md mb-4 rounded'></div>
				<div className='h-4 bg-gray-200 max-w-xl rounded'></div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
				{[...Array(9)].map((_, i) => (
					<div
						key={i}
						className='bg-white rounded-lg shadow-sm overflow-hidden animate-pulse'>
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

// Interface pour le composant ProductsGrid
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

// Conversion WooProduct vers Product
function convertToProduct(wooProduct: WooProduct): Product {
	return {
		...wooProduct,
		stock_quantity: wooProduct.stock_quantity ?? undefined,
	};
}

export default async function BestSellersPage() {
	// Récupérer les best-sellers depuis WooCommerce
	let products = await getBestSellingProducts(24);

	// Fallback : Si aucun best-seller (pas encore de ventes),
	// afficher les produits featured ou les plus récents
	if (products.length === 0) {
		console.log('[BestSellers] Aucun best-seller trouvé, fallback sur produits récents');
		const { getProducts } = await import('@/lib/woo');
		products = await getProducts('?orderby=date&order=desc&per_page=24');
	}

	// Statistiques basées sur les produits
	const stats = {
		totalProducts: products.length,
		inStock: products.filter(p => p.stock_status === 'instock').length,
		onSale: products.filter(p => p.on_sale).length,
	};

	// FAQ
	const faqItems = [
		{
			question: "Comment définissez-vous qu'un produit est un best-seller ?",
			answer: "Nos best-sellers sont les produits les plus vendus sur notre boutique. Ils sont triés automatiquement par popularité basée sur le nombre de ventes réelles, ce qui garantit que vous découvrez les produits véritablement plébiscités par nos clients.",
		},
		{
			question: 'Les produits best-sellers sont-ils toujours disponibles en stock ?',
			answer: "Nous faisons notre maximum pour maintenir nos best-sellers en stock permanent. Cependant, certains produits très populaires peuvent parfois être en rupture temporaire. Consultez la disponibilité directement sur la page du produit.",
		},
		{
			question: 'Les best-sellers bénéficient-ils de promotions ?',
			answer: "Oui ! Certains de nos best-sellers peuvent être en promotion. Vous verrez clairement le prix barré et le nouveau prix sur la fiche produit. C'est l'occasion idéale de découvrir nos produits les plus populaires à prix réduit.",
		},
		{
			question: 'Puis-je retourner un produit best-seller si je ne suis pas satisfait ?',
			answer: "Absolument ! Tous nos produits, y compris les best-sellers, bénéficient de notre politique de retour 'satisfait ou remboursé' pendant 14 jours. Vous pouvez retourner le produit dans son état d'origine pour un remboursement intégral.",
		},
		{
			question: 'Comment sont classés les produits sur cette page ?',
			answer: "Les produits sont automatiquement classés par popularité, du plus vendu au moins vendu. Ce classement est mis à jour régulièrement pour refléter les tendances actuelles et les préférences de nos clients.",
		},
	];

	return (
		<>
			<ItemListSchemaSSR
				products={products}
				listName="Meilleures ventes - Selectura"
				listUrl="https://selectura.co/best-sellers"
				description="Découvrez nos produits les plus populaires, plébiscités par nos clients pour leur qualité exceptionnelle."
			/>
			<BreadcrumbSchemaSSR
				items={[{ name: 'Meilleures ventes', url: 'https://selectura.co/best-sellers' }]}
			/>
			<Suspense fallback={<BestSellersLoading />}>
				<div className='bg-white'>
				{/* Hero Section */}
				<div className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
						<h1 className='text-4xl md:text-5xl font-extrabold mb-4'>
							Nos produits phares
						</h1>
						<p className='text-xl text-indigo-100 max-w-3xl'>
							Découvrez notre sélection de produits premium, soigneusement choisis pour leur qualité exceptionnelle.
						</p>
					</div>
				</div>

				{/* Statistiques */}
				<div className='bg-gray-50 border-b'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
							<div className='text-center'>
								<div className='text-4xl font-bold text-indigo-600 mb-2'>
									{stats.totalProducts}
								</div>
								<div className='text-gray-600'>Produits best-sellers</div>
							</div>
							<div className='text-center'>
								<div className='text-4xl font-bold text-green-600 mb-2'>
									{stats.inStock}
								</div>
								<div className='text-gray-600'>Disponibles en stock</div>
							</div>
							<div className='text-center'>
								<div className='text-4xl font-bold text-red-600 mb-2'>
									{stats.onSale}
								</div>
								<div className='text-gray-600'>En promotion</div>
							</div>
						</div>
					</div>
				</div>

				{/* Grille de produits */}
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
					<div className='mb-8'>
						<h2 className='text-2xl font-bold text-gray-900 mb-2'>
							Tous nos produits
						</h2>
						<p className='text-gray-600'>
							{products.length > 0 && products[0]?.date_created
								? 'Les derniers ajouts en premier'
								: 'Nos produits sélectionnés avec soin'}
						</p>
					</div>

					{products.length > 0 ? (
						<ProductsGrid products={products} />
					) : (
						<div className='text-center py-16'>
							<p className='text-gray-500 text-lg'>
								Aucun produit disponible pour le moment.
							</p>
						</div>
					)}
				</div>

				{/* Avantages */}
				<div className='bg-indigo-50 py-16'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<h2 className='text-3xl font-bold text-center text-gray-900 mb-12'>
							Pourquoi choisir nos best-sellers ?
						</h2>
						<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
							<div className='text-center'>
								<div className='rounded-full bg-indigo-100 w-16 h-16 flex items-center justify-center mx-auto mb-4'>
									<svg
										className='w-8 h-8 text-indigo-600'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
										/>
									</svg>
								</div>
								<h3 className='text-lg font-semibold text-gray-900 mb-2'>
									Qualité prouvée
								</h3>
								<p className='text-gray-600'>
									Produits testés et approuvés par de nombreux clients
								</p>
							</div>

							<div className='text-center'>
								<div className='rounded-full bg-indigo-100 w-16 h-16 flex items-center justify-center mx-auto mb-4'>
									<svg
										className='w-8 h-8 text-indigo-600'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M13 10V3L4 14h7v7l9-11h-7z'
										/>
									</svg>
								</div>
								<h3 className='text-lg font-semibold text-gray-900 mb-2'>
									Livraison rapide
								</h3>
								<p className='text-gray-600'>
									Stock prioritaire pour une expédition sous 24-48h
								</p>
							</div>

							<div className='text-center'>
								<div className='rounded-full bg-indigo-100 w-16 h-16 flex items-center justify-center mx-auto mb-4'>
									<svg
										className='w-8 h-8 text-indigo-600'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
										/>
									</svg>
								</div>
								<h3 className='text-lg font-semibold text-gray-900 mb-2'>
									Satisfaction garantie
								</h3>
								<p className='text-gray-600'>
									14 jours pour retourner si vous n'êtes pas satisfait
								</p>
							</div>

							<div className='text-center'>
								<div className='rounded-full bg-indigo-100 w-16 h-16 flex items-center justify-center mx-auto mb-4'>
									<svg
										className='w-8 h-8 text-indigo-600'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
										/>
									</svg>
								</div>
								<h3 className='text-lg font-semibold text-gray-900 mb-2'>
									Support dédié
								</h3>
								<p className='text-gray-600'>
									Une équipe à votre écoute pour vous conseiller
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* FAQ */}
				<ImprovedFaqSection
					faqs={faqItems}
					title='Questions fréquentes sur nos best-sellers'
					description='Tout ce que vous devez savoir sur nos produits les plus populaires.'
					bgColor='bg-white'
					showContact={true}
				/>
				</div>
			</Suspense>
		</>
	);
}
