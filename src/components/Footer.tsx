'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
	FaFacebook,
	FaTwitter,
	FaInstagram,
	FaLinkedin,
	FaYoutube,
} from 'react-icons/fa';

export default function Footer() {
	const [email, setEmail] = useState('');
	const [subscribeStatus, setSubscribeStatus] = useState<{
		message: string;
		type: 'success' | 'error' | null;
	}>({ message: '', type: null });

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim()) {
			setSubscribeStatus({
				message: 'Veuillez entrer une adresse e-mail valide',
				type: 'error',
			});
			return;
		}

		try {
			// Simulation d'appel API pour l'inscription à la newsletter
			// À remplacer par votre implémentation réelle
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

	return (
		<footer className='bg-gray-900 text-white'>
			{/* Fond abstrait */}
			<div className='relative overflow-hidden'>
				<div className='absolute inset-0 opacity-5'>
					<div className='absolute -top-20 -left-20 w-96 h-96 rounded-full bg-indigo-500'></div>
					<div className='absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-500'></div>
				</div>

				<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
					{/* Section newsletter */}
					<div className='relative z-10 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-2xl p-8 md:p-12 mb-16 shadow-xl'>
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
									<input
										type='email'
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										placeholder='Votre adresse e-mail'
										className='flex-grow px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white'
										required
									/>
									<button
										type='submit'
										className='px-6 py-3 bg-white text-indigo-700 font-medium rounded-full hover:bg-gray-100 transition-colors duration-300 whitespace-nowrap'>
										S&apos;inscrire
									</button>
								</form>
								{subscribeStatus.message && (
									<p
										className={`mt-2 text-sm ${
											subscribeStatus.type === 'success'
												? 'text-green-300'
												: 'text-red-300'
										}`}>
										{subscribeStatus.message}
									</p>
								)}
								<p className='mt-2 text-xs text-indigo-200'>
									En vous inscrivant, vous acceptez de
									recevoir nos emails marketing et confirmez
									avoir lu notre{' '}
									<Link
										href='/privacy-policy'
										className='underline hover:text-white'>
										politique de confidentialité
									</Link>
									.
								</p>
							</div>
						</div>
					</div>

					{/* Grille de liens */}
					<div className='grid grid-cols-2 md:grid-cols-4 gap-8 mb-12'>
						<div>
							<h3 className='text-lg font-semibold mb-4 text-indigo-300'>
								Produits
							</h3>
							<ul className='space-y-2'>
								<li>
									<Link
										href='/products'
										className='text-gray-300 hover:text-white transition-colors'>
										Tous les produits
									</Link>
								</li>
								<li>
									<Link
										href='/new-arrivals'
										className='text-gray-300 hover:text-white transition-colors'>
										Nouveautés
									</Link>
								</li>
								<li>
									<Link
										href='/promotions'
										className='text-gray-300 hover:text-white transition-colors'>
										Promotions
									</Link>
								</li>
								<li>
									<Link
										href='/best-sellers'
										className='text-gray-300 hover:text-white transition-colors'>
										Meilleures ventes
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h3 className='text-lg font-semibold mb-4 text-indigo-300'>
								Catégories
							</h3>
							<ul className='space-y-2'>
								<li>
									<Link
										href='/categories'
										className='text-gray-300 hover:text-white transition-colors'>
										Toutes les catégories
									</Link>
								</li>
								<li>
									<Link
										href='/categories/category-1'
										className='text-gray-300 hover:text-white transition-colors'>
										Catégorie 1
									</Link>
								</li>
								<li>
									<Link
										href='/categories/category-2'
										className='text-gray-300 hover:text-white transition-colors'>
										Catégorie 2
									</Link>
								</li>
								<li>
									<Link
										href='/categories/category-3'
										className='text-gray-300 hover:text-white transition-colors'>
										Catégorie 3
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h3 className='text-lg font-semibold mb-4 text-indigo-300'>
								À propos
							</h3>
							<ul className='space-y-2'>
								<li>
									<Link
										href='/about'
										className='text-gray-300 hover:text-white transition-colors'>
										Notre histoire
									</Link>
								</li>
								<li>
									<Link
										href='/blog'
										className='text-gray-300 hover:text-white transition-colors'>
										Blog
									</Link>
								</li>
								<li>
									<Link
										href='/testimonials'
										className='text-gray-300 hover:text-white transition-colors'>
										Témoignages
									</Link>
								</li>
								<li>
									<Link
										href='/faq'
										className='text-gray-300 hover:text-white transition-colors'>
										FAQ
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h3 className='text-lg font-semibold mb-4 text-indigo-300'>
								Support
							</h3>
							<ul className='space-y-2'>
								<li>
									<Link
										href='/contact'
										className='text-gray-300 hover:text-white transition-colors'>
										Contact
									</Link>
								</li>
								<li>
									<Link
										href='/shipping'
										className='text-gray-300 hover:text-white transition-colors'>
										Livraison
									</Link>
								</li>
								<li>
									<Link
										href='/returns'
										className='text-gray-300 hover:text-white transition-colors'>
										Retours
									</Link>
								</li>
								<li>
									<Link
										href='/terms'
										className='text-gray-300 hover:text-white transition-colors'>
										Conditions générales
									</Link>
								</li>
							</ul>
						</div>
					</div>

					{/* Informations de contact et médias sociaux */}
					<div className='grid md:grid-cols-2 gap-8 border-t border-gray-800 pt-8'>
						<div>
							<Link
								href='/'
								className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 inline-block mb-4'>
								LOGO
							</Link>
							<p className='text-gray-400 mb-4 max-w-md'>
								Votre boutique en ligne innovante qui redéfinit
								l&apos;expérience shopping avec des produits
								soigneusement sélectionnés et un service client
								exceptionnel.
							</p>
							<div className='flex space-x-4'>
								<a
									href='https://facebook.com'
									target='_blank'
									rel='noopener noreferrer'
									className='text-gray-400 hover:text-white transition-colors'
									aria-label='Facebook'>
									<FaFacebook size={20} />
								</a>
								<a
									href='https://twitter.com'
									target='_blank'
									rel='noopener noreferrer'
									className='text-gray-400 hover:text-white transition-colors'
									aria-label='Twitter'>
									<FaTwitter size={20} />
								</a>
								<a
									href='https://instagram.com'
									target='_blank'
									rel='noopener noreferrer'
									className='text-gray-400 hover:text-white transition-colors'
									aria-label='Instagram'>
									<FaInstagram size={20} />
								</a>
								<a
									href='https://linkedin.com'
									target='_blank'
									rel='noopener noreferrer'
									className='text-gray-400 hover:text-white transition-colors'
									aria-label='LinkedIn'>
									<FaLinkedin size={20} />
								</a>
								<a
									href='https://youtube.com'
									target='_blank'
									rel='noopener noreferrer'
									className='text-gray-400 hover:text-white transition-colors'
									aria-label='YouTube'>
									<FaYoutube size={20} />
								</a>
							</div>
						</div>

						<div className='flex flex-col md:items-end'>
							<div className='text-gray-400'>
								<p className='mb-2'>
									<strong className='text-white'>
										Adresse:
									</strong>{' '}
									123 Rue du Commerce, 75000 Paris, France
								</p>
								<p className='mb-2'>
									<strong className='text-white'>
										Téléphone:
									</strong>{' '}
									+33 1 23 45 67 89
								</p>
								<p className='mb-2'>
									<strong className='text-white'>
										Email:
									</strong>{' '}
									contact@votre-boutique.fr
								</p>
								<p className='mb-2'>
									<strong className='text-white'>
										Horaires:
									</strong>{' '}
									Lun-Ven: 9h-18h | Sam: 10h-17h
								</p>
							</div>
						</div>
					</div>

					{/* Bas de page, copyright et liens légaux */}
					<div className='border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center'>
						<p className='text-gray-400 text-sm mb-4 md:mb-0'>
							&copy; {new Date().getFullYear()} Votre Boutique.
							Tous droits réservés.
						</p>
						<div className='flex flex-wrap gap-4 text-sm text-gray-400'>
							<Link
								href='/terms'
								className='hover:text-white transition-colors'>
								Conditions d&apos;utilisation
							</Link>
							<Link
								href='/privacy-policy'
								className='hover:text-white transition-colors'>
								Politique de confidentialité
							</Link>
							<Link
								href='/cookies'
								className='hover:text-white transition-colors'>
								Politique de cookies
							</Link>
							<Link
								href='/sitemap'
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
