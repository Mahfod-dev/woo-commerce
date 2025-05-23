'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface CookiePreferences {
	essential: boolean;
	analytics: boolean;
	marketing: boolean;
	preferences: boolean;
}

export default function CookieConsentBanner() {
	const [showBanner, setShowBanner] = useState(false);
	const [showPreferences, setShowPreferences] = useState(false);
	const [preferences, setPreferences] = useState<CookiePreferences>({
		essential: true, // Toujours activé
		analytics: false,
		marketing: false,
		preferences: false,
	});

	useEffect(() => {
		// Vérifier si l'utilisateur a déjà donné son consentement
		const consentGiven = localStorage.getItem('cookie-consent');
		if (!consentGiven) {
			// Délai pour laisser le temps à la page de se charger
			const timer = setTimeout(() => {
				setShowBanner(true);
			}, 1000);
			return () => clearTimeout(timer);
		} else {
			// Charger les préférences existantes
			const savedPreferences = localStorage.getItem('cookie-preferences');
			if (savedPreferences) {
				setPreferences(JSON.parse(savedPreferences));
			}
		}
	}, []);

	const handleAcceptAll = () => {
		const allAccepted: CookiePreferences = {
			essential: true,
			analytics: true,
			marketing: true,
			preferences: true,
		};
		
		savePreferences(allAccepted);
		setShowBanner(false);
	};

	const handleRejectAll = () => {
		const essentialOnly: CookiePreferences = {
			essential: true,
			analytics: false,
			marketing: false,
			preferences: false,
		};
		
		savePreferences(essentialOnly);
		setShowBanner(false);
	};

	const handleSavePreferences = () => {
		savePreferences(preferences);
		setShowBanner(false);
		setShowPreferences(false);
	};

	const savePreferences = (prefs: CookiePreferences) => {
		localStorage.setItem('cookie-consent', 'true');
		localStorage.setItem('cookie-preferences', JSON.stringify(prefs));
		localStorage.setItem('cookie-consent-date', new Date().toISOString());

		// Ici vous pouvez ajouter la logique pour activer/désactiver les scripts
		// en fonction des préférences utilisateur
		if (prefs.analytics) {
			// Activer Google Analytics
			console.log('Google Analytics activé');
		}
		if (prefs.marketing) {
			// Activer les cookies marketing
			console.log('Cookies marketing activés');
		}
		if (prefs.preferences) {
			// Activer les cookies de préférences
			console.log('Cookies de préférences activés');
		}
	};

	const handlePreferenceChange = (key: keyof CookiePreferences) => {
		if (key === 'essential') return; // Ne peut pas être désactivé
		
		setPreferences(prev => ({
			...prev,
			[key]: !prev[key]
		}));
	};

	return (
		<AnimatePresence>
			{showBanner && (
				<motion.div
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 100 }}
					transition={{ type: 'spring', stiffness: 300, damping: 30 }}
					className='fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl border-t border-gray-200'>
					
					{!showPreferences ? (
						// Bandeau principal
						<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
							<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
								<div className='flex-1'>
									<div className='flex items-start'>
										<div className='flex-shrink-0 mr-3'>
											<svg className='h-6 w-6 text-indigo-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
												<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
											</svg>
										</div>
										<div>
											<h3 className='text-sm font-medium text-gray-900 mb-1'>
												Nous utilisons des cookies
											</h3>
											<p className='text-sm text-gray-600'>
												Ce site utilise des cookies pour améliorer votre expérience de navigation, analyser le trafic et personnaliser le contenu. 
												Vous pouvez accepter tous les cookies, les personnaliser ou consulter notre{' '}
												<Link href='/cookie-policy' className='text-indigo-600 hover:text-indigo-800 underline'>
													politique de cookies
												</Link>
												{' '}pour plus d'informations.
											</p>
										</div>
									</div>
								</div>
								
								<div className='flex flex-col sm:flex-row gap-2 lg:ml-4'>
									<button
										onClick={() => setShowPreferences(true)}
										className='px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'>
										Personnaliser
									</button>
									<button
										onClick={handleRejectAll}
										className='px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'>
										Refuser tout
									</button>
									<button
										onClick={handleAcceptAll}
										className='px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors'>
										Accepter tout
									</button>
								</div>
							</div>
						</div>
					) : (
						// Centre de préférences
						<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
							<div className='mb-4'>
								<h3 className='text-lg font-medium text-gray-900 mb-2'>
									Paramètres des cookies
								</h3>
								<p className='text-sm text-gray-600'>
									Choisissez les types de cookies que vous souhaitez autoriser. Vous pouvez modifier ces paramètres à tout moment.
								</p>
							</div>

							<div className='space-y-4 mb-6'>
								{/* Cookies essentiels */}
								<div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
									<div className='flex-1'>
										<h4 className='text-sm font-medium text-gray-900'>Cookies essentiels</h4>
										<p className='text-xs text-gray-600 mt-1'>
											Nécessaires au fonctionnement du site (panier, session, sécurité). Toujours activés.
										</p>
									</div>
									<div className='ml-4'>
										<div className='w-11 h-6 bg-indigo-600 rounded-full shadow-inner cursor-not-allowed opacity-50'>
											<div className='w-4 h-4 bg-white rounded-full shadow m-1 transform translate-x-5'></div>
										</div>
									</div>
								</div>

								{/* Cookies d'analyse */}
								<div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
									<div className='flex-1'>
										<h4 className='text-sm font-medium text-gray-900'>Cookies d'analyse</h4>
										<p className='text-xs text-gray-600 mt-1'>
											Nous aident à comprendre comment vous utilisez notre site pour l'améliorer (Google Analytics).
										</p>
									</div>
									<div className='ml-4'>
										<button
											onClick={() => handlePreferenceChange('analytics')}
											className={`w-11 h-6 rounded-full shadow-inner transition-colors ${
												preferences.analytics ? 'bg-indigo-600' : 'bg-gray-300'
											}`}>
											<div className={`w-4 h-4 bg-white rounded-full shadow m-1 transform transition-transform ${
												preferences.analytics ? 'translate-x-5' : 'translate-x-0'
											}`}></div>
										</button>
									</div>
								</div>

								{/* Cookies de préférences */}
								<div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
									<div className='flex-1'>
										<h4 className='text-sm font-medium text-gray-900'>Cookies de préférences</h4>
										<p className='text-xs text-gray-600 mt-1'>
											Mémorisent vos préférences (langue, région, produits vus récemment).
										</p>
									</div>
									<div className='ml-4'>
										<button
											onClick={() => handlePreferenceChange('preferences')}
											className={`w-11 h-6 rounded-full shadow-inner transition-colors ${
												preferences.preferences ? 'bg-indigo-600' : 'bg-gray-300'
											}`}>
											<div className={`w-4 h-4 bg-white rounded-full shadow m-1 transform transition-transform ${
												preferences.preferences ? 'translate-x-5' : 'translate-x-0'
											}`}></div>
										</button>
									</div>
								</div>

								{/* Cookies marketing */}
								<div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
									<div className='flex-1'>
										<h4 className='text-sm font-medium text-gray-900'>Cookies marketing</h4>
										<p className='text-xs text-gray-600 mt-1'>
											Personnalisent les publicités et mesurent l'efficacité de nos campagnes.
										</p>
									</div>
									<div className='ml-4'>
										<button
											onClick={() => handlePreferenceChange('marketing')}
											className={`w-11 h-6 rounded-full shadow-inner transition-colors ${
												preferences.marketing ? 'bg-indigo-600' : 'bg-gray-300'
											}`}>
											<div className={`w-4 h-4 bg-white rounded-full shadow m-1 transform transition-transform ${
												preferences.marketing ? 'translate-x-5' : 'translate-x-0'
											}`}></div>
										</button>
									</div>
								</div>
							</div>

							<div className='flex flex-col sm:flex-row gap-2 justify-end'>
								<button
									onClick={() => setShowPreferences(false)}
									className='px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'>
									Retour
								</button>
								<Link
									href='/cookie-policy'
									className='px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-center'>
									En savoir plus
								</Link>
								<button
									onClick={handleSavePreferences}
									className='px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors'>
									Enregistrer les préférences
								</button>
							</div>
						</div>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}