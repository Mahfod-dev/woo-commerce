'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/wooClient';
import { useCart } from '@/components/CartProvider';
import ProductGallery from '@/components/ProductGallery';

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
}

const ProductDetailContent = ({
	product,
	accessories = [],
	premiumVariant = null,
	similarProducts = [],
}: {
	product: Product;
	accessories?: Product[];
	premiumVariant?: Product | null;
	similarProducts?: Product[];
}) => {
	const [quantity, setQuantity] = useState(1);
	const [selectedAccessories, setSelectedAccessories] = useState([]);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const [notification, setNotification] = useState({
		show: false,
		message: '',
		type: '',
	});
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

	// Gérer la sélection d'accessoires
	const toggleAccessory = (accessoryId) => {
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

	// Gérer l'achat direct
	const handleBuyNow = async () => {
		setIsAddingToCart(true);

		try {
			// Ajouter le produit principal au panier
			await addToCart(product.id, quantity);

			// Ajouter les accessoires sélectionnés
			for (const accessoryId of selectedAccessories) {
				await addToCart(accessoryId, 1);
			}

			// Rediriger vers la page de checkout
			window.location.href = '/checkout';
		} catch (error) {
			console.error("Erreur lors de l'achat direct:", error);

			setNotification({
				show: true,
				message: "Erreur lors de l'achat",
				type: 'error',
			});

			setIsAddingToCart(false);
		}
	};

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
			{/* Notification */}
			{notification.show && (
				<div
					className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${
						notification.type === 'success'
							? 'bg-green-100 border-l-4 border-green-500'
							: 'bg-red-100 border-l-4 border-red-500'
					} transition-all duration-300 transform translate-x-0 opacity-100`}>
					<div className='flex items-center'>
						<div
							className={`flex-shrink-0 ${
								notification.type === 'success'
									? 'text-green-500'
									: 'text-red-500'
							}`}>
							{notification.type === 'success' ? (
								<svg
									className='h-5 w-5'
									viewBox='0 0 20 20'
									fill='currentColor'>
									<path
										fillRule='evenodd'
										d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
										clipRule='evenodd'
									/>
								</svg>
							) : (
								<svg
									className='h-5 w-5'
									viewBox='0 0 20 20'
									fill='currentColor'>
									<path
										fillRule='evenodd'
										d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
										clipRule='evenodd'
									/>
								</svg>
							)}
						</div>
						<div className='ml-3'>
							<p
								className={`text-sm ${
									notification.type === 'success'
										? 'text-green-700'
										: 'text-red-700'
								}`}>
								{notification.message}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Fil d'Ariane */}
			<nav className='flex mb-8 text-sm'>
				<Link
					href='/'
					className='text-gray-500 hover:text-indigo-600'>
					Accueil
				</Link>
				<span className='mx-2 text-gray-400'>/</span>
				{product.categories.length > 0 && (
					<>
						<Link
							href={`/categories/${product.categories[0].slug}`}
							className='text-gray-500 hover:text-indigo-600'>
							{product.categories[0].name}
						</Link>
						<span className='mx-2 text-gray-400'>/</span>
					</>
				)}
				<span className='text-gray-800 font-medium'>
					{product.name}
				</span>
			</nav>

			<div className='flex flex-col lg:flex-row gap-8'>
				{/* Galerie d'images */}
				<div className='lg:w-1/2'>
					<ProductGallery
						images={product.images}
						productName={product.name}
					/>
				</div>

				{/* Informations produit */}
				<div className='lg:w-1/2'>
					<div className='sticky top-24'>
						<h1 className='text-3xl font-bold text-gray-900 mb-2'>
							{product.name}
						</h1>

						{/* Prix */}
						<div className='flex items-baseline my-4'>
							<div className='text-2xl font-extrabold text-indigo-600'>
								{formatPrice(product.price)}
							</div>

							{product.on_sale && product.regular_price && (
								<div className='ml-3 text-lg text-gray-500 line-through'>
									{formatPrice(product.regular_price)}
								</div>
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
											viewBox='0 0 20 20'
											fill='currentColor'>
											<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
										</svg>
									))}
								</div>
								<span className='ml-2 text-gray-600'>
									{product.average_rating} (
									{product.rating_count} avis)
								</span>
							</div>
						)}

						{/* Stock */}
						<div className='mb-6'>
							{product.stock_status === 'instock' ? (
								<div className='flex items-center text-green-600'>
									<svg
										className='h-5 w-5 mr-1'
										fill='currentColor'
										viewBox='0 0 20 20'>
										<path
											fillRule='evenodd'
											d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
											clipRule='evenodd'
										/>
									</svg>
									<span>En stock</span>
									{product.stock_quantity && (
										<span className='ml-1 text-gray-500'>
											({product.stock_quantity}{' '}
											disponibles)
										</span>
									)}
								</div>
							) : (
								<div className='text-red-600'>Épuisé</div>
							)}
						</div>

						{/* Description courte */}
						{product.short_description && (
							<div
								className='prose prose-indigo max-w-none mb-8 text-gray-700'
								dangerouslySetInnerHTML={{
									__html: product.short_description,
								}}
							/>
						)}

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
										setQuantity(Math.max(1, quantity - 1))
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
												parseInt(e.target.value) || 1
											)
										)
									}
									className='text-center w-16 h-10 border-gray-200 border-y focus:ring-indigo-500 focus:border-indigo-500'
								/>
								<button
									onClick={() => setQuantity(quantity + 1)}
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
								<h3 className='text-lg font-medium text-gray-900 mb-3'>
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
												toggleAccessory(accessory.id)
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
												+{formatPrice(accessory.price)}
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
									<div className='flex items-start'>
										<div className='flex-shrink-0 mt-1'>
											<svg
												className='h-5 w-5 text-indigo-600'
												fill='currentColor'
												viewBox='0 0 20 20'>
												<path
													fillRule='evenodd'
													d='M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z'
													clipRule='evenodd'
												/>
											</svg>
										</div>
										<div className='ml-3'>
											<h4 className='text-sm font-medium text-gray-900'>
												Version premium disponible
											</h4>
											<p className='mt-1 text-sm text-gray-600'>
												Vous cherchez plus de
												fonctionnalités ?
											</p>
											<Link
												href={`/products/${premiumVariant.slug}`}
												className='mt-2 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800'>
												Découvrir la version premium
												<svg
													className='ml-1 h-4 w-4'
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
							</div>
						)}

						{/* Total */}
						{selectedAccessories.length > 0 && (
							<div className='mb-6 p-4 bg-gray-50 rounded-lg'>
								<h3 className='text-lg font-medium text-gray-900 mb-3'>
									Récapitulatif
								</h3>
								<ul className='space-y-2 mb-3'>
									<li className='flex justify-between'>
										<span className='text-gray-600'>
											{product.name} x {quantity}
										</span>
										<span className='font-medium'>
											{formatPrice(
												parseFloat(product.price) *
													quantity
											)}
										</span>
									</li>
									{selectedAccessories.map((accessoryId) => {
										const accessory = accessories.find(
											(acc) => acc.id === accessoryId
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
									})}
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
						)}

						{/* Boutons d'action */}
						<div className='flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4'>
							<button
								onClick={handleAddToCart}
								disabled={
									isAddingToCart ||
									product.stock_status !== 'instock'
								}
								className={`flex-1 py-3 px-4 flex items-center justify-center rounded-full text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
									isAddingToCart ? 'animate-pulse' : ''
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
										Chargement...
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

							<button
								onClick={handleBuyNow}
								disabled={
									isAddingToCart ||
									product.stock_status !== 'instock'
								}
								className='flex-1 py-3 px-4 flex items-center justify-center rounded-full text-base font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
								<svg
									className='h-5 w-5 mr-2'
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
								Acheter maintenant
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
									Satisfait ou remboursé
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
									Support disponible 7j/7
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Produits similaires */}
			{similarProducts.length > 0 && (
				<div className='mt-16 border-t border-gray-200 pt-10'>
					<h2 className='text-2xl font-bold text-gray-900 mb-6'>
						Vous pourriez aussi aimer
					</h2>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
						{similarProducts.map((product) => (
							<motion.div
								key={product.id}
								whileHover={{ y: -5 }}
								className='group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300'>
								<Link
									href={`/products/${product.slug}`}
									className='block'>
									<div className='relative aspect-square overflow-hidden'>
										{product.images &&
										product.images.length > 0 ? (
											<Image
												src={product.images[0].src}
												alt={product.name}
												fill
												sizes='(max-width: 768px) 100vw, 25vw'
												className='object-cover transition-transform duration-500 group-hover:scale-105'
											/>
										) : (
											<div className='w-full h-full flex items-center justify-center bg-gray-100'>
												<svg
													className='h-12 w-12 text-gray-400'
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
									<div className='p-4'>
										<h3 className='text-sm font-medium text-gray-900 line-clamp-2'>
											{product.name}
										</h3>
										<p className='mt-1 text-sm font-bold text-indigo-600'>
											{formatPrice(product.price)}
										</p>
									</div>
								</Link>
							</motion.div>
						))}
					</div>
				</div>
			)}

			{/* Description complète */}
			<div className='mt-16 border-t border-gray-200 pt-10'>
				<div className='prose prose-indigo max-w-none'>
					<h2 className='text-2xl font-bold text-gray-900 mb-6'>
						Description du produit
					</h2>
					<div
						dangerouslySetInnerHTML={{
							__html: product.description,
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default ProductDetailContent;
