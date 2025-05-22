'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Testimonials() {
	const [currentTestimonial, setCurrentTestimonial] = useState(0);
	const [autoplay, setAutoplay] = useState(true);
	const [direction, setDirection] = useState(0);
	const sectionRef = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	// Données des témoignages
	const testimonials = [
		{
			id: 1,
			author: 'Sophie',
			role: 'Cliente fidèle',
			text: "La personnalisation et l'expérience unique m'ont vraiment convaincue. Une boutique qui ose sortir des sentiers battus et propose des produits d'une qualité exceptionnelle !",
			image: '/images/sophie.png', // Remplacer par vos images ou utiliser une image par défaut
			rating: 5,
		},
		{
			id: 2,
			author: 'Thomas',
			role: 'Client depuis 2 ans',
			text: "Un design frais et des produits de qualité, le service client est irréprochable et les livraisons toujours à l'heure. Je recommande vivement !",
			image: '/images/marc.png',
			rating: 5,
		},
		{
			id: 3,
			author: 'Émilie',
			role: 'Nouvelle cliente',
			text: "L'interface est un pur plaisir à parcourir, et l'attention aux détails fait toute la différence. Mes commandes sont toujours parfaitement emballées et livrées rapidement.",
			image: '/images/emilie.png',
			rating: 4,
		},
		{
			id: 4,
			author: 'David',
			role: 'Acheteur régulier',
			text: 'Innovant et élégant, ce site change totalement la donne en matière de shopping en ligne. Les produits sont toujours conformes aux descriptions et de très bonne qualité.',
			image: '/images/pierre.png',
			rating: 5,
		},
	];

	// Observer d'intersection pour détecter quand la section est visible
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setIsVisible(true);
				} else {
					setIsVisible(false);
				}
			},
			{ threshold: 0.3 }
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => {
			if (sectionRef.current) {
				observer.unobserve(sectionRef.current);
			}
		};
	}, []);

	// Gestion de l'autoplay
	useEffect(() => {
		let interval: NodeJS.Timeout;

		if (autoplay && isVisible) {
			interval = setInterval(() => {
				setDirection(1);
				setCurrentTestimonial(
					(prev) => (prev + 1) % testimonials.length
				);
			}, 5000); // Change le témoignage toutes les 5 secondes
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [autoplay, isVisible, testimonials.length]);

	// Passage au témoignage suivant
	const nextTestimonial = () => {
		setDirection(1);
		setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
		setAutoplay(false);
		setTimeout(() => setAutoplay(true), 10000);
	};

	// Passage au témoignage précédent
	const prevTestimonial = () => {
		setDirection(-1);
		setCurrentTestimonial(
			(prev) => (prev - 1 + testimonials.length) % testimonials.length
		);
		setAutoplay(false);
		setTimeout(() => setAutoplay(true), 10000);
	};

	// Sélectionner un témoignage spécifique
	const goToTestimonial = (index: number) => {
		setDirection(index > currentTestimonial ? 1 : -1);
		setCurrentTestimonial(index);
		setAutoplay(false);
		setTimeout(() => setAutoplay(true), 10000);
	};

	// Variants d'animation pour les témoignages
	const testimonialVariants = {
		enter: (direction: number) => ({
			x: direction > 0 ? 300 : -300,
			opacity: 0,
		}),
		center: {
			x: 0,
			opacity: 1,
			transition: {
				x: { type: 'spring', stiffness: 300, damping: 30 },
				opacity: { duration: 0.4 },
			},
		},
		exit: (direction: number) => ({
			x: direction > 0 ? -300 : 300,
			opacity: 0,
			transition: {
				x: { type: 'spring', stiffness: 300, damping: 30 },
				opacity: { duration: 0.4 },
			},
		}),
	};

	// Rendu des étoiles pour le rating
	const renderStars = (rating: number) => {
		return (
			<div className='flex mt-2'>
				{Array.from({ length: 5 }).map((_, i) => (
					<svg
						key={i}
						className={`h-5 w-5 ${
							i < rating ? 'text-yellow-400' : 'text-gray-300'
						}`}
						fill='currentColor'
						viewBox='0 0 20 20'>
						<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
					</svg>
				))}
			</div>
		);
	};

	return (
		<section
			ref={sectionRef}
			className='py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden'>
			{/* Éléments décoratifs */}
			<div className='absolute inset-0 pointer-events-none'>
				<div className='absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-100 opacity-50'></div>
				<div className='absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-100 opacity-50'></div>
			</div>

			<div className='max-w-7xl mx-auto px-6 relative z-10'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-100px' }}
					transition={{ duration: 0.7 }}
					className='text-center mb-16'>
					<h2 className='text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 inline-block'>
						Ce qu'ils en pensent
					</h2>
					<div className='h-1 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mt-4 rounded-full'></div>
					<p className='mt-4 text-gray-600 max-w-2xl mx-auto'>
						Découvrez les avis de nos clients sur leur expérience
						avec notre boutique
					</p>
				</motion.div>

				<div className='relative'>
					{/* Contrôles de navigation */}
					<div className='absolute top-1/2 w-full flex justify-between items-center z-20 px-4 -mt-6'>
						<motion.button
							initial={{ opacity: 0.6 }}
							whileHover={{ opacity: 1, scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={prevTestimonial}
							className='bg-white/80 text-indigo-600 p-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-colors duration-300'
							aria-label='Témoignage précédent'>
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
							onClick={nextTestimonial}
							className='bg-white/80 text-indigo-600 p-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-colors duration-300'
							aria-label='Témoignage suivant'>
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

					{/* Carousel de témoignages */}
					<div className='max-w-4xl mx-auto'>
						<AnimatePresence
							initial={false}
							custom={direction}
							mode='wait'>
							<motion.div
								key={currentTestimonial}
								custom={direction}
								variants={testimonialVariants}
								initial='enter'
								animate='center'
								exit='exit'
								className='bg-white rounded-2xl shadow-xl overflow-hidden'>
								<div className='md:flex'>
									<div className='md:w-2/5 bg-gradient-to-br from-indigo-600 to-purple-600 relative'>
										{/* Image du client */}
										<div className='h-48 md:h-full relative'>
											<div className='absolute inset-0 opacity-20 bg-pattern-dots'></div>
											<Image
												src={
													testimonials[
														currentTestimonial
													].image
												}
												alt={
													testimonials[
														currentTestimonial
													].author
												}
												fill
												className='object-cover opacity-80'
												sizes='(max-width: 768px) 100vw, 40vw'
												priority
											/>
										</div>
									</div>
									<div className='md:w-3/5 p-8 md:p-10 flex flex-col justify-center'>
										<div className='text-5xl font-serif text-indigo-300 mb-4'>
											"
										</div>
										<p className='text-gray-700 italic mb-6 text-lg'>
											{
												testimonials[currentTestimonial]
													.text
											}
										</p>
										<div>
											{renderStars(
												testimonials[currentTestimonial]
													.rating
											)}
											<div className='mt-4'>
												<h4 className='font-bold text-gray-900 text-lg'>
													{
														testimonials[
															currentTestimonial
														].author
													}
												</h4>
												<p className='text-indigo-600'>
													{
														testimonials[
															currentTestimonial
														].role
													}
												</p>
											</div>
										</div>
									</div>
								</div>
							</motion.div>
						</AnimatePresence>
					</div>

					{/* Indicateurs */}
					<div className='flex justify-center mt-8 space-x-2'>
						{testimonials.map((_, index) => (
							<button
								key={index}
								onClick={() => goToTestimonial(index)}
								className={`w-3 h-3 rounded-full transition-all duration-300 ${
									index === currentTestimonial
										? 'bg-indigo-600 w-6'
										: 'bg-gray-300 hover:bg-indigo-400'
								}`}
								aria-label={`Témoignage ${index + 1}`}
							/>
						))}
					</div>
				</div>

				{/* Bouton d'action */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className='mt-16 text-center'>
					<a
						href='#'
						className='inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 md:py-4 md:text-lg md:px-10 transition-all duration-300 shadow-lg hover:shadow-xl'>
						Rejoindre nos clients satisfaits
					</a>
				</motion.div>
			</div>
		</section>
	);
}
