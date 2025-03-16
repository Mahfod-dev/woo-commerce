'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const MegaMenu = ({ categories }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const menuRef = useRef(null);

	// Exemple de structure de sous-catégories et de produits populaires (à adapter selon vos données)
	// Dans une implémentation réelle, ces données viendraient de votre API
	const categoryDetails = {
		1: {
			subCategories: [
				{
					id: 101,
					name: 'Sous-catégorie 1.1',
					slug: 'sub-category-1-1',
				},
				{
					id: 102,
					name: 'Sous-catégorie 1.2',
					slug: 'sub-category-1-2',
				},
				{
					id: 103,
					name: 'Sous-catégorie 1.3',
					slug: 'sub-category-1-3',
				},
			],
			popularProducts: [
				{
					id: 1001,
					name: 'Produit populaire 1.1',
					slug: 'popular-product-1-1',
					image: '/placeholder.jpg',
				},
				{
					id: 1002,
					name: 'Produit populaire 1.2',
					slug: 'popular-product-1-2',
					image: '/placeholder.jpg',
				},
			],
		},
		2: {
			subCategories: [
				{
					id: 201,
					name: 'Sous-catégorie 2.1',
					slug: 'sub-category-2-1',
				},
				{
					id: 202,
					name: 'Sous-catégorie 2.2',
					slug: 'sub-category-2-2',
				},
			],
			popularProducts: [
				{
					id: 2001,
					name: 'Produit populaire 2.1',
					slug: 'popular-product-2-1',
					image: '/placeholder.jpg',
				},
				{
					id: 2002,
					name: 'Produit populaire 2.2',
					slug: 'popular-product-2-2',
					image: '/placeholder.jpg',
				},
				{
					id: 2003,
					name: 'Produit populaire 2.3',
					slug: 'popular-product-2-3',
					image: '/placeholder.jpg',
				},
			],
		},
		// Vous pouvez ajouter d'autres catégories ici
	};

	// Fermer le menu quand on clique en dehors
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Animation variants
	const menuVariants = {
		hidden: {
			opacity: 0,
			y: -20,
			transition: {
				duration: 0.2,
				ease: 'easeInOut',
			},
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.3,
				ease: 'easeOut',
				staggerChildren: 0.05,
			},
		},
		exit: {
			opacity: 0,
			y: -20,
			transition: {
				duration: 0.2,
				ease: 'easeInOut',
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 10 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<div
			ref={menuRef}
			className='relative'>
			{/* Bouton pour ouvrir/fermer le méga-menu */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				onMouseEnter={() => setIsOpen(true)}
				className={`flex items-center py-2 px-4 rounded-md transition-colors ${
					isOpen
						? 'bg-gray-100 text-indigo-600'
						: 'text-gray-700 hover:text-indigo-600'
				}`}>
				<span className='mr-1'>Catégories</span>
				<svg
					className={`h-5 w-5 transition-transform ${
						isOpen ? 'rotate-180' : ''
					}`}
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M19 9l-7 7-7-7'
					/>
				</svg>
			</button>

			{/* Le méga-menu */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						variants={menuVariants}
						initial='hidden'
						animate='visible'
						exit='exit'
						className='absolute left-0 z-50 mt-2 w-screen max-w-screen-xl bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden'
						onMouseLeave={() => setIsOpen(false)}>
						<div className='grid grid-cols-4 gap-0'>
							{/* Liste des catégories principales */}
							<div className='col-span-1 bg-gray-50 border-r border-gray-200 py-6 h-96 overflow-y-auto'>
								<ul className='space-y-1'>
									{categories.map((category) => (
										<motion.li
											key={category.id}
											variants={itemVariants}>
											<button
												onClick={() =>
													setSelectedCategory(
														category.id
													)
												}
												onMouseEnter={() =>
													setSelectedCategory(
														category.id
													)
												}
												className={`w-full text-left px-6 py-3 flex items-center justify-between transition-colors ${
													selectedCategory ===
													category.id
														? 'bg-gray-100 text-indigo-600 font-medium'
														: 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
												}`}>
												<span>{category.name}</span>
												<svg
													className={`h-4 w-4 transition-transform ${
														selectedCategory ===
														category.id
															? 'rotate-180'
															: ''
													}`}
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
										</motion.li>
									))}
								</ul>
							</div>

							{/* Détails de la catégorie sélectionnée */}
							<div className='col-span-3 p-6'>
								{selectedCategory &&
								categoryDetails[selectedCategory] ? (
									<div className='grid grid-cols-3 gap-8'>
										{/* Sous-catégories */}
										<div className='col-span-1'>
											<h3 className='text-lg font-semibold text-gray-900 mb-4'>
												Sous-catégories
											</h3>
											<ul className='space-y-2'>
												{categoryDetails[
													selectedCategory
												].subCategories.map(
													(subCat) => (
														<motion.li
															key={subCat.id}
															variants={
																itemVariants
															}>
															<Link
																href={`/categories/${subCat.slug}`}
																className='text-gray-600 hover:text-indigo-600 transition-colors flex items-center'
																onClick={() =>
																	setIsOpen(
																		false
																	)
																}>
																<svg
																	className='h-4 w-4 mr-2'
																	fill='none'
																	viewBox='0 0 24 24'
																	stroke='currentColor'>
																	<path
																		strokeLinecap='round'
																		strokeLinejoin='round'
																		strokeWidth={
																			2
																		}
																		d='M9 5l7 7-7 7'
																	/>
																</svg>
																{subCat.name}
															</Link>
														</motion.li>
													)
												)}

												<motion.li
													variants={itemVariants}
													className='pt-2'>
													<Link
														href={`/categories/${
															categories.find(
																(cat) =>
																	cat.id ===
																	selectedCategory
															)?.slug
														}`}
														className='text-indigo-600 font-medium hover:text-indigo-800 transition-colors flex items-center'
														onClick={() =>
															setIsOpen(false)
														}>
														Voir toutes les
														sous-catégories
														<svg
															className='h-4 w-4 ml-1'
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
												</motion.li>
											</ul>
										</div>

										{/* Produits populaires */}
										<div className='col-span-2'>
											<h3 className='text-lg font-semibold text-gray-900 mb-4'>
												Produits populaires
											</h3>
											<div className='grid grid-cols-2 gap-4'>
												{categoryDetails[
													selectedCategory
												].popularProducts.map(
													(product) => (
														<motion.div
															key={product.id}
															variants={
																itemVariants
															}
															whileHover={{
																y: -5,
															}}
															className='group'>
															<Link
																href={`/products/${product.slug}`}
																className='block'
																onClick={() =>
																	setIsOpen(
																		false
																	)
																}>
																<div className='relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2 group-hover:shadow-md transition-shadow'>
																	<Image
																		src={
																			product.image
																		}
																		alt={
																			product.name
																		}
																		fill
																		sizes='(max-width: 768px) 50vw, 25vw'
																		className='object-cover group-hover:scale-105 transition-transform duration-300'
																	/>
																</div>
																<h4 className='text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors'>
																	{
																		product.name
																	}
																</h4>
															</Link>
														</motion.div>
													)
												)}
											</div>
										</div>
									</div>
								) : (
									<div className='h-full flex items-center justify-center'>
										<p className='text-gray-500'>
											Sélectionnez une catégorie pour voir
											les détails
										</p>
									</div>
								)}
							</div>
						</div>

						{/* Pied du méga-menu avec offres et navigation rapide */}
						<div className='bg-gray-50 border-t border-gray-200 p-6'>
							<div className='flex justify-between items-center'>
								<div>
									<h3 className='text-sm font-semibold text-gray-900'>
										Offres spéciales
									</h3>
									<p className='text-sm text-gray-600'>
										Découvrez nos promotions exclusives
									</p>
								</div>
								<Link
									href='/promotions'
									className='inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors'
									onClick={() => setIsOpen(false)}>
									Voir les offres
								</Link>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default MegaMenu;
