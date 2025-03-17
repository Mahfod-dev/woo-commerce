// app/page.tsx
import Link from 'next/link';
import ImprovedHeroCarousel from '@/components/HeroCarousel';
import ImprovedAnimatedProductsGrid from '@/components/AnimatedProductsGrid';
import ImprovedCategoriesSection from '@/components/CategoriesSection';
import ImprovedTestimonials from '@/components/Testimonials';
import NewsletterSection from '@/components/NewsletterSection';

export default async function HomePage() {
	const { getProducts } = await import('@/lib/woo');
	const products = await getProducts('?per_page=6&featured=true');

	const { getCategories } = await import('@/lib/woo');
	const categories = await getCategories();

	return (
		<main className='font-sans text-gray-800'>
			{/* Hero Carousel */}
			<ImprovedHeroCarousel />

			{/* Featured Products */}
			<section className='py-24 bg-gradient-to-b from-white to-indigo-50'>
				<div className='max-w-7xl mx-auto px-6'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 inline-block'>
							Nos sélections exclusives
						</h2>
						<div className='h-1 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mt-4 rounded-full'></div>
						<p className='mt-4 text-gray-600 max-w-2xl mx-auto'>
							Découvrez notre collection unique, soigneusement
							sélectionnée pour vous offrir le meilleur.
						</p>
					</div>
					<ImprovedAnimatedProductsGrid products={products} />
					<div className='text-center mt-16'>
						<Link
							href='/products'
							className='inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 md:py-4 md:text-lg md:px-10 transition-all duration-200 shadow-lg hover:shadow-xl'>
							Explorer toute la collection
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5 ml-2'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M14 5l7 7m0 0l-7 7m7-7H3'
								/>
							</svg>
						</Link>
					</div>
				</div>
			</section>

			{/* Categories Section */}
			<ImprovedCategoriesSection categories={categories} />

			{/* Testimonials */}
			<ImprovedTestimonials />

			{/* Newsletter signup */}
			<NewsletterSection />
		</main>
	);
}
