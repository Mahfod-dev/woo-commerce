// app/sitemap/page.tsx
import Link from 'next/link';
import { getCategories, getProducts } from '@/lib/woo';

export const metadata = {
	title: 'Plan du site | Selectura',
	description: 'Plan du site Selectura - Naviguez facilement vers toutes nos pages et catégories.',
	themeColor: '#4338ca',
};

export default async function SitemapPage() {
	const categories = await getCategories();
	const products = await getProducts();

	const staticPages = [
		{ name: 'Accueil', href: '/' },
		{ name: 'Produits', href: '/products' },
		{ name: 'Catégories', href: '/categories' },
		{ name: 'Best-sellers', href: '/best-sellers' },
		{ name: 'Nouveautés', href: '/new-arrivals' },
		{ name: 'Promotions', href: '/promotions' },
		{ name: 'Flash Sale', href: '/flash-sale' },
		{ name: 'À propos', href: '/about' },
		{ name: 'À propos - Qualité', href: '/about-quality' },
		{ name: 'Blog', href: '/blog' },
		{ name: 'Contact', href: '/contact' },
		{ name: 'FAQ', href: '/faq' },
		{ name: 'Panier', href: '/cart' },
		{ name: 'Commande', href: '/checkout' },
		{ name: 'Compte client', href: '/account' },
		{ name: 'Connexion', href: '/login' },
		{ name: 'Témoignages', href: '/testimonials' },
	];

	const legalPages = [
		{ name: 'Conditions générales', href: '/terms' },
		{ name: 'Politique de confidentialité', href: '/privacy-policy' },
		{ name: 'Politique de cookies', href: '/cookie-policy' },
		{ name: 'Politique de retour', href: '/returns' },
		{ name: 'Livraison', href: '/shipping' },
	];

	return (
		<div className='bg-gray-50 min-h-screen py-16'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='bg-white rounded-lg shadow-sm p-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-8'>Plan du site</h1>
					
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{/* Pages principales */}
						<div>
							<h2 className='text-xl font-semibold text-gray-900 mb-4'>Pages principales</h2>
							<ul className='space-y-2'>
								{staticPages.map((page) => (
									<li key={page.href}>
										<Link
											href={page.href}
											className='text-indigo-600 hover:text-indigo-800 transition-colors'>
											{page.name}
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Catégories */}
						<div>
							<h2 className='text-xl font-semibold text-gray-900 mb-4'>Catégories</h2>
							<ul className='space-y-2'>
								{categories.slice(0, 10).map((category) => (
									<li key={category.id}>
										<Link
											href={`/categories/${category.slug}`}
											className='text-indigo-600 hover:text-indigo-800 transition-colors'>
											{category.name}
										</Link>
									</li>
								))}
								{categories.length > 10 && (
									<li>
										<Link
											href='/categories'
											className='text-gray-500 hover:text-gray-700 text-sm'>
											... et {categories.length - 10} autres catégories
										</Link>
									</li>
								)}
							</ul>
						</div>

						{/* Produits populaires */}
						<div>
							<h2 className='text-xl font-semibold text-gray-900 mb-4'>Produits populaires</h2>
							<ul className='space-y-2'>
								{products.slice(0, 10).map((product) => (
									<li key={product.id}>
										<Link
											href={`/products/${product.slug}`}
											className='text-indigo-600 hover:text-indigo-800 transition-colors text-sm'>
											{product.name.length > 40 
												? product.name.substring(0, 40) + '...' 
												: product.name}
										</Link>
									</li>
								))}
								{products.length > 10 && (
									<li>
										<Link
											href='/products'
											className='text-gray-500 hover:text-gray-700 text-sm'>
											... et {products.length - 10} autres produits
										</Link>
									</li>
								)}
							</ul>
						</div>

						{/* Pages légales */}
						<div>
							<h2 className='text-xl font-semibold text-gray-900 mb-4'>Informations légales</h2>
							<ul className='space-y-2'>
								{legalPages.map((page) => (
									<li key={page.href}>
										<Link
											href={page.href}
											className='text-indigo-600 hover:text-indigo-800 transition-colors'>
											{page.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className='mt-12 pt-8 border-t border-gray-200'>
						<p className='text-gray-600 text-sm'>
							Ce plan du site vous aide à naviguer facilement sur Selectura. 
							Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas à{' '}
							<Link href='/contact' className='text-indigo-600 hover:text-indigo-800'>
								nous contacter
							</Link>.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}