'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import ReturnsSchema from './ReturnsSchema';

// Types pour les données de retour
interface ReturnsSection {
	id: string;
	title: string;
	content: string;
}

interface ReturnsData {
	lastUpdated: string;
	introduction: {
		title: string;
		content: string;
	};
	sections: ReturnsSection[];
}

interface ReturnsContentProps {
	returnsData: ReturnsData;
}

export default function ReturnsContent({ returnsData }: ReturnsContentProps) {
	const [activeSection, setActiveSection] = useState<string>('');
	const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
	const contentRef = useRef<HTMLDivElement>(null);

	// Récupérer les paramètres d'URL pour afficher une section spécifique
	const searchParams = useSearchParams();

	// Effet pour définir la section active en fonction du scroll
	useEffect(() => {
		const section = searchParams.get('section');
		if (section && sectionRefs.current[section]) {
			setActiveSection(section);
			sectionRefs.current[section]?.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}

		const handleScroll = () => {
			if (!contentRef.current) return;

			// Déterminer quelle section est visible
			const scrollPosition = window.scrollY + 100; // offset pour la navigation fixe

			for (const id in sectionRefs.current) {
				const section = sectionRefs.current[id];
				if (!section) continue;

				const sectionTop = section.offsetTop;
				const sectionBottom = sectionTop + section.offsetHeight;

				if (
					scrollPosition >= sectionTop &&
					scrollPosition < sectionBottom
				) {
					setActiveSection(id);
					break;
				}
			}
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll(); // Initialiser la section active

		return () => window.removeEventListener('scroll', handleScroll);
	}, [searchParams]);

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.05,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				stiffness: 100,
				damping: 15,
			},
		},
	};

	// Fonction pour naviguer vers une section
	const scrollToSection = (sectionId: string) => {
		setActiveSection(sectionId);
		sectionRefs.current[sectionId]?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	};

	return (
		<div
			className='bg-gray-50 min-h-screen py-16 returns-content'
			data-print-date={new Date().toLocaleDateString('fr-FR', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})}>
			{/* Ajouter le schéma JSON-LD */}
			<ReturnsSchema
				organizationName='Votre Boutique'
				url='https://votreboutique.com/returns'
				lastUpdated={returnsData.lastUpdated}
			/>
			{/* Hero section */}
			<div className='relative bg-gradient-to-r from-indigo-700 to-purple-700 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className='text-center max-w-3xl mx-auto'>
						<h1 className='text-3xl md:text-5xl font-bold mb-4'>
							Politique de Retour
						</h1>
						<p className='text-xl text-indigo-100 mb-4'>
							Tout ce que vous devez savoir sur nos procédures de
							retour, d&apos;échange et de remboursement.
						</p>
						<p className='text-base text-indigo-200'>
							Dernière mise à jour : {returnsData.lastUpdated}
						</p>
					</motion.div>
				</div>

				{/* Éléments décoratifs */}
				<div className='absolute inset-0 overflow-hidden opacity-20'>
					<div className='absolute -top-20 -left-20 w-64 h-64 rounded-full bg-indigo-500' />
					<div className='absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-500' />
				</div>
			</div>

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20'>
				<motion.div
					initial={{ y: 50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className='bg-white rounded-xl shadow-lg overflow-hidden'>
					<div className='flex flex-col md:flex-row'>
						{/* Navigation latérale */}
						<div className='md:w-64 bg-gray-50 p-6 md:sticky md:top-20 md:h-screen md:overflow-y-auto'>
							<nav className='space-y-1 returns-nav'>
								<div className='mb-6'>
									<button
										onClick={() =>
											scrollToSection('introduction')
										}
										className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors returns-nav-item ${
											activeSection === 'introduction'
												? 'bg-indigo-100 text-indigo-700 active'
												: 'text-gray-600 hover:bg-gray-100'
										}`}>
										{returnsData.introduction.title}
									</button>
								</div>

								<div className='space-y-1'>
									{returnsData.sections.map((section) => (
										<button
											key={section.id}
											onClick={() =>
												scrollToSection(section.id)
											}
											className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors returns-nav-item ${
												activeSection === section.id
													? 'bg-indigo-100 text-indigo-700 active'
													: 'text-gray-600 hover:bg-gray-100'
											}`}>
											{section.title}
										</button>
									))}
								</div>

								<div className='pt-6 mt-6 border-t border-gray-200'>
									<Link
										href='/contact'
										className='flex items-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 rounded-md hover:bg-indigo-50 transition-colors'>
										<svg
											className='mr-2 h-5 w-5'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
											/>
										</svg>
										Nous contacter
									</Link>

									<Link
										href='/shipping'
										className='flex items-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 rounded-md hover:bg-indigo-50 transition-colors'>
										<svg
											className='mr-2 h-5 w-5'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
											/>
										</svg>
										Politique de livraison
									</Link>

									<button
										onClick={() => window.print()}
										className='flex items-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 rounded-md hover:bg-indigo-50 transition-colors w-full text-left'>
										<svg
											className='mr-2 h-5 w-5'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z'
											/>
										</svg>
										Imprimer
									</button>
								</div>
							</nav>
						</div>

						{/* Contenu principal */}
						<div
							ref={contentRef}
							className='flex-1 p-6 md:p-10'>
							<motion.div
								variants={containerVariants}
								initial='hidden'
								animate='visible'
								className='returns-content-container prose prose-indigo max-w-none'>
								{/* Introduction */}
								<section
									id='introduction'
									ref={(el) => {
										sectionRefs.current['introduction'] =
											el;
									}}
									className='mb-12 returns-section'>
									<motion.h2
										variants={itemVariants}
										className='text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200'>
										{returnsData.introduction.title}
									</motion.h2>
									<motion.div
										variants={itemVariants}
										dangerouslySetInnerHTML={{
											__html: returnsData.introduction
												.content,
										}}
										className='text-gray-700'
									/>
								</section>

								{/* Sections */}
								{returnsData.sections.map((section) => (
									<section
										key={section.id}
										id={section.id}
										ref={(el) => {
											sectionRefs.current[section.id] =
												el;
										}}
										className='mb-12 returns-section'>
										<motion.h2
											variants={itemVariants}
											className='text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200'>
											{section.title}
										</motion.h2>
										<motion.div
											variants={itemVariants}
											dangerouslySetInnerHTML={{
												__html: section.content,
											}}
											className='text-gray-700'
										/>
									</section>
								))}

								{/* Pied de page */}
								<motion.div
									variants={itemVariants}
									className='mt-16 pt-8 border-t border-gray-200 text-center'>
									<p className='text-gray-600 italic'>
										Cette politique de retour a été mise à
										jour le {returnsData.lastUpdated}.
									</p>
									<p className='text-gray-600 mt-2'>
										Pour toute question concernant nos
										procédures de retour, veuillez{' '}
										<Link
											href='/contact'
											className='text-indigo-600 hover:text-indigo-800'>
											nous contacter
										</Link>
										.
									</p>
								</motion.div>
							</motion.div>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Section Satisfaction Garantie */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<div className='bg-gradient-to-br from-green-600 to-teal-600 rounded-xl shadow-lg overflow-hidden'>
					<div className='md:flex'>
						<div className='md:w-2/3 p-8 md:p-12 text-white'>
							<h2 className='text-2xl md:text-3xl font-bold mb-4'>
								Satisfaction garantie à 100%
							</h2>
							<p className='text-green-100 mb-6'>
								Votre satisfaction est notre priorité. Si vous
								n&apos;êtes pas entièrement satisfait de votre
								achat, nous vous remboursons ou vous échangeons
								le produit sans complication.
							</p>
							<div className='space-y-4'>
								<div className='flex items-start'>
									<svg
										className='h-6 w-6 text-green-300 mr-3 mt-0.5'
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
									<p>30 jours pour changer d&apos;avis</p>
								</div>
								<div className='flex items-start'>
									<svg
										className='h-6 w-6 text-green-300 mr-3 mt-0.5'
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
									<p>
										Processus de retour simple et sans
										tracas
									</p>
								</div>
								<div className='flex items-start'>
									<svg
										className='h-6 w-6 text-green-300 mr-3 mt-0.5'
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
									<p>
										Service client dédié pour vous assister
									</p>
								</div>
							</div>
							<div className='mt-8'>
								<Link
									href='/products'
									className='inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-gray-50 transition-colors'>
									Découvrir nos produits
								</Link>
							</div>
						</div>
						<div className='md:w-1/3 bg-green-700 p-8 md:p-12 flex items-center justify-center'>
							<div className='text-center'>
								<div className='text-white text-5xl font-bold mb-2'>
									30
								</div>
								<div className='text-green-200 font-medium'>
									jours pour essayer
								</div>
								<div className='mt-6 px-4 py-2 bg-white/10 rounded-lg text-white text-sm'>
									Sans condition
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Back to top button */}
			<div className='fixed bottom-8 right-8 z-30'>
				<button
					onClick={() =>
						window.scrollTo({ top: 0, behavior: 'smooth' })
					}
					className='bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
					aria-label='Retour en haut'>
					<svg
						className='h-6 w-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M5 10l7-7m0 0l7 7m-7-7v18'
						/>
					</svg>
				</button>
			</div>
		</div>
	);
}
