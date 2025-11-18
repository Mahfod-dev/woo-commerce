'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
	FaFacebook,
	FaTwitter,
	FaInstagram,
	FaLinkedin,
	FaYoutube,
	FaMapMarkerAlt,
	FaPhone,
	FaEnvelope,
	FaClock,
} from 'react-icons/fa';

export default function ImprovedFooter() {
	const [email, setEmail] = useState('');
	const [subscribeStatus, setSubscribeStatus] = useState<{
		message: string;
		type: 'success' | 'error' | null;
	}>({ message: '', type: null });
	const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim() || !email.includes('@')) {
			setSubscribeStatus({
				message: 'Veuillez entrer une adresse e-mail valide',
				type: 'error',
			});
			return;
		}

		try {
			// Simulation d'appel API pour l'inscription à la newsletter
			await new Promise((resolve) => setTimeout(resolve, 800));

			setSubscribeStatus({
				message: 'Merci de vous être inscrit à notre newsletter!',
				type: 'success',
			});
			setEmail('');

			// Réinitialiser le message après 5 secondes
			setTimeout(() => {
				setSubscribeStatus({ message: '', type: null });
			}, 5000);
		} catch {
			setSubscribeStatus({
				message:
					"Une erreur s'est produite. Veuillez réessayer plus tard.",
				type: 'error',
			});
		}
	};

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
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

	// Toggle accordion (for mobile view)
	const toggleAccordion = (id: string) => {
		if (activeAccordion === id) {
			setActiveAccordion(null);
		} else {
			setActiveAccordion(id);
		}
	};

	return (
		<footer className='bg-gradient-to-b from-gray-900 to-indigo-900 text-white relative overflow-hidden font-sans'>
			{/* Fond abstrait */}
			<div className='absolute inset-0 opacity-5'>
				<div className='absolute -top-20 -left-20 w-96 h-96 rounded-full bg-indigo-500'></div>
				<div className='absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-500'></div>
			</div>

			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Section newsletter */}
				<div className='relative z-10 pt-16 pb-8'>
					{/* <motion.div
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-100px' }}
						transition={{ duration: 0.7 }}
						className='bg-gradient-to-r from-indigo-700 to-purple-700 rounded-2xl p-8 md:p-12 mb-16 shadow-xl'>
						<div className='grid md:grid-cols-2 gap-8 items-center'>
							<div>
								<h2 className='text-2xl md:text-3xl font-bold mb-2'>
									Restez informé
								</h2>
								<p className='text-indigo-100 mb-0 max-w-md'>
									Inscrivez-vous à notre newsletter pour
									recevoir nos dernières nouveautés et offres
									exclusives.
								</p>
							</div>
							<div>
								<form
									onSubmit={handleSubscribe}
									className='flex flex-col sm:flex-row gap-2'>
									<div className='flex-grow relative'>
										<input
											type='email'
											value={email}
											onChange={(e) =>
												setEmail(e.target.value)
											}
											placeholder='Votre adresse e-mail'
											className='w-full px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white'
											required
										/>
										{subscribeStatus.message && (
											<p
												className={`absolute left-0 -bottom-6 text-sm ${
													subscribeStatus.type ===
													'success'
														? 'text-green-300'
														: 'text-red-300'
												}`}>
												{subscribeStatus.message}
											</p>
										)}
									</div>
									<motion.button
										type='submit'
										whileHover={{ scale: 1.03 }}
										whileTap={{ scale: 0.97 }}
										className='px-6 py-3 bg-white text-indigo-700 font-medium rounded-full hover:bg-gray-100 transition-colors duration-300 whitespace-nowrap shadow-md'>
										S'inscrire
									</motion.button>
								</form>
								<p className='mt-4 text-xs text-indigo-200'>
									En vous inscrivant, vous acceptez de
									recevoir nos emails marketing et confirmez
									avoir lu notre{' '}
									<Link
										href='/privacy-policy'
										className='underline hover:text-white transition-colors'>
										politique de confidentialité
									</Link>
									.
								</p>
							</div>
						</div>
					</motion.div> */}

					{/* Grille de liens */}
					<motion.div
						variants={containerVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true, margin: '-100px' }}
						className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-12'>
						{/* Première colonne - Logo et infos */}
						<motion.div
							variants={itemVariants}
							className='md:col-span-1'>
							<Link
								href='/'
								className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 inline-block mb-4'>
								<Image
									src='/selectura.png'
									alt='Logo de la boutique'
									width={100}
									height={100}
									className='h-10 w-auto'
								/>
							</Link>
							<p className='text-gray-400 mb-6 max-w-md'>
								Votre boutique en ligne innovante qui redéfinit
								l'expérience shopping avec des produits
								soigneusement sélectionnés et un service client
								exceptionnel.
							</p>
							<div className='flex space-x-4'>
								<motion.a
									href='https://facebook.com'
									target='_blank'
									rel='noopener noreferrer'
									className='text-gray-400 hover:text-white transition-colors'
									aria-label='Facebook'
									whileHover={{
										scale: 1.2,
										color: '#4267B2',
									}}>
									<FaFacebook size={20} />
								</motion.a>
								<motion.a
									href='https://twitter.com'
									target='_blank'
									rel='noopener noreferrer'
									className='text-gray-400 hover:text-white transition-colors'
									aria-label='Twitter'
									whileHover={{
										scale: 1.2,
										color: '#1DA1F2',
									}}>
									<FaTwitter size={20} />
								</motion.a>
								<motion.a
									href='https://instagram.com'
									target='_blank'
									rel='noopener noreferrer'
									className='text-gray-400 hover:text-white transition-colors'
									aria-label='Instagram'
									whileHover={{
										scale: 1.2,
										color: '#E1306C',
									}}>
									<FaInstagram size={20} />
								</motion.a>
								<motion.a
									href='https://linkedin.com'
									target='_blank'
									rel='noopener noreferrer'
									className='text-gray-400 hover:text-white transition-colors'
									aria-label='LinkedIn'
									whileHover={{
										scale: 1.2,
										color: '#0077B5',
									}}>
									<FaLinkedin size={20} />
								</motion.a>
								<motion.a
									href='https://youtube.com'
									target='_blank'
									rel='noopener noreferrer'
									className='text-gray-400 hover:text-white transition-colors'
									aria-label='YouTube'
									whileHover={{
										scale: 1.2,
										color: '#FF0000',
									}}>
									<FaYoutube size={20} />
								</motion.a>
							</div>
						</motion.div>

						{/* Colonnes pour les liens - version desktop */}
						<div className='hidden md:grid md:grid-cols-3 md:col-span-3 gap-8'>
							<motion.div variants={itemVariants}>
								<h3 className='text-lg font-semibold text-indigo-300 mb-4'>
									Produits
								</h3>
								<ul className='space-y-2'>
									<motion.li
										variants={itemVariants}
										whileHover={{ x: 5 }}
										transition={{
											type: 'spring',
											stiffness: 300,
										}}>
										<Link
											href='/products'
											className='text-gray-300 hover:text-white transition-colors block'>
											Tous les produits
										</Link>
									</motion.li>
									<motion.li
										variants={itemVariants}
										whileHover={{ x: 5 }}
										transition={{
											type: 'spring',
											stiffness: 300,
										}}>
										<Link
											href='/new-arrivals'
											className='text-gray-300 hover:text-white transition-colors block'>
											Nouveautés
										</Link>
									</motion.li>
									<motion.li
										variants={itemVariants}
										whileHover={{ x: 5 }}
										transition={{
											type: 'spring',
											stiffness: 300,
										}}>
										<Link
											href='/promotions'
											className='text-gray-300 hover:text-white transition-colors block'>
											Promotions
										</Link>
									</motion.li>
									<motion.li
										variants={itemVariants}
										whileHover={{ x: 5 }}
										transition={{
											type: 'spring',
											stiffness: 300,
										}}>
										<Link
											href='/best-sellers'
											className='text-gray-300 hover:text-white transition-colors block'>
											Meilleures ventes
										</Link>
									</motion.li>
								</ul>
							</motion.div>

							<motion.div variants={itemVariants}>
								<h3 className='text-lg font-semibold text-indigo-300 mb-4'>
									À propos
								</h3>
								<ul className='space-y-2'>
									<motion.li
										variants={itemVariants}
										whileHover={{ x: 5 }}
										transition={{
											type: 'spring',
											stiffness: 300,
										}}>
										<Link
											href='/about'
											className='text-gray-300 hover:text-white transition-colors block'>
											Notre histoire
										</Link>
									</motion.li>
									<motion.li
										variants={itemVariants}
										whileHover={{ x: 5 }}
										transition={{
											type: 'spring',
											stiffness: 300,
										}}>
										<Link
											href='/blog'
											className='text-gray-300 hover:text-white transition-colors block'>
											Blog
										</Link>
									</motion.li>
									<motion.li
										variants={itemVariants}
										whileHover={{ x: 5 }}
										transition={{
											type: 'spring',
											stiffness: 300,
										}}>
										<Link
											href='/testimonials'
											className='text-gray-300 hover:text-white transition-colors block'>
											Témoignages
										</Link>
									</motion.li>
									<motion.li
										variants={itemVariants}
										whileHover={{ x: 5 }}
										transition={{
											type: 'spring',
											stiffness: 300,
										}}>
										<Link
											href='/faq'
											className='text-gray-300 hover:text-white transition-colors block'>
											FAQ
										</Link>
									</motion.li>
								</ul>
							</motion.div>

							<motion.div variants={itemVariants}>
								<h3 className='text-lg font-semibold text-indigo-300 mb-4'>
									Support
								</h3>
								<ul className='space-y-2'>
									<motion.li
										variants={itemVariants}
										whileHover={{ x: 5 }}
										transition={{
											type: 'spring',
											stiffness: 300,
										}}>
										<Link
											href='/contact'
											className='text-gray-300 hover:text-white transition-colors block'>
											Contact
										</Link>
									</motion.li>
									<motion.li
										variants={itemVariants}
										whileHover={{ x: 5 }}
										transition={{
											type: 'spring',
											stiffness: 300,
										}}>
										<Link
											href='/shipping'
											className='text-gray-300 hover:text-white transition-colors block'>
											Livraison
										</Link>
									</motion.li>
									<motion.li
										variants={itemVariants}
										whileHover={{ x: 5 }}
										transition={{
											type: 'spring',
											stiffness: 300,
										}}>
										<Link
											href='/returns'
											className='text-gray-300 hover:text-white transition-colors block'>
											Retours
										</Link>
									</motion.li>
									<motion.li
										variants={itemVariants}
										whileHover={{ x: 5 }}
										transition={{
											type: 'spring',
											stiffness: 300,
										}}>
										<Link
											href='/terms'
											className='text-gray-300 hover:text-white transition-colors block'>
											Conditions générales
										</Link>
									</motion.li>
								</ul>
							</motion.div>
						</div>

						{/* Version mobile avec accordéons */}
						<div className='md:hidden space-y-4'>
							{/* Accordéon Produits */}
							<div className='border-b border-gray-800 pb-4'>
								<button
									onClick={() => toggleAccordion('products')}
									className='flex justify-between items-center w-full text-left'>
									<h3 className='text-lg font-semibold text-indigo-300'>
										Produits
									</h3>
									<svg
										className={`h-5 w-5 text-gray-300 transform transition-transform ${
											activeAccordion === 'products'
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

								{activeAccordion === 'products' && (
									<motion.ul
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: 'auto', opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ duration: 0.3 }}
										className='mt-3 space-y-2 pl-2'>
										<li>
											<Link
												href='/products'
												className='text-gray-300 hover:text-white transition-colors block py-1'>
												Tous les produits
											</Link>
										</li>
										<li>
											<Link
												href='/new-arrivals'
												className='text-gray-300 hover:text-white transition-colors block py-1'>
												Nouveautés
											</Link>
										</li>
										<li>
											<Link
												href='/promotions'
												className='text-gray-300 hover:text-white transition-colors block py-1'>
												Promotions
											</Link>
										</li>
										<li>
											<Link
												href='/best-sellers'
												className='text-gray-300 hover:text-white transition-colors block py-1'>
												Meilleures ventes
											</Link>
										</li>
									</motion.ul>
								)}
							</div>

							{/* Accordéon À propos */}
							<div className='border-b border-gray-800 pb-4'>
								<button
									onClick={() => toggleAccordion('about')}
									className='flex justify-between items-center w-full text-left'>
									<h3 className='text-lg font-semibold text-indigo-300'>
										À propos
									</h3>
									<svg
										className={`h-5 w-5 text-gray-300 transform transition-transform ${
											activeAccordion === 'about'
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

								{activeAccordion === 'about' && (
									<motion.ul
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: 'auto', opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ duration: 0.3 }}
										className='mt-3 space-y-2 pl-2'>
										<li>
											<Link
												href='/about'
												className='text-gray-300 hover:text-white transition-colors block py-1'>
												Notre histoire
											</Link>
										</li>
										<li>
											<Link
												href='/blog'
												className='text-gray-300 hover:text-white transition-colors block py-1'>
												Blog
											</Link>
										</li>
										<li>
											<Link
												href='/testimonials'
												className='text-gray-300 hover:text-white transition-colors block py-1'>
												Témoignages
											</Link>
										</li>
										<li>
											<Link
												href='/faq'
												className='text-gray-300 hover:text-white transition-colors block py-1'>
												FAQ
											</Link>
										</li>
									</motion.ul>
								)}
							</div>

							{/* Accordéon Support */}
							<div className='border-b border-gray-800 pb-4'>
								<button
									onClick={() => toggleAccordion('support')}
									className='flex justify-between items-center w-full text-left'>
									<h3 className='text-lg font-semibold text-indigo-300'>
										Support
									</h3>
									<svg
										className={`h-5 w-5 text-gray-300 transform transition-transform ${
											activeAccordion === 'support'
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

								{activeAccordion === 'support' && (
									<motion.ul
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: 'auto', opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ duration: 0.3 }}
										className='mt-3 space-y-2 pl-2'>
										<li>
											<Link
												href='/contact'
												className='text-gray-300 hover:text-white transition-colors block py-1'>
												Contact
											</Link>
										</li>
										<li>
											<Link
												href='/shipping'
												className='text-gray-300 hover:text-white transition-colors block py-1'>
												Livraison
											</Link>
										</li>
										<li>
											<Link
												href='/returns'
												className='text-gray-300 hover:text-white transition-colors block py-1'>
												Retours
											</Link>
										</li>
										<li>
											<Link
												href='/terms'
												className='text-gray-300 hover:text-white transition-colors block py-1'>
												Conditions générales
											</Link>
										</li>
									</motion.ul>
								)}
							</div>
						</div>
					</motion.div>

					{/* Informations de contact */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className='pt-8 border-t border-gray-800'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
							<div className='space-y-4'>
								<h3 className='text-lg font-semibold text-white'>
									Contactez-nous
								</h3>
								<ul className='space-y-3'>
									<li className='flex items-start'>
										<FaMapMarkerAlt className='text-indigo-400 mt-1 mr-3 flex-shrink-0' />
										<span className='text-gray-300'>
											254 rue Vendôme Lyon 69003,
											France
										</span>
									</li>
									<li className='flex items-start'>
										<FaPhone className='text-indigo-400 mt-1 mr-3 flex-shrink-0' />
										<span className='text-gray-300'>
											(913) 675-9287
										</span>
									</li>
									<li className='flex items-start'>
										<FaEnvelope className='text-indigo-400 mt-1 mr-3 flex-shrink-0' />
										<span className='text-gray-300'>
											support@flowcontent.io
										</span>
									</li>
									<li className='flex items-start'>
										<FaClock className='text-indigo-400 mt-1 mr-3 flex-shrink-0' />
										<span className='text-gray-300'>
											Lun-Ven: 9h-18h | Sam: 10h-17h
										</span>
									</li>
								</ul>
							</div>

							<div className='flex flex-col md:items-end justify-center space-y-6'>
								<div>
									<h3 className='text-lg font-semibold text-white mb-3'>
										Paiement sécurisé
									</h3>
									<div className='flex flex-wrap gap-2 mb-2'>
										{/* Visa */}
										<div className='bg-white p-2 rounded w-12 h-8 flex items-center justify-center'>
											<div className='text-blue-600 font-bold text-xs'>VISA</div>
										</div>
										{/* Mastercard */}
										<div className='bg-white p-2 rounded w-12 h-8 flex items-center justify-center'>
											<div className='flex space-x-0.5'>
												<div className='w-2 h-2 rounded-full bg-red-500'></div>
												<div className='w-2 h-2 rounded-full bg-yellow-500'></div>
											</div>
										</div>
										{/* PayPal */}
										<div className='bg-white p-2 rounded w-12 h-8 flex items-center justify-center'>
											<div className='text-blue-600 font-bold text-xs'>PayPal</div>
										</div>
										{/* Apple Pay */}
										<div className='bg-white p-2 rounded w-12 h-8 flex items-center justify-center'>
											<div className='text-black text-xs'>🍎 Pay</div>
										</div>
										{/* Stripe */}
										<div className='bg-white p-2 rounded w-12 h-8 flex items-center justify-center'>
											<div className='text-indigo-600 font-bold text-xs'>S</div>
										</div>
									</div>
									<p className='text-xs text-gray-400 italic max-w-xs md:text-right'>
										"Paiements 100% sécurisés - Plus de 50,000 clients nous font confiance"
									</p>
								</div>

								<div>
									<h3 className='text-lg font-semibold text-white mb-3'>
										Produits de qualité
									</h3>
									<div className='flex flex-wrap gap-2 mb-2'>
										{/* Électronique */}
										<div className='bg-blue-500 p-2 rounded w-12 h-8 flex items-center justify-center'>
											<div className='text-white font-bold text-xs'>📱</div>
										</div>
										{/* Mode */}
										<div className='bg-pink-500 p-2 rounded w-12 h-8 flex items-center justify-center'>
											<div className='text-white font-bold text-xs'>👗</div>
										</div>
										{/* Maison */}
										<div className='bg-green-500 p-2 rounded w-12 h-8 flex items-center justify-center'>
											<div className='text-white font-bold text-xs'>🏠</div>
										</div>
										{/* Sport */}
										<div className='bg-orange-500 p-2 rounded w-12 h-8 flex items-center justify-center'>
											<div className='text-white font-bold text-xs'>⚽</div>
										</div>
										{/* Beauté */}
										<div className='bg-purple-500 p-2 rounded w-12 h-8 flex items-center justify-center'>
											<div className='text-white font-bold text-xs'>💄</div>
										</div>
									</div>
									<p className='text-xs text-gray-400 italic max-w-xs md:text-right'>
										"Plus de 10,000 produits sélectionnés pour leur qualité exceptionnelle"
									</p>
								</div>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Copyright et liens légaux */}
				<div className='border-t border-gray-800 py-8'>
					<div className='flex flex-col md:flex-row justify-between items-center'>
						<p className='text-gray-400 text-sm mb-4 md:mb-0'>
							&copy; {new Date().getFullYear()} Votre Boutique.
							Tous droits réservés.
						</p>
						<div className='flex flex-wrap gap-4 text-sm text-gray-400'>
							<Link
								href='/terms'
								className='hover:text-white transition-colors'>
								Conditions d'utilisation
							</Link>
							<Link
								href='/privacy-policy'
								className='hover:text-white transition-colors'>
								Politique de confidentialité
							</Link>
							<Link
								href='/cookie-policy'
								className='hover:text-white transition-colors'>
								Politique de cookies
							</Link>
							<Link
								href='/sitemap.xml'
								className='hover:text-white transition-colors'>
								Plan du site
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
