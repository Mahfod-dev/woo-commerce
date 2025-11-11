'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryProducts, type SimplifiedProduct } from '@/app/actions/categories';

// Interface pour les catégories
// Cette interface utilise la même structure que WooCategory de l'API WooCommerce
interface Category {
	id: number;
	name: string;
	slug: string;
	count?: number;
	image?: {
		id?: number;
		src: string;
		alt?: string;
	} | null;
}

// Interface pour les détails de catégorie
interface CategoryDetail {
	popularProducts: SimplifiedProduct[];
}

// Type pour le dictionnaire des détails de catégorie
type CategoryDetailsType = {
	[key: number]: CategoryDetail;
};

interface MegaMenuProps {
	categories: Category[];
	isDarkBg?: boolean;
}

const MegaMenu = ({ categories, isDarkBg = false }: MegaMenuProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<number | null>(
		null
	);
	const [categoryDetails, setCategoryDetails] = useState<CategoryDetailsType>(
		{}
	);
	const [isLoading, setIsLoading] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	// Fonction pour charger les détails d'une catégorie
	const loadCategoryDetails = async (categoryId: number) => {
		if (categoryDetails[categoryId]) return; // Déjà chargé

		setIsLoading(true);
		try {
			// Utiliser la Server Action pour récupérer les produits
			const products = await getCategoryProducts(categoryId);

			// Mettre à jour les détails
			setCategoryDetails((prev) => ({
				...prev,
				[categoryId]: {
					popularProducts: products,
				},
			}));
		} catch (error) {
			console.error(
				'Erreur lors du chargement des détails de catégorie:',
				error
			);
		} finally {
			setIsLoading(false);
		}
	};

	// Si pas de catégories, générer quelques fausses données pour la démo
	if (!categories || categories.length === 0) {
		categories = [
			{ id: 1, name: 'Catégorie 1', slug: 'categorie-1' },
			{ id: 2, name: 'Catégorie 2', slug: 'categorie-2' },
			{ id: 3, name: 'Catégorie 3', slug: 'categorie-3' },
		];
	}

	// Fermer le menu quand on clique en dehors
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				event.target instanceof Node &&
				!menuRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Définir la catégorie sélectionnée par défaut quand le menu s'ouvre
	useEffect(() => {
		if (isOpen && !selectedCategory && categories.length > 0) {
			setSelectedCategory(categories[0].id);
		}
	}, [isOpen, selectedCategory, categories]);

	// Charger les détails de la catégorie quand elle est sélectionnée
	useEffect(() => {
		if (selectedCategory) {
			loadCategoryDetails(selectedCategory);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCategory]);

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
				className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
					isOpen
						? isDarkBg
							? 'bg-white/20 text-white'
							: 'bg-indigo-50 text-indigo-600'
						: isDarkBg
						? 'text-white hover:bg-white/20'
						: 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
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
						className='absolute left-0 z-50 mt-2 w-screen max-w-screen-lg bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden'
						onMouseLeave={() => setIsOpen(false)}>
						<div className='grid grid-cols-4 gap-0'>
							{/* Liste des catégories principales */}
							<div className='col-span-1 bg-gray-50 border-r border-gray-200 py-6 max-h-96 overflow-y-auto'>
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
													className='h-4 w-4 text-gray-400'
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
							<div className='col-span-3 p-6 bg-white'>
								{isLoading ? (
									// Indicateur de chargement
									<div className='h-64 flex flex-col items-center justify-center text-center p-8'>
										<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4'></div>
										<p className='text-gray-500'>
											Chargement des informations...
										</p>
									</div>
								) : selectedCategory &&
								  categoryDetails[selectedCategory] ? (
									<div>
										{/* Produits populaires - maintenant en pleine largeur */}
										<div>
											<div className='flex justify-between items-center mb-4'>
												<h3 className='text-lg font-semibold text-gray-900'>
													Produits populaires
												</h3>
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
													Voir tous les produits
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
											</div>
											<div className='grid grid-cols-4 gap-4'>
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
									// Si la catégorie n'a pas de détails ou si aucune catégorie n'est sélectionnée
									<div className='h-64 flex flex-col items-center justify-center text-center p-8'>
										<svg
											className='h-16 w-16 text-indigo-100 mb-4'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M4 6h16M4 12h16M4 18h16'
											/>
										</svg>
										<h3 className='text-lg font-medium text-gray-900 mb-1'>
											Explorez nos catégories
										</h3>
										<p className='text-gray-500 max-w-md'>
											Découvrez notre large gamme de
											produits organisés en catégories
											pour faciliter votre navigation.
										</p>
									</div>
								)}
							</div>
						</div>

						{/* Pied du méga-menu avec offres et navigation rapide */}
						<div className='bg-gray-50 border-t border-gray-200 p-4'>
							<div className='flex flex-wrap justify-between items-center'>
								<div className='mb-2 sm:mb-0'>
									<h3 className='text-sm font-semibold text-gray-900'>
										Offres spéciales
									</h3>
									<p className='text-sm text-gray-600'>
										Découvrez nos promotions exclusives
									</p>
								</div>
								<Link
									href='/promotions'
									className='inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm'
									onClick={() => setIsOpen(false)}>
									Voir les offres
									<svg
										className='ml-2 h-4 w-4'
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
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default MegaMenu;
