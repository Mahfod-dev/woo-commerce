// app/page.tsx
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategoriesSection from '@/components/CategoriesSection';
import Testimonials from '@/components/Testimonials';

export default async function HomePage() {
	const { getProducts } = await import('@/lib/woo');
	const products = await getProducts('?per_page=6&featured=true');

	const { getCategories } = await import('@/lib/woo');
	const categories = await getCategories();

	return (
		<main className='font-sans text-gray-800'>
			<Hero />
			<FeaturedProducts products={products} />
			<CategoriesSection categories={categories} />
			<Testimonials />
		</main>
	);
}
