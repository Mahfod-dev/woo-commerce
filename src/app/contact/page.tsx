// app/contact/page.tsx
import { Suspense } from 'react';
import ContactContent from '@/components/ContactContent';
import '../styles/contact.css';

// Métadonnées pour le SEO
export const metadata = {
	title: 'Contactez-nous | Votre Boutique',
	description:
		'Nous sommes là pour vous aider. Contactez notre équipe pour toute question concernant nos produits, vos commandes ou nos services.',
	keywords:
		'contact, service client, support, aide, questions, boutique en ligne',
};

// Composant de chargement pour Suspense
function ContactLoading() {
	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
			<div className='animate-pulse mb-12'>
				<div className='h-10 bg-gray-200 max-w-md mb-4 rounded'></div>
				<div className='h-4 bg-gray-200 max-w-xl rounded'></div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
				<div className='animate-pulse space-y-4'>
					<div className='h-6 bg-gray-200 w-1/2 rounded'></div>
					<div className='h-10 bg-gray-200 rounded'></div>
					<div className='h-10 bg-gray-200 rounded'></div>
					<div className='h-10 bg-gray-200 rounded'></div>
					<div className='h-32 bg-gray-200 rounded'></div>
					<div className='h-12 bg-gray-200 w-1/3 rounded'></div>
				</div>

				<div className='animate-pulse space-y-4 bg-gray-100 p-6 rounded-lg'>
					<div className='h-6 bg-gray-200 w-1/2 rounded'></div>
					<div className='space-y-2'>
						<div className='h-5 bg-gray-200 rounded'></div>
						<div className='h-5 bg-gray-200 rounded'></div>
					</div>
					<div className='h-6 bg-gray-200 w-1/2 rounded mt-8'></div>
					<div className='space-y-2'>
						<div className='h-5 bg-gray-200 rounded'></div>
						<div className='h-5 bg-gray-200 rounded'></div>
					</div>
					<div className='h-6 bg-gray-200 w-1/2 rounded mt-8'></div>
					<div className='h-5 bg-gray-200 rounded'></div>
					<div className='h-5 bg-gray-200 rounded w-3/4'></div>
				</div>
			</div>
		</div>
	);
}

// Données pour la page de contact
const contactData = {
	heroSection: {
		title: 'Contactez-nous',
		description:
			'Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans votre expérience.',
	},
	form: {
		title: 'Envoyez-nous un message',
		nameLabel: 'Votre nom',
		namePlaceholder: 'Prénom et Nom',
		emailLabel: 'Votre email',
		emailPlaceholder: 'exemple@email.com',
		subjectLabel: 'Sujet',
		subjectOptions: [
			{ value: 'question', label: 'Question sur un produit' },
			{ value: 'order', label: 'Suivi de commande' },
			{ value: 'return', label: 'Retour ou remboursement' },
			{ value: 'suggestion', label: 'Suggestion' },
			{ value: 'other', label: 'Autre' },
		],
		messageLabel: 'Votre message',
		messagePlaceholder: 'Comment pouvons-nous vous aider ?',
		buttonText: 'Envoyer',
		successMessage: 'Votre message a été envoyé avec succès.',
		errorMessage:
			"Une erreur s'est produite lors de l'envoi. Veuillez réessayer.",
		gdprText:
			'En soumettant ce formulaire, vous acceptez notre politique de confidentialité et le traitement de vos données pour le suivi de votre demande.',
	},
	contactInfo: {
		title: 'Nos coordonnées',
		email: {
			label: 'Email',
			value: 'support@flowcontent.io',
			description: 'Nous répondons généralement sous 24h ouvrées',
		},
		phone: {
			label: 'Téléphone',
			value: '+19136759287',
			description: 'Lun-Ven, 9h-18h',
		},
		address: {
			label: 'Adresse',
			value: '254 rue Vendôme Lyon 003',
			description: 'Showroom ouvert sur rendez-vous uniquement',
		},
	},
	faq: {
		title: 'Questions fréquentes',
		items: [
			{
				question: 'Quel est le délai de livraison ?',
				answer: "Nos délais de livraison sont généralement de 2-3 jours ouvrés pour la France métropolitaine et 5-7 jours pour l'international. Vous recevrez un email de confirmation avec un numéro de suivi dès l'expédition de votre commande.",
			},
			{
				question: 'Comment faire un retour ?',
				answer: 'Vous disposez de 14 jours à compter de la réception pour retourner un produit. Rendez-vous dans votre espace client ou contactez-nous directement pour initier le processus de retour. Nous vous enverrons une étiquette de retour prépayée.',
			},
			{
				question:
					'Les accessoires sont-ils compatibles avec tous vos produits ?',
				answer: "Nos accessoires sont conçus spécifiquement pour nos produits et leur compatibilité est clairement indiquée sur chaque fiche produit. Si vous avez un doute, n'hésitez pas à nous contacter avant votre achat.",
			},
		],
	},
	socialMedia: {
		title: 'Suivez-nous',
		networks: [
			{
				name: 'Instagram',
				url: 'https://instagram.com/votreboutique',
				icon: 'instagram',
			},
			{
				name: 'LinkedIn',
				url: 'https://linkedin.com/company/votreboutique',
				icon: 'linkedin',
			},
			{
				name: 'Facebook',
				url: 'https://facebook.com/votreboutique',
				icon: 'facebook',
			},
		],
	},
	map: {
		title: 'Nous trouver',
		address: '254 rue Vendôme Lyon 69003',
		embedUrl:
			'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2783.0876656555713!2d4.8299631!3d45.7578137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f4ea56197f0eb3%3A0x6186a4c0b373d4d2!2sLyon%2C%20France!5e0!3m2!1sen!2sus!4v1651270228267!5m2!1sen!2sus',
	},
};

export default function ContactPage() {
	return (
		<Suspense fallback={<ContactLoading />}>
			<ContactContent contactData={contactData} />
		</Suspense>
	);
}
