'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import FaqSchema from './FaqSchema';

// Types pour les données FAQ
interface FaqQuestion {
	id: string;
	question: string;
	answer: string;
}

interface FaqCategory {
	id: string;
	name: string;
	questions: FaqQuestion[];
}

interface ContactOption {
	icon: string;
	title: string;
	description: string;
	action: string;
}

interface FaqData {
	categories: FaqCategory[];
	support: {
		title: string;
		description: string;
		contactOptions: ContactOption[];
	};
}

interface FaqContentProps {
	faqData: FaqData;
}

export default function FaqContent({ faqData }: FaqContentProps) {
	// État pour la catégorie active et les questions ouvertes
	const [activeCategory, setActiveCategory] = useState<string>(
		faqData.categories[0]?.id || ''
	);
	const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>(
		{}
	);
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState<FaqQuestion[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	// Récupérer les paramètres d'URL pour préouvrir une question ou catégorie
	const searchParams = useSearchParams();
	const categoryRef = useRef<HTMLDivElement>(null);

	// Effet pour gérer les paramètres d'URL
	useEffect(() => {
		const category = searchParams.get('category');
		const question = searchParams.get('question');

		if (category && faqData.categories.some((cat) => cat.id === category)) {
			setActiveCategory(category);

			// Scroll vers la catégorie si nécessaire
			setTimeout(() => {
				if (categoryRef.current) {
					categoryRef.current.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
					});
				}
			}, 100);
		}

		if (question) {
			// Ouvrir la question spécifiée
			setOpenQuestions((prev) => ({ ...prev, [question]: true }));
		}
	}, [searchParams, faqData]);

	// Fonction pour basculer l'état d'une question
	const toggleQuestion = (questionId: string) => {
		setOpenQuestions((prev) => ({
			...prev,
			[questionId]: !prev[questionId],
		}));
	};

	// Fonction pour rechercher des questions
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const term = e.target.value;
		setSearchTerm(term);

		if (term.trim() === '') {
			setIsSearching(false);
			setSearchResults([]);
			return;
		}

		setIsSearching(true);

		// Rechercher dans toutes les questions de toutes les catégories
		const results = faqData.categories.flatMap((category) =>
			category.questions.filter(
				(q) =>
					q.question.toLowerCase().includes(term.toLowerCase()) ||
					q.answer.toLowerCase().includes(term.toLowerCase())
			)
		);

		setSearchResults(results);
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

	const contentVariants = {
		hidden: { height: 0, opacity: 0 },
		visible: {
			height: 'auto',
			opacity: 1,
			transition: {
				height: {
					type: 'spring',
					stiffness: 100,
					damping: 20,
				},
				opacity: { duration: 0.2 },
			},
		},
	};

	return (
		<div className='bg-gray-50 min-h-screen py-16 faq-content'>
			{/* Ajout du schéma JSON-LD pour le SEO */}
			<FaqSchema
				categories={faqData.categories}
				organizationName='Votre Boutique'
				url='https://votreboutique.com/faq'
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
							Questions fréquentes
						</h1>
						<p className='text-xl text-indigo-100'>
							Trouvez des réponses à vos questions concernant nos
							produits, commandes et services.
						</p>

						{/* Barre de recherche */}
						<div className='mt-10 max-w-xl mx-auto'>
							<div className='relative'>
								<input
									type='text'
									value={searchTerm}
									onChange={handleSearch}
									placeholder='Rechercher une question...'
									className='w-full px-5 py-3 text-gray-900 bg-white rounded-full border-none focus:outline-none focus:ring-2 focus:ring-indigo-300 search-input'
								/>
								<div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
									<svg
										className='h-5 w-5 text-gray-500'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
										/>
									</svg>
								</div>
							</div>
						</div>
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
					{/* Navigation des catégories pour mobile */}
					<div className='sm:hidden p-4 bg-gray-50'>
						<select
							value={activeCategory}
							onChange={(e) => setActiveCategory(e.target.value)}
							className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md faq-mobile-select'>
							{faqData.categories.map((category) => (
								<option
									key={category.id}
									value={category.id}>
									{category.name}
								</option>
							))}
						</select>
					</div>

					<div className='flex flex-col sm:flex-row'>
						{/* Navigation des catégories pour desktop */}
						<div className='hidden sm:block sm:w-64 bg-gray-50 p-6'>
							<h3 className='text-lg font-medium text-gray-900 mb-3'>
								Catégories
							</h3>
							<nav className='space-y-1'>
								{faqData.categories.map((category) => (
									<button
										key={category.id}
										onClick={() =>
											setActiveCategory(category.id)
										}
										className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md faq-category-button ${
											activeCategory === category.id
												? 'bg-indigo-100 text-indigo-700 active'
												: 'text-gray-600 hover:bg-gray-100'
										} transition-colors`}>
										{category.name}
									</button>
								))}
							</nav>
						</div>

						{/* Contenu principal */}
						<div
							className='flex-1 p-6 md:p-8'
							ref={categoryRef}>
							{isSearching ? (
								// Afficher les résultats de recherche
								<div>
									<h2 className='text-2xl font-bold text-gray-900 mb-6'>
										Résultats de recherche pour &quot;
										{searchTerm}&quot;
									</h2>

									{searchResults.length === 0 ? (
										<div className='text-center py-12'>
											<svg
												className='mx-auto h-12 w-12 text-gray-400'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
												/>
											</svg>
											<h3 className='mt-2 text-sm font-medium text-gray-900'>
												Aucun résultat trouvé
											</h3>
											<p className='mt-1 text-sm text-gray-500'>
												Essayez avec d&apos;autres
												termes ou consultez nos
												catégories de questions.
											</p>
											<div className='mt-6'>
												<button
													onClick={() => {
														setSearchTerm('');
														setIsSearching(false);
													}}
													className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
													Voir toutes les questions
												</button>
											</div>
										</div>
									) : (
										<motion.div
											variants={containerVariants}
											initial='hidden'
											animate='visible'
											className='space-y-4'>
											{searchResults.map((question) => (
												<motion.div
													key={question.id}
													variants={itemVariants}
													className='bg-white rounded-lg border border-gray-200 overflow-hidden faq-question-container'>
													<button
														onClick={() =>
															toggleQuestion(
																question.id
															)
														}
														className='w-full flex justify-between items-center p-6 text-left'>
														<h3 className='text-lg font-medium text-gray-900'>
															{question.question}
														</h3>
														<span>
															<svg
																className={`h-6 w-6 text-indigo-500 transform transition-transform expansion-icon ${
																	openQuestions[
																		question
																			.id
																	]
																		? 'rotate-180 expanded'
																		: ''
																}`}
																fill='none'
																viewBox='0 0 24 24'
																stroke='currentColor'>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	strokeWidth={
																		2
																	}
																	d='M19 9l-7 7-7-7'
																/>
															</svg>
														</span>
													</button>

													<AnimatePresence>
														{openQuestions[
															question.id
														] && (
															<motion.div
																variants={
																	contentVariants
																}
																initial='hidden'
																animate='visible'
																exit='hidden'
																className='px-6 pb-6 faq-answer'>
																<div className='prose prose-indigo max-w-none'>
																	<p>
																		{
																			question.answer
																		}
																	</p>
																</div>
															</motion.div>
														)}
													</AnimatePresence>
												</motion.div>
											))}
										</motion.div>
									)}
								</div>
							) : (
								// Afficher la catégorie active
								<div>
									{faqData.categories
										.filter(
											(category) =>
												category.id === activeCategory
										)
										.map((category) => (
											<div key={category.id}>
												<h2 className='text-2xl font-bold text-gray-900 mb-6'>
													{category.name}
												</h2>

												<motion.div
													variants={containerVariants}
													initial='hidden'
													animate='visible'
													className='space-y-4'>
													{category.questions.map(
														(question) => (
															<motion.div
																key={
																	question.id
																}
																variants={
																	itemVariants
																}
																className='bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
																<button
																	onClick={() =>
																		toggleQuestion(
																			question.id
																		)
																	}
																	className='w-full flex justify-between items-center p-6 text-left'>
																	<h3 className='text-lg font-medium text-gray-900'>
																		{
																			question.question
																		}
																	</h3>
																	<span>
																		<svg
																			className={`h-6 w-6 text-indigo-500 transform transition-transform ${
																				openQuestions[
																					question
																						.id
																				]
																					? 'rotate-180'
																					: ''
																			}`}
																			fill='none'
																			viewBox='0 0 24 24'
																			stroke='currentColor'>
																			<path
																				strokeLinecap='round'
																				strokeLinejoin='round'
																				strokeWidth={
																					2
																				}
																				d='M19 9l-7 7-7-7'
																			/>
																		</svg>
																	</span>
																</button>

																<AnimatePresence>
																	{openQuestions[
																		question
																			.id
																	] && (
																		<motion.div
																			variants={
																				contentVariants
																			}
																			initial='hidden'
																			animate='visible'
																			exit='hidden'
																			className='px-6 pb-6'>
																			<div className='prose prose-indigo max-w-none'>
																				<p>
																					{
																						question.answer
																					}
																				</p>
																			</div>
																		</motion.div>
																	)}
																</AnimatePresence>
															</motion.div>
														)
													)}
												</motion.div>
											</div>
										))}
								</div>
							)}
						</div>
					</div>
				</motion.div>
			</div>

			{/* Section Contact Support */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-8'>
				<div className='text-center mb-12'>
					<h2 className='text-3xl font-bold text-gray-900 mb-4'>
						{faqData.support.title}
					</h2>
					<p className='text-xl text-gray-600 max-w-3xl mx-auto'>
						{faqData.support.description}
					</p>
				</div>

				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, margin: '-100px' }}
					className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					{faqData.support.contactOptions.map((option) => (
						<motion.div
							key={option.title}
							variants={itemVariants}
							className='bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow text-center contact-icon-container'>
							<div className='rounded-full bg-indigo-100 w-16 h-16 flex items-center justify-center mx-auto mb-6'>
								{option.icon === 'email' && (
									<svg
										className='h-8 w-8 text-indigo-600'
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
								)}
								{option.icon === 'phone' && (
									<svg
										className='h-8 w-8 text-indigo-600'
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
								)}
								{option.icon === 'chat' && (
									<svg
										className='h-8 w-8 text-indigo-600'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
										/>
									</svg>
								)}
							</div>
							<h3 className='text-xl font-bold text-gray-900 mb-2'>
								{option.title}
							</h3>
							<p className='text-gray-600 mb-4'>
								{option.description}
							</p>

							{option.icon === 'email' && (
								<a
									href={`mailto:${option.action}`}
									className='text-indigo-600 font-medium hover:text-indigo-800'>
									{option.action}
								</a>
							)}

							{option.icon === 'phone' && (
								<a
									href={`tel:${option.action.replace(
										/\s/g,
										''
									)}`}
									className='text-indigo-600 font-medium hover:text-indigo-800'>
									{option.action}
								</a>
							)}

							{option.icon === 'chat' && (
								<button className='inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors'>
									{option.action}
								</button>
							)}
						</motion.div>
					))}
				</motion.div>
			</div>

			{/* Questions populaires */}
			<div className='bg-gray-50 py-16'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-12'>
						<h2 className='text-3xl font-bold text-gray-900 mb-4'>
							Questions les plus posées
						</h2>
						<p className='text-xl text-gray-600 max-w-3xl mx-auto'>
							Parcourez les questions les plus fréquemment posées
							par nos clients
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{/* Liste de tags questions populaires */}
						{faqData.categories.flatMap((category) =>
							category.questions.slice(0, 2).map((question) => (
								<button
									key={question.id}
									onClick={() => {
										setActiveCategory(
											faqData.categories.find((cat) =>
												cat.questions.some(
													(q) => q.id === question.id
												)
											)?.id || ''
										);
										setOpenQuestions((prev) => ({
											...prev,
											[question.id]: true,
										}));
										setIsSearching(false);
										setSearchTerm('');

										// Scroll vers la question
										setTimeout(() => {
											if (categoryRef.current) {
												categoryRef.current.scrollIntoView(
													{
														behavior: 'smooth',
														block: 'start',
													}
												);
											}
										}, 100);
									}}
									className='bg-white text-left p-6 rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300 popular-question-tag'>
									<h3 className='text-lg font-medium text-gray-900 mb-2 line-clamp-2'>
										{question.question}
									</h3>
									<p className='text-gray-600 line-clamp-3'>
										{question.answer}
									</p>
									<p className='text-indigo-600 font-medium mt-4 flex items-center'>
										Lire la réponse
										<svg
											className='ml-2 h-4 w-4'
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
									</p>
								</button>
							))
						)}
					</div>
				</div>
			</div>

			{/* CTA - Contactez-nous */}
			<div className='bg-gradient-to-r from-indigo-700 to-purple-700 py-12'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<h2 className='text-2xl font-bold text-white mb-4'>
						Vous avez d&apos;autres questions ?
					</h2>
					<p className='text-indigo-100 max-w-3xl mx-auto mb-8'>
						Notre équipe d&apos;experts est prête à vous aider pour
						toute question supplémentaire.
					</p>
					<Link
						href='/contact'
						className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 transition-colors shadow-md'>
						Contactez-nous
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
		</div>
	);
}
