// app/page.jsx
import React from 'react';
import Link from 'next/link';
import HeroCarousel from '@/components/HeroCarousel';
import FocusedProductShowcase from '@/components/FocusedProductShowcase';
import ImprovedCategoriesSection from '@/components/CategoriesSection';
import ImprovedTestimonials from '@/components/Testimonials';
import NewsletterSection from '@/components/NewsletterSection';

export default async function OptimizedHomePage() {
	// Ici, nous ferons une requête plus ciblée
	const { getProducts } = await import('@/lib/woo');

	// Récupérer seulement 4 produits phares
	const featuredProducts = await getProducts('?featured=true&per_page=4');

	// Récupérer des accessoires associés
	const accessories = await getProducts('?tag=accessory&per_page=4');

	// Récupérer les produits premium
	const premiumProducts = await getProducts('?tag=premium&per_page=4');

	// Récupérer les catégories
	const { getCategories } = await import('@/lib/woo');
	const categories = await getCategories();

	return (
		<main className='font-sans text-gray-800'>
			{/* Hero Carousel */}
			<HeroCarousel />

			{/* Produits Phares Focalisés */}
			<FocusedProductShowcase
				featuredProducts={featuredProducts}
				accessories={accessories}
				premiumOptions={premiumProducts}
			/>

			{/* Bannière informative */}
			<div className='bg-indigo-600 py-12'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-center'>
						<div className='text-center'>
							<div className='rounded-full bg-indigo-500 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4'>
								<svg
									className='h-8 w-8 text-white'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
									/>
								</svg>
							</div>
							<h3 className='text-xl font-bold text-white mb-2'>
								Qualité garantie
							</h3>
							<p className='text-indigo-100'>
								Tous nos produits sont testés rigoureusement
								avant expédition
							</p>
						</div>

						<div className='text-center'>
							<div className='rounded-full bg-indigo-500 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4'>
								<svg
									className='h-8 w-8 text-white'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3'
									/>
								</svg>
							</div>
							<h3 className='text-xl font-bold text-white mb-2'>
								Satisfait ou remboursé
							</h3>
							<p className='text-indigo-100'>
								30 jours pour changer d'avis, sans condition
							</p>
						</div>

						<div className='text-center'>
							<div className='rounded-full bg-indigo-500 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4'>
								<svg
									className='h-8 w-8 text-white'
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
							<h3 className='text-xl font-bold text-white mb-2'>
								Support premium
							</h3>
							<p className='text-indigo-100'>
								Une équipe dédiée pour vous accompagner
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Section mise en avant avec explication de notre approche */}
			<section className='py-20 bg-gray-50'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='lg:grid lg:grid-cols-2 lg:gap-16 items-center'>
						<div>
							<h2 className='text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
								Une approche différente
							</h2>
							<p className='mt-4 text-lg text-gray-500'>
								Nous avons fait le choix de vous proposer moins
								de produits, mais des produits exceptionnels.
								Notre catalogue restreint mais soigneusement
								sélectionné vous garantit :
							</p>
							<ul className='mt-8 space-y-4'>
								<li className='flex items-start'>
									<div className='flex-shrink-0'>
										<svg
											className='h-6 w-6 text-indigo-600'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth='2'
												d='M5 13l4 4L19 7'
											/>
										</svg>
									</div>
									<p className='ml-3 text-base text-gray-500'>
										<strong className='font-medium text-gray-900'>
											Expertise inégalée
										</strong>{' '}
										- Nous connaissons parfaitement chacun
										de nos produits
									</p>
								</li>
								<li className='flex items-start'>
									<div className='flex-shrink-0'>
										<svg
											className='h-6 w-6 text-indigo-600'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth='2'
												d='M5 13l4 4L19 7'
											/>
										</svg>
									</div>
									<p className='ml-3 text-base text-gray-500'>
										<strong className='font-medium text-gray-900'>
											Choix plus simple
										</strong>{' '}
										- Fini la paralysie de la décision face
										à trop d'options
									</p>
								</li>
								<li className='flex items-start'>
									<div className='flex-shrink-0'>
										<svg
											className='h-6 w-6 text-indigo-600'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth='2'
												d='M5 13l4 4L19 7'
											/>
										</svg>
									</div>
									<p className='ml-3 text-base text-gray-500'>
										<strong className='font-medium text-gray-900'>
											Qualité supérieure
										</strong>{' '}
										- Des produits rigoureusement testés et
										approuvés
									</p>
								</li>
								<li className='flex items-start'>
									<div className='flex-shrink-0'>
										<svg
											className='h-6 w-6 text-indigo-600'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth='2'
												d='M5 13l4 4L19 7'
											/>
										</svg>
									</div>
									<p className='ml-3 text-base text-gray-500'>
										<strong className='font-medium text-gray-900'>
											Accessoires parfaitement adaptés
										</strong>{' '}
										- Un écosystème complet et cohérent
									</p>
								</li>
							</ul>
							<div className='mt-8'>
								<Link
									href='/about-us'
									className='text-base font-medium text-indigo-600 hover:text-indigo-500'>
									En savoir plus sur notre philosophie{' '}
									<span aria-hidden='true'>&rarr;</span>
								</Link>
							</div>
						</div>
						<div className='mt-10 lg:mt-0'>
							<div className='aspect-w-3 aspect-h-2 rounded-lg overflow-hidden'>
								<img
									src='/img/quality-focus.jpg'
									alt='Sélection de qualité'
									className='w-full h-full object-cover'
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Categories Section */}
			<ImprovedCategoriesSection categories={categories} />

			{/* Testimonials */}
			<ImprovedTestimonials />

			{/* Banner achat facile */}
			<div className='bg-gradient-to-r from-indigo-600 to-purple-600 py-16'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-10'>
						<h2 className='text-3xl font-extrabold text-white sm:text-4xl'>
							Votre achat en toute simplicité
						</h2>
						<p className='mt-3 max-w-2xl mx-auto text-xl text-indigo-100 sm:mt-4'>
							Notre processus d'achat simplifié en trois étapes
						</p>
					</div>

					<div className='grid grid-cols-1 gap-10 sm:grid-cols-3'>
						<div className='text-center'>
							<div className='rounded-full bg-white/10 w-16 h-16 flex items-center justify-center mx-auto mb-4'>
								<span className='text-2xl font-bold text-white'>
									1
								</span>
							</div>
							<h3 className='text-lg font-medium text-white'>
								Choisissez votre produit
							</h3>
							<p className='mt-2 text-base text-indigo-100'>
								Sélectionnez parmi notre gamme ciblée de
								produits de qualité
							</p>
						</div>

						<div className='text-center'>
							<div className='rounded-full bg-white/10 w-16 h-16 flex items-center justify-center mx-auto mb-4'>
								<span className='text-2xl font-bold text-white'>
									2
								</span>
							</div>
							<h3 className='text-lg font-medium text-white'>
								Personnalisez
							</h3>
							<p className='mt-2 text-base text-indigo-100'>
								Ajoutez les accessoires complémentaires qui vous
								intéressent
							</p>
						</div>

						<div className='text-center'>
							<div className='rounded-full bg-white/10 w-16 h-16 flex items-center justify-center mx-auto mb-4'>
								<span className='text-2xl font-bold text-white'>
									3
								</span>
							</div>
							<h3 className='text-lg font-medium text-white'>
								Finaliser l'achat
							</h3>
							<p className='mt-2 text-base text-indigo-100'>
								Paiement sécurisé et livraison rapide à votre
								porte
							</p>
						</div>
					</div>

					<div className='mt-10 text-center'>
						<Link
							href='/products'
							className='inline-block bg-white text-indigo-600 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors'>
							Découvrir nos produits
						</Link>
					</div>
				</div>
			</div>

			{/* Newsletter signup */}
			<NewsletterSection />
		</main>
	);
}

