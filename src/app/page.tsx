import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import HeroCarousel from '@/components/HeroCarousel';
import FocusedProductShowcase from '@/components/FocusedProductShowcase';
import ImprovedCategoriesSection from '@/components/CategoriesSection';
import ImprovedTestimonials from '@/components/Testimonials';
import NewsletterSection from '@/components/NewsletterSection';
import { WooProduct } from '@/lib/woo';

// Configuration de revalidation - régénère la page toutes les heures
export const revalidate = 3600;

export const metadata: Metadata = {
	title: 'Selectura | Boutique Premium de Produits Sélectionnés avec Expertise',
	description: 'Découvrez notre sélection exclusive de produits de qualité supérieure. Une approche différente du commerce en ligne : moins de choix, mais l\'excellence garantie. Qualité testée, support premium.',
	keywords: [
		'boutique premium', 
		'produits qualité supérieure', 
		'sélection exclusive', 
		'commerce responsable',
		'expertise produits',
		'qualité garantie',
		'support client premium',
		'satisfaction garantie'
	],
	openGraph: {
		title: 'Selectura | Boutique Premium de Produits Sélectionnés',
		description: 'Une approche différente du commerce : moins de produits, mais des produits exceptionnels. Qualité garantie, expertise inégalée.',
		type: 'website',
		locale: 'fr_FR',
		url: 'https://selectura.co',
		siteName: 'Selectura',
		images: [
			{
				url: '/images/quality-focus.png',
				width: 1200,
				height: 630,
				alt: 'Selectura - Sélection de qualité et expertise produits',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Selectura | Boutique Premium de Produits Sélectionnés',
		description: 'Moins de choix, mais l\'excellence garantie. Découvrez notre approche unique du commerce en ligne.',
		images: ['/images/quality-focus.png'],
	},
	alternates: {
		canonical: 'https://selectura.co',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
};

// Interface pour le type Product utilisé dans FocusedProductShowcase
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
		stock_quantity: wooProduct.stock_quantity ?? undefined,
	};
}

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
	const allCategories = await getCategories();

	// Filtrer pour n'afficher que les catégories principales (pas les sous-catégories)
	const categories = allCategories.filter(
		(category) => !category.parent || category.parent === 0
	);

	console.log('Featured Products:', categories);

	// Convertir les produits WooProduct en Product
	const convertedFeaturedProducts = featuredProducts.map(convertToProduct);
	const convertedAccessories = accessories.map(convertToProduct);
	const convertedPremiumProducts = premiumProducts.map(convertToProduct);

	return (
		<main className='font-sans text-gray-800'>
			{/* H1 principal pour SEO - visuellement masqué mais accessible */}
			<h1 className='sr-only'>Selectura - Boutique Premium de Produits Sélectionnés avec Expertise</h1>

			{/* Hero Carousel */}
			<HeroCarousel />

			{/* Section Vidéo Promotionnelle */}
			<section className='py-16 bg-gradient-to-b from-white to-gray-50'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-12'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
							Découvrez Selectura
						</h2>
						<p className='text-xl text-gray-600 max-w-3xl mx-auto'>
							Votre destination pour des produits premium sélectionnés avec soin
						</p>
					</div>

					{/* Vidéo format portrait 9:16 hébergée sur Supabase Storage */}
					<div className='flex justify-center'>
						<div className='relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 w-full max-w-md' style={{ aspectRatio: '9/16' }}>
							<video
								className='absolute inset-0 w-full h-full object-cover'
								controls
								autoPlay
								muted
								loop
								playsInline
							>
								<source src='https://kkvwzwmtnwoewxanoyzg.supabase.co/storage/v1/object/public/videos/selectura.mp4' type='video/mp4' />
								Votre navigateur ne supporte pas la vidéo.
							</video>
						</div>
					</div>

					{/* Texte sous la vidéo */}
					<div className='mt-8 text-center'>
						<p className='text-gray-600'>
							Qualité premium • Sélection rigoureuse • Livraison Europe & USA
						</p>
					</div>
				</div>
			</section>

			{/* Section Catégories - Explorez par thème */}
			<ImprovedCategoriesSection categories={categories} />

			{/* Bannière informative provenance et délais */}
			<div className='bg-gradient-to-r from-blue-100 to-indigo-100 border-y border-indigo-200'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
					<div className='text-center mb-8'>
						<h2 className='text-2xl font-bold text-gray-900 mb-2'>
							Provenance et Qualité
						</h2>
						<p className='text-gray-600 max-w-3xl mx-auto'>
							Notre sélection rigoureuse privilégie la qualité avant tout
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						{/* Provenance Europe/USA */}
						<div className='bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow'>
							<div className='flex items-center justify-center mb-4'>
								<div className='rounded-full bg-blue-100 p-3 w-14 h-14 flex items-center justify-center'>
									<svg
										className='h-7 w-7 text-blue-600'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
										/>
									</svg>
								</div>
							</div>
							<h3 className='text-lg font-semibold text-gray-900 mb-2 text-center'>
								Origine Europe & USA
							</h3>
							<p className='text-gray-600 text-center text-sm'>
								Tous nos produits proviennent d'Europe ou des États-Unis,
								garantissant les meilleurs standards de qualité.
							</p>
						</div>

						{/* Délais de livraison */}
						<div className='bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow'>
							<div className='flex items-center justify-center mb-4'>
								<div className='rounded-full bg-indigo-100 p-3 w-14 h-14 flex items-center justify-center'>
									<svg
										className='h-7 w-7 text-indigo-600'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
										/>
									</svg>
								</div>
							</div>
							<h3 className='text-lg font-semibold text-gray-900 mb-2 text-center'>
								Livraison 3 à 14 jours
							</h3>
							<p className='text-gray-600 text-center text-sm'>
								Les délais varient selon la provenance du produit.
								Chaque fiche produit indique le délai estimé.
							</p>
						</div>

						{/* Qualité avant tout */}
						<div className='bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow'>
							<div className='flex items-center justify-center mb-4'>
								<div className='rounded-full bg-green-100 p-3 w-14 h-14 flex items-center justify-center'>
									<svg
										className='h-7 w-7 text-green-600'
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
							</div>
							<h3 className='text-lg font-semibold text-gray-900 mb-2 text-center'>
								Qualité Premium
							</h3>
							<p className='text-gray-600 text-center text-sm'>
								Notre choix se porte exclusivement sur la qualité,
								pas sur la rapidité. Chaque produit est sélectionné avec soin.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Produits Phares Focalisés */}
			<FocusedProductShowcase
				featuredProducts={convertedFeaturedProducts}
				accessories={convertedAccessories}
				premiumOptions={convertedPremiumProducts}
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
								14 jours pour changer d&apos;avis, sans
								condition
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
										à trop d&apos;options
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
									href='/about'
									className='text-base font-medium text-indigo-600 hover:text-indigo-500'>
									En savoir plus sur notre philosophie{' '}
									<span aria-hidden='true'>&rarr;</span>
								</Link>
							</div>
						</div>
						<div className='mt-10 lg:mt-0'>
							<div className='aspect-w-3 aspect-h-2 rounded-lg overflow-hidden'>
								<Image
									src='/images/quality-focus.png'
									alt='Sélection de qualité'
									className='w-full h-full object-cover'
									width={500}
									height={300}
									priority
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

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
							Notre processus d&apos;achat simplifié en trois
							étapes
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
								Finaliser l&apos;achat
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
