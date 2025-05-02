'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import PrivacySchema from './PrivacySchema';

// Types pour les données de la politique de confidentialité
interface PrivacySection {
	id: string;
	title: string;
	content: string;
}

interface PrivacyData {
	lastUpdated: string;
	introduction: {
		title: string;
		content: string;
	};
	sections: PrivacySection[];
}

interface PrivacyContentProps {
	privacyData: PrivacyData;
}

export default function PrivacyContent({ privacyData }: PrivacyContentProps) {
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
			className='bg-gray-50 min-h-screen py-16 privacy-content'
			data-print-date={new Date().toLocaleDateString('fr-FR', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})}>
			{/* Ajouter le schéma JSON-LD */}
			<PrivacySchema
				organizationName='Votre Boutique'
				url='https://votreboutique.com/privacy'
				lastUpdated={privacyData.lastUpdated}
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
							Politique de Confidentialité
						</h1>
						<p className='text-xl text-indigo-100 mb-4'>
							Comment nous protégeons vos données personnelles et
							respectons votre vie privée
						</p>
						<p className='text-base text-indigo-200'>
							Dernière mise à jour : {privacyData.lastUpdated}
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
							<nav className='space-y-1 privacy-nav'>
								<div className='mb-6'>
									<button
										onClick={() =>
											scrollToSection('introduction')
										}
										className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors privacy-nav-item ${
											activeSection === 'introduction'
												? 'bg-indigo-100 text-indigo-700 active'
												: 'text-gray-600 hover:bg-gray-100'
										}`}>
										{privacyData.introduction.title}
									</button>
								</div>

								<div className='space-y-1'>
									{privacyData.sections.map((section) => (
										<button
											key={section.id}
											onClick={() =>
												scrollToSection(section.id)
											}
											className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors privacy-nav-item ${
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
										href='/terms'
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
												d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
											/>
										</svg>
										Conditions générales
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
								className='privacy-content-container prose prose-indigo max-w-none'>
								{/* Introduction */}
								<section
									id='introduction'
									ref={(el) => {
										sectionRefs.current['introduction'] =
											el;
									}}
									className='mb-12 privacy-section'>
									<motion.h2
										variants={itemVariants}
										className='text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200'>
										{privacyData.introduction.title}
									</motion.h2>
									<motion.div
										variants={itemVariants}
										dangerouslySetInnerHTML={{
											__html: privacyData.introduction
												.content,
										}}
										className='text-gray-700'
									/>
								</section>

								{/* Sections */}
								{privacyData.sections.map((section) => (
									<section
										key={section.id}
										id={section.id}
										ref={(el) => {
											sectionRefs.current[section.id] =
												el;
										}}
										className='mb-12 privacy-section'>
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
										Cette politique de confidentialité a été
										mise à jour le {privacyData.lastUpdated}
										.
									</p>
									<p className='text-gray-600 mt-2'>
										Pour toute question concernant la
										protection de vos données, veuillez{' '}
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

			{/* FAQ simplifiée pour les questions de confidentialité courantes */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h2 className='text-2xl font-bold text-gray-900 text-center mb-8'>
					Questions fréquentes sur la protection des données
				</h2>

				<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
					<div className='bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow'>
						<h3 className='text-lg font-medium text-gray-900 mb-3'>
							Comment puis-je accéder à mes données ?
						</h3>
						<p className='text-gray-600'>
							Vous pouvez accéder à la plupart de vos données en
							vous connectant à votre compte dans la section
							&quot;Mon compte&quot;. Pour une demande complète,
							contactez-nous à privacy@votreboutique.com.
						</p>
					</div>

					<div className='bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow'>
						<h3 className='text-lg font-medium text-gray-900 mb-3'>
							Comment désactiver les cookies ?
						</h3>
						<p className='text-gray-600'>
							Vous pouvez modifier vos préférences de cookies à
							tout moment via le lien &quot;Gérer les
							cookies&quot; en bas de notre site. Vous pouvez
							également les désactiver dans les paramètres de
							votre navigateur.
						</p>
					</div>

					<div className='bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow'>
						<h3 className='text-lg font-medium text-gray-900 mb-3'>
							Comment me désabonner des emails ?
						</h3>
						<p className='text-gray-600'>
							Chaque email marketing contient un lien de
							désabonnement en bas. Vous pouvez également gérer
							vos préférences de communication dans votre compte
							ou nous contacter directement.
						</p>
					</div>

					<div className='bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow'>
						<h3 className='text-lg font-medium text-gray-900 mb-3'>
							Vendez-vous mes données ?
						</h3>
						<p className='text-gray-600'>
							Non, nous ne vendons jamais vos données personnelles
							à des tiers. Nous ne les partageons que dans les cas
							limités décrits dans notre politique de
							confidentialité et avec votre consentement lorsque
							nécessaire.
						</p>
					</div>

					<div className='bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow'>
						<h3 className='text-lg font-medium text-gray-900 mb-3'>
							Comment supprimer mon compte ?
						</h3>
						<p className='text-gray-600'>
							Vous pouvez demander la suppression de votre compte
							en nous contactant à privacy@votreboutique.com ou
							via la section &quot;Supprimer mon compte&quot; dans
							les paramètres de votre compte.
						</p>
					</div>

					<div className='bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow'>
						<h3 className='text-lg font-medium text-gray-900 mb-3'>
							Mes données sont-elles en sécurité ?
						</h3>
						<p className='text-gray-600'>
							Nous mettons en œuvre des mesures de sécurité
							techniques et organisationnelles pour protéger vos
							données. Toutes les transmissions sont chiffrées et
							nos systèmes sont régulièrement audités.
						</p>
					</div>
				</div>
			</div>

			{/* Call to action section */}
			<div className='bg-indigo-700 py-12 mt-16'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<h2 className='text-2xl font-bold text-white mb-4'>
						Besoin d&apos;aide concernant vos données personnelles ?
					</h2>
					<p className='text-white mb-6'>
						Notre délégué à la protection des données est à votre
						disposition pour répondre à toutes vos questions
						concernant la protection de vos informations
						personnelles.
					</p>
					<Link
						href='/contact?subject=privacy'
						className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 transition-colors shadow-md'>
						Contactez notre DPO
						<svg
							className='ml-2 h-5 w-5'
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
