'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartProvider';
import { formatPrice } from '@/lib/wooClient';

const MiniCart = () => {
	const [isOpen, setIsOpen] = useState(false);
	const cartRef = useRef(null);
	const {
		items,
		itemCount,
		subtotal,
		removeFromCart,
		updateQuantity,
		isLoading,
	} = useCart();

	// Fermer le mini-panier quand on clique en dehors
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (cartRef.current && !cartRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Animation variants pour framer-motion
	const dropdownVariants = {
		hidden: {
			opacity: 0,
			y: -10,
			scale: 0.95,
			transformOrigin: 'top right',
		},
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: 0.2,
				ease: 'easeOut',
			},
		},
		exit: {
			opacity: 0,
			y: -10,
			scale: 0.95,
			transition: {
				duration: 0.1,
				ease: 'easeIn',
			},
		},
	};

	return (
		<div
			ref={cartRef}
			className='relative z-50'>
			{/* Bouton du panier */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				onMouseEnter={() => setIsOpen(true)}
				className='relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors'
				aria-label='Panier'>
				<svg
					className='h-6 w-6 text-gray-800'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
					/>
				</svg>

				{itemCount > 0 && (
					<motion.span
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className='absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
						{itemCount}
					</motion.span>
				)}
			</button>

			{/* Dropdown du mini-panier */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						variants={dropdownVariants}
						initial='hidden'
						animate='visible'
						exit='exit'
						className='absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden'>
						<div className='p-4 border-b border-gray-100'>
							<div className='flex justify-between items-center'>
								<h3 className='font-medium text-gray-900'>
									Votre panier
								</h3>
								<span className='text-sm text-gray-600'>
									{itemCount} article
									{itemCount !== 1 ? 's' : ''}
								</span>
							</div>
						</div>

						{items.length === 0 ? (
							<div className='p-8 text-center'>
								<svg
									className='mx-auto h-12 w-12 text-gray-400'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
									/>
								</svg>
								<p className='mt-4 text-gray-600'>
									Votre panier est vide
								</p>
								<Link
									href='/products'
									className='mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-800'
									onClick={() => setIsOpen(false)}>
									Découvrir nos produits
								</Link>
							</div>
						) : (
							<>
								<div className='max-h-72 overflow-y-auto divide-y divide-gray-100'>
									{items.map((item) => (
										<div
											key={item.key}
											className='p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors'>
											<div className='relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border border-gray-200'>
												<Image
													src={item.image}
													alt={item.name}
													fill
													sizes='64px'
													className='object-cover'
												/>
											</div>

											<div className='flex-grow min-w-0'>
												<h4 className='text-sm font-medium text-gray-900 truncate'>
													{item.name}
												</h4>
												<div className='flex items-center justify-between mt-1'>
													<div className='flex items-center'>
														<button
															onClick={() =>
																updateQuantity(
																	item.key,
																	Math.max(
																		1,
																		item.quantity -
																			1
																	)
																)
															}
															disabled={isLoading}
															className='text-gray-500 hover:text-gray-700 p-1'>
															<svg
																className='h-3 w-3'
																fill='none'
																viewBox='0 0 24 24'
																stroke='currentColor'>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	strokeWidth={
																		2
																	}
																	d='M20 12H4'
																/>
															</svg>
														</button>
														<span className='mx-1 text-sm text-gray-600'>
															{item.quantity}
														</span>
														<button
															onClick={() =>
																updateQuantity(
																	item.key,
																	item.quantity +
																		1
																)
															}
															disabled={isLoading}
															className='text-gray-500 hover:text-gray-700 p-1'>
															<svg
																className='h-3 w-3'
																fill='none'
																viewBox='0 0 24 24'
																stroke='currentColor'>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	strokeWidth={
																		2
																	}
																	d='M12 4v16m8-8H4'
																/>
															</svg>
														</button>
													</div>
													<span className='text-sm font-medium text-gray-900'>
														{formatPrice(
															parseFloat(
																item.price
															) * item.quantity
														)}
													</span>
												</div>
											</div>

											<button
												onClick={() =>
													removeFromCart(item.key)
												}
												disabled={isLoading}
												className='text-gray-400 hover:text-red-500 p-1'
												aria-label='Supprimer'>
												<svg
													className='h-5 w-5'
													fill='none'
													viewBox='0 0 24 24'
													stroke='currentColor'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M6 18L18 6M6 6l12 12'
													/>
												</svg>
											</button>
										</div>
									))}
								</div>

								<div className='p-4 border-t border-gray-100 bg-gray-50'>
									<div className='flex justify-between items-center mb-4'>
										<span className='font-medium text-gray-900'>
											Sous-total
										</span>
										<span className='font-bold text-indigo-600'>
											{formatPrice(subtotal)}
										</span>
									</div>

									<div className='grid grid-cols-2 gap-2'>
										<Link
											href='/cart'
											className='py-2 px-4 text-center text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors'
											onClick={() => setIsOpen(false)}>
											Voir le panier
										</Link>
										<Link
											href='/checkout'
											className='py-2 px-4 text-center text-sm bg-indigo-600 rounded-md text-white hover:bg-indigo-700 transition-colors'
											onClick={() => setIsOpen(false)}>
											Commander
										</Link>
									</div>
								</div>
							</>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default MiniCart;
