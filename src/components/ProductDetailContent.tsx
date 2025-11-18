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
import VariationSelector from './VariationSelector';
import { getProductVariations, WooVariation } from '@/lib/woo';

// Function to extract features from HTML description
const extractFeaturesFromHTML = (htmlContent: string): string[] => {
	if (typeof document === 'undefined') return [];

	// Parse the HTML description to extract key points
	const tempDiv = document.createElement('div');
	tempDiv.innerHTML = htmlContent;

	// Look for bullet lists (ul/li) or paragraphs
	const listItems = tempDiv.querySelectorAll('li');
	const paragraphs = tempDiv.querySelectorAll('p');

	// Build a feature array from the content
	let features: string[] = [];

	// If we find list items, use them first
	if (listItems.length > 0) {
		features = Array.from(listItems)
			.map((item) => item.textContent?.trim() || '')
			.filter((text) => text.length > 10);
	}
	// Otherwise use short paragraphs as features
	else if (paragraphs.length > 0) {
		features = Array.from(paragraphs)
			.map((p) => p.textContent?.trim() || '')
			.filter((text) => text.length > 10 && text.length < 200);
	}

	// Limit to 6 features maximum
	features = features.slice(0, 6);

	return features;
};

/* ========================================
 * SECTION DOCUMENTS - DÉSACTIVÉE
 * ========================================
 * Code commenté pour future réactivation.
 * Voir src/app/products/[id]/page.tsx pour décommenter generateDocuments()
 * ======================================== */

// Fonction pour obtenir l'icône appropriée selon le type de document - DÉSACTIVÉE
/*
const getDocumentIcon = (type: ProductDocument['type']) => {
	switch (type) {
		case 'pdf':
			return (
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
				/>
			);
		case 'doc':
			return (
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
				/>
			);
		case 'image':
			return (
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
				/>
			);
		case 'video':
			return (
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
				/>
			);
		default:
			return (
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
				/>
			);
	}
};
*/

