'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const HeroCarousel = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [autoplay, setAutoplay] = useState(true);

	// Données des slides
	const slides = [
		{
			id: 1,
			title: 'Une nouvelle expérience shopping',
			subtitle:
				'Découvrez notre collection unique où innovation et élégance se rencontrent',
			cta: 'Explorer notre collection',
			ctaLink: '/products',
			secondaryCta: 'Voir les nouveautés',
			secondaryCtaLink: '/new-arrivals',
			image: '/globe.svg', // Utilise l'image existante
			bgColor: 'from-indigo-900 via-purple-800 to-indigo-700',
		},
		{
			id: 2,
			title: 'Collections exclusives',
			subtitle:
				'Des produits uniques sélectionnés pour vous offrir le meilleur de la qualité',
			cta: 'Voir les exclusivités',
			ctaLink: '/products?featured=true',
			secondaryCta: 'Nos catégories',
			secondaryCtaLink: '/categories',
			image: '/placeholder.jpg', // À remplacer par une image réelle
			bgColor: 'from-sky-800 via-blue-700 to-indigo-800',
		},
		{
			id: 3,
			title: 'Promotions spéciales',
			subtitle: "Jusqu'à 50% de réduction sur une sélection d'articles",
			cta: 'Voir les offres',
			ctaLink: '/products?on_sale=true',
			secondaryCta: 'En savoir plus',
			secondaryCtaLink: '/promotions',
			image: '/placeholder.jpg', // À remplacer par une image réelle
			bgColor: 'from-rose-700 via-pink-700 to-purple-800',
		},
	];

	// Gestion de l'autoplay
	useEffect(() => {
		let interval: NodeJS.Timeout | undefined;

		if (autoplay) {
			interval = setInterval(() => {
				setCurrentSlide((prev) => (prev + 1) % slides.length);
			}, 6000); // Change slide every 6 seconds
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [autoplay, slides.length]);

	// Passage au slide suivant
	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
		setAutoplay(false); // Pause autoplay when manually changing

		// Resume autoplay after some time
		setTimeout(() => setAutoplay(true), 10000);
	};

	// Passage au slide précédent
	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
		setAutoplay(false); // Pause autoplay when manually changing

		// Resume autoplay after some time
		setTimeout(() => setAutoplay(true), 10000);
	};

	// Sélectionner un slide spécifique
	const goToSlide = (index: number) => {
		setCurrentSlide(index);
		setAutoplay(false);
		setTimeout(() => setAutoplay(true), 10000);
	};

	return (
		<section className='relative h-screen overflow-hidden'>
			{/* Slides */}
			<AnimatePresence mode='wait'>
				{slides.map(
					(slide, index) =>
						currentSlide === index && (
							<motion.div
								key={slide.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 1 }}
								className={`absolute inset-0 bg-gradient-to-br ${slide.bgColor} text-white`}>
								{/* Cercles abstraits en arrière-plan */}
								<div className='absolute top-0 left-0 w-full h-full overflow-hidden z-0'>
									<motion.div
										initial={{ scale: 0.8, opacity: 0.5 }}
										animate={{
											scale: 1,
											opacity: 0.2,
											transition: {
												duration: 8,
												repeat: Infinity,
												repeatType: 'reverse',
											},
										}}
										className='absolute w-96 h-96 rounded-full bg-white/20 -top-20 -left-20'
									/>
									<motion.div
										initial={{ scale: 0.8, opacity: 0.5 }}
										animate={{
											scale: 1,
											opacity: 0.2,
											transition: {
												duration: 6,
												repeat: Infinity,
												repeatType: 'reverse',
												delay: 1,
											},
										}}
										className='absolute w-96 h-96 rounded-full bg-white/20 top-1/3 right-0'
									/>
									<motion.div
										initial={{ scale: 0.8, opacity: 0.5 }}
										animate={{
											scale: 1,
											opacity: 0.2,
											transition: {
												duration: 7,
												repeat: Infinity,
												repeatType: 'reverse',
												delay: 2,
											},
										}}
										className='absolute w-96 h-96 rounded-full bg-white/20 bottom-0 left-1/3'
									/>
								</div>

								{/* Contenu du slide */}
								<div className='relative z-10 h-full max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-center'>
									{/* Texte */}
									<div className='md:w-1/2 space-y-8'>
										<motion.h1
											initial={{ opacity: 0, y: 30 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												duration: 0.8,
												delay: 0.3,
											}}
											className='text-5xl md:text-7xl font-extrabold leading-tight'>
											<span className='block'>
												{slide.title
													.split(' ')
													.slice(0, -1)
													.join(' ')}
											</span>
											<span className='block bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200'>
												{slide.title
													.split(' ')
													.slice(-1)}
											</span>
										</motion.h1>

										<motion.p
											initial={{ opacity: 0, y: 30 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												duration: 0.8,
												delay: 0.5,
											}}
											className='text-xl text-indigo-100 max-w-md'>
											{slide.subtitle}
										</motion.p>

										<motion.div
											initial={{ opacity: 0, y: 30 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												duration: 0.8,
												delay: 0.7,
											}}
											className='flex flex-wrap gap-4'>
											{/* Modification ici : lien primaire séparé de l'animation */}
											<div className='relative'>
												<Link
													href={slide.ctaLink}
													className='group inline-flex items-center justify-center px-8 py-3 font-medium bg-white rounded-full z-20 relative'>
													<span className='absolute inset-0 w-full h-full transition-all duration-300 ease-out bg-gradient-to-r from-purple-500 to-pink-500 group-hover:opacity-100 opacity-0 rounded-full'></span>
													<span className='relative bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:text-white transition-colors duration-300 font-bold'>
														{slide.cta}
													</span>
												</Link>
											</div>

											{/* Lien secondaire également séparé */}
											<div className='relative'>
												<Link
													href={
														slide.secondaryCtaLink
													}
													className='inline-flex items-center justify-center px-8 py-3 font-medium text-indigo-100 border border-indigo-300 rounded-full hover:text-white hover:border-white transition-colors duration-300 z-20 relative'>
													{slide.secondaryCta}
												</Link>
											</div>
										</motion.div>
									</div>

									{/* Image/Visuel */}
									<motion.div
										initial={{ opacity: 0, x: 50 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 1, delay: 0.3 }}
										className='md:w-1/2 mt-12 md:mt-0'>
										<div className='relative h-80 md:h-96 w-80 md:w-96 mx-auto'>
											<div className='absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-30 animate-pulse'></div>
											<Image
												src={slide.image}
												alt={slide.title}
												className='relative z-10 object-contain'
												fill
												priority
											/>
										</div>
									</motion.div>
								</div>
							</motion.div>
						)
				)}
			</AnimatePresence>

			{/* Navigation Arrows */}
			<div className='absolute inset-0 flex items-center justify-between z-20 px-4 pointer-events-none'>
				<motion.button
					initial={{ opacity: 0.6 }}
					whileHover={{ opacity: 1, scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={prevSlide}
					className='bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm pointer-events-auto'
					aria-label='Slide précédent'>
					<svg
						className='h-6 w-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M15 19l-7-7 7-7'
						/>
					</svg>
				</motion.button>

				<motion.button
					initial={{ opacity: 0.6 }}
					whileHover={{ opacity: 1, scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={nextSlide}
					className='bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm pointer-events-auto'
					aria-label='Slide suivant'>
					<svg
						className='h-6 w-6'
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
				</motion.button>
			</div>

			{/* Indicateurs de slide */}
			<div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3'>
				{slides.map((_, index) => (
					<button
						key={index}
						onClick={() => goToSlide(index)}
						className={`w-3 h-3 rounded-full transition-all duration-300 ${
							currentSlide === index
								? 'bg-white w-8'
								: 'bg-white/50 hover:bg-white/80'
						}`}
						aria-label={`Aller au slide ${index + 1}`}
					/>
				))}
			</div>

			{/* Scroll indicator */}
			<motion.div
				className='absolute bottom-8 left-1/2 -translate-x-1/2 z-20'
				animate={{
					y: [0, 10, 0],
					opacity: [0.8, 1, 0.8],
				}}
				transition={{
					repeat: Infinity,
					duration: 2,
				}}>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='24'
					height='24'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
					className='text-white'>
					<path d='M12 5v14M5 12l7 7 7-7' />
				</svg>
			</motion.div>
		</section>
	);
};

export default HeroCarousel;

// 'use client';
// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';

// const HeroCarousel = () => {
// 	const [currentSlide, setCurrentSlide] = useState(0);
// 	const [autoplay, setAutoplay] = useState(true);

// 	// Données des slides
// 	const slides = [
// 		{
// 			id: 1,
// 			title: 'Une nouvelle expérience shopping',
// 			subtitle:
// 				'Découvrez notre collection unique où innovation et élégance se rencontrent',
// 			cta: 'Explorer notre collection',
// 			ctaLink: '/products',
// 			secondaryCta: 'Voir les nouveautés',
// 			secondaryCtaLink: '/new-arrivals',
// 			image: '/globe.svg', // Utilise l'image existante
// 			bgColor: 'from-indigo-900 via-purple-800 to-indigo-700',
// 		},
// 		{
// 			id: 2,
// 			title: 'Collections exclusives',
// 			subtitle:
// 				'Des produits uniques sélectionnés pour vous offrir le meilleur de la qualité',
// 			cta: 'Voir les exclusivités',
// 			ctaLink: '/products?featured=true',
// 			secondaryCta: 'Nos catégories',
// 			secondaryCtaLink: '/categories',
// 			image: '/placeholder.jpg', // À remplacer par une image réelle
// 			bgColor: 'from-sky-800 via-blue-700 to-indigo-800',
// 		},
// 		{
// 			id: 3,
// 			title: 'Promotions spéciales',
// 			subtitle: "Jusqu'à 50% de réduction sur une sélection d'articles",
// 			cta: 'Voir les offres',
// 			ctaLink: '/products?on_sale=true',
// 			secondaryCta: 'En savoir plus',
// 			secondaryCtaLink: '/promotions',
// 			image: '/placeholder.jpg', // À remplacer par une image réelle
// 			bgColor: 'from-rose-700 via-pink-700 to-purple-800',
// 		},
// 	];

// 	// Gestion de l'autoplay
// 	useEffect(() => {
// 		let interval;

// 		if (autoplay) {
// 			interval = setInterval(() => {
// 				setCurrentSlide((prev) => (prev + 1) % slides.length);
// 			}, 6000); // Change slide every 6 seconds
// 		}

// 		return () => {
// 			if (interval) clearInterval(interval);
// 		};
// 	}, [autoplay, slides.length]);

// 	// Passage au slide suivant
// 	const nextSlide = () => {
// 		setCurrentSlide((prev) => (prev + 1) % slides.length);
// 		setAutoplay(false); // Pause autoplay when manually changing

// 		// Resume autoplay after some time
// 		setTimeout(() => setAutoplay(true), 10000);
// 	};

// 	// Passage au slide précédent
// 	const prevSlide = () => {
// 		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
// 		setAutoplay(false); // Pause autoplay when manually changing

// 		// Resume autoplay after some time
// 		setTimeout(() => setAutoplay(true), 10000);
// 	};

// 	// Sélectionner un slide spécifique
// 	const goToSlide = (index) => {
// 		setCurrentSlide(index);
// 		setAutoplay(false);
// 		setTimeout(() => setAutoplay(true), 10000);
// 	};

// 	return (
// 		<section className='relative h-screen overflow-hidden'>
// 			{/* Slides */}
// 			<AnimatePresence mode='wait'>
// 				{slides.map(
// 					(slide, index) =>
// 						currentSlide === index && (
// 							<motion.div
// 								key={slide.id}
// 								initial={{ opacity: 0 }}
// 								animate={{ opacity: 1 }}
// 								exit={{ opacity: 0 }}
// 								transition={{ duration: 1 }}
// 								className={`absolute inset-0 bg-gradient-to-br ${slide.bgColor} text-white`}>
// 								{/* Cercles abstraits en arrière-plan */}
// 								<div className='absolute top-0 left-0 w-full h-full overflow-hidden z-0'>
// 									<motion.div
// 										initial={{ scale: 0.8, opacity: 0.5 }}
// 										animate={{
// 											scale: 1,
// 											opacity: 0.2,
// 											transition: {
// 												duration: 8,
// 												repeat: Infinity,
// 												repeatType: 'reverse',
// 											},
// 										}}
// 										className='absolute w-96 h-96 rounded-full bg-white/20 -top-20 -left-20'
// 									/>
// 									<motion.div
// 										initial={{ scale: 0.8, opacity: 0.5 }}
// 										animate={{
// 											scale: 1,
// 											opacity: 0.2,
// 											transition: {
// 												duration: 6,
// 												repeat: Infinity,
// 												repeatType: 'reverse',
// 												delay: 1,
// 											},
// 										}}
// 										className='absolute w-96 h-96 rounded-full bg-white/20 top-1/3 right-0'
// 									/>
// 									<motion.div
// 										initial={{ scale: 0.8, opacity: 0.5 }}
// 										animate={{
// 											scale: 1,
// 											opacity: 0.2,
// 											transition: {
// 												duration: 7,
// 												repeat: Infinity,
// 												repeatType: 'reverse',
// 												delay: 2,
// 											},
// 										}}
// 										className='absolute w-96 h-96 rounded-full bg-white/20 bottom-0 left-1/3'
// 									/>
// 								</div>

// 								{/* Contenu du slide */}
// 								<div className='relative z-10 h-full max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-center'>
// 									{/* Texte */}
// 									<div className='md:w-1/2 space-y-8'>
// 										<motion.h1
// 											initial={{ opacity: 0, y: 30 }}
// 											animate={{ opacity: 1, y: 0 }}
// 											transition={{
// 												duration: 0.8,
// 												delay: 0.3,
// 											}}
// 											className='text-5xl md:text-7xl font-extrabold leading-tight'>
// 											<span className='block'>
// 												{slide.title
// 													.split(' ')
// 													.slice(0, -1)
// 													.join(' ')}
// 											</span>
// 											<span className='block bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200'>
// 												{slide.title
// 													.split(' ')
// 													.slice(-1)}
// 											</span>
// 										</motion.h1>

// 										<motion.p
// 											initial={{ opacity: 0, y: 30 }}
// 											animate={{ opacity: 1, y: 0 }}
// 											transition={{
// 												duration: 0.8,
// 												delay: 0.5,
// 											}}
// 											className='text-xl text-indigo-100 max-w-md'>
// 											{slide.subtitle}
// 										</motion.p>

// 										<motion.div
// 											initial={{ opacity: 0, y: 30 }}
// 											animate={{ opacity: 1, y: 0 }}
// 											transition={{
// 												duration: 0.8,
// 												delay: 0.7,
// 											}}
// 											className='flex flex-wrap gap-4'>
// 											<Link
// 												href={slide.ctaLink}
// 												className='group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium bg-white rounded-full'>
// 												<span className='absolute inset-0 w-full h-full transition-all duration-300 ease-out bg-gradient-to-r from-purple-500 to-pink-500 group-hover:opacity-100 opacity-0'></span>
// 												<span className='relative bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:text-white transition-colors duration-300 font-bold'>
// 													{slide.cta}
// 												</span>
// 											</Link>
// 											<Link
// 												href={slide.secondaryCtaLink}
// 												className='inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-indigo-100 border border-indigo-300 rounded-full hover:text-white hover:border-white transition-colors duration-300'>
// 												{slide.secondaryCta}
// 											</Link>
// 										</motion.div>
// 									</div>

// 									{/* Image/Visuel */}
// 									<motion.div
// 										initial={{ opacity: 0, x: 50 }}
// 										animate={{ opacity: 1, x: 0 }}
// 										transition={{ duration: 1, delay: 0.3 }}
// 										className='md:w-1/2 mt-12 md:mt-0'>
// 										<div className='relative h-80 md:h-96 w-80 md:w-96 mx-auto'>
// 											<div className='absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-30 animate-pulse'></div>
// 											<Image
// 												src={slide.image}
// 												alt={slide.title}
// 												className='relative z-10 object-contain'
// 												fill
// 												priority
// 											/>
// 										</div>
// 									</motion.div>
// 								</div>
// 							</motion.div>
// 						)
// 				)}
// 			</AnimatePresence>

// 			{/* Navigation Arrows */}
// 			<div className='absolute inset-0 flex items-center justify-between z-20 px-4'>
// 				<motion.button
// 					initial={{ opacity: 0.6 }}
// 					whileHover={{ opacity: 1, scale: 1.1 }}
// 					whileTap={{ scale: 0.9 }}
// 					onClick={prevSlide}
// 					className='bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm'
// 					aria-label='Slide précédent'>
// 					<svg
// 						className='h-6 w-6'
// 						fill='none'
// 						viewBox='0 0 24 24'
// 						stroke='currentColor'>
// 						<path
// 							strokeLinecap='round'
// 							strokeLinejoin='round'
// 							strokeWidth={2}
// 							d='M15 19l-7-7 7-7'
// 						/>
// 					</svg>
// 				</motion.button>

// 				<motion.button
// 					initial={{ opacity: 0.6 }}
// 					whileHover={{ opacity: 1, scale: 1.1 }}
// 					whileTap={{ scale: 0.9 }}
// 					onClick={nextSlide}
// 					className='bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm'
// 					aria-label='Slide suivant'>
// 					<svg
// 						className='h-6 w-6'
// 						fill='none'
// 						viewBox='0 0 24 24'
// 						stroke='currentColor'>
// 						<path
// 							strokeLinecap='round'
// 							strokeLinejoin='round'
// 							strokeWidth={2}
// 							d='M9 5l7 7-7 7'
// 						/>
// 					</svg>
// 				</motion.button>
// 			</div>

// 			{/* Indicateurs de slide */}
// 			<div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3'>
// 				{slides.map((_, index) => (
// 					<button
// 						key={index}
// 						onClick={() => goToSlide(index)}
// 						className={`w-3 h-3 rounded-full transition-all duration-300 ${
// 							currentSlide === index
// 								? 'bg-white w-8'
// 								: 'bg-white/50 hover:bg-white/80'
// 						}`}
// 						aria-label={`Aller au slide ${index + 1}`}
// 					/>
// 				))}
// 			</div>

// 			{/* Scroll indicator */}
// 			<motion.div
// 				className='absolute bottom-8 left-1/2 -translate-x-1/2 z-20'
// 				animate={{
// 					y: [0, 10, 0],
// 					opacity: [0.8, 1, 0.8],
// 				}}
// 				transition={{
// 					repeat: Infinity,
// 					duration: 2,
// 				}}>
// 				<svg
// 					xmlns='http://www.w3.org/2000/svg'
// 					width='24'
// 					height='24'
// 					viewBox='0 0 24 24'
// 					fill='none'
// 					stroke='currentColor'
// 					strokeWidth='2'
// 					strokeLinecap='round'
// 					strokeLinejoin='round'
// 					className='text-white'>
// 					<path d='M12 5v14M5 12l7 7 7-7' />
// 				</svg>
// 			</motion.div>
// 		</section>
// 	);
// };

// export default HeroCarousel;
