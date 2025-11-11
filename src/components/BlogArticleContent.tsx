'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// Type pour l'auteur
interface Author {
	name: string;
	avatar: string;
	bio: string;
}

// Type pour l'article
interface Article {
	id: number;
	title: string;
	excerpt: string;
	category: string;
	date: string;
	author: Author;
	image: string;
	slug: string;
	content: string;
}

interface BlogArticleContentProps {
	article: Article;
}

export default function BlogArticleContent({
	article,
}: BlogArticleContentProps) {
	const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
	const [readingProgress, setReadingProgress] = useState(0);
	const { scrollYProgress } = useScroll();

	// Gestion de la barre de progression de lecture
	useEffect(() => {
		const updateReadingProgress = () => {
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight - windowHeight;
			const scrolled = window.scrollY;
			const progress = (scrolled / documentHeight) * 100;
			setReadingProgress(progress);
		};

		window.addEventListener('scroll', updateReadingProgress);
		return () => window.removeEventListener('scroll', updateReadingProgress);
	}, []);

	// Formatage de la date (ex: "15 septembre 2023")
	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString('fr-FR', {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			});
		} catch (error) {
			console.error('Erreur de formatage de la date:', error);
			return dateString;
		}
	};

	// Calculer le temps de lecture estimé
	const calculateReadingTime = (content: string) => {
		const wordsPerMinute = 200;
		const wordCount = content.split(/\s+/).length;
		const readingTime = Math.ceil(wordCount / wordsPerMinute);
		return readingTime;
	};

	// Partager sur les réseaux sociaux
	const shareOnTwitter = () => {
		window.open(
			`https://twitter.com/intent/tweet?text=${encodeURIComponent(
				article.title
			)}&url=${encodeURIComponent(window.location.href)}`,
			'_blank'
		);
	};

	const shareOnFacebook = () => {
		window.open(
			`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
				window.location.href
			)}`,
			'_blank'
		);
	};

	const shareOnLinkedIn = () => {
		window.open(
			`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
				window.location.href
			)}`,
			'_blank'
		);
	};

	const readingTime = calculateReadingTime(article.content);

	return (
		<div className='bg-white min-h-screen font-sans'>
			{/* Barre de progression de lecture */}
			<div className='fixed top-0 left-0 right-0 h-1 bg-gray-100 z-50'>
				<motion.div
					className='h-full bg-gradient-to-r from-indigo-600 to-purple-600'
					style={{ width: `${readingProgress}%` }}
				/>
			</div>

			{/* Header navigation */}
			<header className='fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-40 mt-1'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-between h-16'>
						<Link
							href='/blog'
							className='inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors'>
							<svg
								className='w-5 h-5 mr-2'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M10 19l-7-7m0 0l7-7m-7 7h18'
								/>
							</svg>
							Retour au blog
						</Link>

						{/* Boutons de partage desktop */}
						<div className='hidden md:flex items-center space-x-2'>
							<span className='text-sm text-gray-500 mr-2'>Partager:</span>
							<button
								onClick={shareOnTwitter}
								className='p-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors'
								aria-label='Partager sur Twitter'>
								<svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
									<path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
								</svg>
							</button>
							<button
								onClick={shareOnFacebook}
								className='p-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors'
								aria-label='Partager sur Facebook'>
								<svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
									<path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
								</svg>
							</button>
							<button
								onClick={shareOnLinkedIn}
								className='p-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors'
								aria-label='Partager sur LinkedIn'>
								<svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
									<path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
								</svg>
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Hero section épuré */}
			<div className='pt-24 pb-12 px-4 sm:px-6 lg:px-8'>
				<div className='max-w-6xl mx-auto'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}>
						{/* Catégorie et temps de lecture */}
						<div className='flex items-center space-x-4 mb-6'>
							<span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800'>
								{article.category}
							</span>
							<span className='text-sm text-gray-500 flex items-center'>
								<svg className='w-4 h-4 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
								</svg>
								{readingTime} min de lecture
							</span>
						</div>

						{/* Titre */}
						<h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
							{article.title}
						</h1>

						{/* Excerpt */}
						<p className='text-xl text-gray-600 leading-relaxed mb-8'>
							{article.excerpt}
						</p>

						{/* Métadonnées et auteur */}
						<div className='flex items-center justify-between pb-8 border-b border-gray-200'>
							<div className='flex items-center space-x-4'>
								<div className='relative w-12 h-12 rounded-full overflow-hidden'>
									<Image
										src={article.author.avatar}
										alt={article.author.name}
										fill
										className='object-cover'
										sizes='48px'
									/>
								</div>
								<div>
									<div className='text-sm font-medium text-gray-900'>
										{article.author.name}
									</div>
									<div className='text-sm text-gray-500'>
										{formatDate(article.date)}
									</div>
								</div>
							</div>

							{/* Boutons de partage mobile */}
							<div className='md:hidden flex items-center space-x-2'>
								<button
									onClick={shareOnTwitter}
									className='p-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors'
									aria-label='Partager sur Twitter'>
									<svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
										<path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
									</svg>
								</button>
								<button
									onClick={shareOnFacebook}
									className='p-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors'
									aria-label='Partager sur Facebook'>
									<svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
										<path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
									</svg>
								</button>
							</div>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Image de couverture */}
			<div className='px-4 sm:px-6 lg:px-8 mb-12'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className='max-w-6xl mx-auto'>
					<div className='relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl'>
						<Image
							src={article.image}
							alt={article.title}
							fill
							className='object-cover'
							sizes='(max-width: 1280px) 100vw, 1280px'
							priority
						/>
					</div>
				</motion.div>
			</div>

			{/* Contenu principal */}
			<div className='px-4 sm:px-6 lg:px-8 pb-16'>
				<div className='max-w-3xl mx-auto'>
					<motion.article
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						style={{ fontSize: '21px', lineHeight: '1.75' }}
						className='prose max-w-none
							prose-headings:font-serif
							prose-h1:hidden
							prose-h2:text-[32px] prose-h2:font-bold prose-h2:tracking-tight prose-h2:mt-12 prose-h2:mb-4 prose-h2:leading-tight
							prose-h3:text-[24px] prose-h3:font-semibold prose-h3:mt-10 prose-h3:mb-3
							prose-h4:text-[20px] prose-h4:font-semibold prose-h4:mt-8 prose-h4:mb-2
							prose-p:text-[21px] prose-p:leading-[1.75] prose-p:text-gray-800 prose-p:mb-7
							prose-a:text-inherit prose-a:underline prose-a:decoration-2 prose-a:underline-offset-2 hover:prose-a:text-gray-600
							prose-strong:font-semibold prose-strong:text-gray-900
							prose-em:italic
							prose-ul:my-6 prose-ul:list-disc prose-ul:pl-8
							prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-8
							prose-li:text-[21px] prose-li:leading-[1.75] prose-li:text-gray-800 prose-li:my-2
							prose-blockquote:border-l-[3px] prose-blockquote:border-gray-900 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:my-8 prose-blockquote:font-serif
							prose-code:text-[18px] prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-gray-800
							prose-code:before:content-[""] prose-code:after:content-[""]
							prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:my-8 prose-pre:p-5 prose-pre:overflow-x-auto
							prose-img:rounded-lg prose-img:my-10
							prose-hr:border-gray-300 prose-hr:my-12'>
						<ReactMarkdown>
							{article.content}
						</ReactMarkdown>
					</motion.article>

					{/* Section auteur enrichie */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.6 }}
						className='mt-16 pt-12 border-t border-gray-200'>
						<div className='bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8'>
							<div className='flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-6'>
								<div className='relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-xl flex-shrink-0'>
									<Image
										src={article.author.avatar}
										alt={article.author.name}
										fill
										className='object-cover'
										sizes='96px'
									/>
								</div>
								<div className='text-center sm:text-left flex-1'>
									<div className='text-sm font-medium text-indigo-600 mb-1'>
										À propos de l'auteur
									</div>
									<h3 className='text-2xl font-bold text-gray-900 mb-2'>
										{article.author.name}
									</h3>
									<p className='text-gray-600 leading-relaxed mb-4'>
										{article.author.bio}
									</p>
									<div className='flex justify-center sm:justify-start space-x-3'>
										<a
											href='#'
											className='p-2 rounded-lg bg-white text-gray-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm'
											target='_blank'
											rel='noopener noreferrer'>
											<svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
												<path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
											</svg>
										</a>
										<a
											href='#'
											className='p-2 rounded-lg bg-white text-gray-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm'
											target='_blank'
											rel='noopener noreferrer'>
											<svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
												<path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
											</svg>
										</a>
									</div>
								</div>
							</div>
						</div>
					</motion.div>

					{/* CTA Newsletter moderne */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.8 }}
						className='mt-12'>
						<div className='relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 shadow-2xl'>
							<div className='absolute inset-0 bg-grid-white/10'></div>
							<div className='relative z-10 text-center'>
								<div className='inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6'>
									<svg className='w-8 h-8 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
									</svg>
								</div>
								<h3 className='text-2xl md:text-3xl font-bold text-white mb-4'>
									Vous avez aimé cet article ?
								</h3>
								<p className='text-lg text-white/90 mb-8 max-w-2xl mx-auto'>
									Rejoignez notre communauté et recevez nos meilleurs articles, analyses et offres exclusives directement dans votre boîte mail.
								</p>
								<button
									onClick={() => setIsSubscribeModalOpen(true)}
									className='inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-xl'>
									S&apos;inscrire gratuitement
									<svg className='w-5 h-5 ml-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
									</svg>
								</button>
								<div className='mt-4 text-sm text-white/70'>
									✓ Articles exclusifs · ✓ Conseils d'experts · ✓ Sans spam
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Modal d'inscription à la newsletter */}
			{isSubscribeModalOpen && (
				<div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						className='bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl'>
						<div className='flex justify-between items-start mb-6'>
							<div>
								<h3 className='text-2xl font-bold text-gray-900 mb-2'>
									Restez informé
								</h3>
								<p className='text-gray-600'>
									Rejoignez notre communauté de lecteurs
								</p>
							</div>
							<button
								onClick={() => setIsSubscribeModalOpen(false)}
								className='text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors'>
								<svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
								</svg>
							</button>
						</div>

						<form className='space-y-5'>
							<div>
								<label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-2'>
									Prénom
								</label>
								<input
									type='text'
									id='name'
									placeholder='Jean'
									className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all'
									required
								/>
							</div>

							<div>
								<label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
									Email
								</label>
								<input
									type='email'
									id='email'
									placeholder='jean@exemple.com'
									className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all'
									required
								/>
							</div>

							<div className='flex items-start'>
								<input
									id='privacy'
									type='checkbox'
									className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1'
									required
								/>
								<label htmlFor='privacy' className='ml-3 block text-sm text-gray-600'>
									J&apos;accepte de recevoir la newsletter et j&apos;ai lu la{' '}
									<a href='/privacy-policy' className='text-indigo-600 hover:text-indigo-500 font-medium'>
										politique de confidentialité
									</a>
								</label>
							</div>

							<button
								type='submit'
								className='w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg'>
								S'inscrire maintenant
							</button>
						</form>

						<div className='mt-6 pt-6 border-t border-gray-200'>
							<div className='flex items-center justify-center space-x-6 text-sm text-gray-500'>
								<div className='flex items-center'>
									<svg className='w-5 h-5 text-green-500 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
									</svg>
									Sans spam
								</div>
								<div className='flex items-center'>
									<svg className='w-5 h-5 text-green-500 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
									</svg>
									Gratuit
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</div>
	);
}
