'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
	const heroRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Animation des éléments au chargement
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('animate-in');
					}
				});
			},
			{ threshold: 0.1 }
		);

		const animatedElements =
			heroRef.current?.querySelectorAll('.animate-item');
		animatedElements?.forEach((el) => observer.observe(el));

		return () => {
			animatedElements?.forEach((el) => observer.unobserve(el));
		};
	}, []);

	return (
		<section
			ref={heroRef}
			className='relative h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700 text-white'>
			{/* Cercles abstraits en arrière-plan */}
			<div className='absolute top-0 left-0 w-full h-full overflow-hidden z-0'>
				<div className='absolute w-96 h-96 rounded-full bg-purple-500 opacity-10 -top-20 -left-20'></div>
				<div className='absolute w-96 h-96 rounded-full bg-indigo-500 opacity-10 top-1/3 right-0'></div>
				<div className='absolute w-96 h-96 rounded-full bg-pink-500 opacity-10 bottom-0 left-1/3'></div>
			</div>

			{/* Contenu principal */}
			<div className='relative z-10 h-full max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-center'>
				{/* Texte */}
				<div className='md:w-1/2 space-y-8 animate-item opacity-0 translate-y-8 transition-all duration-1000 ease-out'>
					<h1 className='text-5xl md:text-7xl font-extrabold leading-tight'>
						<span className='block'>Une nouvelle</span>
						<span className='block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400'>
							expérience shopping
						</span>
					</h1>
					<p className='text-xl text-indigo-100 max-w-md'>
						Découvrez notre collection unique où innovation et
						élégance se rencontrent pour une expérience immersive.
					</p>
					<div className='flex flex-wrap gap-4'>
						<Link
							href='/products'
							className='group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium bg-white rounded-full'>
							<span className='absolute inset-0 w-full h-full transition-all duration-300 ease-out bg-gradient-to-r from-purple-500 to-pink-500 group-hover:opacity-100 opacity-0'></span>
							<span className='relative bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:text-white transition-colors duration-300 font-bold'>
								Explorer
							</span>
						</Link>
						<Link
							href='/categories'
							className='inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-indigo-100 border border-indigo-300 rounded-full hover:text-white hover:border-white transition-colors duration-300'>
							Catégories
						</Link>
					</div>
				</div>

				{/* Image/Visuel */}
				<div className='md:w-1/2 mt-12 md:mt-0 animate-item opacity-0 translate-x-8 transition-all duration-1000 delay-300 ease-out'>
					<div className='relative h-80 md:h-96 w-80 md:w-96 mx-auto'>
						<div className='absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-30 animate-pulse'></div>
						<Image
							src='/globe.svg'
							alt='Experience shopping immersive'
							className='relative z-10 object-contain'
							fill
							priority
						/>
					</div>
				</div>
			</div>

			{/* Scroll indicator */}
			<div className='absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='24'
					height='24'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'>
					<path d='M12 5v14M5 12l7 7 7-7' />
				</svg>
			</div>
		</section>
	);
}
