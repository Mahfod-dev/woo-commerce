'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
			return dateString;
		}
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

	return (
		<div className='bg-gray-50 min-h-screen pb-16'>
			{/* Hero section avec image de couverture */}
			<div className='relative h-96 md:h-[500px] bg-gray-900'>
				<Image
					src={article.image}
					alt={article.title}
					fill
					className='object-cover opacity-70'
					sizes='100vw'
					priority
				/>
				<div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent'></div>

				<div className='absolute bottom-0 left-0 right-0'>
					<div className='max-w-4xl mx-auto px-4 sm:px-6 py-12'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}>
							<div className='mb-4'>
								<Link
									href='/blog'
									className='inline-flex items-center text-sm text-indigo-300 hover:text-indigo-100 transition-colors'>
									<svg
										className='w-4 h-4 mr-2'
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
							</div>

							<span className='inline-block px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded-full mb-4'>
								{article.category}
							</span>
							<h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4'>
								{article.title}
							</h1>
							<div className='flex items-center text-gray-300 text-sm'>
								<span>{formatDate(article.date)}</span>
								<span className='mx-2'>•</span>
								<span>Par {article.author.name}</span>
							</div>
						</motion.div>
					</div>
				</div>
			</div>

			{/* Contenu principal de l'article */}
			<div className='max-w-4xl mx-auto px-4 sm:px-6 -mt-6 relative z-10'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className='bg-white rounded-xl shadow-lg p-6 md:p-10'>
					{/* Options de partage sur desktop (côté) */}
					<div className='hidden md:block fixed left-[calc(50%-650px)] top-1/3 space-y-4'>
						<button
							onClick={shareOnTwitter}
							className='w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white transition-colors'
							aria-label='Partager sur Twitter'>
							<svg
								className='w-5 h-5'
								fill='currentColor'
								viewBox='0 0 24 24'>
								<path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
							</svg>
						</button>
						<button
							onClick={shareOnFacebook}
							className='w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition-colors'
							aria-label='Partager sur Facebook'>
							<svg
								className='w-5 h-5'
								fill='currentColor'
								viewBox='0 0 24 24'>
								<path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
							</svg>
						</button>
						<button
							onClick={shareOnLinkedIn}
							className='w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-blue-700 hover:text-white transition-colors'
							aria-label='Partager sur LinkedIn'>
							<svg
								className='w-5 h-5'
								fill='currentColor'
								viewBox='0 0 24 24'>
								<path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
							</svg>
						</button>
					</div>

					{/* Contenu markdown de l'article */}
					<div className='prose prose-lg max-w-none prose-indigo'>
						<ReactMarkdown>{article.content}</ReactMarkdown>
					</div>

					{/* Options de partage sur mobile (bas) */}
					<div className='md:hidden mt-10 border-t pt-6 flex justify-center space-x-4'>
						<h4 className='text-sm font-medium text-gray-500 flex items-center mr-2'>
							Partager:
						</h4>
						<button
							onClick={shareOnTwitter}
							className='w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white transition-colors'
							aria-label='Partager sur Twitter'>
							<svg
								className='w-5 h-5'
								fill='currentColor'
								viewBox='0 0 24 24'>
								<path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
							</svg>
						</button>
						<button
							onClick={shareOnFacebook}
							className='w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition-colors'
							aria-label='Partager sur Facebook'>
							<svg
								className='w-5 h-5'
								fill='currentColor'
								viewBox='0 0 24 24'>
								<path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
							</svg>
						</button>
						<button
							onClick={shareOnLinkedIn}
							className='w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-blue-700 hover:text-white transition-colors'
							aria-label='Partager sur LinkedIn'>
							<svg
								className='w-5 h-5'
								fill='currentColor'
								viewBox='0 0 24 24'>
								<path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
							</svg>
						</button>
					</div>

					{/* Informations sur l'auteur */}
					<div className='mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6'>
						<div className='relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden'>
							<Image
								src={article.author.avatar}
								alt={article.author.name}
								fill
								className='object-cover'
								sizes='(max-width: 640px) 80px, 96px'
							/>
						</div>
						<div className='text-center sm:text-left'>
							<h3 className='text-lg font-bold text-gray-900'>
								{article.author.name}
							</h3>
							<p className='text-gray-600 text-sm'>
								{article.author.bio}
							</p>
							<div className='mt-2 flex justify-center sm:justify-start space-x-2'>
								<a
									href='#'
									className='text-gray-400 hover:text-indigo-600 transition-colors'
									target='_blank'
									rel='noopener noreferrer'>
									<svg
										className='w-5 h-5'
										fill='currentColor'
										viewBox='0 0 24 24'>
										<path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
									</svg>
								</a>
								<a
									href='#'
									className='text-gray-400 hover:text-indigo-600 transition-colors'
									target='_blank'
									rel='noopener noreferrer'>
									<svg
										className='w-5 h-5'
										fill='currentColor'
										viewBox='0 0 24 24'>
										<path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
									</svg>
								</a>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Call to action - Newsletter */}
				<div className='mt-12 bg-indigo-50 rounded-2xl p-8 border border-indigo-100'>
					<div className='text-center'>
						<h3 className='text-xl font-bold text-gray-900 mb-3'>
							Vous avez aimé cet article ?
						</h3>
						<p className='text-gray-600 mb-6'>
							Inscrivez-vous à notre newsletter pour recevoir nos
							derniers articles directement dans votre boîte mail.
						</p>
						<button
							onClick={() => setIsSubscribeModalOpen(true)}
							className='px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors'>
							S'inscrire à la newsletter
						</button>
					</div>
				</div>
			</div>

			{/* Modal d'inscription à la newsletter */}
			{isSubscribeModalOpen && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						className='bg-white rounded-xl p-6 sm:p-8 max-w-md w-full shadow-xl'>
						<div className='flex justify-between items-start mb-4'>
							<h3 className='text-xl font-bold text-gray-900'>
								Restez informé
							</h3>
							<button
								onClick={() => setIsSubscribeModalOpen(false)}
								className='text-gray-400 hover:text-gray-500'>
								<svg
									className='w-6 h-6'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										d='M6 18L18 6M6 6l12 12'
									/>
								</svg>
							</button>
						</div>

						<p className='text-gray-600 mb-6'>
							Recevez nos nouveaux articles, tendances et offres
							exclusives directement dans votre boîte mail.
						</p>

						<form className='space-y-4'>
							<div>
								<label
									htmlFor='email'
									className='block text-sm font-medium text-gray-700 mb-1'>
									Email
								</label>
								<input
									type='email'
									id='email'
									placeholder='votre@email.com'
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
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
								<label
									htmlFor='privacy'
									className='ml-2 block text-sm text-gray-500'>
									J'accepte de recevoir la newsletter et j'ai
									lu la{' '}
									<a
										href='/privacy-policy'
										className='text-indigo-600 hover:text-indigo-500'>
										politique de confidentialité
									</a>
									.
								</label>
							</div>

							<button
								type='submit'
								className='w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors'>
								S'inscrire
							</button>
						</form>
					</motion.div>
				</div>
			)}
		</div>
	);
}
