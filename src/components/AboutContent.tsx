'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import AboutSchema from './AboutSchema';

// Types pour les données de la page À propos
interface AboutValue {
	icon: string;
	title: string;
	description: string;
}

interface SelectionStep {
	number: string;
	title: string;
	description: string;
}

interface TeamMember {
	name: string;
	role: string;
	bio: string;
	imageUrl: string;
}

interface Testimonial {
	text: string;
	author: string;
}

interface AboutData {
	heroSection: {
		title: string;
		description: string;
		imageUrl: string;
	};
	history: {
		title: string;
		content: string;
		imageUrl: string;
	};
	philosophy: {
		title: string;
		content: string;
	};
	values: {
		title: string;
		items: AboutValue[];
	};
	selectionProcess: {
		title: string;
		steps: SelectionStep[];
	};
	team: {
		title: string;
		description: string;
		members: TeamMember[];
	};
	testimonials: {
		title: string;
		quotes: Testimonial[];
	};
	contact: {
		title: string;
		description: string;
		email: string;
		phone: string;
		address: string;
	};
}

interface AboutContentProps {
	aboutData: AboutData;
}

export default function AboutContent({ aboutData }: AboutContentProps) {
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

	// Fonction pour naviguer vers une section
	const scrollToSection = (sectionId: string) => {
		setActiveSection(sectionId);
		sectionRefs.current[sectionId]?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	};

	// Rendu d'icône en fonction du type
	const renderIcon = (iconType: string) => {
		switch (iconType) {
			case 'quality':
				return (
					<svg
						className='h-8 w-8 text-indigo-600'
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
				);
			case 'transparency':
				return (
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
				);
			case 'sustainability':
				return (
					<svg
						className='h-8 w-8 text-indigo-600'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
						/>
					</svg>
				);
			case 'simplicity':
				return (
					<svg
						className='h-8 w-8 text-indigo-600'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
						/>
					</svg>
				);
			default:
				return (
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
				);
		}
	};

	return (
		<div className='bg-gray-50 min-h-screen font-sans about-content'>
			{/* Ajouter le schéma JSON-LD */}
			<AboutSchema
				organizationName='Votre Boutique'
				url='https://votreboutique.com/about'
				foundingDate='2018'
				founders={['Pierre Martin']}
				location='Lyon, France'
			/>

			{/* Hero section */}
			<div className='relative bg-gradient-to-r from-indigo-700 to-purple-700 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className='text-center max-w-3xl mx-auto'>
						<h1 className='text-3xl md:text-5xl font-bold mb-4'>
							{aboutData.heroSection.title}
						</h1>
						<p className='text-xl text-indigo-100'>
							{aboutData.heroSection.description}
						</p>
					</motion.div>
				</div>

				{/* Éléments décoratifs */}
				<div className='absolute inset-0 overflow-hidden opacity-20'>
					<div className='absolute -top-20 -left-20 w-64 h-64 rounded-full bg-indigo-500' />
					<div className='absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-500' />
				</div>
			</div>

			{/* Navigation latérale et contenu */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10'>
				<div className='flex flex-col md:flex-row gap-8'>
					{/* Navigation latérale */}
					<div className='md:w-64 md:sticky md:top-20 md:self-start'>
						<nav className='bg-white rounded-xl shadow-sm p-4 about-nav'>
							<h3 className='text-lg font-medium text-gray-900 mb-4 pl-3'>
								Sommaire
							</h3>
							<div className='space-y-1'>
								<button
									onClick={() => scrollToSection('history')}
									className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors about-nav-item ${
										activeSection === 'history'
											? 'bg-indigo-100 text-indigo-700 active'
											: 'text-gray-600 hover:bg-gray-100'
									}`}>
									Notre histoire
								</button>
								<button
									onClick={() =>
										scrollToSection('philosophy')
									}
									className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors about-nav-item ${
										activeSection === 'philosophy'
											? 'bg-indigo-100 text-indigo-700 active'
											: 'text-gray-600 hover:bg-gray-100'
									}`}>
									Notre philosophie
								</button>
								<button
									onClick={() => scrollToSection('values')}
									className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors about-nav-item ${
										activeSection === 'values'
											? 'bg-indigo-100 text-indigo-700 active'
											: 'text-gray-600 hover:bg-gray-100'
									}`}>
									Nos valeurs
								</button>
								<button
									onClick={() =>
										scrollToSection('selectionProcess')
									}
									className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors about-nav-item ${
										activeSection === 'selectionProcess'
											? 'bg-indigo-100 text-indigo-700 active'
											: 'text-gray-600 hover:bg-gray-100'
									}`}>
									Notre processus de sélection
								</button>
								<button
									onClick={() => scrollToSection('team')}
									className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors about-nav-item ${
										activeSection === 'team'
											? 'bg-indigo-100 text-indigo-700 active'
											: 'text-gray-600 hover:bg-gray-100'
									}`}>
									Notre équipe
								</button>
								<button
									onClick={() =>
										scrollToSection('testimonials')
									}
									className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors about-nav-item ${
										activeSection === 'testimonials'
											? 'bg-indigo-100 text-indigo-700 active'
											: 'text-gray-600 hover:bg-gray-100'
									}`}>
									Témoignages
								</button>
								<button
									onClick={() => scrollToSection('contact')}
									className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors about-nav-item ${
										activeSection === 'contact'
											? 'bg-indigo-100 text-indigo-700 active'
											: 'text-gray-600 hover:bg-gray-100'
									}`}>
									Contact
								</button>
							</div>
						</nav>
					</div>

					{/* Contenu principal */}
					<div
						ref={contentRef}
						className='flex-1'>
						<motion.div
							variants={containerVariants}
							initial='hidden'
							animate='visible'
							className='space-y-16'>
							{/* Notre histoire */}
							<motion.section
								variants={itemVariants}
								id='history'
								ref={(el) => {
									sectionRefs.current['history'] = el;
								}}
								className='bg-white rounded-xl shadow-sm overflow-hidden about-section'>
								<div className='md:flex'>
									<div className='md:w-1/2 p-8'>
										<h2 className='text-3xl font-bold text-gray-900 mb-6'>
											{aboutData.history.title}
										</h2>
										<div
											className='prose prose-indigo max-w-none'
											dangerouslySetInnerHTML={{
												__html: aboutData.history
													.content,
											}}
										/>
									</div>
									<div className='md:w-1/2 relative'>
										<div className='h-full min-h-[300px] relative'>
											<Image
												src={aboutData.history.imageUrl}
												alt='Fondateur de Votre Boutique'
												fill
												sizes='(max-width: 768px) 100vw, 50vw'
												className='object-cover'
											/>
										</div>
									</div>
								</div>
							</motion.section>

							{/* Notre philosophie */}
							<motion.section
								variants={itemVariants}
								id='philosophy'
								ref={(el) => {
									sectionRefs.current['philosophy'] = el;
								}}
								className='bg-white rounded-xl shadow-sm p-8 about-section'>
								<h2 className='text-3xl font-bold text-gray-900 mb-6'>
									{aboutData.philosophy.title}
								</h2>
								<div
									className='prose prose-indigo max-w-none'
									dangerouslySetInnerHTML={{
										__html: aboutData.philosophy.content,
									}}
								/>
							</motion.section>

							{/* Nos valeurs */}
							<motion.section
								variants={itemVariants}
								id='values'
								ref={(el) => {
									sectionRefs.current['values'] = el;
								}}
								className='about-section'>
								<h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
									{aboutData.values.title}
								</h2>
								<div className='grid md:grid-cols-2 gap-6'>
									{aboutData.values.items.map(
										(value, index) => (
											<motion.div
												key={index}
												whileHover={{ y: -5 }}
												className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
												<div className='flex items-start'>
													<div className='bg-indigo-100 rounded-lg p-3 mr-4'>
														{renderIcon(value.icon)}
													</div>
													<div>
														<h3 className='text-xl font-bold text-gray-900 mb-2'>
															{value.title}
														</h3>
														<p className='text-gray-600'>
															{value.description}
														</p>
													</div>
												</div>
											</motion.div>
										)
									)}
								</div>
							</motion.section>

							{/* Notre processus de sélection */}
							<motion.section
								variants={itemVariants}
								id='selectionProcess'
								ref={(el) => {
									sectionRefs.current['selectionProcess'] =
										el;
								}}
								className='bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-sm p-8 text-white about-section'>
								<h2 className='text-3xl font-bold mb-8 text-center'>
									{aboutData.selectionProcess.title}
								</h2>
								<div className='grid md:grid-cols-5 gap-4'>
									{aboutData.selectionProcess.steps.map(
										(step, index) => (
											<div
												key={index}
												className='relative'>
												<div className='bg-white/10 backdrop-blur-sm rounded-lg p-6 h-full'>
													<div className='text-3xl font-bold text-white/80 mb-3'>
														{step.number}
													</div>
													<h3 className='text-xl font-bold mb-2'>
														{step.title}
													</h3>
													<p className='text-indigo-100'>
														{step.description}
													</p>
												</div>
												{index <
													aboutData.selectionProcess
														.steps.length -
														1 && (
													<div className='hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10'>
														<svg
															className='h-8 w-8 text-white'
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
													</div>
												)}
											</div>
										)
									)}
								</div>
							</motion.section>

							{/* Notre équipe */}
							<motion.section
								variants={itemVariants}
								id='team'
								ref={(el) => {
									sectionRefs.current['team'] = el;
								}}
								className='about-section'>
								<h2 className='text-3xl font-bold text-gray-900 mb-4 text-center'>
									{aboutData.team.title}
								</h2>
								<p className='text-gray-600 text-center max-w-3xl mx-auto mb-12'>
									{aboutData.team.description}
								</p>
								<div className='grid md:grid-cols-3 gap-8'>
									{aboutData.team.members.map(
										(member, index) => (
											<motion.div
												key={index}
												whileHover={{ y: -5 }}
												className='bg-white rounded-xl shadow-sm overflow-hidden'>
												<div className='h-64 relative'>
													<Image
														src={member.imageUrl}
														alt={member.name}
														fill
														sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
														className='object-cover'
													/>
												</div>
												<div className='p-6'>
													<h3 className='text-xl font-bold text-gray-900 mb-1'>
														{member.name}
													</h3>
													<p className='text-indigo-600 font-medium mb-3'>
														{member.role}
													</p>
													<p className='text-gray-600'>
														{member.bio}
													</p>
												</div>
											</motion.div>
										)
									)}
								</div>
							</motion.section>

							{/* Témoignages */}
							<motion.section
								variants={itemVariants}
								id='testimonials'
								ref={(el) => {
									sectionRefs.current['testimonials'] = el;
								}}
								className='about-section'>
								<h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
									{aboutData.testimonials.title}
								</h2>
								<div className='grid md:grid-cols-3 gap-6'>
									{aboutData.testimonials.quotes.map(
										(quote, index) => (
											<motion.div
												key={index}
												whileHover={{ y: -5 }}
												className='bg-white rounded-xl shadow-sm p-6'>
												<svg
													className='h-8 w-8 text-indigo-600 mb-4'
													fill='currentColor'
													viewBox='0 0 24 24'>
													<path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z' />
												</svg>
												<p className='text-gray-700 mb-4 italic'>
													&ldquo;{quote.text}&rdquo;
												</p>
												<p className='text-sm text-indigo-600 font-medium'>
													{quote.author}
												</p>
											</motion.div>
										)
									)}
								</div>
							</motion.section>

							{/* Contact */}
							<motion.section
								variants={itemVariants}
								id='contact'
								ref={(el) => {
									sectionRefs.current['contact'] = el;
								}}
								className='bg-white rounded-xl shadow-sm p-8 about-section'>
								<h2 className='text-3xl font-bold text-gray-900 mb-4'>
									{aboutData.contact.title}
								</h2>
								<p className='text-gray-600 mb-8'>
									{aboutData.contact.description}
								</p>
								<div className='grid md:grid-cols-3 gap-6'>
									<div className='flex items-start'>
										<div className='bg-indigo-100 rounded-lg p-3 mr-4'>
											<svg
												className='h-6 w-6 text-indigo-600'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
												/>
											</svg>
										</div>
										<div>
											<h3 className='text-lg font-bold text-gray-900 mb-1'>
												Email
											</h3>
											<a
												href={`mailto:${aboutData.contact.email}`}
												className='text-indigo-600 hover:text-indigo-800'>
												{aboutData.contact.email}
											</a>
										</div>
									</div>
									<div className='flex items-start'>
										<div className='bg-indigo-100 rounded-lg p-3 mr-4'>
											<svg
												className='h-6 w-6 text-indigo-600'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
												/>
											</svg>
										</div>
										<div>
											<h3 className='text-lg font-bold text-gray-900 mb-1'>
												Téléphone
											</h3>
											<a
												href={`tel:${aboutData.contact.phone.replace(
													/\s/g,
													''
												)}`}
												className='text-indigo-600 hover:text-indigo-800'>
												{aboutData.contact.phone}
											</a>
										</div>
									</div>
									<div className='flex items-start'>
										<div className='bg-indigo-100 rounded-lg p-3 mr-4'>
											<svg
												className='h-6 w-6 text-indigo-600'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
												/>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
												/>
											</svg>
										</div>
										<div>
											<h3 className='text-lg font-bold text-gray-900 mb-1'>
												Adresse
											</h3>
											<address className='not-italic text-gray-600'>
												{aboutData.contact.address}
											</address>
										</div>
									</div>
								</div>

								<div className='mt-8 text-center'>
									<Link
										href='/contact'
										className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm bg-indigo-600 hover:bg-indigo-800 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'>
										<span className=' text-white'>
											Contactez-nous
										</span>
										<svg
											className='h-5 w-5'
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
									{/* <svg
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
										</svg> */}
								</div>
							</motion.section>
						</motion.div>
					</div>
				</div>
			</div>

			{/* CTA section */}
			<div className='bg-indigo-600 py-12 mt-16'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<h2 className='text-2xl font-bold text-white mb-4'>
						Découvrez nos produits sélectionnés
					</h2>
					<p className='text-indigo-100 mb-8 max-w-3xl mx-auto'>
						Maintenant que vous connaissez notre philosophie et
						notre engagement pour la qualité, explorez notre
						collection soigneusement choisie.
					</p>
					<Link
						href='/products'
						className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white'>
						Voir nos produits
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
