'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types pour les FAQ
interface FaqItem {
	question: string;
	answer: string;
}

interface ImprovedFaqSectionProps {
	faqs: FaqItem[];
	title?: string;
	description?: string;
	bgColor?: string;
	showContact?: boolean;
}

export default function ImprovedFaqSection({
	faqs,
	title = 'Questions fréquentes',
	description,
	bgColor = 'bg-gray-50',
	showContact = true,
}: ImprovedFaqSectionProps) {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
		hidden: { opacity: 0, height: 0 },
		visible: {
			opacity: 1,
			height: 'auto',
			transition: {
				duration: 0.3,
				ease: [0.04, 0.62, 0.23, 0.98],
			},
		},
	};

	// Basculer la FAQ active
	const toggleFaq = (index: number) => {
		setActiveIndex(activeIndex === index ? null : index);
	};

	return (
		<section className={`py-16 ${bgColor}`}>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* En-tête de section */}
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					className='text-center mb-12'>
					<motion.h2
						variants={itemVariants}
						className='text-3xl font-bold text-gray-900 mb-4'>
						{title}
					</motion.h2>
					{description && (
						<motion.p
							variants={itemVariants}
							className='text-xl text-gray-600 max-w-3xl mx-auto'>
							{description}
						</motion.p>
					)}
				</motion.div>

				{/* Liste des FAQ */}
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					className='max-w-3xl mx-auto'>
					<div className='bg-white rounded-xl shadow-md overflow-hidden'>
						{faqs.map((faq, index) => (
							<motion.div
								key={index}
								variants={itemVariants}
								className={`border-b border-gray-200 last:border-b-0 ${
									activeIndex === index ? 'bg-indigo-50' : ''
								} transition-colors duration-300`}>
								<button
									onClick={() => toggleFaq(index)}
									className='w-full flex justify-between items-center p-6 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 faq-question'
									aria-expanded={activeIndex === index}
									aria-controls={`faq-answer-${index}`}>
									<h3 className='text-lg font-medium text-gray-900'>
										{faq.question}
									</h3>
									<svg
										className={`h-5 w-5 text-indigo-500 transition-transform duration-300 faq-arrow ${
											activeIndex === index
												? 'rotate-180'
												: ''
										}`}
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M19 9l-7 7-7-7'
										/>
									</svg>
								</button>
								<AnimatePresence>
									{activeIndex === index && (
										<motion.div
											id={`faq-answer-${index}`}
											variants={contentVariants}
											initial='hidden'
											animate='visible'
											exit='hidden'
											className='px-6 pb-6'>
											<p className='text-gray-600 prose prose-indigo max-w-none'>
												{faq.answer}
											</p>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* Section contact */}
				{showContact && (
					<motion.div
						variants={containerVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}
						className='text-center mt-12'>
						<motion.p
							variants={itemVariants}
							className='text-gray-600 mb-4'>
							Vous n'avez pas trouvé de réponse à votre question ?
						</motion.p>
						<motion.a
							variants={itemVariants}
							href='/contact'
							className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md'>
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
									d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
								/>
							</svg>
						</motion.a>
					</motion.div>
				)}
			</div>
		</section>
	);
}
