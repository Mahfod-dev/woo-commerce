'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/wooClient';
import { useCart } from '@/components/CartProvider';

// Interface pour les produits
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

interface FocusedProductShowcaseProps {
  featuredProducts: Product[];
  accessories: Product[];
  premiumOptions: Product[];
}

const FocusedProductShowcase = ({
	featuredProducts,
	accessories,
	premiumOptions,
}: FocusedProductShowcaseProps) => {
	const [activeTab, setActiveTab] = useState('featured');
	const { addToCart, isLoading } = useCart();
	const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				stiffness: 100,
				damping: 15,
			},
		},
	};

	// Handle adding product to cart
	const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
		e.preventDefault();
		setSelectedProduct(product.id);

		try {
			await addToCart(product.id, 1);
			setTimeout(() => setSelectedProduct(null), 1500);
		} catch (error) {
			console.error("Erreur lors de l'ajout au panier:", error);
			setSelectedProduct(null);
		}
	};

	return (
		<div className='py-16 bg-gradient-to-b from-gray-50 to-white'>
			<div className='max-w-7xl mx-auto px-6'>
				{/* Heading section */}
				<div className='text-center mb-12'>
					<h2 className='text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 inline-block'>
						Notre Collection Exclusive
					</h2>
					<div className='h-1 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mt-4 rounded-full'></div>
					<p className='mt-4 text-gray-600 max-w-2xl mx-auto'>
						Découvrez notre sélection soigneusement choisie pour
						vous offrir une expérience exceptionnelle.
					</p>
				</div>

				{/* Product grid based on active tab */}
				<motion.div
					variants={containerVariants}
					initial='hidden'
					animate='visible'
					className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					{activeTab === 'featured' &&
						featuredProducts.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								variants={itemVariants}
								handleAddToCart={handleAddToCart}
								isLoading={isLoading}
								isSelected={selectedProduct === product.id}
							/>
						))}

					{activeTab === 'accessories' &&
						accessories.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								variants={itemVariants}
								handleAddToCart={handleAddToCart}
								isLoading={isLoading}
								isSelected={selectedProduct === product.id}
							/>
						))}

					{activeTab === 'premium' &&
						premiumOptions.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								variants={itemVariants}
								handleAddToCart={handleAddToCart}
								isLoading={isLoading}
								isSelected={selectedProduct === product.id}
							/>
						))}
				</motion.div>

				{/* Notre approche de qualité */}
				<div className='mt-16'>
					<h3 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
						Notre Engagement Qualité
					</h3>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						<motion.div
							whileHover={{ y: -5 }}
							className='bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200'>
							<div className='p-6'>
								<div className='flex justify-between items-start'>
									<div>
										<span className='inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2'>
											Notre approche
										</span>
										<h4 className='text-xl font-bold text-gray-900 mb-2'>
											Sélection rigoureuse
										</h4>
										<p className='text-gray-600 mb-4'>
											Nous ne proposons que des produits
											soigneusement sélectionnés pour leur
											qualité exceptionnelle et leur
											durabilité.
										</p>
									</div>
									<svg
										className='h-10 w-10 text-indigo-600 flex-shrink-0'
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

								<div className='border-t border-gray-200 my-4 pt-4'>
									<ul className='space-y-2'>
										<li className='flex items-center'>
											<svg
												className='w-4 h-4 text-indigo-500 mr-2'
												fill='currentColor'
												viewBox='0 0 20 20'>
												<path
													fillRule='evenodd'
													d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
													clipRule='evenodd'
												/>
											</svg>
											<span className='text-gray-700'>
												Tests rigoureux d'efficacité
											</span>
										</li>
										<li className='flex items-center'>
											<svg
												className='w-4 h-4 text-indigo-500 mr-2'
												fill='currentColor'
												viewBox='0 0 20 20'>
												<path
													fillRule='evenodd'
													d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
													clipRule='evenodd'
												/>
											</svg>
											<span className='text-gray-700'>
												Matériaux de haute qualité
											</span>
										</li>
										<li className='flex items-center'>
											<svg
												className='w-4 h-4 text-indigo-500 mr-2'
												fill='currentColor'
												viewBox='0 0 20 20'>
												<path
													fillRule='evenodd'
													d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
													clipRule='evenodd'
												/>
											</svg>
											<span className='text-gray-700'>
												Design ergonomique et
												fonctionnel
											</span>
										</li>
									</ul>
								</div>

								<Link
									href='/about-quality'
									className='w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors block text-center'>
									Notre philosophie de qualité
								</Link>
							</div>
						</motion.div>

						<motion.div
							whileHover={{ y: -5 }}
							className='bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200'>
							<div className='p-6'>
								<div className='flex justify-between items-start'>
									<div>
										<span className='inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2'>
											Accessoires exclusifs
										</span>
										<h4 className='text-xl font-bold text-gray-900 mb-2'>
											Expérience enrichie
										</h4>
										<p className='text-gray-600 mb-4'>
											Des accessoires parfaitement
											compatibles pour optimiser et
											personnaliser l'utilisation de nos
											produits.
										</p>
									</div>
									<svg
										className='h-10 w-10 text-purple-600 flex-shrink-0'
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

								<div className='border-t border-gray-200 my-4 pt-4'>
									<ul className='space-y-2'>
										<li className='flex items-center'>
											<svg
												className='w-4 h-4 text-indigo-500 mr-2'
												fill='currentColor'
												viewBox='0 0 20 20'>
												<path
													fillRule='evenodd'
													d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
													clipRule='evenodd'
												/>
											</svg>
											<span className='text-gray-700'>
												Conçus spécifiquement pour nos
												produits
											</span>
										</li>
										<li className='flex items-center'>
											<svg
												className='w-4 h-4 text-indigo-500 mr-2'
												fill='currentColor'
												viewBox='0 0 20 20'>
												<path
													fillRule='evenodd'
													d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
													clipRule='evenodd'
												/>
											</svg>
											<span className='text-gray-700'>
												Amélioration des fonctionnalités
											</span>
										</li>
										<li className='flex items-center'>
											<svg
												className='w-4 h-4 text-indigo-500 mr-2'
												fill='currentColor'
												viewBox='0 0 20 20'>
												<path
													fillRule='evenodd'
													d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
													clipRule='evenodd'
												/>
											</svg>
											<span className='text-gray-700'>
												Possibilité de personnalisation
											</span>
										</li>
										<li className='flex items-center'>
											<svg
												className='w-4 h-4 text-indigo-500 mr-2'
												fill='currentColor'
												viewBox='0 0 20 20'>
												<path
													fillRule='evenodd'
													d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
													clipRule='evenodd'
												/>
											</svg>
											<span className='text-gray-700'>
												Même niveau de qualité premium
											</span>
										</li>
									</ul>
								</div>

								<Link
									href='/accessories'
									className='w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-colors shadow-md block text-center'>
									Découvrir nos accessoires
								</Link>
							</div>
						</motion.div>
					</div>
				</div>

				{/* Guide d'achat modifié */}
				<div className='mt-16 bg-indigo-50 rounded-2xl p-8'>
					<div className='text-center mb-8'>
						<h3 className='text-2xl font-bold text-gray-900'>
							Notre approche sélective
						</h3>
						<p className='text-gray-600 mt-2'>
							Pourquoi nous proposons moins de produits, mais des
							produits exceptionnels
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<div className='bg-white p-6 rounded-xl shadow-sm'>
							<div className='bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-full mb-4'>
								<svg
									className='w-6 h-6 text-indigo-600'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'></path>
								</svg>
							</div>
							<h4 className='text-lg font-semibold mb-2'>
								Sélection Rigoureuse
							</h4>
							<p className='text-gray-600'>
								Contrairement aux magasins traditionnels, nous
								ne proposons que des produits soigneusement
								sélectionnés qui ont passé nos tests de qualité
								exigeants.
							</p>
						</div>

						<div className='bg-white p-6 rounded-xl shadow-sm'>
							<div className='bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-full mb-4'>
								<svg
									className='w-6 h-6 text-indigo-600'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'></path>
								</svg>
							</div>
							<h4 className='text-lg font-semibold mb-2'>
								Expertise Produit
							</h4>
							<p className='text-gray-600'>
								Nos experts connaissent parfaitement chaque
								produit que nous vendons. Cela nous permet de
								vous offrir des conseils personnalisés et un
								support technique de qualité.
							</p>
						</div>

						<div className='bg-white p-6 rounded-xl shadow-sm'>
							<div className='bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-full mb-4'>
								<svg
									className='w-6 h-6 text-indigo-600'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										d='M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11'></path>
								</svg>
							</div>
							<h4 className='text-lg font-semibold mb-2'>
								Personnalisation
							</h4>
							<p className='text-gray-600'>
								Nos accessoires soigneusement choisis vous
								permettent d'adapter parfaitement nos produits à
								vos besoins spécifiques plutôt que de chercher
								une solution universelle.
							</p>
						</div>
					</div>

					<div className='mt-8 text-center'>
						<Link
							href='/our-philosophy'
							className='inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium'>
							En savoir plus sur notre philosophie
							<svg
								className='ml-2 w-4 h-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M14 5l7 7m0 0l-7 7m7-7H3'></path>
							</svg>
						</Link>
					</div>
				</div>

				{/* Call to action */}
				<div className='mt-12 text-center'>
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
		</div>
	);
};

