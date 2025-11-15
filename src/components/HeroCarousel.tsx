'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ProductBadge from './ProductBadge';

const HeroCarousel = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [autoplay, setAutoplay] = useState(true);
	const [isMounted, setIsMounted] = useState(false);

	// Données des slides avec des layouts différents
	const slides = [
		{
			id: 1,
			title: 'Une nouvelle expérience',
			titleHighlight: 'shopping',
			subtitle: 'Découvrez notre collection unique où innovation et élégance se rencontrent pour une expérience d\'achat exceptionnelle',
			cta: 'Explorer maintenant',
			ctaLink: '/products',
			secondaryCta: 'Voir les nouveautés',
			secondaryCtaLink: '/new-arrivals',
			image: '/images/shop.png',
			bgGradient: 'from-indigo-900 via-purple-900 to-pink-800',
			layout: 'split',
		},
		{
			id: 2,
			title: 'Collections',
			titleHighlight: 'exclusives',
			subtitle: 'Des produits uniques sélectionnés avec soin pour vous offrir le meilleur de la qualité et du style',
			cta: 'Voir les exclusivités',
			ctaLink: '/products?featured=true',
			secondaryCta: 'Nos catégories',
			secondaryCtaLink: '/categories',
			image: '/images/collections.png',
			bgGradient: 'from-blue-900 via-indigo-800 to-purple-900',
			layout: 'centered',
		},
		{
			id: 3,
			title: 'Promotions',
			titleHighlight: 'spéciales',
			subtitle: "Jusqu'à 50% de réduction sur une sélection premium d'articles de qualité supérieure",
			cta: 'Voir les offres',
			ctaLink: '/products?on_sale=true',
			secondaryCta: 'En savoir plus',
			secondaryCtaLink: '/promotions',
			image: '/images/promotions.png',
			bgGradient: 'from-rose-900 via-pink-800 to-purple-900',
			layout: 'overlay',
		},
	];

	// Détection du montage côté client
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Gestion de l'autoplay
	useEffect(() => {
		let interval: NodeJS.Timeout | undefined;

		if (autoplay) {
			interval = setInterval(() => {
				setCurrentSlide((prev) => (prev + 1) % slides.length);
			}, 7000); // 7 secondes pour laisser le temps d'apprécier
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [autoplay, slides.length]);

	// Navigation
	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
		setAutoplay(false);
		setTimeout(() => setAutoplay(true), 12000);
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
		setAutoplay(false);
		setTimeout(() => setAutoplay(true), 12000);
	};

	const goToSlide = (index: number) => {
		setCurrentSlide(index);
		setAutoplay(false);
		setTimeout(() => setAutoplay(true), 12000);
	};

	return (
		<section className='relative h-[80vh] md:h-screen overflow-hidden'>
			{/* Slides avec arrière-plan d'image pour plus d'immersion */}
			<AnimatePresence mode='wait'>
				{slides.map(
					(slide, index) =>
						currentSlide === index && (
							<motion.div
								key={slide.id}
								initial={{ opacity: 0, scale: 1.1 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{ duration: 1.2, ease: 'easeOut' }}
								className='absolute inset-0'>


								{/* Image de fond avec overlay */}
								<div className='absolute inset-0'>
									<Image
										src={slide.image}
										alt={slide.title}
										fill
										className='object-cover object-center'
										priority
									/>
									{/* Overlay gradient dynamique */}
									<div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient} opacity-85`}></div>
									{/* Overlay pattern */}
									<div 
										className='absolute inset-0 opacity-10'
										style={{
											backgroundImage: `radial-gradient(circle at 20% 50%, white 2px, transparent 2px), 
															radial-gradient(circle at 80% 50%, white 2px, transparent 2px)`,
											backgroundSize: '100px 100px'
										}}
									></div>
								</div>

								{/* Particules animées pour plus de dynamisme */}
								{isMounted && (
									<div className='absolute inset-0 overflow-hidden'>
										{[...Array(6)].map((_, i) => {
											const windowWidth = window.innerWidth;
											const windowHeight = window.innerHeight;

											return (
												<motion.div
													key={i}
													className='absolute w-2 h-2 bg-white rounded-full opacity-20'
													animate={{
														x: [Math.random() * windowWidth, Math.random() * windowWidth],
														y: [Math.random() * windowHeight, Math.random() * windowHeight],
													}}
													transition={{
														duration: 20 + Math.random() * 10,
														repeat: Infinity,
														repeatType: 'reverse',
														ease: 'linear',
														delay: i * 2,
													}}
													style={{
														left: Math.random() * 100 + '%',
														top: Math.random() * 100 + '%',
													}}
												/>
											);
										})}
									</div>
								)}

								{/* Contenu principal */}
								<div className='relative z-10 h-full flex items-center'>
									<div className='max-w-7xl mx-auto px-4 sm:px-8 lg:px-8 w-full'>
										{slide.layout === 'split' && (
											<div className='grid lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
												{/* Contenu texte */}
												<motion.div
													initial={{ opacity: 0, x: -50 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ duration: 1, delay: 0.3 }}
													className='space-y-3 sm:space-y-6 md:space-y-8'>
													<div>
														<motion.h1
															className='text-xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white leading-tight sm:leading-[1.1]'
															initial={{ opacity: 0, y: 50 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ duration: 0.8, delay: 0.5 }}
														>
															{slide.title}
															<br />
															<span className='bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent'>
																{slide.titleHighlight}
															</span>
														</motion.h1>
													</div>

													<motion.p
														className='text-xs sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-lg'
														initial={{ opacity: 0, y: 30 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ duration: 0.8, delay: 0.7 }}
													>
														{slide.subtitle}
													</motion.p>

													{/* Badges de provenance - visible sur mobile et desktop */}
													{slide.id === 1 && (
														<motion.div
															className='flex flex-wrap gap-3 justify-start'
															initial={{ opacity: 0, y: 20 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ duration: 0.8, delay: 0.85 }}
														>
															<div className='bg-white/15 backdrop-blur-lg px-6 py-3 rounded-full border-2 border-white/30 shadow-2xl flex items-center gap-4'>
																<ProductBadge type="made-in-usa" size="md" showIcon={true} />
																<div className='w-px h-6 bg-white/40'></div>
																<ProductBadge type="made-in-eu" size="md" showIcon={true} />
															</div>
														</motion.div>
													)}

													<motion.div
														className='flex flex-col sm:flex-row gap-4'
														initial={{ opacity: 0, y: 30 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ duration: 0.8, delay: 1 }}
													>
														<Link
															href={slide.ctaLink}
															className='group relative bg-white text-black px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-all duration-300 shadow-2xl'>
															<span className='absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
															<span className='relative group-hover:text-white'>
																{slide.cta}
															</span>
														</Link>
														
														<Link
															href={slide.secondaryCtaLink}
															className='border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-white hover:text-black transition-all duration-300'>
															{slide.secondaryCta}
														</Link>
													</motion.div>
												</motion.div>

												{/* Image produit */}
												<motion.div
													initial={{ opacity: 0, x: 50, scale: 0.8 }}
													animate={{ opacity: 1, x: 0, scale: 1 }}
													transition={{ duration: 1.2, delay: 0.4 }}
													className='relative'>
													<div className='relative w-full h-96 lg:h-[500px]'>
														{/* Glow effect */}
														<div className='absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-pink-400/30 rounded-full blur-3xl scale-110'></div>
														<Image
															src={slide.image}
															alt={slide.title}
															fill
															className='object-contain relative z-10 drop-shadow-2xl'
														/>
													</div>
												</motion.div>
											</div>
										)}

										{slide.layout === 'centered' && (
											<div className='text-center space-y-6 md:space-y-8'>
												<motion.div
													initial={{ opacity: 0, y: 50 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ duration: 1, delay: 0.3 }}
													className='space-y-6'>
													<h1 className='text-3xl sm:text-5xl md:text-7xl lg:text-9xl font-black text-white leading-tight'>
														{slide.title}
														<br />
														<span className='bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent'>
															{slide.titleHighlight}
														</span>
													</h1>
													
													<p className='text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed'>
														{slide.subtitle}
													</p>
												</motion.div>

												<motion.div
													initial={{ opacity: 0, scale: 0.8 }}
													animate={{ opacity: 1, scale: 1 }}
													transition={{ duration: 1.2, delay: 0.6 }}
													className='relative w-full max-w-md mx-auto h-80'>
													<div className='absolute inset-0 bg-gradient-to-r from-blue-400/40 to-purple-400/40 rounded-full blur-3xl'></div>
													<Image
														src={slide.image}
														alt={slide.title}
														fill
														className='object-contain relative z-10 drop-shadow-2xl'
													/>
												</motion.div>

												<motion.div 
													className='flex flex-col sm:flex-row gap-4 justify-center'
													initial={{ opacity: 0, y: 30 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ duration: 0.8, delay: 0.9 }}
												>
													<Link
														href={slide.ctaLink}
														className='group relative bg-white text-black px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-all duration-300 shadow-2xl'>
														<span className='absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
														<span className='relative group-hover:text-white'>
															{slide.cta}
														</span>
													</Link>
													
													<Link
														href={slide.secondaryCtaLink}
														className='border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-white hover:text-black transition-all duration-300'>
														{slide.secondaryCta}
													</Link>
												</motion.div>
											</div>
										)}

										{slide.layout === 'overlay' && (
											<div className='relative h-full flex items-center'>
												{/* Image en arrière-plan avec effet parallax */}
												<motion.div
													initial={{ scale: 1.2, opacity: 0 }}
													animate={{ scale: 1, opacity: 0.3 }}
													transition={{ duration: 2 }}
													className='absolute right-0 top-1/2 transform -translate-y-1/2 w-1/2 h-96'>
													<Image
														src={slide.image}
														alt={slide.title}
														fill
														className='object-contain'
													/>
												</motion.div>

												{/* Contenu au premier plan */}
												<motion.div
													initial={{ opacity: 0, x: -100 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ duration: 1, delay: 0.3 }}
													className='relative z-20 max-w-2xl space-y-6 md:space-y-8'>
													<h1 className='text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black text-white leading-tight'>
														{slide.title}
														<br />
														<span className='bg-gradient-to-r from-rose-300 via-pink-300 to-purple-300 bg-clip-text text-transparent'>
															{slide.titleHighlight}
														</span>
													</h1>
													
													<p className='text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed'>
														{slide.subtitle}
													</p>

													<div className='flex flex-col sm:flex-row gap-4'>
														<Link
															href={slide.ctaLink}
															className='group relative bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-all duration-300 shadow-2xl'>
															<span className='absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
															<span className='relative'>
																{slide.cta}
															</span>
														</Link>
														
														<Link
															href={slide.secondaryCtaLink}
															className='border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-white hover:text-black transition-all duration-300'>
															{slide.secondaryCta}
														</Link>
													</div>
												</motion.div>
											</div>
										)}
									</div>
								</div>
							</motion.div>
						)
				)}
			</AnimatePresence>

			{/* Navigation améliorée */}
			<div className='absolute inset-0 flex items-center justify-between z-30 px-6 pointer-events-none'>
				<motion.button
					initial={{ opacity: 0.7 }}
					whileHover={{ opacity: 1, scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={prevSlide}
					className='group bg-black/20 backdrop-blur-md hover:bg-black/40 text-white p-4 rounded-full border border-white/20 pointer-events-auto transition-all duration-300'>
					<svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
					</svg>
				</motion.button>

				<motion.button
					initial={{ opacity: 0.7 }}
					whileHover={{ opacity: 1, scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={nextSlide}
					className='group bg-black/20 backdrop-blur-md hover:bg-black/40 text-white p-4 rounded-full border border-white/20 pointer-events-auto transition-all duration-300'>
					<svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
					</svg>
				</motion.button>
			</div>

			{/* Indicateurs stylisés */}
			<div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30'>
				<div className='flex space-x-4 bg-black/20 backdrop-blur-md rounded-full p-3 border border-white/20'>
					{slides.map((slide, index) => (
						<button
							key={index}
							onClick={() => goToSlide(index)}
							className={`relative transition-all duration-500 ${
								currentSlide === index
									? 'w-12 h-3 bg-white rounded-full'
									: 'w-3 h-3 bg-white/50 hover:bg-white/80 rounded-full'
							}`}
							aria-label={`Aller au slide ${index + 1}`}>
							{currentSlide === index && (
								<motion.div
									layoutId='activeIndicator'
									className='absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full'
									transition={{ type: 'spring', stiffness: 300, damping: 30 }}
								/>
							)}
						</button>
					))}
				</div>
			</div>

			{/* Numérotation des slides */}
			<motion.div 
				className='absolute bottom-8 right-8 z-30 text-white/80 font-mono text-sm'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1 }}
			>
				<span className='text-2xl font-bold'>{(currentSlide + 1).toString().padStart(2, '0')}</span>
				<span className='text-white/50'> / {slides.length.toString().padStart(2, '0')}</span>
			</motion.div>

			{/* Scroll indicator animé */}
			<motion.div
				className='absolute bottom-8 left-8 z-30'
				animate={{
					y: [0, 10, 0],
					opacity: [0.6, 1, 0.6],
				}}
				transition={{
					repeat: Infinity,
					duration: 2.5,
				}}>
				<div className='flex flex-col items-center text-white/70'>
					<span className='text-xs mb-2 uppercase tracking-wider'>Scroll</span>
					<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
						<path d='M12 5v14M5 12l7 7 7-7' />
					</svg>
				</div>
			</motion.div>
		</section>
	);
};

export default HeroCarousel;