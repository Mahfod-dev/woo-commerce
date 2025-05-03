// src/components/AboutQualityContent.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ImprovedFaqSection from './ImprovedFaqSection';

interface AboutQualityData {
	heroSection: {
		title: string;
		description: string;
		imageUrl: string;
	};
	introduction: {
		title: string;
		content: string;
	};
	selectionProcess: {
		title: string;
		content: string;
		steps: {
			number: string;
			title: string;
			description: string;
			detail: string;
		}[];
	};
	qualityCriteria: {
		title: string;
		content: string;
		criteria: {
			icon: string;
			title: string;
			description: string;
		}[];
	};
	laboratorySection: {
		title: string;
		content: string;
		imageUrl: string;
	};
	userFeedback: {
		title: string;
		content: string;
	};
	qualityTeam: {
		title: string;
		content: string;
		members: {
			name: string;
			role: string;
			bio: string;
			imageUrl: string;
		}[];
	};
	qualityGuarantee: {
		title: string;
		content: string;
	};
	testimonials: {
		title: string;
		quotes: {
			text: string;
			author: string;
		}[];
	};
	faqs: {
		title: string;
		questions: {
			question: string;
			answer: string;
		}[];
	};
	conclusion: {
		title: string;
		content: string;
	};
	cta: {
		title: string;
		description: string;
		buttonText: string;
		buttonLink: string;
	};
}

interface AboutQualityContentProps {
	aboutQualityData: AboutQualityData;
}