// Type pour les documents - DÉSACTIVÉ
/*
interface ProductDocument {
	id: string;
	name: string;
	description: string;
	url: string;
	size: string;
	type: 'pdf' | 'doc' | 'image' | 'video' | 'other';
}
*/

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
	// Attributs techniques
	weight?: string;
	dimensions?: {
		length: string;
		width: string;
		height: string;
	};
	attributes?: {
		id: number;
		name: string;
		position: number;
		visible: boolean;
		variation: boolean;
		options: string[];
	}[];
	// Documents et ressources - DÉSACTIVÉ
	// documents?: ProductDocument[];
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
	const [variations, setVariations] = useState<WooVariation[]>([]);
	const [selectedVariationId, setSelectedVariationId] = useState<number | null>(null);
	const [selectedVariation, setSelectedVariation] = useState<WooVariation | null>(null);
	const [loadingVariations, setLoadingVariations] = useState(false);
	const [features, setFeatures] = useState<string[]>([
		"Bien plus qu'un",
		'Conception ergonomique',
		'Matériaux durables',
		'Performance optimale',
		'Design élégant',
		'Fonctionnalités innovantes',
	]);
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

	// Extract features from product description (client-side only)
	useEffect(() => {
		if (typeof window !== 'undefined') {
			try {
				const extractedFeatures = extractFeaturesFromHTML(product.description);
				if (extractedFeatures && extractedFeatures.length > 0) {
					setFeatures(extractedFeatures);
				}
			} catch (error) {
				console.error('Error extracting features:', error);
			}
		}
	}, [product.description]);

	// Load variations if product has variations
	useEffect(() => {
		const loadVariations = async () => {
			if (product.attributes && product.attributes.some(attr => attr.variation)) {
				setLoadingVariations(true);
				try {
					const vars = await getProductVariations(product.id);
					setVariations(vars);
				} catch (error) {
					console.error('Error loading variations:', error);
				} finally {
					setLoadingVariations(false);
				}
			}
		};

		loadVariations();
	}, [product.id, product.attributes]);

	// Handle variation selection
	const handleVariationChange = (variationId: number | null, variation: WooVariation | null) => {
		setSelectedVariationId(variationId);
		setSelectedVariation(variation);
	};

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
		// Check if product has variations and no variation is selected
		const hasVariations = product.attributes && product.attributes.some(attr => attr.variation);
		if (hasVariations && !selectedVariationId) {
			setNotification({
				show: true,
				message: 'Veuillez sélectionner toutes les options du produit',
				type: 'error',
			});
			setTimeout(() => {
				setNotification({ show: false, message: '', type: '' });
			}, 3000);
			return;
		}

		setIsAddingToCart(true);

		try {
			// Ajouter le produit principal au panier avec la variation si sélectionnée
			await addToCart(product.id, quantity, selectedVariationId || undefined);

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
	const scrollToSection = (
		sectionRef: React.RefObject<HTMLDivElement | null>
	) => {
		if (sectionRef.current) {
			window.scrollTo({
				top: sectionRef.current.offsetTop - 80, // Offset pour le header fixe
				behavior: 'smooth',
			});
		}
	};

	return (
		<>
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
									onClick={() =>
										scrollToSection(accessoriesRef)
									}
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
								{product.short_description.replace(
									/<[^>]*>/g,
									''
								)}
							</p>
							<div className='flex flex-col sm:flex-row justify-center items-center gap-4 mb-8'>
								<span className='text-3xl font-bold text-gray-900'>
									{selectedVariation
										? formatPrice(selectedVariation.price)
										: formatPrice(product.price)
									}
								</span>
								{((selectedVariation?.on_sale && selectedVariation?.regular_price) || (product.on_sale && product.regular_price)) && (
									<span className='text-lg text-gray-500 line-through'>
										{selectedVariation && selectedVariation.regular_price
											? formatPrice(selectedVariation.regular_price)
											: product.regular_price
											? formatPrice(product.regular_price)
											: null
										}
									</span>
								)}
								{(selectedVariation?.on_sale || product.on_sale) && (
									<span className='bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full'>
										-{calculateDiscount()}%
									</span>
								)}
							</div>

							{/* Variation Selector */}
							{product.attributes && product.attributes.some(attr => attr.variation) && variations.length > 0 && (
								<div className='max-w-2xl mx-auto mb-8'>
									<VariationSelector
										productId={product.id}
										variations={variations}
										attributes={product.attributes}
										onVariationChange={handleVariationChange}
									/>
								</div>
							)}

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
										href={`/products/${premiumVariant.id}-${premiumVariant.slug}`}
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
								className='max-w-4xl mx-auto mb-12'>
								<ProductGallery
									images={product.images}
									productName={product.name}
								/>
							</motion.div>
						</div>

						{/* Description complète du produit */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className='max-w-4xl mx-auto mt-12'>
							<div className='bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100'>
								<h3 className='text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-indigo-100'>
									Description
								</h3>
								<div
									className='product-description prose prose-lg max-w-none text-gray-700'
									style={{
										lineHeight: '2',
										fontSize: '1.0625rem'
									}}
									dangerouslySetInnerHTML={{ __html: product.description }}
								/>
								<style jsx>{`
									.product-description :global(p) {
										margin-bottom: 2.5rem;
										line-height: 2;
										color: #374151;
									}
									.product-description :global(h1),
									.product-description :global(h2),
									.product-description :global(h3) {
										color: #4f46e5;
										font-weight: 700;
										margin-top: 3rem;
										margin-bottom: 1.5rem;
									}
									.product-description :global(h2) {
										font-size: 1.5rem;
										border-bottom: 2px solid #e0e7ff;
										padding-bottom: 0.5rem;
									}
									.product-description :global(ul) {
										margin: 2.5rem 0;
										padding-left: 0;
										list-style: none;
									}
									.product-description :global(ul li) {
										position: relative;
										padding-left: 2rem;
										margin-bottom: 1.25rem;
										line-height: 2;
										font-size: 1.0625rem;
									}
									.product-description :global(ul li::before) {
										content: '✓';
										position: absolute;
										left: 0;
										top: 0;
										color: #10b981;
										font-weight: bold;
										width: 1.5rem;
										height: 1.5rem;
										display: flex;
										align-items: center;
										justify-content: center;
										background: #d1fae5;
										border-radius: 50%;
										font-size: 0.875rem;
									}
								`}</style>
							</div>
						</motion.div>
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
									durabilité et des performances
									exceptionnelles.
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
									Des performances inégalées qui répondent à
									tous vos besoins quotidiens.
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
									Un design minimaliste et élégant qui
									complète parfaitement votre style de vie.
								</p>
							</motion.div>
						</div>

						{/* Image et texte alternés - Afficher uniquement si images disponibles */}
						{product.images && product.images.length > 1 && (
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
											<Image
												src={
													product.images[
														Math.min(
															1,
															product.images
																.length - 1
														)
													]?.src ||
													product.images[0].src
												}
												alt={product.name}
												fill
												className='object-contain'
												sizes='(max-width: 768px) 100vw, 600px'
											/>
										</div>
									</motion.div>

									{product.images.length > 2 && (
										<motion.div
											initial={{ opacity: 0, x: 50 }}
											whileInView={{ opacity: 1, x: 0 }}
											viewport={{ once: true, margin: '-100px' }}
											transition={{ duration: 0.6 }}
											className='md:w-1/2'>
											<div className='relative aspect-square rounded-2xl overflow-hidden shadow-md bg-white p-4'>
												<Image
													src={
														product.images[
															Math.min(
																2,
																product.images
																	.length - 1
															)
														]?.src ||
														product.images[0].src
													}
													alt={product.name}
													fill
													className='object-contain'
													sizes='(max-width: 768px) 100vw, 600px'
												/>
											</div>
										</motion.div>
									)}
								</div>

								{/* Bloc de texte "Conçu pour l'excellence" + petite image à droite */}
								<div className={`flex flex-col md:flex-row items-center gap-12 ${product.images.length <= 3 ? 'justify-center' : ''}`}>
									<motion.div
										initial={{ opacity: 0, x: -50 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true, margin: '-100px' }}
										transition={{ duration: 0.6 }}
										className={product.images.length > 3 ? 'md:w-1/2' : 'max-w-2xl'}>
										<h3 className='text-2xl font-bold text-gray-900 mb-4'>
											Conçu pour l'excellence
										</h3>
										<p className='text-lg text-gray-600 mb-6'>
											Chaque détail a été soigneusement pensé
											pour offrir une expérience utilisateur
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
													Matériaux durables et
													écologiques
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
													Design ergonomique pour un
													confort optimal
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

									{product.images.length > 3 && (
										<motion.div
											initial={{ opacity: 0, x: 50 }}
											whileInView={{ opacity: 1, x: 0 }}
											viewport={{ once: true, margin: '-100px' }}
											transition={{ duration: 0.6 }}
											className='md:w-1/2'>
											<div className='relative aspect-square rounded-2xl overflow-hidden shadow-md bg-white p-4'>
												<Image
													src={
														product.images[
															Math.min(
																3,
																product.images
																	.length - 1
															)
														]?.src ||
														product.images[0].src
													}
													alt={product.name}
													fill
													className='object-contain'
													sizes='(max-width: 768px) 100vw, 600px'
												/>
											</div>
										</motion.div>
									)}
								</div>

								{/* Deuxième rangée (inversée) : texte + image */}
								<div className={`flex flex-col md:flex-row-reverse items-center gap-12 ${product.images.length <= 4 ? 'justify-center' : ''}`}>
									<motion.div
										initial={{ opacity: 0, x: 50 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true, margin: '-100px' }}
										transition={{ duration: 0.6 }}
										className={product.images.length > 4 ? 'md:w-1/2' : 'max-w-2xl'}>
										<h3 className='text-2xl font-bold text-gray-900 mb-4'>
											Des performances inégalées
										</h3>
										<p className='text-lg text-gray-600 mb-6'>
											Profitez de performances exceptionnelles
											jour après jour. Ce produit a été conçu
											pour offrir une efficacité maximale et
											une expérience utilisateur fluide dans
											toutes les situations.
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

									{product.images.length > 4 && (
										<motion.div
											initial={{ opacity: 0, x: -50 }}
											whileInView={{ opacity: 1, x: 0 }}
											viewport={{ once: true, margin: '-100px' }}
											transition={{ duration: 0.6 }}
											className='md:w-1/2'>
											<div className='relative aspect-square rounded-2xl overflow-hidden shadow-md bg-white p-4'>
												<Image
													src={
														product.images[
															Math.min(
																4,
																product.images
																	.length - 1
															)
														]?.src ||
														product.images[0].src
													}
													alt={product.name}
													fill
													className='object-contain'
													sizes='(max-width: 768px) 100vw, 600px'
												/>
											</div>
										</motion.div>
									)}
								</div>
							</div>
						)}
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
								Découvrez ce qui rend ce produit unique
							</p>
						</div>

						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-100px' }}
							transition={{ duration: 0.6 }}
							className='max-w-4xl mx-auto'>
							<div className='bg-white rounded-2xl shadow-sm p-8 md:p-12'>
								<ul className='space-y-6'>
									{features.map((feature, index) => (
										<motion.li
											key={index}
											initial={{ opacity: 0, x: -20 }}
											whileInView={{ opacity: 1, x: 0 }}
											viewport={{ once: true }}
											transition={{
												duration: 0.5,
												delay: index * 0.1,
											}}
											className='flex items-start group'>
											<div className='flex-shrink-0 mr-4'>
												<div className='w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 transition-colors'>
													<svg
														className='h-4 w-4 text-indigo-600 group-hover:text-white transition-colors'
														fill='none'
														viewBox='0 0 24 24'
														stroke='currentColor'>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2.5}
															d='M5 13l4 4L19 7'
														/>
													</svg>
												</div>
											</div>
											<div className='flex-1'>
												<p className='text-lg text-gray-800 leading-relaxed'>
													{feature}
												</p>
											</div>
										</motion.li>
									))}
								</ul>
							</div>
						</motion.div>

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
										viewport={{
											once: true,
											margin: '-100px',
										}}
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
													src={
														accessory.images[0].src
													}
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
										<div className='flex items-center' onClick={(e) => e.stopPropagation()}>
											<label
												htmlFor={`accessory-${accessory.id}`}
												className='flex items-center cursor-pointer'
											>
												<input
													id={`accessory-${accessory.id}`}
													type='checkbox'
													checked={selectedAccessories.includes(
														accessory.id
													)}
													onChange={() =>
														toggleAccessory(
															accessory.id
														)
													}
													className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer'
												/>
												<span className='ml-2 text-sm text-gray-600 cursor-pointer'>
													{selectedAccessories.includes(
														accessory.id
													)
														? 'Sélectionné'
														: 'Ajouter à mon achat'}
												</span>
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
									Nous travaillons à ajouter des accessoires
									pour ce produit.
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
												parseFloat(product.price) *
													quantity
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
								Caractéristiques détaillées du produit
							</p>
						</div>

						<div className='bg-white rounded-xl shadow-sm overflow-hidden'>
							<div className='border-b border-gray-200'>
								<dl>
									{/* Référence produit */}
									<div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
										<dt className='text-sm font-medium text-gray-500'>
											Référence produit
										</dt>
										<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
											SKU-{product.id}
										</dd>
									</div>

									{/* Catégories */}
									<div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
										<dt className='text-sm font-medium text-gray-500'>
											Catégorie
										</dt>
										<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
											{product.categories
												.map((cat) => cat.name)
												.join(', ')}
										</dd>
									</div>

									{/* Tags (si présents) */}
									{product.tags &&
										product.tags.length > 0 && (
											<div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
												<dt className='text-sm font-medium text-gray-500'>
													Tags
												</dt>
												<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
													{product.tags
														.map((tag) => tag.name)
														.join(', ')}
												</dd>
											</div>
										)}

									{/* Dimensions (si présentes) */}
									{product.dimensions && (
										<div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
											<dt className='text-sm font-medium text-gray-500'>
												Dimensions
											</dt>
											<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
												{product.dimensions.length} ×{' '}
												{product.dimensions.width} ×{' '}
												{product.dimensions.height} cm
											</dd>
										</div>
									)}

									{/* Poids (si présent) */}
									{product.weight && (
										<div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
											<dt className='text-sm font-medium text-gray-500'>
												Poids
											</dt>
											<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
												{product.weight} kg
											</dd>
										</div>
									)}

									{/* Disponibilité */}
									<div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
										<dt className='text-sm font-medium text-gray-500'>
											Disponibilité
										</dt>
										<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
											{product.stock_status ===
											'instock' ? (
												<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
													En stock{' '}
													{product.stock_quantity
														? `(${product.stock_quantity} unités)`
														: ''}
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

									{/* Attributs (si présents) */}
									{product.attributes &&
										product.attributes.map(
											(attr, index) =>
												attr.visible && (
													<div
														key={`attr-${attr.id}-${index}`}
														className={`${
															index % 2 === 0
																? 'bg-gray-50'
																: 'bg-white'
														} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
														<dt className='text-sm font-medium text-gray-500'>
															{attr.name}
														</dt>
														<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
															{attr.options.join(
																', '
															)}
														</dd>
													</div>
												)
										)}

									{/* Évaluation (si présente) */}
									{product.average_rating &&
										typeof product.average_rating === 'string' &&
										parseFloat(product.average_rating) > 0 && (
											<div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
												<dt className='text-sm font-medium text-gray-500'>
													Évaluation
												</dt>
												<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center'>
													<div className='flex items-center'>
														{[1, 2, 3, 4, 5].map(
															(star) => (
																<svg
																	key={star}
																	className={`h-4 w-4 ${
																		product.average_rating && 
																		parseFloat(
																			product.average_rating
																		) >=
																		star
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
													<span className='ml-2'>
														{product.average_rating ? parseFloat(product.average_rating).toFixed(1) : "0.0"}
														/5{' '}
														{product.rating_count &&
															`(${product.rating_count} avis)`}
													</span>
												</dd>
											</div>
										)}
								</dl>
							</div>
						</div>

						{/* Téléchargements et documents - SECTION DÉSACTIVÉE */}
						{/* Décommenter cette section après avoir activé generateDocuments() */}
						{/*
						{product.documents && product.documents.length > 0 && (
							<div className='mt-12'>
								<h3 className='text-lg font-medium text-gray-900 mb-4'>
									Documents et ressources
								</h3>
								<div className='bg-white rounded-xl shadow-sm p-6'>
									<ul className='divide-y divide-gray-200'>
										{product.documents.map((document) => (
											<li key={document.id} className='py-4 flex items-center'>
												<svg
													className='h-6 w-6 text-gray-400 mr-4 flex-shrink-0'
													fill='none'
													viewBox='0 0 24 24'
													stroke='currentColor'>
													{getDocumentIcon(document.type)}
												</svg>
												<div className='ml-3 flex-grow'>
													<p className='text-sm font-medium text-gray-900'>
														{document.name}
													</p>
													<p className='text-sm text-gray-500'>
														{document.description} • {document.size}
													</p>
												</div>
												<div className='ml-auto'>
													<a
														href={document.url}
														target='_blank'
														rel='noopener noreferrer'
														className='text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200'>
														Télécharger
													</a>
												</div>
											</li>
										))}
									</ul>
								</div>
							</div>
						)}
						*/}
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
												Quelle est la durée de la
												garantie ?
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
											Tous nos produits sont couverts par
											une garantie de 2 ans. Nous
											proposons également une extension de
											garantie payante pour une année
											supplémentaire.
										</p>
									</dd>
								</div>

								<div className='pt-6'>
									<dt className='text-lg'>
										<button className='text-left w-full flex justify-between items-start text-gray-900 focus:outline-none'>
											<span className='font-medium'>
												Comment choisir entre ce modèle
												et la version premium ?
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
											usage quotidien. Si vous avez besoin
											de fonctionnalités avancées ou d'une
											performance supérieure, la version
											premium sera plus adaptée à vos
											besoins.
										</p>
									</dd>
								</div>

								<div className='pt-6'>
									<dt className='text-lg'>
										<button className='text-left w-full flex justify-between items-start text-gray-900 focus:outline-none'>
											<span className='font-medium'>
												Les accessoires sont-ils
												nécessaires ?
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
											fonctionnel sans accessoires.
											Cependant, nos accessoires peuvent
											améliorer votre expérience et
											ajouter des fonctionnalités
											supplémentaires.
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
									D'autres produits qui pourraient vous
									intéresser
								</p>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
								{similarProducts.map((similarProduct) => (
									<motion.div
										key={similarProduct.id}
										initial={{ opacity: 0, y: 30 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{
											once: true,
											margin: '-100px',
										}}
										transition={{ duration: 0.5 }}
										className='bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300'>
										<Link
											href={`/products/${similarProduct.id}-${similarProduct.slug}`}
											className='block'>
											<div className='relative aspect-square'>
												{similarProduct.images &&
												similarProduct.images.length >
													0 ? (
													<Image
														src={
															similarProduct
																.images[0].src
														}
														alt={
															similarProduct.name
														}
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
									14 jours pour changer d'avis
								</p>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
