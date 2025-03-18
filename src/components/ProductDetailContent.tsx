'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/components/CartProvider';
import { formatPrice } from '@/lib/wooClient';
import ImprovedProductGallery from '@/components/ProductGallery';

// Type pour les produits
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

interface ImprovedProductDetailProps {
	product: Product;
	accessories?: Product[];
	premiumVariant?: Product | null;
	similarProducts?: Product[];
}

export default function ImprovedProductDetail({
	product,
	accessories = [],
	premiumVariant = null,
	similarProducts = [],
}: ImprovedProductDetailProps) {
	const [quantity, setQuantity] = useState(1);
	const [selectedAccessories, setSelectedAccessories] = useState<number[]>(
		[]
	);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const [notification, setNotification] = useState({
		show: false,
		message: '',
		type: '',
	});
	const [activeTab, setActiveTab] = useState('description');
	const [showShareOptions, setShowShareOptions] = useState(false);
	const { addToCart } = useCart();

	// Calculer le prix total (produit + accessoires sélectionnés)
	const calculateTotalPrice = () => {
		let total = parseFloat(product.price) * quantity;

		selectedAccessories.forEach((accessoryId) => {
			const accessory = accessories.find((acc) => acc.id === accessoryId);
			if (accessory) {
				total += parseFloat(accessory.price);
			}
		});

		return total;
	};

	// Calculer le pourcentage de réduction
	const calculateDiscount = () => {
		if (product.on_sale && product.regular_price && product.sale_price) {
			const regular = parseFloat(product.regular_price);
			const sale = parseFloat(product.sale_price);
			return Math.round(((regular - sale) / regular) * 100);
		}
		return 0;
	};

	// Gérer la sélection d'accessoires
	const toggleAccessory = (accessoryId: number) => {
		setSelectedAccessories((prev) => {
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
			// Ajouter le produit principal au panier
			await addToCart(product.id, quantity);

			// Ajouter les accessoires sélectionnés
			for (const accessoryId of selectedAccessories) {
				await addToCart(accessoryId, 1);
			}

			setNotification({
				show: true,
				message: `${product.name} et les accessoires sélectionnés ajoutés au panier`,
				type: 'success',
			});

			setTimeout(() => {
				setNotification({ show: false, message: '', type: '' });
			}, 3000);
		} catch (error) {
			console.error("Erreur lors de l'ajout au panier:", error);

			setNotification({
				show: true,
				message: "Erreur lors de l'ajout au panier",
				type: 'error',
			});
		} finally {
			setIsAddingToCart(false);
		}
	};

	// Partager le produit
	const shareProduct = (platform: string) => {
		const url = window.location.href;
		const text = `Découvrez ${product.name}`;

		switch (platform) {
			case 'twitter':
				window.open(
					`https://twitter.com/intent/tweet?text=${encodeURIComponent(
						text
					)}&url=${encodeURIComponent(url)}`
				);
				break;
			case 'facebook':
				window.open(
					`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
						url
					)}`
				);
				break;
			case 'pinterest':
				window.open(
					`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
						url
					)}&media=${encodeURIComponent(
						product.images[0]?.src || ''
					)}&description=${encodeURIComponent(text)}`
				);
				break;
			case 'email':
				window.location.href = `mailto:?subject=${encodeURIComponent(
					text
				)}&body=${encodeURIComponent(url)}`;
				break;
			case 'whatsapp':
				window.open(
					`https://api.whatsapp.com/send?text=${encodeURIComponent(
						text + ' ' + url
					)}`
				);
				break;
		}

		setShowShareOptions(false);
	};

	// Variants animation
	const fadeInVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
			},
		},
	};

	return (
		<div className='bg-gray-50 pb-24'>
			{/* Notification */}
			<AnimatePresence>
				{notification.show && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg ${
							notification.type === 'success'
								? 'bg-green-50 border-l-4 border-green-500 text-green-700'
								: 'bg-red-50 border-l-4 border-red-500 text-red-700'
						}`}>
						{notification.message}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Hero section */}
			<div className='bg-gradient-to-r from-indigo-700 to-purple-700 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
					<div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
						{/* Fil d'Ariane */}
						<nav className='flex text-sm text-indigo-100'>
							<Link
								href='/'
								className='hover:text-white'>
								Accueil
							</Link>
							<span className='mx-2'>/</span>
							{product.categories.length > 0 && (
								<>
									<Link
										href={`/categories/${product.categories[0].slug}`}
										className='hover:text-white'>
										{product.categories[0].name}
									</Link>
									<span className='mx-2'>/</span>
								</>
							)}
							<span className='text-white font-medium'>
								{product.name}
							</span>
						</nav>

						{/* Bouton de partage */}
						<div className='relative mt-4 md:mt-0'>
							<button
								onClick={() =>
									setShowShareOptions(!showShareOptions)
								}
								className='flex items-center space-x-2 text-indigo-100 hover:text-white transition-colors'>
								<svg
									className='w-5 h-5'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
									/>
								</svg>
								<span>Partager</span>
							</button>

							{/* Options de partage */}
							<AnimatePresence>
								{showShareOptions && (
									<motion.div
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.9 }}
										className='absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10'>
										<div className='py-1'>
											<button
												onClick={() =>
													shareProduct('facebook')
												}
												className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'>
												<span className='w-8 text-blue-600'>
													<svg
														className='w-5 h-5'
														fill='currentColor'
														viewBox='0 0 24 24'>
														<path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
													</svg>
												</span>
												Facebook
											</button>
											<button
												onClick={() =>
													shareProduct('twitter')
												}
												className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'>
												<span className='w-8 text-blue-400'>
													<svg
														className='w-5 h-5'
														fill='currentColor'
														viewBox='0 0 24 24'>
														<path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
													</svg>
												</span>
												Twitter
											</button>
											<button
												onClick={() =>
													shareProduct('pinterest')
												}
												className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'>
												<span className='w-8 text-red-600'>
													<svg
														className='w-5 h-5'
														fill='currentColor'
														viewBox='0 0 24 24'>
														<path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z' />
													</svg>
												</span>
												Pinterest
											</button>
											<button
												onClick={() =>
													shareProduct('whatsapp')
												}
												className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'>
												<span className='w-8 text-green-500'>
													<svg
														className='w-5 h-5'
														fill='currentColor'
														viewBox='0 0 24 24'>
														<path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
													</svg>
												</span>
												WhatsApp
											</button>
											<button
												onClick={() =>
													shareProduct('email')
												}
												className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'>
												<span className='w-8 text-gray-600'>
													<svg
														className='w-5 h-5'
														fill='none'
														viewBox='0 0 24 24'
														stroke='currentColor'>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
														/>
													</svg>
												</span>
												Email
											</button>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>
				</div>
			</div>

			{/* Contenu principal */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10'>
				<motion.div
					variants={fadeInVariants}
					initial='hidden'
					animate='visible'
					className='bg-white rounded-2xl shadow-lg overflow-hidden'>
					<div className='p-6 md:p-10'>
						<div className='flex flex-col lg:flex-row gap-10'>
							{/* Partie gauche - Galerie */}
							<div className='w-full lg:w-3/5'>
								<ImprovedProductGallery
									images={product.images}
									productName={product.name}
								/>
							</div>

							{/* Partie droite - Infos produit */}
							<div className='w-full lg:w-2/5'>
								{/* Badges */}
								<div className='flex flex-wrap gap-2 mb-3'>
									{product.featured && (
										<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800'>
											Populaire
										</span>
									)}
									{product.on_sale && (
										<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
											-{calculateDiscount()}% Promo
										</span>
									)}
									{product.stock_status === 'instock' ? (
										<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
											En stock
										</span>
									) : (
										<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
											{product.stock_status ===
											'onbackorder'
												? 'Sur commande'
												: 'Épuisé'}
										</span>
									)}
								</div>

								<h1 className='text-3xl font-bold text-gray-900 mb-2'>
									{product.name}
								</h1>

								{/* Prix */}
								<div className='flex items-end mb-6'>
									<p className='text-3xl font-bold text-indigo-600'>
										{formatPrice(product.price)}
									</p>
									{product.on_sale &&
										product.regular_price && (
											<p className='ml-2 text-lg text-gray-500 line-through'>
												{formatPrice(
													product.regular_price
												)}
											</p>
										)}
								</div>

								{/* Note et avis */}
								{product.rating_count > 0 && (
									<div className='flex items-center mb-4'>
										<div className='flex'>
											{[...Array(5)].map((_, i) => (
												<svg
													key={i}
													className={`h-5 w-5 ${
														i <
														Math.floor(
															parseFloat(
																product.average_rating
															)
														)
															? 'text-yellow-400'
															: 'text-gray-300'
													}`}
													fill='currentColor'
													viewBox='0 0 20 20'>
													<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
												</svg>
											))}
										</div>
										<p className='ml-2 text-sm text-gray-600'>
											{product.average_rating} (
											{product.rating_count} avis)
										</p>
									</div>
								)}

								{/* Description courte */}
								<div
									className='prose prose-sm mb-6'
									dangerouslySetInnerHTML={{
										__html: product.short_description,
									}}
								/>

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

								{/* Accessoires complémentaires */}
								{accessories.length > 0 && (
									<div className='mb-6'>
										<h3 className='text-sm font-medium text-gray-900 mb-3'>
											Accessoires complémentaires
										</h3>
										<div className='space-y-3'>
											{accessories.map((accessory) => (
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
															{
																accessory.short_description
															}
														</p>
													</div>
													<span className='text-sm font-bold text-indigo-600'>
														+
														{formatPrice(
															accessory.price
														)}
													</span>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Option premium */}
								{premiumVariant && (
									<div className='mb-6'>
										<div className='bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100'>
											<div className='flex justify-between items-start'>
												<div>
													<span className='inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2'>
														Premium
													</span>
													<h4 className='text-sm font-medium text-gray-900 mb-1'>
														Version premium
														disponible
													</h4>
													<p className='text-xs text-gray-600 mb-2'>
														Fonctionnalités avancées
														et performances
														supérieures
													</p>
												</div>
												<Link
													href={`/products/${premiumVariant.slug}`}
													className='text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center'>
													Découvrir
													<svg
														className='ml-1 w-4 h-4'
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
												</Link>
											</div>
										</div>
									</div>
								)}

								{/* Total */}
								{selectedAccessories.length > 0 && (
									<div className='mb-6 p-4 bg-gray-50 rounded-lg'>
										<h3 className='text-sm font-medium text-gray-900 mb-3'>
											Récapitulatif
										</h3>
										<ul className='space-y-2 mb-3'>
											<li className='flex justify-between'>
												<span className='text-gray-600'>
													{product.name} x {quantity}
												</span>
												<span className='font-medium'>
													{formatPrice(
														parseFloat(
															product.price
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
												{formatPrice(
													calculateTotalPrice()
												)}
											</span>
										</div>
									</div>
								)}

								{/* Boutons d'action */}
								<div className='flex flex-col space-y-3'>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={handleAddToCart}
										disabled={
											isAddingToCart ||
											product.stock_status !== 'instock'
										}
										className={`py-3 px-4 flex items-center justify-center rounded-lg text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${
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
									</motion.button>

									<button
										className='py-3 px-4 flex items-center justify-center rounded-lg text-base font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
										disabled={
											product.stock_status !== 'instock'
										}>
										<svg
											className='h-5 w-5 mr-2'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
											/>
										</svg>
										Ajouter aux favoris
									</button>
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
											Satisfait ou remboursé sous 30 jours
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

						{/* Onglets d'information produit */}
						<div className='mt-12 border-t border-gray-200 pt-10'>
							<div className='border-b border-gray-200'>
								<nav className='flex space-x-8'>
									<button
										onClick={() =>
											setActiveTab('description')
										}
										className={`${
											activeTab === 'description'
												? 'border-indigo-500 text-indigo-600'
												: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
										} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
										Description
									</button>
									<button
										onClick={() =>
											setActiveTab('specifications')
										}
										className={`${
											activeTab === 'specifications'
												? 'border-indigo-500 text-indigo-600'
												: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
										} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
										Caractéristiques
									</button>
									<button
										onClick={() => setActiveTab('reviews')}
										className={`${
											activeTab === 'reviews'
												? 'border-indigo-500 text-indigo-600'
												: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
										} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
										Avis ({product.rating_count || 0})
									</button>
								</nav>
							</div>

							<div className='py-10'>
								{activeTab === 'description' && (
									<div
										className='prose prose-indigo max-w-none'
										dangerouslySetInnerHTML={{
											__html: product.description,
										}}
									/>
								)}

								{activeTab === 'specifications' && (
									<div className='border-t border-gray-200 px-4 py-5 sm:p-0'>
										<dl className='sm:divide-y sm:divide-gray-200'>
											<div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
												<dt className='text-sm font-medium text-gray-500'>
													Référence
												</dt>
												<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
													#PROD-{product.id}
												</dd>
											</div>
											<div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
												<dt className='text-sm font-medium text-gray-500'>
													Catégorie
												</dt>
												<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
													{product.categories
														.map((cat) => cat.name)
														.join(', ')}
												</dd>
											</div>
											<div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
												<dt className='text-sm font-medium text-gray-500'>
													Disponibilité
												</dt>
												<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
													{product.stock_status ===
													'instock'
														? `En stock${
																product.stock_quantity
																	? ` (${product.stock_quantity} disponibles)`
																	: ''
														  }`
														: product.stock_status ===
														  'onbackorder'
														? 'Sur commande'
														: 'Épuisé'}
												</dd>
											</div>
											{/* Ajoutez d'autres spécifications selon vos besoins */}
										</dl>
									</div>
								)}

								{activeTab === 'reviews' && (
									<div>
										{product.rating_count > 0 ? (
											<div className='flow-root'>
												<div className='-my-12 divide-y divide-gray-200'>
													{/* Remplacez ceci par de vrais avis dans un scénario réel */}
													<div className='py-12'>
														<div className='flex items-center'>
															<div className='ml-4'>
																<h4 className='text-sm font-bold text-gray-900'>
																	Emily S.
																</h4>
																<div className='mt-1 flex items-center'>
																	{[
																		0, 1, 2,
																		3, 4,
																	].map(
																		(
																			rating
																		) => (
																			<svg
																				key={
																					rating
																				}
																				className={`h-5 w-5 ${
																					rating <
																					5
																						? 'text-yellow-400'
																						: 'text-gray-300'
																				}`}
																				fill='currentColor'
																				viewBox='0 0 20 20'>
																				<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
																			</svg>
																		)
																	)}
																</div>
																<p className='sr-only'>
																	5 out of 5
																	stars
																</p>
															</div>
														</div>

														<div className='mt-4 space-y-6 text-base italic text-gray-600'>
															<p>
																Cet article est
																exactement ce
																que je cherchais
																! La qualité est
																excellente et le
																rapport
																qualité/prix est
																imbattable. Je
																le recommande
																vivement à
																quiconque
																recherche un
																produit
																similaire.
															</p>
														</div>
													</div>

													{/* Second review */}
													<div className='py-12'>
														<div className='flex items-center'>
															<div className='ml-4'>
																<h4 className='text-sm font-bold text-gray-900'>
																	Thomas R.
																</h4>
																<div className='mt-1 flex items-center'>
																	{[
																		0, 1, 2,
																		3,
																	].map(
																		(
																			rating
																		) => (
																			<svg
																				key={
																					rating
																				}
																				className='h-5 w-5 text-yellow-400'
																				fill='currentColor'
																				viewBox='0 0 20 20'>
																				<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
																			</svg>
																		)
																	)}
																	<svg
																		className='h-5 w-5 text-gray-300'
																		fill='currentColor'
																		viewBox='0 0 20 20'>
																		<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
																	</svg>
																</div>
																<p className='sr-only'>
																	4 out of 5
																	stars
																</p>
															</div>
														</div>

														<div className='mt-4 space-y-6 text-base italic text-gray-600'>
															<p>
																Très bon
																produit, mais
																l'expédition a
																pris un peu plus
																de temps que
																prévu. Cela dit,
																la qualité est
																au rendez-vous
																et le service
																client a été
																très réactif.
															</p>
														</div>
													</div>
												</div>
											</div>
										) : (
											<div className='text-center py-12'>
												<svg
													className='mx-auto h-12 w-12 text-gray-400'
													fill='none'
													viewBox='0 0 24 24'
													stroke='currentColor'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
													/>
												</svg>
												<h3 className='mt-2 text-sm font-medium text-gray-900'>
													Aucun avis pour le moment
												</h3>
												<p className='mt-1 text-sm text-gray-500'>
													Soyez le premier à donner
													votre avis sur ce produit.
												</p>
												<div className='mt-6'>
													<button
														type='button'
														className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
														Rédiger un avis
													</button>
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</motion.div>

				{/* Produits similaires - Cette section est gérée par le composant ProductRecommendations importé dans page.tsx */}
			</div>
		</div>
	);
}

// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { motion } from 'framer-motion';
// import { formatPrice } from '@/lib/wooClient';
// import { useCart } from '@/components/CartProvider';
// import ProductGallery from '@/components/ProductGallery';

// // Type pour les produits
// interface Product {
// 	id: number;
// 	name: string;
// 	slug: string;
// 	price: string;
// 	regular_price?: string;
// 	sale_price?: string;
// 	on_sale?: boolean;
// 	stock_status: 'instock' | 'outofstock' | 'onbackorder';
// 	stock_quantity?: number;
// 	short_description: string;
// 	description: string;
// 	images: { src: string; alt: string }[];
// 	categories: { id: number; name: string; slug: string }[];
// 	average_rating?: string;
// 	rating_count?: number;
// 	featured?: boolean;
// }

// // Type pour les bundles
// interface Bundle {
// 	id: string;
// 	name: string;
// 	description: string;
// 	price: number;
// 	items: {
// 		productId: number;
// 		quantity: number;
// 	}[];
// 	badge?: string;
// 	badgeColor?: string;
// 	discount?: number;
// }

// const ProductDetailContent = ({
// 	product,
// 	accessories = [],
// 	premiumVariant = null,
// 	similarProducts = [],
// 	bundles = [],
// }: {
// 	product: Product;
// 	accessories?: Product[];
// 	premiumVariant?: Product | null;
// 	similarProducts?: Product[];
// 	bundles?: Bundle[];
// }) => {
// 	const [quantity, setQuantity] = useState(1);
// 	const [selectedAccessories, setSelectedAccessories] = useState<number[]>(
// 		[]
// 	);
// 	const [isAddingToCart, setIsAddingToCart] = useState(false);
// 	const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
// 	const [notification, setNotification] = useState({
// 		show: false,
// 		message: '',
// 		type: '',
// 	});
// 	const { addToCart } = useCart();

// 	// Calculer le prix total (produit + accessoires sélectionnés)
// 	const calculateTotalPrice = () => {
// 		let total = parseFloat(product.price) * quantity;

// 		selectedAccessories.forEach((accessoryId) => {
// 			const accessory = accessories.find((acc) => acc.id === accessoryId);
// 			if (accessory) {
// 				total += parseFloat(accessory.price);
// 			}
// 		});

// 		return total;
// 	};

// 	// Gérer la sélection d'accessoires
// 	const toggleAccessory = (accessoryId: number) => {
// 		setSelectedAccessories((prev) => {
// 			if (prev.includes(accessoryId)) {
// 				return prev.filter((id) => id !== accessoryId);
// 			} else {
// 				return [...prev, accessoryId];
// 			}
// 		});
// 		// Réinitialiser le bundle sélectionné si un accessoire est ajouté/supprimé manuellement
// 		setSelectedBundle(null);
// 	};

// 	// Gérer la sélection d'un bundle
// 	const selectBundle = (bundleId: string) => {
// 		// Si le même bundle est cliqué, le désélectionner
// 		if (selectedBundle === bundleId) {
// 			setSelectedBundle(null);
// 			setSelectedAccessories([]);
// 			return;
// 		}

// 		// Sinon, sélectionner le nouveau bundle
// 		setSelectedBundle(bundleId);

// 		// Trouver le bundle sélectionné
// 		const bundle = bundles.find((b) => b.id === bundleId);
// 		if (bundle) {
// 			// Extraire les accessoires du bundle
// 			const bundleAccessoryIds = bundle.items
// 				.filter((item) => item.productId !== product.id)
// 				.map((item) => item.productId);

// 			// Mettre à jour les accessoires sélectionnés
// 			setSelectedAccessories(bundleAccessoryIds);

// 			// Mettre à jour la quantité du produit principal selon le bundle
// 			const mainProductItem = bundle.items.find(
// 				(item) => item.productId === product.id
// 			);
// 			if (mainProductItem) {
// 				setQuantity(mainProductItem.quantity);
// 			}
// 		}
// 	};

// 	// Calculer le prix du bundle sélectionné
// 	const getBundlePrice = () => {
// 		if (!selectedBundle) return null;

// 		const bundle = bundles.find((b) => b.id === selectedBundle);
// 		return bundle ? bundle.price : null;
// 	};

// 	// Calculer l'économie réalisée avec le bundle
// 	const calculateBundleSavings = () => {
// 		if (!selectedBundle) return 0;

// 		const bundlePrice = getBundlePrice();
// 		const regularTotal = calculateTotalPrice();

// 		return bundlePrice !== null ? regularTotal - bundlePrice : 0;
// 	};

// 	// Gérer l'ajout au panier
// 	const handleAddToCart = async () => {
// 		setIsAddingToCart(true);

// 		try {
// 			// Ajouter le produit principal au panier
// 			await addToCart(product.id, quantity);

// 			// Ajouter les accessoires sélectionnés
// 			for (const accessoryId of selectedAccessories) {
// 				await addToCart(accessoryId, 1);
// 			}

// 			setNotification({
// 				show: true,
// 				message: selectedBundle
// 					? `Bundle ${
// 							bundles.find((b) => b.id === selectedBundle)?.name
// 					  } ajouté au panier`
// 					: `${product.name}${
// 							selectedAccessories.length > 0
// 								? ' et les accessoires sélectionnés'
// 								: ''
// 					  } ajouté au panier`,
// 				type: 'success',
// 			});

// 			setTimeout(() => {
// 				setNotification({ show: false, message: '', type: '' });
// 			}, 3000);
// 		} catch (error) {
// 			console.error("Erreur lors de l'ajout au panier:", error);

// 			setNotification({
// 				show: true,
// 				message: "Erreur lors de l'ajout au panier",
// 				type: 'error',
// 			});
// 		} finally {
// 			setIsAddingToCart(false);
// 		}
// 	};

// 	// Gérer l'achat direct
// 	const handleBuyNow = async () => {
// 		setIsAddingToCart(true);

// 		try {
// 			// Ajouter le produit principal au panier
// 			await addToCart(product.id, quantity);

// 			// Ajouter les accessoires sélectionnés
// 			for (const accessoryId of selectedAccessories) {
// 				await addToCart(accessoryId, 1);
// 			}

// 			// Rediriger vers la page de checkout
// 			window.location.href = '/checkout';
// 		} catch (error) {
// 			console.error("Erreur lors de l'achat direct:", error);

// 			setNotification({
// 				show: true,
// 				message: "Erreur lors de l'achat",
// 				type: 'error',
// 			});

// 			setIsAddingToCart(false);
// 		}
// 	};

// 	return (
// 		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
// 			{/* Notification */}
// 			{notification.show && (
// 				<div
// 					className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${
// 						notification.type === 'success'
// 							? 'bg-green-100 border-l-4 border-green-500'
// 							: 'bg-red-100 border-l-4 border-red-500'
// 					} transition-all duration-300 transform translate-x-0 opacity-100`}>
// 					<div className='flex items-center'>
// 						<div
// 							className={`flex-shrink-0 ${
// 								notification.type === 'success'
// 									? 'text-green-500'
// 									: 'text-red-500'
// 							}`}>
// 							{notification.type === 'success' ? (
// 								<svg
// 									className='h-5 w-5'
// 									viewBox='0 0 20 20'
// 									fill='currentColor'>
// 									<path
// 										fillRule='evenodd'
// 										d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
// 										clipRule='evenodd'
// 									/>
// 								</svg>
// 							) : (
// 								<svg
// 									className='h-5 w-5'
// 									viewBox='0 0 20 20'
// 									fill='currentColor'>
// 									<path
// 										fillRule='evenodd'
// 										d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
// 										clipRule='evenodd'
// 									/>
// 								</svg>
// 							)}
// 						</div>
// 						<div className='ml-3'>
// 							<p
// 								className={`text-sm ${
// 									notification.type === 'success'
// 										? 'text-green-700'
// 										: 'text-red-700'
// 								}`}>
// 								{notification.message}
// 							</p>
// 						</div>
// 					</div>
// 				</div>
// 			)}

// 			{/* Fil d'Ariane */}
// 			<nav className='flex mb-8 text-sm'>
// 				<Link
// 					href='/'
// 					className='text-gray-500 hover:text-indigo-600'>
// 					Accueil
// 				</Link>
// 				<span className='mx-2 text-gray-400'>/</span>
// 				{product.categories.length > 0 && (
// 					<>
// 						<Link
// 							href={`/categories/${product.categories[0].slug}`}
// 							className='text-gray-500 hover:text-indigo-600'>
// 							{product.categories[0].name}
// 						</Link>
// 						<span className='mx-2 text-gray-400'>/</span>
// 					</>
// 				)}
// 				<span className='text-gray-800 font-medium'>
// 					{product.name}
// 				</span>
// 			</nav>

// 			<div className='flex flex-col lg:flex-row gap-8'>
// 				{/* Galerie d'images */}
// 				<div className='lg:w-1/2'>
// 					<ProductGallery
// 						images={product.images}
// 						productName={product.name}
// 					/>

// 					{/* Guide d'achat rapide */}
// 					<div className='mt-8 bg-indigo-50 rounded-lg p-6'>
// 						<h3 className='text-lg font-medium text-indigo-900 mb-3'>
// 							Guide d'achat rapide
// 						</h3>
// 						<div className='space-y-4'>
// 							<div className='flex'>
// 								<div className='bg-indigo-100 rounded-full p-2 flex-shrink-0'>
// 									<svg
// 										className='h-5 w-5 text-indigo-600'
// 										fill='none'
// 										viewBox='0 0 24 24'
// 										stroke='currentColor'>
// 										<path
// 											strokeLinecap='round'
// 											strokeLinejoin='round'
// 											strokeWidth={2}
// 											d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
// 										/>
// 									</svg>
// 								</div>
// 								<div className='ml-3'>
// 									<h4 className='text-sm font-medium text-gray-900'>
// 										Comment choisir ?
// 									</h4>
// 									<p className='text-xs text-gray-600'>
// 										Pour un usage quotidien, notre produit
// 										standard est idéal. Pour des
// 										fonctionnalités avancées, considérez la
// 										version premium.
// 									</p>
// 								</div>
// 							</div>
// 							<div className='flex'>
// 								<div className='bg-indigo-100 rounded-full p-2 flex-shrink-0'>
// 									<svg
// 										className='h-5 w-5 text-indigo-600'
// 										fill='none'
// 										viewBox='0 0 24 24'
// 										stroke='currentColor'>
// 										<path
// 											strokeLinecap='round'
// 											strokeLinejoin='round'
// 											strokeWidth={2}
// 											d='M13 10V3L4 14h7v7l9-11h-7z'
// 										/>
// 									</svg>
// 								</div>
// 								<div className='ml-3'>
// 									<h4 className='text-sm font-medium text-gray-900'>
// 										Notre conseil
// 									</h4>
// 									<p className='text-xs text-gray-600'>
// 										Optez pour un bundle pour économiser
// 										tout en obtenant une expérience
// 										complète.
// 									</p>
// 								</div>
// 							</div>
// 							<Link
// 								href='/guide'
// 								className='inline-flex items-center text-sm text-indigo-600 font-medium hover:text-indigo-800'>
// 								Voir notre guide d'achat détaillé
// 								<svg
// 									className='ml-1 h-4 w-4'
// 									viewBox='0 0 20 20'
// 									fill='currentColor'>
// 									<path
// 										fillRule='evenodd'
// 										d='M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z'
// 										clipRule='evenodd'
// 									/>
// 								</svg>
// 							</Link>
// 						</div>
// 					</div>
// 				</div>

// 				{/* Informations produit */}
// 				<div className='lg:w-1/2'>
// 					<div className='sticky top-24'>
// 						<h1 className='text-3xl font-bold text-gray-900 mb-2'>
// 							{product.name}
// 						</h1>

// 						{/* Prix */}
// 						<div className='flex items-baseline my-4'>
// 							<div className='text-2xl font-extrabold text-indigo-600'>
// 								{formatPrice(product.price)}
// 							</div>

// 							{product.on_sale && product.regular_price && (
// 								<div className='ml-3 text-lg text-gray-500 line-through'>
// 									{formatPrice(product.regular_price)}
// 								</div>
// 							)}

// 							{product.on_sale && product.regular_price && (
// 								<div className='ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full'>
// 									-
// 									{Math.round(
// 										((parseFloat(product.regular_price) -
// 											parseFloat(product.price)) /
// 											parseFloat(product.regular_price)) *
// 											100
// 									)}
// 									%
// 								</div>
// 							)}
// 						</div>

// 						{/* Note et avis */}
// 						{product.rating_count > 0 && (
// 							<div className='flex items-center mb-4'>
// 								<div className='flex'>
// 									{[...Array(5)].map((_, i) => (
// 										<svg
// 											key={i}
// 											className={`h-5 w-5 ${
// 												i <
// 												Math.floor(
// 													parseFloat(
// 														product.average_rating
// 													)
// 												)
// 													? 'text-yellow-400'
// 													: 'text-gray-300'
// 											}`}
// 											viewBox='0 0 20 20'
// 											fill='currentColor'>
// 											<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
// 										</svg>
// 									))}
// 								</div>
// 								<span className='ml-2 text-gray-600'>
// 									{product.average_rating} (
// 									{product.rating_count} avis)
// 								</span>
// 							</div>
// 						)}

// 						{/* Stock */}
// 						<div className='mb-6'>
// 							{product.stock_status === 'instock' ? (
// 								<div className='flex items-center text-green-600'>
// 									<svg
// 										className='h-5 w-5 mr-1'
// 										fill='currentColor'
// 										viewBox='0 0 20 20'>
// 										<path
// 											fillRule='evenodd'
// 											d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
// 											clipRule='evenodd'
// 										/>
// 									</svg>
// 									<span>En stock</span>
// 									{product.stock_quantity && (
// 										<span className='ml-1 text-gray-500'>
// 											({product.stock_quantity}{' '}
// 											disponibles)
// 										</span>
// 									)}
// 								</div>
// 							) : (
// 								<div className='text-red-600'>Épuisé</div>
// 							)}
// 						</div>

// 						{/* Description courte */}
// 						{product.short_description && (
// 							<div
// 								className='prose prose-indigo max-w-none mb-8 text-gray-700'
// 								dangerouslySetInnerHTML={{
// 									__html: product.short_description,
// 								}}
// 							/>
// 						)}

// 						{/* Bundles recommandés */}
// 						{bundles.length > 0 && (
// 							<div className='mb-8'>
// 								<h3 className='text-lg font-medium text-gray-900 mb-3'>
// 									Bundles recommandés
// 								</h3>
// 								<div className='space-y-3'>
// 									{bundles.map((bundle) => (
// 										<div
// 											key={bundle.id}
// 											onClick={() =>
// 												selectBundle(bundle.id)
// 											}
// 											className={`p-4 border rounded-lg cursor-pointer transition-all ${
// 												selectedBundle === bundle.id
// 													? 'border-indigo-500 bg-indigo-50 shadow-md'
// 													: 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
// 											}`}>
// 											<div className='flex justify-between items-start mb-2'>
// 												<div>
// 													{bundle.badge && (
// 														<span
// 															className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
// 																bundle.badgeColor ||
// 																'bg-indigo-100 text-indigo-800'
// 															} mb-1`}>
// 															{bundle.badge}
// 														</span>
// 													)}
// 													<h4 className='text-base font-medium text-gray-900'>
// 														{bundle.name}
// 													</h4>
// 												</div>
// 												<div className='text-right'>
// 													<span className='text-lg font-bold text-indigo-600'>
// 														{formatPrice(
// 															bundle.price
// 														)}
// 													</span>
// 													{bundle.discount && (
// 														<p className='text-xs text-green-600'>
// 															Économisez{' '}
// 															{bundle.discount}%
// 														</p>
// 													)}
// 												</div>
// 											</div>
// 											<p className='text-sm text-gray-600 mb-3'>
// 												{bundle.description}
// 											</p>
// 											<div className='text-xs text-gray-500'>
// 												<span>Inclus: </span>
// 												<ul className='inline list-disc pl-5'>
// 													{bundle.items.map(
// 														(item, idx) => {
// 															const isMainProduct =
// 																item.productId ===
// 																product.id;
// 															const accessory =
// 																!isMainProduct
// 																	? accessories.find(
// 																			(
// 																				a
// 																			) =>
// 																				a.id ===
// 																				item.productId
// 																	  )
// 																	: null;

// 															return (
// 																<li
// 																	key={idx}
// 																	className='inline mr-2'>
// 																	{isMainProduct
// 																		? `${
// 																				product.name
// 																		  }${
// 																				item.quantity >
// 																				1
// 																					? ` (×${item.quantity})`
// 																					: ''
// 																		  }`
// 																		: accessory
// 																		? `${
// 																				accessory.name
// 																		  }${
// 																				item.quantity >
// 																				1
// 																					? ` (×${item.quantity})`
// 																					: ''
// 																		  }`
// 																		: ''}
// 																</li>
// 															);
// 														}
// 													)}
// 												</ul>
// 											</div>
// 										</div>
// 									))}
// 								</div>
// 							</div>
// 						)}

// 						{/* Quantité */}
// 						<div className='mb-6'>
// 							<label
// 								htmlFor='quantity'
// 								className='block text-sm font-medium text-gray-700 mb-2'>
// 								Quantité
// 							</label>
// 							<div className='flex'>
// 								<button
// 									onClick={() =>
// 										setQuantity(Math.max(1, quantity - 1))
// 									}
// 									disabled={selectedBundle !== null}
// 									className='bg-gray-100 text-gray-600 hover:text-gray-700 hover:bg-gray-200 w-10 h-10 rounded-l-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'>
// 									<svg
// 										className='h-4 w-4'
// 										fill='none'
// 										viewBox='0 0 24 24'
// 										stroke='currentColor'>
// 										<path
// 											strokeLinecap='round'
// 											strokeLinejoin='round'
// 											strokeWidth={2}
// 											d='M20 12H4'
// 										/>
// 									</svg>
// 								</button>
// 								<input
// 									type='number'
// 									id='quantity'
// 									name='quantity'
// 									min='1'
// 									value={quantity}
// 									onChange={(e) =>
// 										setQuantity(
// 											Math.max(
// 												1,
// 												parseInt(e.target.value) || 1
// 											)
// 										)
// 									}
// 									disabled={selectedBundle !== null}
// 									className='text-center w-16 h-10 border-gray-200 border-y focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500'
// 								/>
// 								<button
// 									onClick={() => setQuantity(quantity + 1)}
// 									disabled={selectedBundle !== null}
// 									className='bg-gray-100 text-gray-600 hover:text-gray-700 hover:bg-gray-200 w-10 h-10 rounded-r-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'>
// 									<svg
// 										className='h-4 w-4'
// 										fill='none'
// 										viewBox='0 0 24 24'
// 										stroke='currentColor'>
// 										<path
// 											strokeLinecap='round'
// 											strokeLinejoin='round'
// 											strokeWidth={2}
// 											d='M12 4v16m8-8H4'
// 										/>
// 									</svg>
// 								</button>
// 							</div>
// 							{selectedBundle && (
// 								<p className='mt-1 text-xs text-indigo-600'>
// 									Quantité définie par le bundle sélectionné
// 								</p>
// 							)}
// 						</div>

// 						{/* Accessoires complémentaires */}
// 						{accessories.length > 0 && (
// 							<div className='mb-6'>
// 								<h3 className='text-lg font-medium text-gray-900 mb-3'>
// 									Accessoires complémentaires
// 								</h3>
// 								<div className='space-y-3'>
// 									{accessories.map((accessory) => (
// 										<div
// 											key={accessory.id}
// 											className={`flex items-center p-3 rounded-lg border ${
// 												selectedAccessories.includes(
// 													accessory.id
// 												)
// 													? 'border-indigo-500 bg-indigo-50'
// 													: 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
// 											} transition-colors cursor-pointer`}
// 											onClick={() =>
// 												toggleAccessory(accessory.id)
// 											}>
// 											<input
// 												type='checkbox'
// 												checked={selectedAccessories.includes(
// 													accessory.id
// 												)}
// 												onChange={() =>
// 													toggleAccessory(
// 														accessory.id
// 													)
// 												}
// 												disabled={
// 													selectedBundle !== null
// 												}
// 												className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50'
// 											/>
// 											<div className='ml-3 flex-grow'>
// 												<p className='text-sm font-medium text-gray-900'>
// 													{accessory.name}
// 												</p>
// 												<p className='text-sm text-gray-500'>
// 													{
// 														accessory.short_description
// 													}
// 												</p>
// 											</div>
// 											<span className='text-sm font-bold text-indigo-600'>
// 												+{formatPrice(accessory.price)}
// 											</span>
// 										</div>
// 									))}
// 								</div>
// 								{selectedBundle && (
// 									<p className='mt-2 text-xs text-indigo-600'>
// 										Accessoires définis par le bundle
// 										sélectionné
// 									</p>
// 								)}
// 							</div>
// 						)}

// 						{/* Option premium */}
// 						{premiumVariant && (
// 							<div className='mb-6'>
// 								<div className='bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100'>
// 									<div className='flex items-start'>
// 										<div className='flex-shrink-0 mt-1'>
// 											<svg
// 												className='h-5 w-5 text-indigo-600'
// 												fill='currentColor'
// 												viewBox='0 0 20 20'>
// 												<path
// 													fillRule='evenodd'
// 													d='M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z'
// 													clipRule='evenodd'
// 												/>
// 											</svg>
// 										</div>
// 										<div className='ml-3'>
// 											<h4 className='text-sm font-medium text-gray-900'>
// 												Version premium disponible
// 											</h4>
// 											<p className='mt-1 text-sm text-gray-600'>
// 												Vous cherchez plus de
// 												fonctionnalités ?
// 											</p>
// 											<Link
// 												href={`/products/${premiumVariant.slug}`}
// 												className='mt-2 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800'>
// 												Découvrir la version premium
// 												<svg
// 													className='ml-1 h-4 w-4'
// 													fill='none'
// 													viewBox='0 0 24 24'
// 													stroke='currentColor'>
// 													<path
// 														strokeLinecap='round'
// 														strokeLinejoin='round'
// 														strokeWidth={2}
// 														d='M9 5l7 7-7 7'
// 													/>
// 												</svg>
// 											</Link>
// 										</div>
// 									</div>
// 								</div>
// 							</div>
// 						)}

// 						{/* Total */}
// 						<div className='mb-6 p-4 bg-gray-50 rounded-lg'>
// 							<h3 className='text-lg font-medium text-gray-900 mb-3'>
// 								Récapitulatif
// 							</h3>

// 							{selectedBundle ? (
// 								// Affichage du bundle sélectionné
// 								<>
// 									<div className='mb-3'>
// 										<div className='flex justify-between text-gray-600'>
// 											<span>
// 												Bundle{' '}
// 												{
// 													bundles.find(
// 														(b) =>
// 															b.id ===
// 															selectedBundle
// 													)?.name
// 												}
// 											</span>
// 											<span className='font-medium'>
// 												{formatPrice(
// 													getBundlePrice() || 0
// 												)}
// 											</span>
// 										</div>
// 										<div className='mt-2 flex justify-between text-sm text-green-600'>
// 											<span>Économie réalisée</span>
// 											<span>
// 												{formatPrice(
// 													calculateBundleSavings()
// 												)}
// 											</span>
// 										</div>
// 									</div>
// 									<div className='flex justify-between border-t pt-3 border-gray-200'>
// 										<span className='font-bold text-gray-900'>
// 											Total
// 										</span>
// 										<span className='font-bold text-indigo-600'>
// 											{formatPrice(getBundlePrice() || 0)}
// 										</span>
// 									</div>
// 								</>
// 							) : (
// 								// Affichage standard (produit + accessoires)
// 								<>
// 									<ul className='space-y-2 mb-3'>
// 										<li className='flex justify-between'>
// 											<span className='text-gray-600'>
// 												{product.name} x {quantity}
// 											</span>
// 											<span className='font-medium'>
// 												{formatPrice(
// 													parseFloat(product.price) *
// 														quantity
// 												)}
// 											</span>
// 										</li>
// 										{selectedAccessories.map(
// 											(accessoryId) => {
// 												const accessory =
// 													accessories.find(
// 														(acc) =>
// 															acc.id ===
// 															accessoryId
// 													);
// 												return accessory ? (
// 													<li
// 														key={accessory.id}
// 														className='flex justify-between'>
// 														<span className='text-gray-600'>
// 															{accessory.name}
// 														</span>
// 														<span className='font-medium'>
// 															{formatPrice(
// 																accessory.price
// 															)}
// 														</span>
// 													</li>
// 												) : null;
// 											}
// 										)}
// 									</ul>
// 									<div className='flex justify-between border-t pt-3 border-gray-200'>
// 										<span className='font-bold text-gray-900'>
// 											Total
// 										</span>
// 										<span className='font-bold text-indigo-600'>
// 											{formatPrice(calculateTotalPrice())}
// 										</span>
// 									</div>
// 								</>
// 							)}
// 						</div>

// 						{/* Boutons d'action */}
// 						<div className='flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4'>
// 							<button
// 								onClick={handleAddToCart}
// 								disabled={
// 									isAddingToCart ||
// 									product.stock_status !== 'instock'
// 								}
// 								className={`flex-1 py-3 px-4 flex items-center justify-center rounded-full text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
// 									isAddingToCart ? 'animate-pulse' : ''
// 								}`}>
// 								{isAddingToCart ? (
// 									<>
// 										<svg
// 											className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
// 											fill='none'
// 											viewBox='0 0 24 24'>
// 											<circle
// 												className='opacity-25'
// 												cx='12'
// 												cy='12'
// 												r='10'
// 												stroke='currentColor'
// 												strokeWidth='4'></circle>
// 											<path
// 												className='opacity-75'
// 												fill='currentColor'
// 												d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
// 										</svg>
// 										Chargement...
// 									</>
// 								) : (
// 									<>
// 										<svg
// 											className='h-5 w-5 mr-2'
// 											fill='none'
// 											viewBox='0 0 24 24'
// 											stroke='currentColor'>
// 											<path
// 												strokeLinecap='round'
// 												strokeLinejoin='round'
// 												strokeWidth={2}
// 												d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
// 											/>
// 										</svg>
// 										Ajouter au panier
// 									</>
// 								)}
// 							</button>

// 							<button
// 								onClick={handleBuyNow}
// 								disabled={
// 									isAddingToCart ||
// 									product.stock_status !== 'instock'
// 								}
// 								className='flex-1 py-3 px-4 flex items-center justify-center rounded-full text-base font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
// 								<svg
// 									className='h-5 w-5 mr-2'
// 									fill='none'
// 									viewBox='0 0 24 24'
// 									stroke='currentColor'>
// 									<path
// 										strokeLinecap='round'
// 										strokeLinejoin='round'
// 										strokeWidth={2}
// 										d='M13 10V3L4 14h7v7l9-11h-7z'
// 									/>
// 								</svg>
// 								Acheter maintenant
// 							</button>
// 						</div>

// 						{/* Avantages */}
// 						<div className='mt-8 grid grid-cols-2 gap-4'>
// 							<div className='flex items-start'>
// 								<svg
// 									className='h-5 w-5 text-green-500 mt-1 mr-2'
// 									fill='none'
// 									viewBox='0 0 24 24'
// 									stroke='currentColor'>
// 									<path
// 										strokeLinecap='round'
// 										strokeLinejoin='round'
// 										strokeWidth={2}
// 										d='M5 13l4 4L19 7'
// 									/>
// 								</svg>
// 								<span className='text-sm text-gray-600'>
// 									Livraison gratuite dès 50€
// 								</span>
// 							</div>
// 							<div className='flex items-start'>
// 								<svg
// 									className='h-5 w-5 text-green-500 mt-1 mr-2'
// 									fill='none'
// 									viewBox='0 0 24 24'
// 									stroke='currentColor'>
// 									<path
// 										strokeLinecap='round'
// 										strokeLinejoin='round'
// 										strokeWidth={2}
// 										d='M5 13l4 4L19 7'
// 									/>
// 								</svg>
// 								<span className='text-sm text-gray-600'>
// 									Satisfait ou remboursé
// 								</span>
// 							</div>
// 							<div className='flex items-start'>
// 								<svg
// 									className='h-5 w-5 text-green-500 mt-1 mr-2'
// 									fill='none'
// 									viewBox='0 0 24 24'
// 									stroke='currentColor'>
// 									<path
// 										strokeLinecap='round'
// 										strokeLinejoin='round'
// 										strokeWidth={2}
// 										d='M5 13l4 4L19 7'
// 									/>
// 								</svg>
// 								<span className='text-sm text-gray-600'>
// 									Garantie 2 ans
// 								</span>
// 							</div>
// 							<div className='flex items-start'>
// 								<svg
// 									className='h-5 w-5 text-green-500 mt-1 mr-2'
// 									fill='none'
// 									viewBox='0 0 24 24'
// 									stroke='currentColor'>
// 									<path
// 										strokeLinecap='round'
// 										strokeLinejoin='round'
// 										strokeWidth={2}
// 										d='M5 13l4 4L19 7'
// 									/>
// 								</svg>
// 								<span className='text-sm text-gray-600'>
// 									Support disponible 7j/7
// 								</span>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>

// 			{/* Pourquoi choisir ce produit */}
// 			<div className='mt-16 border-t border-gray-200 pt-10'>
// 				<h2 className='text-2xl font-bold text-gray-900 mb-6'>
// 					Pourquoi choisir ce produit ?
// 				</h2>
// 				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
// 					<div className='bg-gray-50 rounded-lg p-6'>
// 						<div className='w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4'>
// 							<svg
// 								className='h-6 w-6 text-indigo-600'
// 								fill='none'
// 								viewBox='0 0 24 24'
// 								stroke='currentColor'>
// 								<path
// 									strokeLinecap='round'
// 									strokeLinejoin='round'
// 									strokeWidth={2}
// 									d='M5 13l4 4L19 7'
// 								/>
// 							</svg>
// 						</div>
// 						<h3 className='text-lg font-medium text-gray-900 mb-2'>
// 							Qualité supérieure
// 						</h3>
// 						<p className='text-gray-600'>
// 							Nos produits sont soigneusement sélectionnés et
// 							testés pour vous offrir la meilleure expérience
// 							possible.
// 						</p>
// 					</div>
// 					<div className='bg-gray-50 rounded-lg p-6'>
// 						<div className='w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4'>
// 							<svg
// 								className='h-6 w-6 text-indigo-600'
// 								fill='none'
// 								viewBox='0 0 24 24'
// 								stroke='currentColor'>
// 								<path
// 									strokeLinecap='round'
// 									strokeLinejoin='round'
// 									strokeWidth={2}
// 									d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
// 								/>
// 							</svg>
// 						</div>
// 						<h3 className='text-lg font-medium text-gray-900 mb-2'>
// 							Support personnalisé
// 						</h3>
// 						<p className='text-gray-600'>
// 							Notre équipe d'experts est là pour vous accompagner
// 							et répondre à toutes vos questions.
// 						</p>
// 					</div>
// 					<div className='bg-gray-50 rounded-lg p-6'>
// 						<div className='w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4'>
// 							<svg
// 								className='h-6 w-6 text-indigo-600'
// 								fill='none'
// 								viewBox='0 0 24 24'
// 								stroke='currentColor'>
// 								<path
// 									strokeLinecap='round'
// 									strokeLinejoin='round'
// 									strokeWidth={2}
// 									d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
// 								/>
// 							</svg>
// 						</div>
// 						<h3 className='text-lg font-medium text-gray-900 mb-2'>
// 							Longue durée de vie
// 						</h3>
// 						<p className='text-gray-600'>
// 							Conçu pour durer, notre produit vous accompagnera
// 							pendant de nombreuses années.
// 						</p>
// 					</div>
// 				</div>

// 				<div className='mt-8 bg-indigo-50 p-6 rounded-lg'>
// 					<h3 className='text-lg font-medium text-indigo-900 mb-2'>
// 						Notre approche différente
// 					</h3>
// 					<p className='text-indigo-700 mb-4'>
// 						Plutôt que de vous proposer des dizaines de produits
// 						similaires, nous avons fait le choix de nous concentrer
// 						sur quelques produits exceptionnels. Cette approche nous
// 						permet de maîtriser parfaitement chaque article que nous
// 						vendons et de vous offrir un service client
// 						incomparable.
// 					</p>
// 					<Link
// 						href='/about-us'
// 						className='text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center'>
// 						En savoir plus sur notre philosophie
// 						<svg
// 							className='ml-1 h-4 w-4'
// 							fill='none'
// 							viewBox='0 0 24 24'
// 							stroke='currentColor'>
// 							<path
// 								strokeLinecap='round'
// 								strokeLinejoin='round'
// 								strokeWidth={2}
// 								d='M14 5l7 7m0 0l-7 7m7-7H3'
// 							/>
// 						</svg>
// 					</Link>
// 				</div>
// 			</div>

// 			{/* Produits similaires */}
// 			{similarProducts.length > 0 && (
// 				<div className='mt-16 border-t border-gray-200 pt-10'>
// 					<h2 className='text-2xl font-bold text-gray-900 mb-6'>
// 						Vous pourriez aussi aimer
// 					</h2>
// 					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
// 						{similarProducts.map((product) => (
// 							<motion.div
// 								key={product.id}
// 								whileHover={{ y: -5 }}
// 								className='group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300'>
// 								<Link
// 									href={`/products/${product.slug}`}
// 									className='block'>
// 									<div className='relative aspect-square overflow-hidden'>
// 										{product.images &&
// 										product.images.length > 0 ? (
// 											<Image
// 												src={product.images[0].src}
// 												alt={product.name}
// 												fill
// 												sizes='(max-width: 768px) 100vw, 25vw'
// 												className='object-cover transition-transform duration-500 group-hover:scale-105'
// 											/>
// 										) : (
// 											<div className='w-full h-full flex items-center justify-center bg-gray-100'>
// 												<svg
// 													className='h-12 w-12 text-gray-400'
// 													fill='none'
// 													viewBox='0 0 24 24'
// 													stroke='currentColor'>
// 													<path
// 														strokeLinecap='round'
// 														strokeLinejoin='round'
// 														strokeWidth={2}
// 														d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
// 													/>
// 												</svg>
// 											</div>
// 										)}
// 									</div>
// 									<div className='p-4'>
// 										<h3 className='text-sm font-medium text-gray-900 line-clamp-2'>
// 											{product.name}
// 										</h3>
// 										<p className='mt-1 text-sm font-bold text-indigo-600'>
// 											{formatPrice(product.price)}
// 										</p>
// 									</div>
// 								</Link>
// 							</motion.div>
// 						))}
// 					</div>
// 				</div>
// 			)}

// 			{/* Description complète */}
// 			<div className='mt-16 border-t border-gray-200 pt-10'>
// 				<div className='prose prose-indigo max-w-none'>
// 					<h2 className='text-2xl font-bold text-gray-900 mb-6'>
// 						Description du produit
// 					</h2>
// 					<div
// 						dangerouslySetInnerHTML={{
// 							__html: product.description,
// 						}}
// 					/>
// 				</div>
// 			</div>

// 			{/* FAQ */}
// 			<div className='mt-16 border-t border-gray-200 pt-10'>
// 				<h2 className='text-2xl font-bold text-gray-900 mb-6'>
// 					Questions fréquentes
// 				</h2>
// 				<div className='space-y-6'>
// 					<div className='border-b border-gray-200 pb-6'>
// 						<h3 className='text-lg font-medium text-gray-900 mb-2'>
// 							Comment choisir entre ce modèle et la version
// 							premium ?
// 						</h3>
// 						<p className='text-gray-600'>
// 							Ce modèle standard est idéal pour une utilisation
// 							quotidienne et couvre la plupart des besoins. La
// 							version premium offre des fonctionnalités
// 							supplémentaires pour les utilisateurs avancés ou
// 							professionnels qui ont besoin de plus de puissance
// 							ou d'options.
// 						</p>
// 					</div>
// 					<div className='border-b border-gray-200 pb-6'>
// 						<h3 className='text-lg font-medium text-gray-900 mb-2'>
// 							Les accessoires sont-ils nécessaires ?
// 						</h3>
// 						<p className='text-gray-600'>
// 							Le produit est pleinement fonctionnel sans
// 							accessoires, mais ces derniers permettent
// 							d'améliorer l'expérience ou d'ajouter des
// 							fonctionnalités spécifiques. Nous recommandons au
// 							minimum [Accessoire Principal] pour une expérience
// 							optimale.
// 						</p>
// 					</div>
// 					<div className='border-b border-gray-200 pb-6'>
// 						<h3 className='text-lg font-medium text-gray-900 mb-2'>
// 							Quelle est la garantie offerte ?
// 						</h3>
// 						<p className='text-gray-600'>
// 							Tous nos produits bénéficient d'une garantie de 2
// 							ans couvrant tout défaut de fabrication. Nous
// 							proposons également une extension de garantie de 1
// 							an supplémentaire en option.
// 						</p>
// 					</div>
// 					<div>
// 						<Link
// 							href='/faq'
// 							className='text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center'>
// 							Voir toutes les questions fréquentes
// 							<svg
// 								className='ml-1 h-4 w-4'
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
// 			</div>
// 		</div>
// 	);
// };

// export default ProductDetailContent;
