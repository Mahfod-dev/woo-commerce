'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, addToCart } from '@/lib/wooClient';
import { WooProduct } from '@/lib/woo';

import { useRouter } from 'next/navigation';

export default function ProductDetailContent({
	product,
}: {
	product: WooProduct;
}) {
	const [selectedImage, setSelectedImage] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const [notification, setNotification] = useState({
		show: false,
		message: '',
		type: '',
	});
	const router = useRouter();

	const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value);
		if (value > 0) {
			setQuantity(value);
		}
	};

	const incrementQuantity = () => {
		setQuantity((prev) => prev + 1);
	};

	const decrementQuantity = () => {
		if (quantity > 1) {
			setQuantity((prev) => prev - 1);
		}
	};

	const handleAddToCart = async () => {
		setIsAddingToCart(true);

		try {
			await addToCart(product.id, quantity);

			setNotification({
				show: true,
				message: `${product.name} ajouté au panier`,
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

	const handleBuyNow = async () => {
		setIsAddingToCart(true);

		try {
			await addToCart(product.id, quantity);
			router.push('/checkout');
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

	// Conversion de la description HTML en texte pour l'affichage
	const createMarkup = (html: string) => {
		return { __html: html };
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

			<div className='flex flex-col md:flex-row gap-8'>
				{/* Galerie d'images */}
				<div className='md:w-1/2'>
					{product.images.length > 0 && (
						<div className='mb-4 relative rounded-2xl overflow-hidden bg-gray-100 aspect-square'>
							<Image
								src={product.images[selectedImage].src}
								alt={
									product.images[selectedImage].alt ||
									product.name
								}
								className='object-cover'
								fill
								sizes='(max-width: 768px) 100vw, 50vw'
								priority
							/>
							{product.on_sale && (
								<span className='absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full'>
									Promo
								</span>
							)}
						</div>
					)}

					{/* Vignettes */}
					{product.images.length > 1 && (
						<div className='grid grid-cols-5 gap-2'>
							{product.images.map((image, index) => (
								<button
									key={image.id}
									onClick={() => setSelectedImage(index)}
									className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all ${
										selectedImage === index
											? 'border-indigo-600 opacity-100'
											: 'border-transparent opacity-80 hover:opacity-100'
									}`}>
									<Image
										src={image.src}
										alt={
											image.alt ||
											`${product.name} - image ${
												index + 1
											}`
										}
										className='object-cover'
										fill
										sizes='(max-width: 768px) 20vw, 10vw'
									/>
								</button>
							))}
						</div>
					)}
				</div>

				{/* Informations produit */}
				<div className='md:w-1/2'>
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
								{product.average_rating} ({product.rating_count}{' '}
								avis)
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
										({product.stock_quantity} disponibles)
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
							dangerouslySetInnerHTML={createMarkup(
								product.short_description
							)}
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
								onClick={decrementQuantity}
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
								onChange={handleQuantityChange}
								className='text-center w-16 h-10 border-gray-200 border-y focus:ring-indigo-500 focus:border-indigo-500'
							/>
							<button
								onClick={incrementQuantity}
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

					{/* Informations supplémentaires */}
					<div className='border-t border-gray-200 mt-8 pt-8'>
						<h3 className='text-sm font-medium text-gray-900 mb-4'>
							Informations
						</h3>
						<dl className='grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2'>
							<div className='flex justify-between sm:justify-start sm:flex-col'>
								<dt className='text-sm text-gray-500'>SKU</dt>
								<dd className='text-sm font-medium text-gray-900'>
									{product.sku || 'N/A'}
								</dd>
							</div>
							<div className='flex justify-between sm:justify-start sm:flex-col'>
								<dt className='text-sm text-gray-500'>
									Catégories
								</dt>
								<dd className='text-sm font-medium text-gray-900'>
									{product.categories
										.map((cat) => cat.name)
										.join(', ') || 'N/A'}
								</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>

			{/* Description complète et onglets */}
			<div className='mt-16 border-t border-gray-200 pt-10'>
				<div className='prose prose-indigo max-w-none'>
					<h2 className='text-2xl font-bold text-gray-900 mb-6'>
						Description du produit
					</h2>
					<div
						dangerouslySetInnerHTML={createMarkup(
							product.description
						)}
					/>
				</div>
			</div>
		</div>
	);
}