export default function AboutQualityContent({
	aboutQualityData,
}: AboutQualityContentProps) {
	const [activeSection, setActiveSection] = useState<string>('introduction');
	const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

	// Fonction utilitaire pour assigner les refs
	const assignRef = (key: string) => (el: HTMLElement | null) => {
		if (sectionRefs.current) {
			sectionRefs.current[key] = el;
		}
	};

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

	// Effet pour suivre le scroll et mettre à jour la section active
	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY + 100;

			// Trouver quelle section est actuellement visible
			Object.entries(sectionRefs.current).forEach(([id, ref]) => {
				if (!ref) return;

				const top = ref.offsetTop;
				const height = ref.offsetHeight;

				if (scrollPosition >= top && scrollPosition < top + height) {
					setActiveSection(id);
				}
			});
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll(); // Initialiser la section active

		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Fonction pour faire défiler vers une section
	const scrollToSection = (sectionId: string) => {
		const section = sectionRefs.current[sectionId];
		if (section) {
			window.scrollTo({
				top: section.offsetTop - 80,
				behavior: 'smooth',
			});
			setActiveSection(sectionId);
		}
	};

	// Rendu des icônes en fonction du type
	const renderIcon = (iconType: string) => {
		switch (iconType) {
			case 'durability':
				return (
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
				);
			case 'performance':
				return (
					<svg
						className='h-6 w-6 text-indigo-600'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
						/>
					</svg>
				);
			case 'design':
				return (
					<svg
						className='h-6 w-6 text-indigo-600'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
						/>
					</svg>
				);
			case 'value':
				return (
					<svg
						className='h-6 w-6 text-indigo-600'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
						/>
					</svg>
				);
			case 'impact':
				return (
					<svg
						className='h-6 w-6 text-indigo-600'
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
			default:
				return (
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
				);
		}
	};

	return (
		<div
			className='bg-gray-50 min-h-screen font-sans quality-content'
			data-print-date={new Date().toLocaleDateString('fr-FR', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})}>
			{/* Hero section */}
			<div className='relative bg-gradient-to-r from-indigo-700 to-purple-700 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className='text-center max-w-3xl mx-auto'>
						<h1 className='text-3xl md:text-5xl font-bold mb-4'>
							{aboutQualityData.heroSection.title}
						</h1>
						<p className='text-xl text-indigo-100'>
							{aboutQualityData.heroSection.description}
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
							<nav className='space-y-1 quality-nav'>
								<button
									onClick={() =>
										scrollToSection('introduction')
									}
									className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors quality-nav-item ${
										activeSection === 'introduction'
											? 'bg-indigo-100 text-indigo-700 active'
											: 'text-gray-600 hover:bg-gray-100'
									}`}>
									Notre philosophie
								</button>
								<button
									onClick={() =>
										scrollToSection('selectionProcess')
									}
									className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors quality-nav-item ${
										activeSection === 'selectionProcess'
											? 'bg-indigo-100 text-indigo-700 active'
											: 'text-gray-600 hover:bg-gray-100'
									}`}>
									Processus de sélection
								</button>
								<button
									onClick={() =>
										scrollToSection('qualityCriteria')
									}
									className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors quality-nav-item ${
										activeSection === 'qualityCriteria'
											? 'bg-indigo-100 text-indigo-700 active'
											: 'text-gray-600 hover:bg-gray-100'
									}`}>
									Critères de qualité
								</button>
								<button
									onClick={() =>
										scrollToSection('laboratorySection')
									}
									className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors quality-nav-item ${
										activeSection === 'laboratorySection'
											? 'bg-indigo-100 text-indigo-700 active'
											: 'text-gray-600 hover:bg-gray-100'
									}`}>
									Notre laboratoire
								</button>
								<button
									onClick={() =>
										scrollToSection('userFeedback')
									}
									className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors quality-nav-item ${
										activeSection === 'userFeedback'
											? 'bg-indigo-100 text-indigo-700 active'
											: 'text-gray-600 hover:bg-gray-100'
									}`}>
									Retours clients
								</button>
								<button
									onClick={() =>
										scrollToSection('qualityTeam')
									}
									className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors quality-nav-item ${
										activeSection === 'qualityTeam'
											? 'bg-indigo-100 text-indigo-700 active'
											: 'text-gray-600 hover:bg-gray-100'
									}`}>
									Notre équipe
								</button>
								<button
									onClick={() =>
										scrollToSection('qualityGuarantee')
									}
									className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors quality-nav-item ${
										activeSection === 'qualityGuarantee'
											? 'bg-indigo-100 text-indigo-700 active'
											: 'text-gray-600 hover:bg-gray-100'
									}`}>
									Notre garantie
								</button>
								<button
									onClick={() =>
										scrollToSection('testimonials')
									}
									className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors quality-nav-item ${
										activeSection === 'testimonials'
											? 'bg-indigo-100 text-indigo-700 active'
											: 'text-gray-600 hover:bg-gray-100'
									}`}>
									Témoignages
								</button>
								<button
									onClick={() => scrollToSection('faqs')}
									className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors quality-nav-item ${
										activeSection === 'faqs'
											? 'bg-indigo-100 text-indigo-700 active'
											: 'text-gray-600 hover:bg-gray-100'
									}`}>
									FAQ
								</button>
								<button
									onClick={() =>
										scrollToSection('conclusion')
									}
									className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors quality-nav-item ${
										activeSection === 'conclusion'
											? 'bg-indigo-100 text-indigo-700 active'
											: 'text-gray-600 hover:bg-gray-100'
									}`}>
									Notre vision
								</button>

								<div className='pt-6 mt-6 border-t border-gray-200'>
									<Link
										href='/about'
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
												d='M11 17l-5-5m0 0l5-5m-5 5h12'
											/>
										</svg>
										À propos de nous
									</Link>

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
												d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
											/>
										</svg>
										Nous contacter
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
						<div className='flex-1 p-6 md:p-10'>
							<motion.div
								variants={containerVariants}
								initial='hidden'
								animate='visible'>
								{/* Introduction */}
								<section
									id='introduction'
									ref={assignRef('introduction')}
									className='mb-16 quality-section'>
									<motion.h2
										variants={itemVariants}
										className='text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200'>
										{aboutQualityData.introduction.title}
									</motion.h2>
									<motion.div
										variants={itemVariants}
										className='prose prose-indigo max-w-none'
										dangerouslySetInnerHTML={{
											__html: aboutQualityData
												.introduction.content,
										}}
									/>
								</section>

								{/* Processus de sélection */}
								<section
									id='selectionProcess'
									ref={assignRef('selectionProcess')}
									className='mb-16 quality-section'>
									<motion.h2
										variants={itemVariants}
										className='text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200'>
										{
											aboutQualityData.selectionProcess
												.title
										}
									</motion.h2>
									<motion.div
										variants={itemVariants}
										className='prose prose-indigo max-w-none mb-8'
										dangerouslySetInnerHTML={{
											__html: aboutQualityData
												.selectionProcess.content,
										}}
									/>

									{/* Étapes du processus */}
									<div className='relative'>
										<div className='absolute top-0 bottom-0 left-16 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 hidden md:block'></div>
										<div className='space-y-12'>
											{aboutQualityData.selectionProcess.steps.map(
												(step, index) => (
													<motion.div
														key={index}
														variants={itemVariants}
														className='md:flex items-start relative process-step'>
														<div className='flex-shrink-0 md:w-32 mb-4 md:mb-0 md:text-right md:pr-8'>
															<div className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold md:absolute md:left-12 md:transform md:-translate-x-1/2 z-10'>
																{step.number}
															</div>
														</div>
														<div className='md:ml-12'>
															<h3 className='text-lg font-bold text-gray-900 mb-2'>
																{step.title}
															</h3>
															<p className='text-gray-700 mb-2'>
																{
																	step.description
																}
															</p>
															<p className='text-gray-600 text-sm italic'>
																{step.detail}
															</p>
														</div>
													</motion.div>
												)
											)}
										</div>
									</div>
								</section>

								{/* Critères de qualité */}
								<section
									id='qualityCriteria'
									ref={assignRef('qualityCriteria')}
									className='mb-16 quality-section'>
									<motion.h2
										variants={itemVariants}
										className='text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200'>
										{aboutQualityData.qualityCriteria.title}
									</motion.h2>
									<motion.div
										variants={itemVariants}
										className='prose prose-indigo max-w-none mb-8'
										dangerouslySetInnerHTML={{
											__html: aboutQualityData
												.qualityCriteria.content,
										}}
									/>

									<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
										{aboutQualityData.qualityCriteria.criteria.map(
											(criterion, index) => (
												<motion.div
													key={index}
													variants={itemVariants}
													whileHover={{
														y: -5,
														boxShadow:
															'0 10px 25px -5px rgba(0, 0, 0, 0.1)',
													}}
													className='bg-white rounded-lg p-6 shadow-sm border border-gray-200 transition-all duration-300 criteria-card'>
													<div className='flex items-start'>
														<div className='flex-shrink-0 bg-indigo-100 rounded-full p-3 criteria-icon'>
															{renderIcon(
																criterion.icon
															)}
														</div>
														<div className='ml-4'>
															<h3 className='text-lg font-medium text-gray-900 mb-2'>
																{
																	criterion.title
																}
															</h3>
															<p className='text-gray-600 text-sm'>
																{
																	criterion.description
																}
															</p>
														</div>
													</div>
												</motion.div>
											)
										)}
									</div>
								</section>

								{/* Notre laboratoire */}
								<section
									id='laboratorySection'
									ref={assignRef('laboratorySection')}
									className='mb-16 quality-section'>
									<motion.h2
										variants={itemVariants}
										className='text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200'>
										{
											aboutQualityData.laboratorySection
												.title
										}
									</motion.h2>

									<div className='md:flex items-start gap-8'>
										<motion.div
											variants={itemVariants}
											className='md:w-1/2 mb-6 md:mb-0 lab-image-container'>
											<div className='relative h-80 rounded-lg overflow-hidden'>
												<Image
													src={
														aboutQualityData
															.laboratorySection
															.imageUrl
													}
													alt='Laboratoire de tests'
													fill
													className='object-cover'
												/>
											</div>
										</motion.div>
										<motion.div
											variants={itemVariants}
											className='md:w-1/2 prose prose-indigo max-w-none'
											dangerouslySetInnerHTML={{
												__html: aboutQualityData
													.laboratorySection.content,
											}}
										/>
									</div>
								</section>

								{/* Retours clients */}
								<section
									id='userFeedback'
									ref={assignRef('userFeedback')}
									className='mb-16 quality-section'>
									<motion.h2
										variants={itemVariants}
										className='text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200'>
										{aboutQualityData.userFeedback.title}
									</motion.h2>
									<motion.div
										variants={itemVariants}
										className='prose prose-indigo max-w-none'
										dangerouslySetInnerHTML={{
											__html: aboutQualityData
												.userFeedback.content,
										}}
									/>
								</section>

								{/* Notre équipe */}
								<section
									id='qualityTeam'
									ref={assignRef('qualityTeam')}
									className='mb-16 quality-section'>
									<motion.h2
										variants={itemVariants}
										className='text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200'>
										{aboutQualityData.qualityTeam.title}
									</motion.h2>
									<motion.div
										variants={itemVariants}
										className='prose prose-indigo max-w-none mb-8'
										dangerouslySetInnerHTML={{
											__html: aboutQualityData.qualityTeam
												.content,
										}}
									/>

									<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
										{aboutQualityData.qualityTeam.members.map(
											(member, index) => (
												<motion.div
													key={index}
													variants={itemVariants}
													whileHover={{
														y: -5,
														boxShadow:
															'0 10px 25px -5px rgba(0, 0, 0, 0.1)',
													}}
													className='bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-all duration-300 team-card'>
													<div className='relative h-64 team-card-image'>
														<Image
															src={
																member.imageUrl
															}
															alt={member.name}
															fill
															className='object-cover'
														/>
													</div>
													<div className='p-6 team-card-content'>
														<h3 className='team-card-name'>
															{member.name}
														</h3>
														<p className='team-card-role'>
															{member.role}
														</p>
														<p className='team-card-bio'>
															{member.bio}
														</p>
													</div>
												</motion.div>
											)
										)}
									</div>
								</section>

								{/* Notre garantie */}
								<section
									id='qualityGuarantee'
									ref={assignRef('qualityGuarantee')}
									className='mb-16 quality-section'>
									<motion.h2
										variants={itemVariants}
										className='text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200'>
										{
											aboutQualityData.qualityGuarantee
												.title
										}
									</motion.h2>
									<motion.div
										variants={itemVariants}
										className='guarantee-card'>
										<div
											className='prose prose-indigo max-w-none'
											dangerouslySetInnerHTML={{
												__html: aboutQualityData
													.qualityGuarantee.content,
											}}
										/>
									</motion.div>
								</section>

								{/* Témoignages */}
								<section
									id='testimonials'
									ref={assignRef('testimonials')}
									className='mb-16 quality-section'>
									<motion.h2
										variants={itemVariants}
										className='text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200'>
										{aboutQualityData.testimonials.title}
									</motion.h2>

									<div className='space-y-6'>
										{aboutQualityData.testimonials.quotes.map(
											(quote, index) => (
												<motion.div
													key={index}
													variants={itemVariants}
													className='testimonial-card'>
													<p className='testimonial-text'>
														&ldquo;{quote.text}
														&rdquo;
													</p>
													<p className='testimonial-author'>
														{quote.author}
													</p>
												</motion.div>
											)
										)}
									</div>
								</section>

								{/* FAQ */}
								<section
									id='faqs'
									ref={assignRef('faqs')}
									className='mb-16 quality-section'>
									<motion.h2
										variants={itemVariants}
										className='text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200'>
										{aboutQualityData.faqs.title}
									</motion.h2>

									<ImprovedFaqSection
										faqs={aboutQualityData.faqs.questions}
										showContact={false}
										bgColor='bg-transparent'
									/>
								</section>

								{/* Conclusion */}
								<section
									id='conclusion'
									ref={assignRef('conclusion')}
									className='mb-16 quality-section'>
									<motion.h2
										variants={itemVariants}
										className='text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200'>
										{aboutQualityData.conclusion.title}
									</motion.h2>
									<motion.div
										variants={itemVariants}
										className='prose prose-indigo max-w-none'
										dangerouslySetInnerHTML={{
											__html: aboutQualityData.conclusion
												.content,
										}}
									/>
								</section>
							</motion.div>
						</div>
					</div>
				</motion.div>
			</div>

			{/* CTA Section */}
			<div className='cta-section'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<h2 className='text-2xl font-bold text-white mb-4'>
						{aboutQualityData.cta.title}
					</h2>
					<p className='text-white opacity-90 mb-8 max-w-3xl mx-auto'>
						{aboutQualityData.cta.description}
					</p>
					<Link
						href={aboutQualityData.cta.buttonLink}
						className='cta-button'>
						{aboutQualityData.cta.buttonText}
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
			<div className='fixed bottom-8 right-8 z-30 back-to-top visible'>
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
