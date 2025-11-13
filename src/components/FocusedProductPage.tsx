'use client';

import React, { useState, useEffect, useRef } from 'react';
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

interface FocusedProductsPageProps {
  products: Product[];
  accessories: Product[];
}

const FocusedProductsPage = ({ products, accessories }: FocusedProductsPageProps) => {
	const [selectedProduct, setSelectedProduct] = useState(products[0]);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const [selectedAccessories, setSelectedAccessories] = useState<number[]>([]);
	const [quantity, setQuantity] = useState(1);
	const [showNotification, setShowNotification] = useState(false);
	const { addToCart } = useCart();
	const productRef = useRef<HTMLDivElement>(null);

	// Calculer le prix total (produit + accessoires)
	const calculateTotalPrice = () => {
		let total = parseFloat(selectedProduct.price) * quantity;

		selectedAccessories.forEach((accessoryId) => {
			const accessory = accessories.find((acc: Product) => acc.id === accessoryId);
			if (accessory) {
				total += parseFloat(accessory.price);
			}
		});

		return total;
	};

	// Filtrer les accessoires compatibles avec le produit sélectionné
	const compatibleAccessories = accessories.filter((accessory: Product) =>
		accessory.categories.some((cat) =>
			selectedProduct.categories.some((prodCat) => prodCat.id === cat.id)
		)
	);

	// Gérer la sélection d'accessoires
	const toggleAccessory = (accessoryId: number) => {
		setSelectedAccessories((prev: number[]) => {
			if (prev.includes(accessoryId)) {
				return prev.filter((id) => id !== accessoryId);
			} else {
				return [...prev, accessoryId];
			}
		});
	};

	// Gérer l'ajout au panier
	const handleAddToCart = async () => {
		setIsAddingToCart(true);

		try {
			// Ajouter le produit principal
			await addToCart(selectedProduct.id, quantity);

			// Ajouter les accessoires sélectionnés
			for (const accessoryId of selectedAccessories) {
				await addToCart(accessoryId, 1);
			}

			setShowNotification(true);
			setTimeout(() => setShowNotification(false), 3000);
		} catch (error) {
			console.error("Erreur lors de l'ajout au panier:", error);
		} finally {
			setIsAddingToCart(false);
		}
	};

	// Scroll vers le produit phare quand on sélectionne un nouveau produit
	useEffect(() => {
		if (productRef.current && typeof window !== 'undefined') {
			// Petit délai pour s'assurer que le contenu est rendu
			setTimeout(() => {
				productRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
			}, 100);
		}
	}, [selectedProduct]);

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

	return (
		<div className='bg-gray-50 min-h-screen pb-24 font-sans'>
			{/* En-tête explicatif */}
			<div className='bg-gradient-to-r from-indigo-700 to-purple-700 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative'>
					<div className='relative z-10 text-center max-w-3xl mx-auto'>
						<h1 className='text-3xl md:text-5xl font-bold mb-4'>
							Notre Collection Soigneusement Sélectionnée
						</h1>
						<p className='text-xl text-indigo-100'>
							Nous ne proposons que quelques produits, mais des
							produits exceptionnels. Chacun a été rigoureusement
							évalué pour vous offrir le meilleur rapport
							qualité/prix.
						</p>
					</div>
					{/* Éléments décoratifs */}
					<div className='absolute inset-0 overflow-hidden opacity-20'>
						<div className='absolute -top-20 -left-20 w-64 h-64 rounded-full bg-indigo-500' />
						<div className='absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-500' />
					</div>
				</div>
			</div>

			{/* Détails du produit phare */}
			<div
				ref={productRef}
				className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16'>
				<div className='bg-white rounded-xl shadow-lg overflow-hidden'>
					<div className='p-6 md:p-10'>
						<h2 className='text-2xl font-bold text-gray-900 mb-8 text-center'>
							Notre Produit Phare
						</h2>
						<div className='flex flex-col lg:flex-row gap-10'>
							{/* Partie gauche - Images */}
							<div className='w-full lg:w-1/2'>
								<div className='aspect-square bg-gray-50 rounded-lg overflow-hidden relative mb-4'>
									{selectedProduct.images &&
									selectedProduct.images.length > 0 ? (
										<Image
											src={selectedProduct.images[0].src}
											alt={selectedProduct.name}
											fill
											sizes='(max-width: 768px) 100vw, 50vw'
											className='object-cover'
											priority
										/>
									) : (
										<div className='w-full h-full flex items-center justify-center bg-gray-100'>
											<svg
												className='h-20 w-20 text-gray-300'
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
								</div>

								{/* Miniatures */}
								{selectedProduct.images &&
									selectedProduct.images.length > 1 && (
										<div className='flex space-x-2 overflow-x-auto'>
											{selectedProduct.images.map(
												(image, index) => (
													<div
														key={index}
														className='relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border border-gray-200'>
														<Image
															src={image.src}
															alt={`${
																selectedProduct.name
															} - image ${
																index + 1
															}`}
															fill
															sizes='80px'
															className='object-cover'
														/>
													</div>
												)
											)}
										</div>
									)}

								{/* Description courte */}
								<div
									className='prose prose-indigo max-w-none mt-8'
									dangerouslySetInnerHTML={{
										__html: selectedProduct.short_description,
									}}
								/>
							</div>

							{/* Partie droite - Informations et ajout au panier */}
							<div className='w-full lg:w-1/2'>
								<div className='flex flex-wrap gap-2 mb-3'>
									{selectedProduct.featured && (
										<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800'>
											Populaire
										</span>
									)}
									{selectedProduct.on_sale && (
										<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
											Promotion
										</span>
									)}
									{selectedProduct.stock_status ===
									'instock' ? (
										<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
											En stock
										</span>
									) : (
										<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
											{selectedProduct.stock_status ===
											'onbackorder'
												? 'Sur commande'
												: 'Épuisé'}
										</span>
									)}
								</div>

								<h1 className='text-3xl font-bold text-gray-900 mb-2'>
									{selectedProduct.name}
								</h1>

								{/* Prix */}
								<div className='flex items-end mb-6'>
									<p className='text-3xl font-bold text-indigo-600'>
										{formatPrice(selectedProduct.price)}
									</p>
									{selectedProduct.on_sale &&
										selectedProduct.regular_price && (
											<p className='ml-2 text-lg text-gray-500 line-through'>
												{formatPrice(
													selectedProduct.regular_price
												)}
											</p>
										)}
								</div>

								{/* Quantité */}
								<div className='mb-6'>
									<label
										htmlFor='quantity'
										className='block text-sm font-medium text-gray-700 mb-2'>
										Quantité
									</label>
									<div className='flex'>
										<button
											onClick={() =>
												setQuantity(
													Math.max(1, quantity - 1)
												)
											}
											className='bg-gray-100 text-gray-600 hover:text-gray-700 hover:bg-gray-200 w-10 h-10 rounded-l-lg flex items-center justify-center'>
											<svg
												className='h-4 w-4'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M20 12H4'
												/>
											</svg>
										</button>
										<input
											type='number'
											id='quantity'
											name='quantity'
											min='1'
											value={quantity}
											onChange={(e) =>
												setQuantity(
													Math.max(
														1,
														parseInt(
															e.target.value
														) || 1
													)
												)
											}
											className='text-center w-16 h-10 border-gray-200 border-y focus:ring-indigo-500 focus:border-indigo-500'
										/>
										<button
											onClick={() =>
												setQuantity(quantity + 1)
											}
											className='bg-gray-100 text-gray-600 hover:text-gray-700 hover:bg-gray-200 w-10 h-10 rounded-r-lg flex items-center justify-center'>
											<svg
												className='h-4 w-4'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M12 4v16m8-8H4'
												/>
											</svg>
										</button>
									</div>
								</div>

								{/* Accessoires compatibles */}
								{compatibleAccessories.length > 0 && (
									<div className='mb-6'>
										<h3 className='text-sm font-medium text-gray-900 mb-3'>
											Accessoires compatibles
										</h3>
										<div className='space-y-3'>
											{compatibleAccessories.map(
												(accessory) => (
													<div
														key={accessory.id}
														className={`flex items-center p-3 rounded-lg border ${
															selectedAccessories.includes(
																accessory.id
															)
																? 'border-indigo-500 bg-indigo-50'
																: 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
														} transition-colors cursor-pointer`}
														onClick={() =>
															toggleAccessory(
																accessory.id
															)
														}>
														<input
															type='checkbox'
															checked={selectedAccessories.includes(
																accessory.id
															)}
															onChange={() =>
																toggleAccessory(
																	accessory.id
																)
															}
															className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
														/>
														<div className='ml-3 flex-grow'>
															<p className='text-sm font-medium text-gray-900'>
																{accessory.name}
															</p>
															<p className='text-sm text-gray-500'>
																{accessory.short_description.replace(
																	/<[^>]*>/g,
																	''
																)}
															</p>
														</div>
														<span className='text-sm font-bold text-indigo-600'>
															+
															{formatPrice(
																accessory.price
															)}
														</span>
													</div>
												)
											)}
										</div>
									</div>
								)}

								{/* Récapitulatif */}
								<div className='mb-6 p-4 bg-gray-50 rounded-lg'>
									<h3 className='text-sm font-medium text-gray-900 mb-3'>
										Récapitulatif
									</h3>
									<ul className='space-y-2 mb-3'>
										<li className='flex justify-between'>
											<span className='text-gray-600'>
												{selectedProduct.name} x{' '}
												{quantity}
											</span>
											<span className='font-medium'>
												{formatPrice(
													parseFloat(
														selectedProduct.price
													) * quantity
												)}
											</span>
										</li>
										{selectedAccessories.map(
											(accessoryId) => {
												const accessory =
													accessories.find(
														(acc) =>
															acc.id ===
															accessoryId
													);
												return accessory ? (
													<li
														key={accessory.id}
														className='flex justify-between'>
														<span className='text-gray-600'>
															{accessory.name}
														</span>
														<span className='font-medium'>
															{formatPrice(
																accessory.price
															)}
														</span>
													</li>
												) : null;
											}
										)}
									</ul>
									<div className='flex justify-between border-t pt-3 border-gray-200'>
										<span className='font-bold text-gray-900'>
											Total
										</span>
										<span className='font-bold text-indigo-600'>
											{formatPrice(calculateTotalPrice())}
										</span>
									</div>
								</div>

								{/* Boutons d'action */}
								<div className='flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4'>
									<button
										onClick={handleAddToCart}
										disabled={
											isAddingToCart ||
											selectedProduct.stock_status !==
												'instock'
										}
										className={`flex-1 py-3 px-4 flex items-center justify-center rounded-lg text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
											isAddingToCart
												? 'animate-pulse'
												: ''
										}`}>
										{isAddingToCart ? (
											<>
												<svg
													className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
													fill='none'
													viewBox='0 0 24 24'>
													<circle
														className='opacity-25'
														cx='12'
														cy='12'
														r='10'
														stroke='currentColor'
														strokeWidth='4'></circle>
													<path
														className='opacity-75'
														fill='currentColor'
														d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
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

									<Link
										href={`/products/${selectedProduct.slug}`}
										className='flex-1 py-3 px-4 flex items-center justify-center rounded-lg text-base font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'>
										<svg
											className='h-5 w-5 mr-2'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
											/>
										</svg>
										Plus de détails
									</Link>
								</div>

								{/* Avantages */}
								<div className='mt-8 grid grid-cols-2 gap-4'>
									<div className='flex items-start'>
										<svg
											className='h-5 w-5 text-green-500 mt-1 mr-2'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M5 13l4 4L19 7'
											/>
										</svg>
										<span className='text-sm text-gray-600'>
											Livraison gratuite dès 50€
										</span>
									</div>
									<div className='flex items-start'>
										<svg
											className='h-5 w-5 text-green-500 mt-1 mr-2'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M5 13l4 4L19 7'
											/>
										</svg>
										<span className='text-sm text-gray-600'>
											Satisfait ou remboursé sous 14 jours
										</span>
									</div>
									<div className='flex items-start'>
										<svg
											className='h-5 w-5 text-green-500 mt-1 mr-2'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M5 13l4 4L19 7'
											/>
										</svg>
										<span className='text-sm text-gray-600'>
											Garantie 2 ans
										</span>
									</div>
									<div className='flex items-start'>
										<svg
											className='h-5 w-5 text-green-500 mt-1 mr-2'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M5 13l4 4L19 7'
											/>
										</svg>
										<span className='text-sm text-gray-600'>
											Support client 7j/7
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Autres produits disponibles */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16'>
				<div className='bg-white rounded-xl shadow-sm p-8 md:p-12 mb-16'>
					<div className='md:flex items-start gap-12'>
						<div className='md:w-1/2 mb-8 md:mb-0'>
							<h2 className='text-2xl font-bold text-gray-900 mb-4'>
								Notre Approche Différente
							</h2>
							<p className='text-gray-600 mb-6'>
								Plutôt que de vous proposer des dizaines de
								produits similaires qui rendent votre choix
								difficile, nous avons sélectionné uniquement les
								meilleurs produits dans chaque catégorie.
							</p>
							<ul className='space-y-3'>
								{[
									'Expertise approfondie sur chaque produit que nous vendons',
									'Qualité supérieure garantie par des tests rigoureux',
									'Accessoires parfaitement adaptés et complémentaires',
									'Support client personnalisé pour chaque achat',
								].map((point, index) => (
									<li
										key={index}
										className='flex'>
										<svg
											className='h-6 w-6 text-indigo-600 flex-shrink-0 mr-2'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M5 13l4 4L19 7'
											/>
										</svg>
										<span className='text-gray-600'>
											{point}
										</span>
									</li>
								))}
							</ul>
						</div>
						<div className='md:w-1/2'>
							<div className='bg-indigo-50 rounded-lg p-6 border border-indigo-100'>
								<h3 className='text-lg font-semibold text-indigo-900 mb-3'>
									Comment choisir ?
								</h3>
								<p className='text-gray-600 mb-4'>
									Nos produits sont regroupés par catégories
									selon vos besoins. Chaque produit est
									accompagné de recommandations d'accessoires
									qui complètent parfaitement votre
									expérience.
								</p>
								<p className='text-gray-600'>
									<strong>Notre conseil :</strong>{' '}
									Concentrez-vous sur le produit qui répond le
									mieux à votre besoin principal, puis ajoutez
									les accessoires qui amélioreront votre
									expérience.
								</p>
							</div>
						</div>
					</div>
				</div>

				<h2 className='text-2xl font-bold text-gray-900 mb-6'>
					Découvrez Nos Autres Produits Sélectionnés
				</h2>

				<motion.div
					variants={containerVariants}
					initial='hidden'
					animate='visible'
					className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16'>
					{products.map((product) => (
						<motion.div
							key={product.id}
							variants={itemVariants}
							className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-2 ${
								selectedProduct.id === product.id
									? 'border-indigo-500'
									: 'border-transparent'
							}`}
							onClick={() => setSelectedProduct(product)}>
							<div className='relative aspect-square overflow-hidden'>
								{product.images && product.images.length > 0 ? (
									<Image
										src={product.images[0].src}
										alt={product.name}
										fill
										sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
										className='object-cover transition-transform duration-500 hover:scale-105'
									/>
								) : (
									<div className='w-full h-full flex items-center justify-center bg-gray-100'>
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

								{/* Badges */}
								{product.featured && (
									<div className='absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full'>
										Populaire
									</div>
								)}
								{product.on_sale && (
									<div className='absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full'>
										Promo
									</div>
								)}
							</div>

							<div className='p-4'>
								{product.categories &&
									product.categories.length > 0 && (
										<div className='text-xs text-indigo-600 font-medium uppercase tracking-wider mb-1'>
											{product.categories[0].name}
										</div>
									)}

								<h3 className='text-lg font-medium text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]'>
									{product.name}
								</h3>

								<div className='flex items-baseline mb-3'>
									<span className='text-lg font-bold text-indigo-600'>
										{formatPrice(product.price)}
									</span>

									{product.on_sale &&
										product.regular_price && (
											<span className='ml-2 text-sm text-gray-500 line-through'>
												{formatPrice(
													product.regular_price
												)}
											</span>
										)}
								</div>

								<div className='flex justify-between items-center mt-4'>
									<Link
										href={`/products/${product.slug}`}
										className='text-indigo-600 text-sm font-medium hover:text-indigo-800'>
										Détails complets
									</Link>
									<button
										onClick={(e) => {
											e.stopPropagation();
											setSelectedProduct(product);
										}}
										className={`px-3 py-1 rounded text-sm font-medium ${
											selectedProduct.id === product.id
												? 'bg-indigo-100 text-indigo-700'
												: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
										}`}>
										{selectedProduct.id === product.id
											? 'Sélectionné'
											: 'Sélectionner'}
									</button>
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>

			{/* Pourquoi choisir ce produit */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16'>
				<h2 className='text-2xl font-bold text-gray-900 mb-8'>
					Pourquoi choisir nos produits ?
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					<div className='bg-white rounded-lg p-6 shadow-sm'>
						<div className='w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4'>
							<svg
								className='h-6 w-6 text-indigo-600'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M5 13l4 4L19 7'
								/>
							</svg>
						</div>
						<h3 className='text-lg font-medium text-gray-900 mb-2'>
							Qualité supérieure
						</h3>
						<p className='text-gray-600'>
							Nos produits sont soigneusement sélectionnés et
							testés pour vous offrir la meilleure expérience
							possible.
						</p>
					</div>
					<div className='bg-white rounded-lg p-6 shadow-sm'>
						<div className='w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4'>
							<svg
								className='h-6 w-6 text-indigo-600'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
								/>
							</svg>
						</div>
						<h3 className='text-lg font-medium text-gray-900 mb-2'>
							Support personnalisé
						</h3>
						<p className='text-gray-600'>
							Notre équipe d'experts est là pour vous accompagner
							et répondre à toutes vos questions.
						</p>
					</div>
					<div className='bg-white rounded-lg p-6 shadow-sm'>
						<div className='w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4'>
							<svg
								className='h-6 w-6 text-indigo-600'
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
						<h3 className='text-lg font-medium text-gray-900 mb-2'>
							Longue durée de vie
						</h3>
						<p className='text-gray-600'>
							Conçus pour durer, nos produits vous accompagneront
							pendant de nombreuses années.
						</p>
					</div>
				</div>
			</div>

			{/* FAQ */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16'>
				<h2 className='text-2xl font-bold text-gray-900 mb-6'>
					Questions fréquentes
				</h2>
				<div className='space-y-6 bg-white rounded-xl shadow-sm p-8'>
					<div className='border-b border-gray-200 pb-6'>
						<h3 className='text-lg font-medium text-gray-900 mb-2'>
							Comment choisir entre nos différents modèles ?
						</h3>
						<p className='text-gray-600'>
							Nos produits sont conçus pour des besoins
							spécifiques. Consultez les descriptions détaillées
							ou contactez notre équipe pour obtenir des conseils
							personnalisés selon votre utilisation.
						</p>
					</div>
					<div className='border-b border-gray-200 pb-6'>
						<h3 className='text-lg font-medium text-gray-900 mb-2'>
							Les accessoires sont-ils nécessaires ?
						</h3>
						<p className='text-gray-600'>
							Nos produits sont pleinement fonctionnels sans
							accessoires, mais ces derniers permettent
							d'améliorer l'expérience ou d'ajouter des
							fonctionnalités spécifiques pour répondre à des
							besoins particuliers.
						</p>
					</div>
					<div className='border-b border-gray-200 pb-6'>
						<h3 className='text-lg font-medium text-gray-900 mb-2'>
							Quelle est la garantie offerte ?
						</h3>
						<p className='text-gray-600'>
							Tous nos produits bénéficient d'une garantie de 2
							ans couvrant tout défaut de fabrication. Nous
							proposons également une extension de garantie de 1
							an supplémentaire en option.
						</p>
					</div>

					<div>
						<Link
							href='/faq'
							className='text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center'>
							Voir toutes les questions fréquentes
							<svg
								className='ml-1 h-4 w-4'
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

			{/* Notification toast */}
			{showNotification && (
				<div className='fixed bottom-4 right-4 bg-green-50 text-green-800 border-l-4 border-green-500 p-4 rounded shadow-lg z-50'>
					<div className='flex'>
						<div className='flex-shrink-0'>
							<svg
								className='h-5 w-5 text-green-500'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M5 13l4 4L19 7'
								/>
							</svg>
						</div>
						<div className='ml-3'>
							<p className='text-sm font-medium'>
								Produits ajoutés au panier avec succès
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default FocusedProductsPage;
