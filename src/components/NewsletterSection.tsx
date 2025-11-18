'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function NewsletterSection() {
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle');
	const [message, setMessage] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim() || !email.includes('@')) {
			setStatus('error');
			setMessage('Veuillez entrer une adresse email valide');
			return;
		}

		setStatus('loading');

		try {
			const response = await fetch('/api/newsletter', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email: email.trim() }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erreur lors de l\'inscription');
			}

			setStatus('success');
			setMessage(data.message || 'Merci pour votre inscription à notre newsletter!');
			setEmail('');

			// Réinitialiser après 5 secondes
			setTimeout(() => {
				setStatus('idle');
				setMessage('');
			}, 5000);
		} catch (error) {
			setStatus('error');
			setMessage(
				error instanceof Error
					? error.message
					: 'Une erreur est survenue. Veuillez réessayer plus tard.'
			);

			// Réinitialiser l'erreur après 5 secondes
			setTimeout(() => {
				setStatus('idle');
				setMessage('');
			}, 5000);
		}
	};

	return (
		<section className='py-20 bg-gradient-to-br from-indigo-900 to-purple-900 text-white'>
			<div className='max-w-7xl mx-auto px-6'>
				<div className='relative z-10'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-100px' }}
						transition={{ duration: 0.7 }}
						className='bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl'>
						<div className='grid md:grid-cols-2 gap-8 items-center'>
							<div>
								<motion.h2
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: 0.2 }}
									className='text-2xl md:text-3xl font-bold mb-4'>
									Rejoignez notre communauté
								</motion.h2>
								<motion.p
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: 0.3 }}
									className='text-indigo-100 mb-0'>
									Inscrivez-vous à notre newsletter et soyez
									les premiers à découvrir nos nouveautés,
									promotions exclusives et conseils d'experts.
								</motion.p>
							</div>
							<div>
								<form
									onSubmit={handleSubmit}
									className='space-y-4'>
									<div>
										<label
											htmlFor='email'
											className='sr-only'>
											Adresse email
										</label>
										<input
											type='email'
											id='email'
											name='email'
											value={email}
											onChange={(e) =>
												setEmail(e.target.value)
											}
											placeholder='Votre adresse email'
											className='w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white'
											disabled={status === 'loading'}
										/>
									</div>

									{message && (
										<p
											className={`text-sm ${
												status === 'success'
													? 'text-green-300'
													: 'text-red-300'
											}`}>
											{message}
										</p>
									)}

									<button
										type='submit'
										disabled={status === 'loading'}
										className='w-full md:w-auto px-6 py-3 bg-white text-indigo-700 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300 disabled:opacity-70 flex items-center justify-center'>
										{status === 'loading' ? (
											<>
												<svg
													className='animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-700'
													xmlns='http://www.w3.org/2000/svg'
													fill='none'
													viewBox='0 0 24 24'>
													<circle
														className='opacity-25'
														cx='12'
														cy='12'
														r='10'
														stroke='currentColor'
														strokeWidth='4'></circle>
													<path
														className='opacity-75'
														fill='currentColor'
														d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
												</svg>
												Inscription en cours...
											</>
										) : (
											"S'inscrire à la newsletter"
										)}
									</button>

									<p className='text-xs text-indigo-200 mt-2'>
										En vous inscrivant, vous acceptez de
										recevoir nos communications marketing et
										confirmez avoir lu notre politique de
										confidentialité.
									</p>
								</form>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Éléments décoratifs */}
				<div className='absolute inset-0 overflow-hidden'>
					<div className='absolute -top-20 -left-20 w-64 h-64 rounded-full bg-purple-500 mix-blend-multiply filter blur-3xl opacity-20'></div>
					<div className='absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-500 mix-blend-multiply filter blur-3xl opacity-20'></div>
				</div>
			</div>
		</section>
	);
}
