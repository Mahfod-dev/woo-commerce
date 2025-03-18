'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
	motion,
	AnimatePresence,
	useScroll,
	useTransform,
} from 'framer-motion';
import { useCart } from '@/components/CartProvider';
import { formatPrice } from '@/lib/wooClient';
import ProductGallery from './ProductGalleryComponent';

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

interface AppleStyleProductDetailProps {
	product: Product;
	accessories?: Product[];
	premiumVariant?: Product | null;
	similarProducts?: Product[];
}

export default function AppleStyleProductDetail({
	product,
	accessories = [],
	premiumVariant = null,
	similarProducts = [],
}: AppleStyleProductDetailProps) {
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
	const [activeSection, setActiveSection] = useState('overview');
	const [showCompareSection, setShowCompareSection] = useState(false);
	const { addToCart } = useCart();

	// Refs pour la navigation par scroll
	const overviewRef = useRef<HTMLDivElement>(null);
	const featuresRef = useRef<HTMLDivElement>(null);
	const accessoriesRef = useRef<HTMLDivElement>(null);
	const specsRef = useRef<HTMLDivElement>(null);

	// Animation au scroll
	const { scrollYProgress } = useScroll();
	const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
	const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

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

	// Effet pour suivre le scroll et mettre à jour la section active
	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY + 100; // Offset pour le menu collant

			if (
				overviewRef.current &&
				scrollPosition <
					overviewRef.current.offsetTop +
						overviewRef.current.clientHeight
			) {
				setActiveSection('overview');
			} else if (
				featuresRef.current &&
				scrollPosition <
					featuresRef.current.offsetTop +
						featuresRef.current.clientHeight
			) {
				setActiveSection('features');
			} else if (
				accessoriesRef.current &&
				scrollPosition <
					accessoriesRef.current.offsetTop +
						accessoriesRef.current.clientHeight
			) {
				setActiveSection('accessories');
			} else if (specsRef.current) {
				setActiveSection('specs');
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Fonction pour naviguer vers une section
	const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
		if (sectionRef.current) {
			window.scrollTo({
				top: sectionRef.current.offsetTop - 80, // Offset pour le header fixe
				behavior: 'smooth',
			});
		}
	};

	return (
		<div className='bg-white font-sans'>
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

			{/* Navigation en haut fixe (style Apple) */}
			<div className='sticky top-20 z-40 bg-white/90 backdrop-blur-md border-t border-b border-gray-200 mt-4'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-between h-16'>
						<div className='flex items-center space-x-8'>
							<h1 className='text-lg font-semibold text-gray-900'>
								{product.name}
							</h1>
						</div>
						<div className='hidden md:flex space-x-8'>
							<button
								onClick={() => scrollToSection(overviewRef)}
								className={`text-sm font-medium ${
									activeSection === 'overview'
										? 'text-indigo-600 border-b-2 border-indigo-600'
										: 'text-gray-500 hover:text-gray-900'
								} px-1 py-4`}>
								Aperçu
							</button>
							<button
								onClick={() => scrollToSection(featuresRef)}
								className={`text-sm font-medium ${
									activeSection === 'features'
										? 'text-indigo-600 border-b-2 border-indigo-600'
										: 'text-gray-500 hover:text-gray-900'
								} px-1 py-4`}>
								Caractéristiques
							</button>
							<button
								onClick={() => scrollToSection(accessoriesRef)}
								className={`text-sm font-medium ${
									activeSection === 'accessories'
										? 'text-indigo-600 border-b-2 border-indigo-600'
										: 'text-gray-500 hover:text-gray-900'
								} px-1 py-4`}>
								Accessoires
							</button>
							<button
								onClick={() => scrollToSection(specsRef)}
								className={`text-sm font-medium ${
									activeSection === 'specs'
										? 'text-indigo-600 border-b-2 border-indigo-600'
										: 'text-gray-500 hover:text-gray-900'
								} px-1 py-4`}>
								Spécifications
							</button>
						</div>
						<div className='hidden md:block'>
							<button
								onClick={handleAddToCart}
								disabled={
									isAddingToCart ||
									product.stock_status !== 'instock'
								}
								className='bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors'>
								{isAddingToCart ? (
									<span className='flex items-center'>
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
												strokeWidth='4'
											/>
											<path
												className='opacity-75'
												fill='currentColor'
												d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
											/>
										</svg>
										Ajout en cours...
									</span>
								) : (
									'Ajouter au panier'
								)}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Section Hero */}
			<section className='relative bg-gradient-to-b from-gray-50 to-white pt-24 pb-16'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<motion.div
						style={{ opacity, scale }}
						className='text-center max-w-3xl mx-auto mb-16'>
						<h1 className='text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-4'>
							{product.name}
						</h1>
						<p className='text-xl md:text-2xl text-gray-500 mb-8'>
							{product.short_description.replace(/<[^>]*>/g, '')}
						</p>
						<div className='flex flex-col sm:flex-row justify-center items-center gap-4 mb-8'>
							<span className='text-3xl font-bold text-gray-900'>
								{formatPrice(product.price)}
							</span>
							{product.on_sale && product.regular_price && (
								<span className='text-lg text-gray-500 line-through'>
									{formatPrice(product.regular_price)}
								</span>
							)}
							{product.on_sale && (
								<span className='bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full'>
									-{calculateDiscount()}%
								</span>
							)}
						</div>
						<div className='flex flex-wrap justify-center gap-4'>
							<button
								onClick={handleAddToCart}
								disabled={
									isAddingToCart ||
									product.stock_status !== 'instock'
								}
								className='bg-indigo-600 text-white px-6 py-3 rounded-full text-base font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
								{isAddingToCart ? (
									<span className='flex items-center'>
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
												strokeWidth='4'
											/>
											<path
												className='opacity-75'
												fill='currentColor'
												d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
											/>
										</svg>
										Ajout en cours...
									</span>
								) : (
									'Ajouter au panier'
								)}
							</button>
							{premiumVariant && (
								<Link
									href={`/products/${premiumVariant.slug}`}
									className='bg-gray-200 text-gray-800 px-6 py-3 rounded-full text-base font-medium hover:bg-gray-300 transition-colors'>
									Voir la version premium
								</Link>
							)}
						</div>
					</motion.div>

					{/* Galerie d'images professionnelle */}
					<div className='relative'>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							className='max-w-4xl mx-auto mb-16'>
							<ProductGallery
								images={product.images}
								productName={product.name}
							/>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Section Overview */}
			<section
				ref={overviewRef}
				className='py-24 bg-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='max-w-3xl mx-auto text-center mb-16'>
						<h2 className='text-3xl font-bold text-gray-900 mb-4'>
							Vue d'ensemble
						</h2>
						<p className='text-xl text-gray-500'>
							Découvrez ce qui rend ce produit exceptionnel
						</p>
					</div>

					{/* Grid de caractéristiques principales */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-12 mb-24'>
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-100px' }}
							transition={{ duration: 0.5 }}
							className='text-center'>
							<div className='w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6'>
								<svg
									className='h-8 w-8 text-indigo-600'
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
							<h3 className='text-xl font-semibold text-gray-900 mb-3'>
								Qualité supérieure
							</h3>
							<p className='text-gray-600'>
								Conçu avec des matériaux premium pour une
								durabilité et des performances exceptionnelles.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-100px' }}
							transition={{ duration: 0.5, delay: 0.1 }}
							className='text-center'>
							<div className='w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6'>
								<svg
									className='h-8 w-8 text-indigo-600'
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
							<h3 className='text-xl font-semibold text-gray-900 mb-3'>
								Performance optimale
							</h3>
							<p className='text-gray-600'>
								Des performances inégalées qui répondent à tous
								vos besoins quotidiens.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-100px' }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className='text-center'>
							<div className='w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6'>
								<svg
									className='h-8 w-8 text-indigo-600'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
									/>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
									/>
								</svg>
							</div>
							<h3 className='text-xl font-semibold text-gray-900 mb-3'>
								Design élégant
							</h3>
							<p className='text-gray-600'>
								Un design minimaliste et élégant qui complète
								parfaitement votre style de vie.
							</p>
						</motion.div>
					</div>

					{/* Image et texte alternés */}
					<div className='space-y-32'>
						{/* Première rangée : deux images */}
						<div className='flex flex-col md:flex-row items-center gap-12'>
							<motion.div
								initial={{ opacity: 0, x: -50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true, margin: '-100px' }}
								transition={{ duration: 0.6 }}
								className='md:w-1/2'>
								<div className='relative aspect-square rounded-2xl overflow-hidden shadow-md bg-white p-4'>
									{product.images &&
									product.images.length > 0 ? (
										<Image
											src={
												product.images[
													Math.min(
														1,
														product.images.length -
															1
													)
												]?.src || product.images[0].src
											}
											alt={product.name}
											fill
											className='object-contain'
											sizes='(max-width: 768px) 100vw, 600px'
										/>
									) : (
										<div className='w-full h-full bg-gray-100 flex items-center justify-center'>
											<svg
												className='h-16 w-16 text-gray-400'
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
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: 50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true, margin: '-100px' }}
								transition={{ duration: 0.6 }}
								className='md:w-1/2'>
								<div className='relative aspect-square rounded-2xl overflow-hidden shadow-md bg-white p-4'>
									{product.images &&
									product.images.length > 1 ? (
										<Image
											src={
												product.images[
													Math.min(
														2,
														product.images.length -
															1
													)
												]?.src || product.images[0].src
											}
											alt={product.name}
											fill
											className='object-contain'
											sizes='(max-width: 768px) 100vw, 600px'
										/>
									) : (
										<div className='w-full h-full bg-gray-100 flex items-center justify-center'>
											<svg
												className='h-16 w-16 text-gray-400'
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
							</motion.div>
						</div>

						{/* Bloc de texte "Conçu pour l'excellence" + petite image à droite */}
						<div className='flex flex-col md:flex-row items-center gap-12'>
							<motion.div
								initial={{ opacity: 0, x: -50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true, margin: '-100px' }}
								transition={{ duration: 0.6 }}
								className='md:w-1/2'>
								<h3 className='text-2xl font-bold text-gray-900 mb-4'>
									Conçu pour l'excellence
								</h3>
								<p className='text-lg text-gray-600 mb-6'>
									Chaque détail a été soigneusement pensé pour
									offrir une expérience utilisateur
									exceptionnelle. Des matériaux de haute
									qualité aux finitions impeccables, ce
									produit incarne l'excellence.
								</p>
								<ul className='space-y-4'>
									<li className='flex items-start'>
										<svg
											className='h-6 w-6 text-indigo-600 mt-0.5 mr-3 flex-shrink-0'
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
											Matériaux durables et écologiques
										</span>
									</li>
									<li className='flex items-start'>
										<svg
											className='h-6 w-6 text-indigo-600 mt-0.5 mr-3 flex-shrink-0'
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
											Design ergonomique pour un confort
											optimal
										</span>
									</li>
									<li className='flex items-start'>
										<svg
											className='h-6 w-6 text-indigo-600 mt-0.5 mr-3 flex-shrink-0'
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
											Finitions de qualité supérieure
										</span>
									</li>
								</ul>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: 50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true, margin: '-100px' }}
								transition={{ duration: 0.6 }}
								className='md:w-1/2'>
								<div className='relative aspect-square rounded-2xl overflow-hidden shadow-md bg-white p-4'>
									{product.images &&
									product.images.length > 3 ? (
										<Image
											src={
												product.images[
													Math.min(
														3,
														product.images.length -
															1
													)
												]?.src || product.images[0].src
											}
											alt={product.name}
											fill
											className='object-contain'
											sizes='(max-width: 768px) 100vw, 600px'
										/>
									) : (
										<div className='w-full h-full bg-gray-100 flex items-center justify-center'>
											<svg
												className='h-16 w-16 text-gray-400'
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
							</motion.div>
						</div>

						{/* Deuxième rangée (inversée) : texte + image */}
						<div className='flex flex-col md:flex-row-reverse items-center gap-12'>
							<motion.div
								initial={{ opacity: 0, x: 50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true, margin: '-100px' }}
								transition={{ duration: 0.6 }}
								className='md:w-1/2'>
								<h3 className='text-2xl font-bold text-gray-900 mb-4'>
									Des performances inégalées
								</h3>
								<p className='text-lg text-gray-600 mb-6'>
									Profitez de performances exceptionnelles
									jour après jour. Ce produit a été conçu pour
									offrir une efficacité maximale et une
									expérience utilisateur fluide dans toutes
									les situations.
								</p>
								<ul className='space-y-4'>
									<li className='flex items-start'>
										<svg
											className='h-6 w-6 text-indigo-600 mt-0.5 mr-3 flex-shrink-0'
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
											Fonctionnement rapide et réactif
										</span>
									</li>
									<li className='flex items-start'>
										<svg
											className='h-6 w-6 text-indigo-600 mt-0.5 mr-3 flex-shrink-0'
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
											Optimisé pour une utilisation
											intensive
										</span>
									</li>
									<li className='flex items-start'>
										<svg
											className='h-6 w-6 text-indigo-600 mt-0.5 mr-3 flex-shrink-0'
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
											Efficacité énergétique améliorée
										</span>
									</li>
								</ul>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: -50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true, margin: '-100px' }}
								transition={{ duration: 0.6 }}
								className='md:w-1/2'>
								<div className='relative aspect-square rounded-2xl overflow-hidden shadow-md bg-white p-4'>
									{product.images &&
									product.images.length > 4 ? (
										<Image
											src={
												product.images[
													Math.min(
														4,
														product.images.length -
															1
													)
												]?.src || product.images[0].src
											}
											alt={product.name}
											fill
											className='object-contain'
											sizes='(max-width: 768px) 100vw, 600px'
										/>
									) : (
										<div className='w-full h-full bg-gray-100 flex items-center justify-center'>
											<svg
												className='h-16 w-16 text-gray-400'
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
							</motion.div>
						</div>
					</div>
				</div>
			</section>

			{/* Section Caractéristiques */}
			<section
				ref={featuresRef}
				className='py-24 bg-gray-50'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='max-w-3xl mx-auto text-center mb-16'>
						<h2 className='text-3xl font-bold text-gray-900 mb-4'>
							Caractéristiques principales
						</h2>
						<p className='text-xl text-gray-500'>
							Découvrez toutes les fonctionnalités qui font de ce
							produit un choix exceptionnel
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{[...Array(6)].map((_, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: '-100px' }}
								transition={{
									duration: 0.5,
									delay: index * 0.1,
								}}
								className='bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow'>
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
											d='M13 10V3L4 14h7v7l9-11h-7z'
										/>
									</svg>
								</div>
								<h3 className='text-lg font-medium text-gray-900 mb-2'>
									Fonctionnalité {index + 1}
								</h3>
								<p className='text-gray-600'>
									Une description détaillée de cette
									fonctionnalité qui explique comment elle
									améliore votre expérience avec ce produit.
								</p>
							</motion.div>
						))}
					</div>

					{/* Bouton Comparer */}
					<div className='text-center mt-12'>
						<button
							onClick={() =>
								setShowCompareSection(!showCompareSection)
							}
							className='inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800'>
							{showCompareSection
								? 'Masquer la comparaison'
								: "Comparer avec d'autres modèles"}
							<svg
								className={`ml-2 h-5 w-5 transform transition-transform ${
									showCompareSection ? 'rotate-180' : ''
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
					</div>

					{/* Tableau de comparaison (conditionnel) */}
					<AnimatePresence>
						{showCompareSection && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.3 }}
								className='mt-8 overflow-hidden'>
								<div className='bg-white rounded-xl shadow-md overflow-hidden'>
									<div className='overflow-x-auto'>
										<table className='min-w-full divide-y divide-gray-200'>
											<thead className='bg-gray-50'>
												<tr>
													<th
														scope='col'
														className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
														Fonctionnalité
													</th>
													<th
														scope='col'
														className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
														{product.name}{' '}
														<span className='font-normal'>
															(Standard)
														</span>
													</th>
													{premiumVariant && (
														<th
															scope='col'
															className='px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider'>
															{
																premiumVariant.name
															}{' '}
															<span className='font-normal'>
																(Premium)
															</span>
														</th>
													)}
												</tr>
											</thead>
											<tbody className='bg-white divide-y divide-gray-200'>
												<tr>
													<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
														Design
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
														<span className='inline-flex items-center'>
															<svg
																className='h-5 w-5 text-green-500 mr-1'
																fill='none'
																viewBox='0 0 24 24'
																stroke='currentColor'>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	strokeWidth={
																		2
																	}
																	d='M5 13l4 4L19 7'
																/>
															</svg>
															Standard
														</span>
													</td>
													{premiumVariant && (
														<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
															<span className='inline-flex items-center'>
																<svg
																	className='h-5 w-5 text-green-500 mr-1'
																	fill='none'
																	viewBox='0 0 24 24'
																	stroke='currentColor'>
																	<path
																		strokeLinecap='round'
																		strokeLinejoin='round'
																		strokeWidth={
																			2
																		}
																		d='M5 13l4 4L19 7'
																	/>
																</svg>
																Premium
															</span>
														</td>
													)}
												</tr>
												<tr>
													<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
														Performance
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
														<span className='inline-flex items-center'>
															<svg
																className='h-5 w-5 text-green-500 mr-1'
																fill='none'
																viewBox='0 0 24 24'
																stroke='currentColor'>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	strokeWidth={
																		2
																	}
																	d='M5 13l4 4L19 7'
																/>
															</svg>
															Haute
														</span>
													</td>
													{premiumVariant && (
														<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
															<span className='inline-flex items-center'>
																<svg
																	className='h-5 w-5 text-green-500 mr-1'
																	fill='none'
																	viewBox='0 0 24 24'
																	stroke='currentColor'>
																	<path
																		strokeLinecap='round'
																		strokeLinejoin='round'
																		strokeWidth={
																			2
																		}
																		d='M5 13l4 4L19 7'
																	/>
																</svg>
																Ultra
															</span>
														</td>
													)}
												</tr>
												<tr>
													<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
														Autonomie
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
														<span className='inline-flex items-center'>
															<svg
																className='h-5 w-5 text-green-500 mr-1'
																fill='none'
																viewBox='0 0 24 24'
																stroke='currentColor'>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	strokeWidth={
																		2
																	}
																	d='M5 13l4 4L19 7'
																/>
															</svg>
															Jusqu'à 10h
														</span>
													</td>
													{premiumVariant && (
														<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
															<span className='inline-flex items-center'>
																<svg
																	className='h-5 w-5 text-green-500 mr-1'
																	fill='none'
																	viewBox='0 0 24 24'
																	stroke='currentColor'>
																	<path
																		strokeLinecap='round'
																		strokeLinejoin='round'
																		strokeWidth={
																			2
																		}
																		d='M5 13l4 4L19 7'
																	/>
																</svg>
																Jusqu'à 24h
															</span>
														</td>
													)}
												</tr>
												<tr>
													<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
														Capacité
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
														<span className='inline-flex items-center'>
															<svg
																className='h-5 w-5 text-green-500 mr-1'
																fill='none'
																viewBox='0 0 24 24'
																stroke='currentColor'>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	strokeWidth={
																		2
																	}
																	d='M5 13l4 4L19 7'
																/>
															</svg>
															Standard
														</span>
													</td>
													{premiumVariant && (
														<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
															<span className='inline-flex items-center'>
																<svg
																	className='h-5 w-5 text-green-500 mr-1'
																	fill='none'
																	viewBox='0 0 24 24'
																	stroke='currentColor'>
																	<path
																		strokeLinecap='round'
																		strokeLinejoin='round'
																		strokeWidth={
																			2
																		}
																		d='M5 13l4 4L19 7'
																	/>
																</svg>
																Étendue
															</span>
														</td>
													)}
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</section>

			{/* Section Accessoires */}
			<section
				ref={accessoriesRef}
				className='py-24 bg-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='max-w-3xl mx-auto text-center mb-16'>
						<h2 className='text-3xl font-bold text-gray-900 mb-4'>
							Accessoires recommandés
						</h2>
						<p className='text-xl text-gray-500'>
							Complétez votre expérience avec ces accessoires
							soigneusement sélectionnés
						</p>
					</div>

					{accessories.length > 0 ? (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
							{accessories.map((accessory) => (
								<motion.div
									key={accessory.id}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, margin: '-100px' }}
									transition={{ duration: 0.5 }}
									className={`bg-white rounded-xl p-6 border ${
										selectedAccessories.includes(
											accessory.id
										)
											? 'border-indigo-600 ring-2 ring-indigo-200'
											: 'border-gray-200 hover:border-gray-300'
									} transition-all cursor-pointer`}
									onClick={() =>
										toggleAccessory(accessory.id)
									}>
									<div className='relative aspect-square mb-4'>
										{accessory.images &&
										accessory.images.length > 0 ? (
											<Image
												src={accessory.images[0].src}
												alt={accessory.name}
												fill
												className='object-contain'
												sizes='(max-width: 768px) 100vw, 300px'
											/>
										) : (
											<div className='w-full h-full flex items-center justify-center bg-gray-100 rounded-lg'>
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
									<div className='flex justify-between items-start mb-3'>
										<h3 className='text-lg font-medium text-gray-900'>
											{accessory.name}
										</h3>
										<span className='font-bold text-indigo-600'>
											{formatPrice(accessory.price)}
										</span>
									</div>
									<p
										className='text-sm text-gray-600 mb-4'
										dangerouslySetInnerHTML={{
											__html: accessory.short_description,
										}}
									/>
									<div className='flex items-center'>
										<input
											type='checkbox'
											checked={selectedAccessories.includes(
												accessory.id
											)}
											onChange={() =>
												toggleAccessory(accessory.id)
											}
											className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
										/>
										<label className='ml-2 text-sm text-gray-600'>
											{selectedAccessories.includes(
												accessory.id
											)
												? 'Sélectionné'
												: 'Ajouter à mon achat'}
										</label>
									</div>
								</motion.div>
							))}
						</div>
					) : (
						<div className='text-center py-10 bg-gray-50 rounded-xl'>
							<svg
								className='mx-auto h-12 w-12 text-gray-400'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
								/>
							</svg>
							<h3 className='mt-2 text-sm font-medium text-gray-900'>
								Aucun accessoire disponible
							</h3>
							<p className='mt-1 text-sm text-gray-500'>
								Nous travaillons à ajouter des accessoires pour
								ce produit.
							</p>
						</div>
					)}

					{/* Résumé du panier avec accessoires */}
					{selectedAccessories.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className='mt-12 bg-gray-50 rounded-xl p-6 shadow-sm'>
							<h3 className='text-lg font-medium text-gray-900 mb-4'>
								Votre sélection
							</h3>
							<div className='space-y-4 mb-6'>
								<div className='flex justify-between items-center pb-4 border-b border-gray-200'>
									<div className='flex items-center'>
										<div className='bg-indigo-100 rounded-full p-2 mr-3'>
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
										<span className='text-gray-900'>
											{product.name}{' '}
											<span className='text-gray-500'>
												x {quantity}
											</span>
										</span>
									</div>
									<span className='font-medium text-gray-900'>
										{formatPrice(
											parseFloat(product.price) * quantity
										)}
									</span>
								</div>

								{selectedAccessories.map((accessoryId) => {
									const accessory = accessories.find(
										(acc) => acc.id === accessoryId
									);
									return accessory ? (
										<div
											key={accessory.id}
											className='flex justify-between items-center pb-4 border-b border-gray-200'>
											<div className='flex items-center'>
												<div className='bg-indigo-100 rounded-full p-2 mr-3'>
													<svg
														className='h-6 w-6 text-indigo-600'
														fill='none'
														viewBox='0 0 24 24'
														stroke='currentColor'>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M12 6v6m0 0v6m0-6h6m-6 0H6'
														/>
													</svg>
												</div>
												<span className='text-gray-900'>
													{accessory.name}
												</span>
											</div>
											<div className='flex items-center'>
												<button
													onClick={() =>
														toggleAccessory(
															accessory.id
														)
													}
													className='text-gray-400 hover:text-red-500 mr-3'>
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
												<span className='font-medium text-gray-900'>
													{formatPrice(
														accessory.price
													)}
												</span>
											</div>
										</div>
									) : null;
								})}
							</div>

							<div className='flex justify-between items-center pt-4 text-lg font-bold'>
								<span className='text-gray-900'>Total</span>
								<span className='text-indigo-600'>
									{formatPrice(calculateTotalPrice())}
								</span>
							</div>

							<div className='mt-6'>
								<button
									onClick={handleAddToCart}
									disabled={
										isAddingToCart ||
										product.stock_status !== 'instock'
									}
									className='w-full bg-indigo-600 text-white py-3 px-4 rounded-xl text-base font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
									{isAddingToCart ? (
										<span className='flex items-center justify-center'>
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
													strokeWidth='4'
												/>
												<path
													className='opacity-75'
													fill='currentColor'
													d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
												/>
											</svg>
											Ajout en cours...
										</span>
									) : (
										'Ajouter tout au panier'
									)}
								</button>
							</div>
						</motion.div>
					)}
				</div>
			</section>

			{/* Section Specs */}
			<section
				ref={specsRef}
				className='py-24 bg-gray-50'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='max-w-3xl mx-auto text-center mb-16'>
						<h2 className='text-3xl font-bold text-gray-900 mb-4'>
							Spécifications techniques
						</h2>
						<p className='text-xl text-gray-500'>
							Tous les détails techniques que vous devez connaître
						</p>
					</div>

					<div className='bg-white rounded-xl shadow-sm overflow-hidden'>
						<div className='border-b border-gray-200'>
							<dl>
								<div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
									<dt className='text-sm font-medium text-gray-500'>
										Nom du produit
									</dt>
									<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
										{product.name}
									</dd>
								</div>
								<div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
									<dt className='text-sm font-medium text-gray-500'>
										Référence
									</dt>
									<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
										PRD-{product.id}
									</dd>
								</div>
								<div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
									<dt className='text-sm font-medium text-gray-500'>
										Catégorie
									</dt>
									<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
										{product.categories
											.map((cat) => cat.name)
											.join(', ')}
									</dd>
								</div>
								<div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
									<dt className='text-sm font-medium text-gray-500'>
										Disponibilité
									</dt>
									<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
										{product.stock_status === 'instock' ? (
											<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
												En stock
											</span>
										) : product.stock_status ===
										  'onbackorder' ? (
											<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
												Sur commande
											</span>
										) : (
											<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
												Épuisé
											</span>
										)}
									</dd>
								</div>
								<div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
									<dt className='text-sm font-medium text-gray-500'>
										Prix
									</dt>
									<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
										{product.on_sale ? (
											<div className='flex items-center'>
												<span className='font-medium'>
													{formatPrice(product.price)}
												</span>
												<span className='ml-2 line-through text-gray-500'>
													{formatPrice(
														product.regular_price ||
															'0'
													)}
												</span>
												<span className='ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
													-{calculateDiscount()}%
												</span>
											</div>
										) : (
											formatPrice(product.price)
										)}
									</dd>
								</div>
								<div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
									<dt className='text-sm font-medium text-gray-500'>
										Description
									</dt>
									<dd
										className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 prose prose-sm max-w-none'
										dangerouslySetInnerHTML={{
											__html: product.description,
										}}
									/>
								</div>
							</dl>
						</div>
					</div>

					{/* Téléchargements et documents */}
					<div className='mt-12'>
						<h3 className='text-lg font-medium text-gray-900 mb-4'>
							Documents et ressources
						</h3>
						<div className='bg-white rounded-xl shadow-sm p-6'>
							<ul className='divide-y divide-gray-200'>
								<li className='py-4 flex'>
									<svg
										className='h-6 w-6 text-gray-400 mr-4'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
										/>
									</svg>
									<div className='ml-3'>
										<p className='text-sm font-medium text-gray-900'>
											Guide d'utilisation
										</p>
										<p className='text-sm text-gray-500'>
											PDF, 2.4 MB
										</p>
									</div>
									<div className='ml-auto'>
										<button className='text-sm font-medium text-indigo-600 hover:text-indigo-500'>
											Télécharger
										</button>
									</div>
								</li>
								<li className='py-4 flex'>
									<svg
										className='h-6 w-6 text-gray-400 mr-4'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
										/>
									</svg>
									<div className='ml-3'>
										<p className='text-sm font-medium text-gray-900'>
											Fiche technique
										</p>
										<p className='text-sm text-gray-500'>
											PDF, 1.8 MB
										</p>
									</div>
									<div className='ml-auto'>
										<button className='text-sm font-medium text-indigo-600 hover:text-indigo-500'>
											Télécharger
										</button>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			{/* Section FAQ */}
			<section className='py-24 bg-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='max-w-3xl mx-auto text-center mb-16'>
						<h2 className='text-3xl font-bold text-gray-900 mb-4'>
							Questions fréquentes
						</h2>
						<p className='text-xl text-gray-500'>
							Tout ce que vous devez savoir sur ce produit
						</p>
					</div>

					<div className='max-w-3xl mx-auto'>
						<dl className='space-y-6 divide-y divide-gray-200'>
							<div className='pt-6'>
								<dt className='text-lg'>
									<button className='text-left w-full flex justify-between items-start text-gray-900 focus:outline-none'>
										<span className='font-medium'>
											Quelle est la durée de la garantie ?
										</span>
										<span className='ml-6 h-7 flex items-center'>
											<svg
												className='h-6 w-6 text-indigo-600'
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
										</span>
									</button>
								</dt>
								<dd className='mt-2 pr-12'>
									<p className='text-base text-gray-600'>
										Tous nos produits sont couverts par une
										garantie de 2 ans. Nous proposons
										également une extension de garantie
										payante pour une année supplémentaire.
									</p>
								</dd>
							</div>

							<div className='pt-6'>
								<dt className='text-lg'>
									<button className='text-left w-full flex justify-between items-start text-gray-900 focus:outline-none'>
										<span className='font-medium'>
											Comment choisir entre ce modèle et
											la version premium ?
										</span>
										<span className='ml-6 h-7 flex items-center'>
											<svg
												className='h-6 w-6 text-indigo-600'
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
										</span>
									</button>
								</dt>
								<dd className='mt-2 pr-12'>
									<p className='text-base text-gray-600'>
										Ce modèle standard est idéal pour un
										usage quotidien. Si vous avez besoin de
										fonctionnalités avancées ou d'une
										performance supérieure, la version
										premium sera plus adaptée à vos besoins.
									</p>
								</dd>
							</div>

							<div className='pt-6'>
								<dt className='text-lg'>
									<button className='text-left w-full flex justify-between items-start text-gray-900 focus:outline-none'>
										<span className='font-medium'>
											Les accessoires sont-ils nécessaires
											?
										</span>
										<span className='ml-6 h-7 flex items-center'>
											<svg
												className='h-6 w-6 text-indigo-600'
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
										</span>
									</button>
								</dt>
								<dd className='mt-2 pr-12'>
									<p className='text-base text-gray-600'>
										Non, le produit est entièrement
										fonctionnel sans accessoires. Cependant,
										nos accessoires peuvent améliorer votre
										expérience et ajouter des
										fonctionnalités supplémentaires.
									</p>
								</dd>
							</div>
						</dl>
					</div>

					<div className='max-w-3xl mx-auto text-center mt-12'>
						<Link
							href='/faq'
							className='text-base font-medium text-indigo-600 hover:text-indigo-800'>
							Voir toutes les questions fréquentes
							<span
								aria-hidden='true'
								className='ml-1'>
								&rarr;
							</span>
						</Link>
					</div>
				</div>
			</section>

			{/* CTA - Bannière d'ajout au panier (mobile) */}
			<section className='sticky bottom-0 z-30 bg-white/90 backdrop-blur-md border-t border-gray-200 py-6 md:hidden'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center'>
						<div>
							<p className='text-sm text-gray-500'>Total</p>
							<p className='text-lg font-bold text-indigo-600'>
								{formatPrice(calculateTotalPrice())}
							</p>
						</div>
						<button
							onClick={handleAddToCart}
							disabled={
								isAddingToCart ||
								product.stock_status !== 'instock'
							}
							className='bg-indigo-600 text-white px-6 py-2 rounded-full text-base font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
							{isAddingToCart ? (
								<span className='flex items-center'>
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
											strokeWidth='4'
										/>
										<path
											className='opacity-75'
											fill='currentColor'
											d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
										/>
									</svg>
									Ajout...
								</span>
							) : (
								'Ajouter au panier'
							)}
						</button>
					</div>
				</div>
			</section>

			{/* Section "Vous aimerez aussi" */}
			{similarProducts.length > 0 && (
				<section className='py-24 bg-gray-50'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='max-w-3xl mx-auto text-center mb-16'>
							<h2 className='text-3xl font-bold text-gray-900 mb-4'>
								Vous aimerez aussi
							</h2>
							<p className='text-xl text-gray-500'>
								D'autres produits qui pourraient vous intéresser
							</p>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
							{similarProducts.map((similarProduct) => (
								<motion.div
									key={similarProduct.id}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, margin: '-100px' }}
									transition={{ duration: 0.5 }}
									className='bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300'>
									<Link
										href={`/products/${similarProduct.slug}`}
										className='block'>
										<div className='relative aspect-square'>
											{similarProduct.images &&
											similarProduct.images.length > 0 ? (
												<Image
													src={
														similarProduct.images[0]
															.src
													}
													alt={similarProduct.name}
													fill
													className='object-cover'
													sizes='(max-width: 768px) 100vw, 300px'
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
										<div className='p-6'>
											<h3 className='text-lg font-medium text-gray-900 mb-2'>
												{similarProduct.name}
											</h3>
											<p className='text-indigo-600 font-bold mb-3'>
												{formatPrice(
													similarProduct.price
												)}
											</p>
											<p className='text-sm text-gray-600 line-clamp-3'>
												{similarProduct.short_description.replace(
													/<[^>]*>/g,
													''
												)}
											</p>
										</div>
									</Link>
								</motion.div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Footer avec garanties */}
			<section className='py-16 bg-white border-t border-gray-200'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
						<div className='text-center'>
							<div className='inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4'>
								<svg
									className='h-6 w-6 text-indigo-600'
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
							<h3 className='text-lg font-medium text-gray-900 mb-2'>
								Livraison rapide
							</h3>
							<p className='text-sm text-gray-600'>
								Livraison en 2-3 jours ouvrables
							</p>
						</div>
						<div className='text-center'>
							<div className='inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4'>
								<svg
									className='h-6 w-6 text-indigo-600'
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
							<h3 className='text-lg font-medium text-gray-900 mb-2'>
								Garantie 2 ans
							</h3>
							<p className='text-sm text-gray-600'>
								Pour une tranquillité d'esprit totale
							</p>
						</div>
						<div className='text-center'>
							<div className='inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4'>
								<svg
									className='h-6 w-6 text-indigo-600'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
									/>
								</svg>
							</div>
							<h3 className='text-lg font-medium text-gray-900 mb-2'>
								Paiement sécurisé
							</h3>
							<p className='text-sm text-gray-600'>
								Transactions cryptées et sécurisées
							</p>
						</div>
						<div className='text-center'>
							<div className='inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4'>
								<svg
									className='h-6 w-6 text-indigo-600'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z'
									/>
								</svg>
							</div>
							<h3 className='text-lg font-medium text-gray-900 mb-2'>
								Retours gratuits
							</h3>
							<p className='text-sm text-gray-600'>
								30 jours pour changer d'avis
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
