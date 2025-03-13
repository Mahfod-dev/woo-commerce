'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Typage pour le produit
interface Product {
	id: number;
	name: string;
	price: string;
	sale_price?: string;
	regular_price?: string;
	images: { src: string; alt: string }[];
	categories: { id: number; name: string }[];
	slug: string;
}

// Cette version client doit recevoir les produits comme props
export default function FeaturedProducts({
	products,
}: {
	products: Product[];
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [, setIsHovering] = useState(false);

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: i * 0.1,
				duration: 0.5,
			},
		}),
		hover: {
			y: -10,
			boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
		},
	};

	return (
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

				<div
					ref={containerRef}
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}>
					{products?.map((product, index) => (
						<motion.div
							key={product.id}
							className='bg-white rounded-2xl overflow-hidden'
							custom={index}
							initial='hidden'
							whileInView='visible'
							whileHover='hover'
							viewport={{ once: true, margin: '-50px' }}
							variants={cardVariants}>
							<Link href={`/products/${product.slug}`}>
								<div className='relative h-64 overflow-hidden group'>
									<Image
										src={
											product.images[0]?.src ||
											'/placeholder.jpg'
										}
										alt={
											product.images[0]?.alt ||
											product.name
										}
										className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
										width={500}
										height={500}
									/>
									{product.sale_price && (
										<div className='absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full'>
											Promo
										</div>
									)}
								</div>
								<div className='p-6'>
									{product.categories &&
										product.categories.length > 0 && (
											<div className='text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-2'>
												{product.categories[0].name}
											</div>
										)}
									<h3 className='text-xl font-bold text-gray-900 mb-2 line-clamp-2 h-14'>
										{product.name}
									</h3>
									<div className='flex justify-between items-center'>
										<div className='flex items-baseline'>
											<span className='text-2xl font-bold text-indigo-600'>
												{product.sale_price ||
													product.price}
												€
											</span>
											{product.sale_price && (
												<span className='ml-2 text-sm text-gray-500 line-through'>
													{product.regular_price}€
												</span>
											)}
										</div>
										<motion.button
											className='w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors'
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.95 }}>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												className='h-5 w-5'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
												/>
											</svg>
										</motion.button>
									</div>
								</div>
							</Link>
						</motion.div>
					))}
				</div>

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
	);
}

// Version server component pour obtenir les produits
export async function FeaturedProductsServer() {
	const { getProducts } = await import('@/lib/woo');
	const products = await getProducts('?per_page=6&featured=true');

	return <FeaturedProducts products={products} />;
}
