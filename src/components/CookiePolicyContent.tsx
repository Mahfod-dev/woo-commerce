'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CookiePolicySchema from './CookiePolicySchema';

interface CookiePolicyData {
	lastUpdated: string;
	introduction: {
		title: string;
		content: string;
	};
	sections: Array<{
		id: string;
		title: string;
		content: string;
	}>;
}

interface CookiePolicyContentProps {
	cookiePolicyData: CookiePolicyData;
}

export default function CookiePolicyContent({ cookiePolicyData }: CookiePolicyContentProps) {
	const [activeSection, setActiveSection] = useState<string>('');

	// Gérer le défilement et l'ancrage automatique
	useEffect(() => {
		const handleScroll = () => {
			const sections = cookiePolicyData.sections;
			const scrollPosition = window.scrollY + 100;

			for (let i = sections.length - 1; i >= 0; i--) {
				const element = document.getElementById(sections[i].id);
				if (element && element.offsetTop <= scrollPosition) {
					setActiveSection(sections[i].id);
					break;
				}
			}
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll(); // Initial call

		return () => window.removeEventListener('scroll', handleScroll);
	}, [cookiePolicyData.sections]);

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				when: 'beforeChildren',
				staggerChildren: 0.1,
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

	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			const offsetTop = element.offsetTop - 80;
			window.scrollTo({
				top: offsetTop,
				behavior: 'smooth',
			});
		}
	};

	return (
		<>
			{/* Schema.org pour SEO */}
			<CookiePolicySchema cookiePolicyData={cookiePolicyData} />

			<div className='bg-gray-50 min-h-screen cookie-policy-content'>
				{/* Header avec navigation breadcrumb */}
				<div className='bg-white shadow-sm'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
						<nav className='flex items-center space-x-2 text-sm'>
							<Link
								href='/'
								className='text-gray-500 hover:text-indigo-600 transition-colors'>
								Accueil
							</Link>
							<span className='text-gray-400'>›</span>
							<span className='text-gray-900 font-medium'>
								Politique de Cookies
							</span>
						</nav>
					</div>
				</div>

				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
					<div className='flex flex-col lg:flex-row gap-8'>
						{/* Table des matières (sidebar) */}
						<aside className='lg:w-1/4'>
							<div className='sticky top-24 bg-white rounded-lg shadow-sm p-6'>
								<h3 className='text-lg font-semibold text-gray-900 mb-4'>
									Table des matières
								</h3>
								<nav className='space-y-2'>
									{cookiePolicyData.sections.map((section) => (
										<button
											key={section.id}
											onClick={() => scrollToSection(section.id)}
											className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
												activeSection === section.id
													? 'bg-indigo-50 text-indigo-700 font-medium'
													: 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
											}`}>
											{section.title}
										</button>
									))}
								</nav>
							</div>
						</aside>

						{/* Contenu principal */}
						<main className='lg:w-3/4'>
							<motion.div
								variants={containerVariants}
								initial='hidden'
								animate='visible'
								className='bg-white rounded-lg shadow-sm'>
								{/* En-tête */}
								<motion.div variants={itemVariants} className='p-8 border-b border-gray-200'>
									<div className='flex items-center justify-between mb-6'>
										<h1 className='text-3xl md:text-4xl font-bold text-gray-900'>
											Politique de Cookies
										</h1>
										<div className='text-sm text-gray-500'>
											Dernière mise à jour : {cookiePolicyData.lastUpdated}
										</div>
									</div>

									{/* Résumé */}
									<div className='bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6'>
										<div className='flex'>
											<div className='flex-shrink-0'>
												<svg
													className='h-5 w-5 text-indigo-400'
													fill='currentColor'
													viewBox='0 0 20 20'>
													<path
														fillRule='evenodd'
														d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
														clipRule='evenodd'
													/>
												</svg>
											</div>
											<div className='ml-3'>
												<h3 className='text-sm font-medium text-indigo-800'>
													En bref
												</h3>
												<p className='mt-1 text-sm text-indigo-700'>
													Cette politique explique comment nous utilisons les cookies sur Selectura pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. Vous gardez le contrôle total sur vos préférences.
												</p>
											</div>
										</div>
									</div>

									{/* Introduction */}
									<div>
										<h2 className='text-xl font-semibold text-gray-900 mb-4'>
											{cookiePolicyData.introduction.title}
										</h2>
										<div
											className='text-gray-600 leading-relaxed cookie-content'
											dangerouslySetInnerHTML={{
												__html: cookiePolicyData.introduction.content,
											}}
										/>
									</div>
								</motion.div>

								{/* Sections du contenu */}
								<div className='p-8'>
									{cookiePolicyData.sections.map((section, index) => (
										<motion.section
											key={section.id}
											id={section.id}
											variants={itemVariants}
											className={`${index > 0 ? 'mt-12 pt-8 border-t border-gray-200' : ''}`}>
											<h2 className='text-2xl font-semibold text-gray-900 mb-6'>
												{section.title}
											</h2>
											<div
												className='text-gray-600 leading-relaxed cookie-content'
												dangerouslySetInnerHTML={{
													__html: section.content,
												}}
											/>
										</motion.section>
									))}
								</div>

								{/* Footer avec liens utiles */}
								<motion.div
									variants={itemVariants}
									className='p-8 bg-gray-50 border-t border-gray-200 rounded-b-lg'>
									<h3 className='text-lg font-semibold text-gray-900 mb-4'>
										Liens utiles
									</h3>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div>
											<h4 className='font-medium text-gray-900 mb-2'>
												Politiques connexes
											</h4>
											<ul className='space-y-1'>
												<li>
													<Link
														href='/privacy-policy'
														className='text-indigo-600 hover:text-indigo-800 transition-colors'>
														Politique de confidentialité
													</Link>
												</li>
												<li>
													<Link
														href='/terms'
														className='text-indigo-600 hover:text-indigo-800 transition-colors'>
														Conditions générales
													</Link>
												</li>
												<li>
													<Link
														href='/returns'
														className='text-indigo-600 hover:text-indigo-800 transition-colors'>
														Politique de retour
													</Link>
												</li>
											</ul>
										</div>
										<div>
											<h4 className='font-medium text-gray-900 mb-2'>
												Besoin d'aide ?
											</h4>
											<ul className='space-y-1'>
												<li>
													<Link
														href='/contact'
														className='text-indigo-600 hover:text-indigo-800 transition-colors'>
														Nous contacter
													</Link>
												</li>
												<li>
													<Link
														href='/faq'
														className='text-indigo-600 hover:text-indigo-800 transition-colors'>
														Questions fréquentes
													</Link>
												</li>
												<li>
													<button
														onClick={() => {
															// Supprimer le consentement pour forcer l'affichage du bandeau
															localStorage.removeItem('cookie-consent');
															// Recharger la page pour afficher le bandeau
															window.location.reload();
														}}
														className='text-indigo-600 hover:text-indigo-800 transition-colors text-left'>
														Gérer mes cookies
													</button>
												</li>
											</ul>
										</div>
									</div>
								</motion.div>
							</motion.div>
						</main>
					</div>
				</div>
			</div>
		</>
	);
}