// // app/page.tsx
// import Link from 'next/link';
// import ImprovedHeroCarousel from '@/components/HeroCarousel';
// import ImprovedAnimatedProductsGrid from '@/components/AnimatedProductsGrid';
// import ImprovedCategoriesSection from '@/components/CategoriesSection';
// import ImprovedTestimonials from '@/components/Testimonials';
// import NewsletterSection from '@/components/NewsletterSection';

// export default async function HomePage() {
// 	const { getProducts } = await import('@/lib/woo');
// 	const products = await getProducts('?per_page=6&featured=true');

// 	const { getCategories } = await import('@/lib/woo');
// 	const categories = await getCategories();

// 	return (
// 		<main className='font-sans text-gray-800'>
// 			{/* Hero Carousel */}
// 			<ImprovedHeroCarousel />

// 			{/* Featured Products */}
// 			<section className='py-24 bg-gradient-to-b from-white to-indigo-50'>
// 				<div className='max-w-7xl mx-auto px-6'>
// 					<div className='text-center mb-16'>
// 						<h2 className='text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 inline-block'>
// 							Nos sélections exclusives
// 						</h2>
// 						<div className='h-1 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mt-4 rounded-full'></div>
// 						<p className='mt-4 text-gray-600 max-w-2xl mx-auto'>
// 							Découvrez notre collection unique, soigneusement
// 							sélectionnée pour vous offrir le meilleur.
// 						</p>
// 					</div>
// 					<ImprovedAnimatedProductsGrid products={products} />
// 					<div className='text-center mt-16'>
// 						<Link
// 							href='/products'
// 							className='inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 md:py-4 md:text-lg md:px-10 transition-all duration-200 shadow-lg hover:shadow-xl'>
// 							Explorer toute la collection
// 							<svg
// 								xmlns='http://www.w3.org/2000/svg'
// 								className='h-5 w-5 ml-2'
// 								fill='none'
// 								viewBox='0 0 24 24'
// 								stroke='currentColor'>
// 								<path
// 									strokeLinecap='round'
// 									strokeLinejoin='round'
// 									strokeWidth={2}
// 									d='M14 5l7 7m0 0l-7 7m7-7H3'
// 								/>
// 							</svg>
// 						</Link>
// 					</div>
// 				</div>
// 			</section>

// 			{/* Categories Section */}
// 			<ImprovedCategoriesSection categories={categories} />

// 			{/* Testimonials */}
// 			<ImprovedTestimonials />

// 			{/* Newsletter signup */}
// 			<NewsletterSection />
// 		</main>
// 	);
// }
