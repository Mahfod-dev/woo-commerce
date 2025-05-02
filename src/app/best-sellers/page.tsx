// app/best-sellers/page.tsx
import { Suspense } from 'react';
import BestSellersContent from '@/components/BestSellersContent';
import '../styles/bestsellers.css';

// Métadonnées pour le SEO
export const metadata = {
	title: 'Produits Best-Sellers | Votre Boutique',
	description:
		'Découvrez notre sélection de produits best-sellers, choisis avec soin et plébiscités par nos clients pour leur qualité exceptionnelle.',
	keywords:
		'best-sellers, produits populaires, top ventes, produits premium, sélection, qualité',
};

// Composant de chargement pour Suspense
function BestSellersLoading() {
	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
			<div className='animate-pulse mb-12'>
				<div className='h-10 bg-gray-200 max-w-md mb-4 rounded'></div>
				<div className='h-4 bg-gray-200 max-w-xl rounded'></div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className='bg-white rounded-lg shadow-sm overflow-hidden animate-pulse'>
						<div className='bg-gray-200 h-64 w-full'></div>
						<div className='p-4 space-y-3'>
							<div className='h-4 bg-gray-200 rounded w-1/4'></div>
							<div className='h-6 bg-gray-200 rounded w-3/4'></div>
							<div className='flex items-center space-x-2'>
								<div className='h-6 bg-gray-200 rounded w-1/4'></div>
								<div className='h-4 bg-gray-200 rounded w-1/5'></div>
							</div>
							<div className='h-10 bg-gray-200 rounded w-full'></div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default async function BestSellersPage() {
	// Dans une implémentation réelle, ces données proviendraient d'une API
	// Pour l'instant, nous utilisons des données statiques pour l'exemple
	const bestSellersData = {
		heroSection: {
			title: 'Nos produits best-sellers',
			description:
				'Découvrez les produits les plus appréciés de notre collection, sélectionnés avec soin et plébiscités par nos clients.',
		},
		categories: [
			{
				id: 'tech',
				name: 'Tech & Accessoires',
				description:
					'Nos produits technologiques les plus populaires, conçus pour durer et offrir une expérience utilisateur exceptionnelle.',
				products: [
					{
						id: 1,
						name: 'Écouteurs Premium XS-700',
						description:
							'Ces écouteurs sans fil offrent une qualité sonore exceptionnelle avec réduction de bruit active et une autonomie de 30 heures.',
						price: '199.00',
						sale_price: '179.00',
						regular_price: '199.00',
						rating: 4.8,
						reviews: 124,
						image: '/img/bestsellers/headphones-premium.jpg',
						badge: 'Top vente',
						badgeColor: 'bg-indigo-600',
						slug: 'ecouteurs-premium-xs-700',
						featured: true,
						on_sale: true,
						stock_status: 'instock',
						categories: [{ id: 1, name: 'Audio' }],
					},
					{
						id: 2,
						name: 'Support de Téléphone Ergonomique',
						description:
							'Support ajustable en aluminium brossé, compatible avec tous les smartphones et petites tablettes.',
						price: '49.00',
						regular_price: '49.00',
						rating: 4.7,
						reviews: 89,
						image: '/img/bestsellers/phone-stand.jpg',
						badge: 'Exclusif',
						badgeColor: 'bg-purple-600',
						slug: 'support-telephone-ergonomique',
						featured: true,
						on_sale: false,
						stock_status: 'instock',
						categories: [{ id: 2, name: 'Accessoires' }],
					},
				],
			},
			{
				id: 'home',
				name: 'Maison & Décoration',
				description:
					'Des objets de décoration et accessoires pour la maison alliant esthétique et fonctionnalité.',
				products: [
					{
						id: 3,
						name: 'Lampe de Bureau Design',
						description:
							'Lampe de bureau à intensité variable avec port USB intégré et design épuré en métal brossé.',
						price: '129.00',
						sale_price: '99.00',
						regular_price: '129.00',
						rating: 4.9,
						reviews: 76,
						image: '/img/bestsellers/desk-lamp.jpg',
						badge: 'Promo',
						badgeColor: 'bg-red-500',
						slug: 'lampe-bureau-design',
						featured: true,
						on_sale: true,
						stock_status: 'instock',
						categories: [{ id: 3, name: 'Éclairage' }],
					},
					{
						id: 4,
						name: 'Carafe Filtrante Premium',
						description:
							'Carafe en verre avec filtre longue durée pour une eau pure et délicieuse à tout moment.',
						price: '79.00',
						regular_price: '79.00',
						rating: 4.6,
						reviews: 52,
						image: '/img/bestsellers/water-carafe.jpg',
						badge: 'Populaire',
						badgeColor: 'bg-green-500',
						slug: 'carafe-filtrante-premium',
						featured: false,
						on_sale: false,
						stock_status: 'instock',
						categories: [{ id: 4, name: 'Cuisine' }],
					},
				],
			},
			{
				id: 'lifestyle',
				name: 'Lifestyle & Bien-être',
				description:
					'Des produits pour améliorer votre quotidien et favoriser un mode de vie équilibré.',
				products: [
					{
						id: 5,
						name: 'Carnet Premium Édition Limitée',
						description:
							'Carnet A5 en cuir véritable avec papier premium sans acide, parfait pour vos notes et croquis.',
						price: '69.00',
						regular_price: '69.00',
						rating: 4.9,
						reviews: 43,
						image: '/img/bestsellers/premium-notebook.jpg',
						badge: 'Édition limitée',
						badgeColor: 'bg-amber-600',
						slug: 'carnet-premium-edition-limitee',
						featured: true,
						on_sale: false,
						stock_status: 'instock',
						categories: [{ id: 5, name: 'Papeterie' }],
					},
					{
						id: 6,
						name: "Diffuseur d'Huiles Essentielles",
						description:
							"Diffuseur ultra-silencieux avec réservoir de 300ml et 7 options d'éclairage pour une ambiance zen.",
						price: '89.00',
						sale_price: '69.00',
						regular_price: '89.00',
						rating: 4.7,
						reviews: 67,
						image: '/img/bestsellers/essential-oil-diffuser.jpg',
						badge: 'Bien-être',
						badgeColor: 'bg-teal-600',
						slug: 'diffuseur-huiles-essentielles',
						featured: false,
						on_sale: true,
						stock_status: 'instock',
						categories: [{ id: 6, name: 'Bien-être' }],
					},
				],
			},
		],
		testimonials: [
			{
				id: 1,
				content:
					"J'utilise les écouteurs XS-700 tous les jours depuis 6 mois et ils sont toujours aussi performants. Le meilleur achat tech que j'ai fait cette année!",
				author: 'Mathieu D.',
				role: 'Client fidèle',
				image: '/img/testimonials/person1.jpg',
			},
			{
				id: 2,
				content:
					"La lampe de bureau a complètement transformé mon espace de travail. Le port USB est super pratique et la qualité de l'éclairage est parfaite.",
				author: 'Sophie L.',
				role: "Designer d'intérieur",
				image: '/img/testimonials/person2.jpg',
			},
			{
				id: 3,
				content:
					"Le carnet premium est un vrai bijou. Les pages sont d'une qualité exceptionnelle et la reliure en cuir lui donne une élégance incomparable.",
				author: 'Thomas B.',
				role: 'Entrepreneur',
				image: '/img/testimonials/person3.jpg',
			},
		],
		features: [
			{
				icon: 'quality',
				title: 'Sélection rigoureuse',
				description:
					'Chaque produit best-seller a passé nos tests de qualité exigeants et a été validé par des milliers de clients.',
			},
			{
				icon: 'delivery',
				title: 'Expédition rapide',
				description:
					'Tous nos best-sellers sont en stock et expédiés sous 24h pour que vous puissiez en profiter rapidement.',
			},
			{
				icon: 'guarantee',
				title: 'Garantie étendue',
				description:
					"Nos produits best-sellers bénéficient d'une garantie de 3 ans, preuve de notre confiance dans leur durabilité.",
			},
			{
				icon: 'support',
				title: 'Support prioritaire',
				description:
					"En achetant un best-seller, vous bénéficiez d'un accès prioritaire à notre service client dédié.",
			},
		],
		stats: {
			title: 'Pourquoi nos best-sellers sont différents',
			description:
				'Des produits qui ont fait leurs preuves et qui continuent de séduire nos clients grâce à leur qualité exceptionnelle.',
			items: [
				{ value: '98%', label: 'Taux de satisfaction client' },
				{ value: '10k+', label: 'Produits vendus chaque mois' },
				{ value: '<1%', label: 'Taux de retour' },
				{
					value: '3 ans',
					label: 'Garantie étendue sur tous les best-sellers',
				},
			],
		},
		faq: {
			title: 'Questions fréquentes sur nos best-sellers',
			questions: [
				{
					question:
						"Comment définissez-vous qu'un produit est un best-seller?",
					answer: "Nos best-sellers sont déterminés sur la base de plusieurs critères: volume de ventes sur une période d'au moins 6 mois, retours clients avec une note moyenne supérieure à 4,5/5, et taux de recommandation élevé. C'est cette combinaison de popularité et de satisfaction client qui fait d'un produit un véritable best-seller.",
				},
				{
					question:
						'Les produits best-sellers sont-ils toujours disponibles en stock?',
					answer: "Oui, nous maintenons en permanence un stock dédié pour nos best-sellers afin d'assurer leur disponibilité immédiate. C'est pourquoi nous garantissons une expédition sous 24h pour ces produits.",
				},
				{
					question:
						'La garantie étendue de 3 ans est-elle automatique?',
					answer: 'Absolument, tous nos produits best-sellers bénéficient automatiquement de la garantie étendue de 3 ans, sans démarche supplémentaire de votre part. Cette garantie couvre tout défaut de fabrication et vous assure un remplacement ou une réparation gratuite.',
				},
			],
		},
	};

	return (
		<Suspense fallback={<BestSellersLoading />}>
			<BestSellersContent bestSellersData={bestSellersData} />
		</Suspense>
	);
}
