'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { WooCategory } from '@/lib/woo';

interface CategoriesSectionProps {
	categories: WooCategory[];
}

export default function ImprovedCategoriesSection({
	categories,
}: CategoriesSectionProps) {
	const [activeCategory, setActiveCategory] = useState<number | null>(null);
	const [visibleCategories, setVisibleCategories] = useState<WooCategory[]>(
		[]
	);
	const scrollRef = useRef<HTMLDivElement>(null);
	const sectionRef = useRef<HTMLElement>(null);
	const [isScrollable, setIsScrollable] = useState(false);

	// Filtrer les catégories pour exclure "Non catégorisé"
	const filteredCategories = categories?.filter(
		(cat) => cat.name !== 'Uncategorized' && cat.name !== 'Non classé'
	);

	// Vérifier si le container est scrollable
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

		// Charger les catégories progressivement pour l'animation
		if (sectionRef.current) {
			const observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						setVisibleCategories(filteredCategories);
					}
				},
				{ threshold: 0.1 }
			);

			observer.observe(sectionRef.current);

			return () => {
				observer.disconnect();
				window.removeEventListener('resize', checkScrollable);
			};
		}

		return () => {
			window.removeEventListener('resize', checkScrollable);
		};
	}, [filteredCategories]);

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

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				delayChildren: 0.3,
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: 'spring',
				stiffness: 100,
				damping: 15,
			},
		},
	};

	return (
		<section
			ref={sectionRef}
			className='py-24 bg-white'>
			<div className='max-w-7xl mx-auto px-6'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-100px' }}
					transition={{ duration: 0.7 }}
					className='text-center mb-16'>
					<h2 className='text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 inline-block'>
						Explorez par thème
					</h2>
					<div className='h-1 w-24 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto mt-4 rounded-full'></div>
					<p className='mt-4 text-gray-600 max-w-2xl mx-auto'>
						Parcourez nos collections par catégories pour trouver
						exactement ce que vous cherchez.
					</p>
				</motion.div>

				<div className='relative group'>
					{isScrollable && (
						<>
							<motion.button
								initial={{ opacity: 0, x: 10 }}
								animate={{ opacity: 1, x: 0 }}
								whileHover={{ scale: 1.1 }}
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
							</motion.button>

							<motion.button
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								whileHover={{ scale: 1.1 }}
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
							</motion.button>
						</>
					)}

					<motion.div
						variants={containerVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true, margin: '-50px' }}
						ref={scrollRef}
						className='flex space-x-6 overflow-x-auto scrollbar-hide pb-8 snap-x snap-mandatory'>
						{visibleCategories.map((cat) => {
							const imageSrc =
								cat.image?.src ||
								'/images/default-category.jpg';

							return (
								<motion.div
									key={cat.id}
									variants={itemVariants}
									className='snap-center block flex-shrink-0 focus:outline-none'>
									<Link
										href={`/categories/${cat.slug}`}
										onMouseEnter={() =>
											setActiveCategory(cat.id)
										}
										onMouseLeave={() =>
											setActiveCategory(null)
										}
										className='block'>
										<motion.div
											whileHover={{
												scale: 1.05,
												transition: { duration: 0.3 },
											}}
											className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${
												activeCategory === cat.id
													? 'w-80 h-96 shadow-2xl z-10'
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

												<motion.div
													initial={{
														opacity: 0,
														y: 10,
													}}
													whileHover={{
														opacity: 1,
														y: 0,
													}}
													transition={{
														duration: 0.3,
													}}
													className={`mt-4 bg-white bg-opacity-20 backdrop-blur-sm py-2 px-4 rounded-full inline-flex items-center ${
														activeCategory ===
														cat.id
															? 'opacity-100 translate-y-0'
															: 'opacity-0 translate-y-4'
													}`}>
													<span className='text-white text-sm font-medium'>
														Découvrir
													</span>
												</motion.div>
											</div>
										</motion.div>
									</Link>
								</motion.div>
							);
						})}
					</motion.div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className='mt-12 text-center'>
					<Link
						href='/categories'
						className='inline-flex items-center justify-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors group'>
						Voir toutes les catégories
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform'
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
				</motion.div>
			</div>
		</section>
	);
}
