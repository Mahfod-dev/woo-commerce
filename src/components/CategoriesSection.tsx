'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CategoriesSection({ categories }) {
	const [activeCategory, setActiveCategory] = useState<number | null>(null);
	const scrollRef = useRef<HTMLDivElement>(null);
	const [isScrollable, setIsScrollable] = useState(false);

	useEffect(() => {
		const checkScrollable = () => {
			if (scrollRef.current) {
				setIsScrollable(
					scrollRef.current.scrollWidth >
						scrollRef.current.clientWidth
				);
			}
		};

		checkScrollable();
		window.addEventListener('resize', checkScrollable);

		return () => {
			window.removeEventListener('resize', checkScrollable);
		};
	}, [categories]);

	const scroll = (direction: 'left' | 'right') => {
		if (scrollRef.current) {
			const { current } = scrollRef;
			const scrollAmount = current.clientWidth * 0.8;

			if (direction === 'left') {
				current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
			} else {
				current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
			}
		}
	};

	const filteredCategories = categories?.filter(
		(cat) => cat.name !== 'Uncategorized'
	);

	return (
		<section className='py-24 bg-white'>
			<div className='max-w-7xl mx-auto px-6'>
				<div className='text-center mb-16'>
					<h2 className='text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 inline-block'>
						Explorez par thème
					</h2>
					<div className='h-1 w-24 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto mt-4 rounded-full'></div>
					<p className='mt-4 text-gray-600 max-w-2xl mx-auto'>
						Parcourez nos collections par catégories pour trouver
						exactement ce que vous cherchez.
					</p>
				</div>

				<div className='relative group'>
					{isScrollable && (
						<>
							<button
								onClick={() => scroll('left')}
								className='absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 group-hover:-translate-x-5 transition-all duration-300'
								aria-label='Défiler à gauche'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-6 w-6 text-indigo-600'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M15 19l-7-7 7-7'
									/>
								</svg>
							</button>

							<button
								onClick={() => scroll('right')}
								className='absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-x-5 transition-all duration-300'
								aria-label='Défiler à droite'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-6 w-6 text-indigo-600'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M9 5l7 7-7 7'
									/>
								</svg>
							</button>
						</>
					)}

					<div
						ref={scrollRef}
						className='flex space-x-6 overflow-x-auto scrollbar-hide pb-8 snap-x snap-mandatory'>
						{filteredCategories?.map((cat) => {
							const imageSrc =
								cat.image?.src ||
								'/images/default-category.jpg';

							return (
								<Link
									key={cat.id}
									href={`/categories/${cat.slug}`}
									className='snap-center block flex-shrink-0 focus:outline-none'
									onMouseEnter={() =>
										setActiveCategory(cat.id)
									}
									onMouseLeave={() =>
										setActiveCategory(null)
									}>
									<div
										className={`relative rounded-2xl overflow-hidden transition-all duration-500 
                      ${
							activeCategory === cat.id
								? 'w-80 h-96 shadow-2xl scale-105 z-10'
								: 'w-72 h-80 shadow-lg'
						}`}>
										<div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 z-10'></div>

										<Image
											src={imageSrc}
											alt={cat.name}
											className='object-cover w-full h-full transition-transform duration-700 ease-out hover:scale-110'
											width={400}
											height={600}
										/>

										<div className='absolute bottom-0 left-0 right-0 p-6 z-20 transition-all duration-500'>
											<h3 className='text-white text-2xl font-bold mb-2'>
												{cat.name}
											</h3>
											<div className='flex items-center text-white text-sm opacity-80'>
												<span>
													{cat.count} produits
												</span>
												<svg
													className='ml-2 w-5 h-5'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
													xmlns='http://www.w3.org/2000/svg'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth='2'
														d='M9 5l7 7-7 7'></path>
												</svg>
											</div>

											<div
												className={`mt-4 bg-white bg-opacity-20 backdrop-blur-sm py-2 px-4 rounded-full inline-flex items-center transition-all duration-500 
                          ${
								activeCategory === cat.id
									? 'opacity-100 translate-y-0'
									: 'opacity-0 translate-y-4'
							}`}>
												<span className='text-white text-sm font-medium'>
													Découvrir
												</span>
											</div>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				</div>

				<div className='mt-12 text-center'>
					<Link
						href='/categories'
						className='inline-flex items-center justify-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors'>
						Voir toutes les catégories
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