// Interface pour le composant ProductCard
interface ProductCardProps {
  product: Product;
  variants: any;
  handleAddToCart: (e: React.MouseEvent, product: Product) => void;
  isLoading: boolean;
  isSelected: boolean;
}

// ProductCard component
const ProductCard = ({
	product,
	variants,
	handleAddToCart,
	isLoading,
	isSelected,
}: ProductCardProps) => {
	return (
		<motion.div
			variants={variants}
			whileHover={{ y: -8 }}
			className='group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300'>
			<Link
				href={`/products/${product.slug}`}
				className='block'>
				<div className='relative aspect-square overflow-hidden bg-gray-100'>
					{product.images && product.images.length > 0 ? (
						<Image
							src={product.images[0].src}
							alt={product.name}
							fill
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
							className='object-cover transition-transform duration-700 group-hover:scale-110'
						/>
					) : (
						<div className='w-full h-full flex items-center justify-center'>
							<svg
								className='h-16 w-16 text-gray-300'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
								/>
							</svg>
						</div>
					)}

					{/* Featured badge */}
					{product.featured && (
						<div className='absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full'>
							Populaire
						</div>
					)}

					{/* Sale badge */}
					{product.on_sale && (
						<div className='absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full'>
							Promo
						</div>
					)}
				</div>

				<div className='p-4'>
					{product.categories && product.categories.length > 0 && (
						<div className='text-xs text-indigo-600 font-medium uppercase tracking-wider mb-1'>
							{product.categories[0].name}
						</div>
					)}

					<h3 className='text-lg font-medium text-gray-900 mb-2 line-clamp-2 h-14'>
						{product.name}
					</h3>

					<div className='flex items-baseline mb-3'>
						<span className='text-lg font-bold text-indigo-600'>
							{formatPrice(product.price)}
						</span>

						{product.on_sale && product.regular_price && (
							<span className='ml-2 text-sm text-gray-500 line-through'>
								{formatPrice(product.regular_price)}
							</span>
						)}
					</div>
				</div>
			</Link>

			<div className='px-4 pb-4'>
				<button
					onClick={(e) => handleAddToCart(e, product)}
					disabled={isLoading || isSelected}
					className='w-full py-2 px-4 flex items-center justify-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:text-gray-500'>
					{isLoading && isSelected ? (
						<>
							<svg
								className='animate-spin h-5 w-5 mr-2'
								viewBox='0 0 24 24'>
								<circle
									className='opacity-25'
									cx='12'
									cy='12'
									r='10'
									stroke='currentColor'
									strokeWidth='4'
									fill='none'
								/>
								<path
									className='opacity-75'
									fill='currentColor'
									d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
								/>
							</svg>
							Ajout en cours...
						</>
					) : (
						<>
							<svg
								className='h-5 w-5 mr-2'
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
							Ajouter au panier
						</>
					)}
				</button>
			</div>
		</motion.div>
	);
};

export default FocusedProductShowcase;
