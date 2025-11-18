'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ContactSchema from './ContactSchema';

// Types pour les données de la page Contact
interface ContactFormData {
	title: string;
	nameLabel: string;
	namePlaceholder: string;
	emailLabel: string;
	emailPlaceholder: string;
	subjectLabel: string;
	subjectOptions: { value: string; label: string }[];
	messageLabel: string;
	messagePlaceholder: string;
	buttonText: string;
	successMessage: string;
	errorMessage: string;
	gdprText: string;
}

interface ContactInfoData {
	title: string;
	email: {
		label: string;
		value: string;
		description: string;
	};
	phone: {
		label: string;
		value: string;
		description: string;
	};
	address: {
		label: string;
		value: string;
		description: string;
	};
}

interface FaqItem {
	question: string;
	answer: string;
}

interface ContactData {
	heroSection: {
		title: string;
		description: string;
	};
	form: ContactFormData;
	contactInfo: ContactInfoData;
	faq: {
		title: string;
		items: FaqItem[];
	};
	socialMedia: {
		title: string;
		networks: {
			name: string;
			url: string;
			icon: string;
		}[];
	};
	map: {
		title: string;
		address: string;
		embedUrl: string;
	};
}

interface ContactContentProps {
	contactData: ContactData;
}

export default function ContactContent({ contactData }: ContactContentProps) {
	// État du formulaire
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: contactData.form.subjectOptions[0].value,
		message: '',
	});
	const [formStatus, setFormStatus] = useState<
		'idle' | 'submitting' | 'success' | 'error'
	>('idle');
	const [errors, setErrors] = useState<Record<string, string>>({});
	const formRef = useRef<HTMLFormElement>(null);
	const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

	// Gérer les changements dans le formulaire
	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Effacer l'erreur lorsque l'utilisateur corrige
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: '',
			}));
		}
	};

	// Valider le formulaire
	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = 'Le nom est requis';
		}

		if (!formData.email.trim()) {
			newErrors.email = "L'email est requis";
		} else if (
			!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
		) {
			newErrors.email = "L'adresse email n'est pas valide";
		}

		if (!formData.subject) {
			newErrors.subject = 'Le sujet est requis';
		}

		if (!formData.message.trim()) {
			newErrors.message = 'Le message est requis';
		} else if (formData.message.trim().length < 10) {
			newErrors.message =
				'Le message doit contenir au moins 10 caractères';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Gérer la soumission du formulaire
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setFormStatus('submitting');

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erreur lors de l\'envoi');
			}

			setFormStatus('success');
			setFormData({
				name: '',
				email: '',
				subject: contactData.form.subjectOptions[0].value,
				message: '',
			});

			// Réinitialiser après 5 secondes
			setTimeout(() => {
				setFormStatus('idle');
			}, 5000);
		} catch (error) {
			setFormStatus('error');
			setErrors({
				form: error instanceof Error ? error.message : contactData.form.errorMessage
			});
			console.error('Submission error:', error);

			setTimeout(() => {
				setFormStatus('idle');
			}, 5000);
		}
	};

	// Rendu de l'icône de réseau social
	const renderSocialIcon = (iconType: string) => {
		switch (iconType) {
			case 'instagram':
				return (
					<svg
						className='h-6 w-6'
						fill='currentColor'
						viewBox='0 0 24 24'>
						<path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
					</svg>
				);
			case 'linkedin':
				return (
					<svg
						className='h-6 w-6'
						fill='currentColor'
						viewBox='0 0 24 24'>
						<path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
					</svg>
				);
			case 'facebook':
				return (
					<svg
						className='h-6 w-6'
						fill='currentColor'
						viewBox='0 0 24 24'>
						<path d='M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z' />
					</svg>
				);
			default:
				return (
					<svg
						className='h-6 w-6'
						fill='currentColor'
						viewBox='0 0 24 24'>
						<path d='M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 8c0 .557-.447 1.008-1 1.008s-1-.45-1-1.008c0-.557.447-1.008 1-1.008s1 .452 1 1.008zm0 2h-2v6h2v-6zm3 0h-2v6h2v-2.861c0-1.722 2.002-1.881 2.002 0v2.861h1.998v-3.359c0-3.284-3.128-3.164-4-1.548v-1.093z' />
					</svg>
				);
		}
	};

	// Fonction pour basculer l'état des FAQs
	const toggleFaq = (index: number) => {
		setOpenFaqIndex(openFaqIndex === index ? null : index);
	};

	return (
		<div className='bg-gray-50 min-h-screen font-sans contact-content'>
			{/* Ajouter le schéma JSON-LD */}
			<ContactSchema
				organizationName='Votre Boutique'
				url='https://votreboutique.com/contact'
				email={contactData.contactInfo.email.value}
				phone={contactData.contactInfo.phone.value}
				address={contactData.contactInfo.address.value}
			/>

			{/* Hero section */}
			<div className='relative bg-gradient-to-r from-indigo-700 to-purple-700 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className='text-center max-w-3xl mx-auto'>
						<h1 className='text-3xl md:text-5xl font-bold mb-4'>
							{contactData.heroSection.title}
						</h1>
						<p className='text-xl text-indigo-100'>
							{contactData.heroSection.description}
						</p>
					</motion.div>
				</div>

				{/* Éléments décoratifs */}
				<div className='absolute inset-0 overflow-hidden opacity-20'>
					<div className='absolute -top-20 -left-20 w-64 h-64 rounded-full bg-indigo-500' />
					<div className='absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-500' />
				</div>
			</div>

			{/* Contenu principal */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 -mt-8'>
				<motion.div
					variants={containerVariants}
					initial='hidden'
					animate='visible'
					className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
					{/* Formulaire de contact */}
					<motion.div
						variants={itemVariants}
						className='lg:col-span-3 bg-white rounded-xl shadow-sm p-8'>
						<h2 className='text-2xl font-bold text-gray-900 mb-6'>
							{contactData.form.title}
						</h2>

						<form
							ref={formRef}
							onSubmit={handleSubmit}
							className='space-y-6'>
							{/* Alerte de statut */}
							{formStatus === 'success' && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className='bg-green-50 border-l-4 border-green-500 p-4 mb-6'>
									<div className='flex'>
										<div className='flex-shrink-0'>
											<svg
												className='h-5 w-5 text-green-400'
												fill='currentColor'
												viewBox='0 0 20 20'>
												<path
													fillRule='evenodd'
													d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
													clipRule='evenodd'
												/>
											</svg>
										</div>
										<div className='ml-3'>
											<p className='text-sm text-green-800'>
												{
													contactData.form
														.successMessage
												}
											</p>
										</div>
									</div>
								</motion.div>
							)}

							{formStatus === 'error' && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className='bg-red-50 border-l-4 border-red-500 p-4 mb-6'>
									<div className='flex'>
										<div className='flex-shrink-0'>
											<svg
												className='h-5 w-5 text-red-400'
												fill='currentColor'
												viewBox='0 0 20 20'>
												<path
													fillRule='evenodd'
													d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
													clipRule='evenodd'
												/>
											</svg>
										</div>
										<div className='ml-3'>
											<p className='text-sm text-red-800'>
												{contactData.form.errorMessage}
											</p>
										</div>
									</div>
								</motion.div>
							)}

							{/* Nom */}
							<div>
								<label
									htmlFor='name'
									className='block text-sm font-medium text-gray-700 mb-1'>
									{contactData.form.nameLabel}
								</label>
								<input
									type='text'
									id='name'
									name='name'
									value={formData.name}
									onChange={handleInputChange}
									placeholder={
										contactData.form.namePlaceholder
									}
									className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
										errors.name
											? 'border-red-300 focus:border-red-500 focus:ring-red-500'
											: 'border-gray-300'
									}`}
									disabled={formStatus === 'submitting'}
								/>
								{errors.name && (
									<p className='mt-1 text-sm text-red-600'>
										{errors.name}
									</p>
								)}
							</div>

							{/* Email */}
							<div>
								<label
									htmlFor='email'
									className='block text-sm font-medium text-gray-700 mb-1'>
									{contactData.form.emailLabel}
								</label>
								<input
									type='email'
									id='email'
									name='email'
									value={formData.email}
									onChange={handleInputChange}
									placeholder={
										contactData.form.emailPlaceholder
									}
									className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
										errors.email
											? 'border-red-300 focus:border-red-500 focus:ring-red-500'
											: 'border-gray-300'
									}`}
									disabled={formStatus === 'submitting'}
								/>
								{errors.email && (
									<p className='mt-1 text-sm text-red-600'>
										{errors.email}
									</p>
								)}
							</div>

							{/* Sujet */}
							<div>
								<label
									htmlFor='subject'
									className='block text-sm font-medium text-gray-700 mb-1'>
									{contactData.form.subjectLabel}
								</label>
								<select
									id='subject'
									name='subject'
									value={formData.subject}
									onChange={handleInputChange}
									className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
										errors.subject
											? 'border-red-300 focus:border-red-500 focus:ring-red-500'
											: 'border-gray-300'
									}`}
									disabled={formStatus === 'submitting'}>
									{contactData.form.subjectOptions.map(
										(option) => (
											<option
												key={option.value}
												value={option.value}>
												{option.label}
											</option>
										)
									)}
								</select>
								{errors.subject && (
									<p className='mt-1 text-sm text-red-600'>
										{errors.subject}
									</p>
								)}
							</div>

							{/* Message */}
							<div>
								<label
									htmlFor='message'
									className='block text-sm font-medium text-gray-700 mb-1'>
									{contactData.form.messageLabel}
								</label>
								<textarea
									id='message'
									name='message'
									value={formData.message}
									onChange={handleInputChange}
									placeholder={
										contactData.form.messagePlaceholder
									}
									rows={6}
									className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
										errors.message
											? 'border-red-300 focus:border-red-500 focus:ring-red-500'
											: 'border-gray-300'
									}`}
									disabled={formStatus === 'submitting'}
								/>
								{errors.message && (
									<p className='mt-1 text-sm text-red-600'>
										{errors.message}
									</p>
								)}
							</div>

							{/* GDPR */}
							<div className='text-sm text-gray-500'>
								{contactData.form.gdprText}{' '}
								<Link
									href='/privacy'
									className='text-indigo-600 hover:text-indigo-800'>
									Politique de confidentialité
								</Link>
							</div>

							{/* Bouton d'envoi */}
							<div>
								<button
									type='submit'
									className='w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors flex items-center justify-center'
									disabled={formStatus === 'submitting'}>
									{formStatus === 'submitting' ? (
										<>
											<svg
												className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
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
											Envoi en cours...
										</>
									) : (
										contactData.form.buttonText
									)}
								</button>
							</div>
						</form>
					</motion.div>

					{/* Infos de contact */}
					<motion.div
						variants={itemVariants}
						className='lg:col-span-2 bg-white rounded-xl shadow-sm p-8'>
						<h2 className='text-2xl font-bold text-gray-900 mb-6'>
							{contactData.contactInfo.title}
						</h2>
						<div className='space-y-6'>
							{/* Email */}
							<div className='flex'>
								<div className='flex-shrink-0'>
									<div className='h-12 w-12 rounded-md bg-indigo-100 flex items-center justify-center'>
										<svg
											className='h-6 w-6 text-indigo-600'
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
									</div>
								</div>
								<div className='ml-4'>
									<h3 className='text-lg font-medium text-gray-900'>
										{contactData.contactInfo.email.label}
									</h3>
									<p className='text-gray-600 mb-1'>
										{
											contactData.contactInfo.email
												.description
										}
									</p>
									<a
										href={`mailto:${contactData.contactInfo.email.value}`}
										className='text-indigo-600 hover:text-indigo-800 font-medium'>
										{contactData.contactInfo.email.value}
									</a>
								</div>
							</div>

							{/* Téléphone */}
							<div className='flex'>
								<div className='flex-shrink-0'>
									<div className='h-12 w-12 rounded-md bg-indigo-100 flex items-center justify-center'>
										<svg
											className='h-6 w-6 text-indigo-600'
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
									</div>
								</div>
								<div className='ml-4'>
									<h3 className='text-lg font-medium text-gray-900'>
										{contactData.contactInfo.phone.label}
									</h3>
									<p className='text-gray-600 mb-1'>
										{
											contactData.contactInfo.phone
												.description
										}
									</p>
									<a
										href={`tel:${contactData.contactInfo.phone.value.replace(
											/\s/g,
											''
										)}`}
										className='text-indigo-600 hover:text-indigo-800 font-medium'>
										{contactData.contactInfo.phone.value}
									</a>
								</div>
							</div>

							{/* Adresse */}
							<div className='flex'>
								<div className='flex-shrink-0'>
									<div className='h-12 w-12 rounded-md bg-indigo-100 flex items-center justify-center'>
										<svg
											className='h-6 w-6 text-indigo-600'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
											/>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
											/>
										</svg>
									</div>
								</div>
								<div className='ml-4'>
									<h3 className='text-lg font-medium text-gray-900'>
										{contactData.contactInfo.address.label}
									</h3>
									<p className='text-gray-600 mb-1'>
										{
											contactData.contactInfo.address
												.description
										}
									</p>
									<address className='not-italic text-indigo-600 font-medium'>
										{contactData.contactInfo.address.value}
									</address>
								</div>
							</div>

							{/* Réseaux sociaux */}
							<div className='mt-8'>
								<h3 className='text-lg font-medium text-gray-900 mb-4'>
									{contactData.socialMedia.title}
								</h3>
								<div className='flex space-x-4'>
									{contactData.socialMedia.networks.map(
										(network) => (
											<a
												key={network.name}
												href={network.url}
												target='_blank'
												rel='noopener noreferrer'
												className='text-gray-600 hover:text-indigo-600 transition-colors'>
												<span className='sr-only'>
													{network.name}
												</span>
												{renderSocialIcon(network.icon)}
											</a>
										)
									)}
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>

				{/* FAQ section */}
				<motion.div
					variants={itemVariants}
					className='mt-16 bg-white rounded-xl shadow-sm p-8'>
					<h2 className='text-2xl font-bold text-gray-900 mb-6'>
						{contactData.faq.title}
					</h2>
					<div className='space-y-4'>
						{contactData.faq.items.map((item, index) => (
							<div
								key={index}
								className='border-b border-gray-200 pb-4 last:border-b-0 last:pb-0'>
								<button
									onClick={() => toggleFaq(index)}
									className='w-full flex justify-between items-center py-2 text-left focus:outline-none focus:ring-indigo-500'>
									<h3 className='text-lg font-medium text-gray-900'>
										{item.question}
									</h3>
									<svg
										className={`h-5 w-5 text-indigo-500 transition-transform ${
											openFaqIndex === index
												? 'transform rotate-180'
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
								{openFaqIndex === index && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{
											opacity: 1,
											height: 'auto',
										}}
										exit={{ opacity: 0, height: 0 }}
										transition={{
											duration: 0.3,
											ease: 'easeInOut',
										}}
										className='mt-2 text-gray-600 prose prose-indigo max-w-none'>
										<p>{item.answer}</p>
									</motion.div>
								)}
							</div>
						))}
					</div>
				</motion.div>

				{/* Carte */}
				<motion.div
					variants={itemVariants}
					className='mt-16 bg-white rounded-xl shadow-sm p-8'>
					<h2 className='text-2xl font-bold text-gray-900 mb-6'>
						{contactData.map.title}
					</h2>
					<div className='h-96 rounded-lg overflow-hidden'>
						<iframe
							src={contactData.map.embedUrl}
							width='100%'
							height='100%'
							style={{ border: 0 }}
							allowFullScreen={false}
							loading='lazy'
							title='Notre localisation'
							className='contact-map'
						/>
					</div>
					<p className='mt-4 text-gray-600 text-center'>
						{contactData.map.address}
					</p>
				</motion.div>
			</div>

			{/* CTA finale */}
			<div className='bg-indigo-600 py-12 mt-16'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<h2 className='text-2xl font-bold text-white mb-4'>
						Prêt à découvrir nos produits sélectionnés ?
					</h2>
					<p className='text-indigo-100 mb-8 max-w-3xl mx-auto'>
						Explorez notre collection unique de produits
						soigneusement choisis pour leur qualité exceptionnelle.
					</p>
					<Link
						href='/products'
						className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white'>
						Voir nos produits
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
			<div className='fixed bottom-8 right-8 z-30'>
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
