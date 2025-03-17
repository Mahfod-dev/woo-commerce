'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types pour les articles
interface BlogPost {
	id: number;
	title: string;
	excerpt: string;
	category: string;
	date: string;
	author: string;
	image: string;
	slug: string;
}

interface BlogContentProps {
	articles: BlogPost[];
}

export default function BlogContent({ articles }: BlogContentProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [filteredArticles, setFilteredArticles] =
		useState<BlogPost[]>(articles);
	const [featuredArticles, setFeaturedArticles] = useState<BlogPost[]>([]);

	// Extraction des catégories uniques
	const categories = [
		'all',
		...Array.from(new Set(articles.map((article) => article.category))),
	];

	// Formatage de la date relative (ex: "il y a 3 jours")
	const formatRelativeDate = (dateString: string) => {
		try {
			return formatDistanceToNow(parseISO(dateString), {
				addSuffix: true,
				locale: fr,
			});
		} catch (error) {
			return dateString;
		}
	};

	// Filtrer les articles en fonction de la recherche et de la catégorie
	useEffect(() => {
		// Définir les articles en vedette (3 premiers)
		setFeaturedArticles(articles.slice(0, 3));

		// Filtrer par terme de recherche et catégorie
		const filtered = articles.filter((article) => {
			const matchesSearch =
				article.title
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				article.excerpt
					.toLowerCase()
					.includes(searchTerm.toLowerCase());

			const matchesCategory =
				selectedCategory === 'all' ||
				article.category === selectedCategory;

			return matchesSearch && matchesCategory;
		});

		setFilteredArticles(filtered);
	}, [articles, searchTerm, selectedCategory]);

	// Variants d'animation pour Framer Motion
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

	return (
		<div className='bg-gray-50 min-h-screen'>
			{/* En-tête du blog */}
			<div className='relative bg-gradient-to-r from-indigo-700 to-purple-700 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}>
						<h1 className='text-3xl md:text-5xl font-bold mb-4'>
							Notre Blog
						</h1>
						<p className='text-indigo-100 max-w-2xl text-lg'>
							Découvrez nos derniers articles, guides et conseils
							pour rester informé des tendances et innovations
							dans notre domaine.
						</p>
					</motion.div>

					{/* Barre de recherche */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className='mt-8 max-w-lg'>
						<div className='relative'>
							<input
								type='text'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder='Rechercher un article...'
								className='w-full pl-12 pr-4 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50'
							/>
							<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
								<svg
									className='h-5 w-5 text-white/70'
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
					</motion.div>
				</div>

				{/* Éléments décoratifs */}
				<div className='absolute inset-0 overflow-hidden opacity-20'>
					<div className='absolute -top-20 -left-20 w-64 h-64 rounded-full bg-indigo-500' />
					<div className='absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-500' />
				</div>
			</div>

			{/* Contenu principal */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				{/* Articles mis en avant (si pas de recherche) */}
				{searchTerm === '' && selectedCategory === 'all' && (
					<div className='mb-16'>
						<h2 className='text-2xl font-bold text-gray-900 mb-8'>
							Articles à la une
						</h2>
						<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
							{featuredArticles.map((article, index) => (
								<motion.div
									key={article.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										duration: 0.5,
										delay: index * 0.1,
									}}
									className={`relative overflow-hidden rounded-xl shadow-lg ${
										index === 0
											? 'lg:col-span-2 lg:row-span-2'
											: ''
									}`}>
									<Link
										href={`/blog/${article.slug}`}
										className='block group'>
										<div className='relative aspect-video lg:aspect-auto lg:h-full'>
											<Image
												src={article.image}
												alt={article.title}
												fill
												className='object-cover transition-transform duration-500 group-hover:scale-105'
												sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
											/>
											<div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent'></div>

											<div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
												<span className='inline-block px-3 py-1 text-xs font-medium bg-indigo-600 rounded-full mb-3'>
													{article.category}
												</span>
												<h3 className='text-xl md:text-2xl font-bold mb-2 group-hover:text-indigo-300 transition-colors'>
													{article.title}
												</h3>
												<p className='text-sm md:text-base text-gray-200 line-clamp-2'>
													{article.excerpt}
												</p>
												<div className='mt-4 flex items-center text-sm text-gray-300'>
													<span className='mr-4'>
														{formatRelativeDate(
															article.date
														)}
													</span>
													<span>
														Par {article.author}
													</span>
												</div>
											</div>
										</div>
									</Link>
								</motion.div>
							))}
						</div>
					</div>
				)}

				{/* Filtres par catégorie */}
				<div className='mb-8'>
					<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
						<h2 className='text-2xl font-bold text-gray-900 mb-4 sm:mb-0'>
							{searchTerm
								? `Résultats pour "${searchTerm}"`
								: 'Tous nos articles'}
						</h2>

						<div className='flex flex-wrap gap-2'>
							{categories.map((category) => (
								<button
									key={category}
									onClick={() =>
										setSelectedCategory(category)
									}
									className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
										selectedCategory === category
											? 'bg-indigo-600 text-white'
											: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
									}`}>
									{category === 'all' ? 'Tous' : category}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Liste d'articles */}
				{filteredArticles.length === 0 ? (
					<div className='bg-white rounded-lg shadow-sm p-8 text-center'>
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
						<h3 className='mt-4 text-lg font-medium text-gray-900'>
							Aucun article trouvé
						</h3>
						<p className='mt-2 text-gray-500'>
							Essayez d'autres termes de recherche ou catégories.
						</p>
						<button
							onClick={() => {
								setSearchTerm('');
								setSelectedCategory('all');
							}}
							className='mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700'>
							Réinitialiser la recherche
						</button>
					</div>
				) : (
					<motion.div
						variants={containerVariants}
						initial='hidden'
						animate='visible'
						className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{filteredArticles.map((article) => (
							<motion.div
								key={article.id}
								variants={itemVariants}
								className='bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group'>
								<Link
									href={`/blog/${article.slug}`}
									className='block'>
									<div className='relative aspect-video'>
										<Image
											src={article.image}
											alt={article.title}
											fill
											className='object-cover transition-transform duration-500 group-hover:scale-105'
											sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
										/>
									</div>
									<div className='p-6'>
										<div className='flex items-center mb-3'>
											<span className='inline-block px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full'>
												{article.category}
											</span>
											<span className='ml-3 text-xs text-gray-500'>
												{formatRelativeDate(
													article.date
												)}
											</span>
										</div>
										<h3 className='text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2'>
											{article.title}
										</h3>
										<p className='text-gray-600 line-clamp-3 mb-4'>
											{article.excerpt}
										</p>
										<div className='flex items-center text-sm text-gray-500'>
											<span>Par {article.author}</span>
										</div>
									</div>
								</Link>
							</motion.div>
						))}
					</motion.div>
				)}

				{/* Pagination (si beaucoup d'articles) */}
				{filteredArticles.length > 12 && (
					<div className='mt-12 flex justify-center'>
						<nav className='inline-flex rounded-md shadow'>
							<a
								href='#'
								className='py-2 px-4 text-sm font-medium text-indigo-600 bg-white rounded-l-md border border-gray-200 hover:bg-gray-50'>
								Précédent
							</a>
							<a
								href='#'
								className='py-2 px-4 text-sm font-medium text-gray-700 bg-indigo-50 border-t border-b border-gray-200'>
								1
							</a>
							<a
								href='#'
								className='py-2 px-4 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-200 hover:bg-gray-50'>
								2
							</a>
							<a
								href='#'
								className='py-2 px-4 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-200 hover:bg-gray-50'>
								3
							</a>
							<a
								href='#'
								className='py-2 px-4 text-sm font-medium text-indigo-600 bg-white rounded-r-md border border-gray-200 hover:bg-gray-50'>
								Suivant
							</a>
						</nav>
					</div>
				)}

				{/* Section newsletter */}
				<div className='mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white shadow-xl'>
					<div className='md:flex md:items-center md:justify-between'>
						<div className='md:w-2/3 mb-6 md:mb-0 md:pr-8'>
							<h3 className='text-2xl font-bold mb-2'>
								Restez informé
							</h3>
							<p className='text-indigo-100'>
								Inscrivez-vous à notre newsletter pour recevoir
								nos derniers articles et conseils directement
								dans votre boîte mail.
							</p>
						</div>
						<div className='md:w-1/3'>
							<form className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2'>
								<input
									type='email'
									placeholder='Votre email'
									className='px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 flex-grow'
								/>
								<button
									type='submit'
									className='px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors'>
									S'inscrire
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
