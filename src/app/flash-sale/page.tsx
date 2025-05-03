// app/flash-sale/page.tsx
import { Suspense } from 'react';
import FlashSaleContent from '@/components/FlashSaleContent';
import '../styles/flash-sale.css'; // Fichier de style dédié

// Métadonnées pour le SEO
export const metadata = {
	title: 'Vente Flash Exceptionnelle | Votre Boutique',
	description:
		'Profitez de notre vente flash limitée dans le temps avec des remises exclusives sur notre sélection de produits premium. Offre à durée limitée !',
	keywords:
		'vente flash, promotion, offres limitées, remises, réductions, offres exclusives, temps limité',
};

// Composant de chargement pour Suspense
function FlashSaleLoading() {
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

// Date de fin de la vente flash
const saleEndDate = new Date('2025-06-05T23:59:59');

// Produits en vente flash
const flashSaleData = {
	heroSection: {
		title: 'Vente Flash Exceptionnelle',
		subtitle: 'Offres exclusives à durée limitée',
		description:
			'Bénéficiez de remises exceptionnelles sur notre sélection de produits premium soigneusement choisis. Ces offres sont limitées dans le temps et dans les stocks disponibles.',
		endDate: saleEndDate,
	},
	saleInfo: {
		title: 'À propos de notre vente flash',
		description:
			"Notre vente flash est un événement rare où nous proposons d'importantes remises sur nos produits les plus appréciés. Fidèles à notre philosophie de qualité, nous ne faisons pas de compromis sur l'excellence des produits sélectionnés.",
		points: [
			"Remises exclusives allant jusqu'à 40% sur des produits premium",
			'Tous les produits conservent leur garantie étendue de 3 ans',
			"Stocks limités pour préserver l'exclusivité",
			'Livraison express offerte pour toute commande pendant la vente flash',
		],
	},
	products: [
		{
			id: 101,
			name: 'Écouteurs Premium XS-700 - Édition Limitée',
			description:
				'Notre best-seller dans une édition limitée avec finition exclusive et étui de rangement premium inclus.',
			price: '199.00',
			sale_price: '129.00',
			regular_price: '199.00',
			discount_percentage: 35,
			rating: 4.9,
			reviews: 189,
			image: '/img/flash-sale/headphones-limited.jpg',
			badge: 'Bestseller',
			badgeColor: 'bg-yellow-500',
			slug: 'ecouteurs-premium-xs-700-edition-limitee',
			featured: true,
			on_sale: true,
			stock_status: 'instock',
			stock_quantity: 15,
			categories: [{ id: 1, name: 'Audio' }],
		},
		{
			id: 102,
			name: 'Lampe de Bureau Design - Pack Duo',
			description:
				'Notre lampe de bureau design primée en pack duo exclusif pour créer une ambiance parfaite dans votre espace de travail.',
			price: '258.00',
			sale_price: '179.00',
			regular_price: '258.00',
			discount_percentage: 30,
			rating: 4.8,
			reviews: 76,
			image: '/img/flash-sale/desk-lamp-duo.jpg',
			badge: 'Pack exclusif',
			badgeColor: 'bg-purple-600',
			slug: 'lampe-bureau-design-pack-duo',
			featured: true,
			on_sale: true,
			stock_status: 'instock',
			stock_quantity: 8,
			categories: [{ id: 3, name: 'Éclairage' }],
		},
		{
			id: 103,
			name: 'Ensemble Premium Accessoires Tech',
			description:
				'Collection complète de nos accessoires tech les plus populaires avec finition harmonisée et rangement dédié.',
			price: '349.00',
			sale_price: '209.00',
			regular_price: '349.00',
			discount_percentage: 40,
			rating: 4.7,
			reviews: 42,
			image: '/img/flash-sale/tech-accessories-set.jpg',
			badge: 'Économie max',
			badgeColor: 'bg-green-600',
			slug: 'ensemble-premium-accessoires-tech',
			featured: false,
			on_sale: true,
			stock_status: 'instock',
			stock_quantity: 5,
			categories: [{ id: 2, name: 'Accessoires' }],
		},
		{
			id: 104,
			name: 'Carafe Filtrante Premium - Pack Familial',
			description:
				'Notre carafe filtrante avec 6 filtres inclus pour une eau pure pendant une année complète. Idéal pour toute la famille.',
			price: '159.00',
			sale_price: '99.00',
			regular_price: '159.00',
			discount_percentage: 38,
			rating: 4.9,
			reviews: 67,
			image: '/img/flash-sale/water-carafe-family.jpg',
			badge: 'Offre spéciale',
			badgeColor: 'bg-teal-600',
			slug: 'carafe-filtrante-premium-pack-familial',
			featured: true,
			on_sale: true,
			stock_status: 'instock',
			stock_quantity: 12,
			categories: [{ id: 4, name: 'Cuisine' }],
		},
		{
			id: 105,
			name: "Diffuseur d'Huiles Essentielles - Collection Bien-être",
			description:
				"Notre diffuseur silencieux accompagné d'une collection de 5 huiles essentielles exclusives pour un bien-être optimal.",
			price: '199.00',
			sale_price: '129.00',
			regular_price: '199.00',
			discount_percentage: 35,
			rating: 4.8,
			reviews: 53,
			image: '/img/flash-sale/essential-oil-collection.jpg',
			badge: 'Collection',
			badgeColor: 'bg-pink-600',
			slug: 'diffuseur-huiles-collection-bien-etre',
			featured: false,
			on_sale: true,
			stock_status: 'instock',
			stock_quantity: 7,
			categories: [{ id: 6, name: 'Bien-être' }],
		},
		{
			id: 106,
			name: 'Set Carnets Premium - Édition Limitée',
			description:
				'Collection de trois carnets en cuir véritable avec techniques de reliure différentes et papier premium sans acide.',
			price: '149.00',
			sale_price: '99.00',
			regular_price: '149.00',
			discount_percentage: 34,
			rating: 4.9,
			reviews: 38,
			image: '/img/flash-sale/premium-notebook-set.jpg',
			badge: 'Édition Spéciale',
			badgeColor: 'bg-amber-600',
			slug: 'set-carnets-premium-edition-limitee',
			featured: true,
			on_sale: true,
			stock_status: 'instock',
			stock_quantity: 9,
			categories: [{ id: 5, name: 'Papeterie' }],
		},
	],
	faqs: [
		{
			question: 'Combien de temps dure la vente flash ?',
			answer: "Notre vente flash est strictement limitée dans le temps. Elle se termine exactement à la date et l'heure indiquées sur le compteur en haut de page. Après cette échéance, les prix reviendront automatiquement à leur valeur normale et les remises ne seront plus disponibles.",
		},
		{
			question: 'Les stocks sont-ils limités ?',
			answer: "Oui, les stocks sont extrêmement limités pour cette vente flash exclusive. Chaque produit a une quantité spécifique disponible, affichée sur sa fiche. Lorsqu'un produit est épuisé, il n'est pas réapprovisionné pendant la vente flash.",
		},
		{
			question:
				'La garantie est-elle la même pour les produits en vente flash ?',
			answer: 'Absolument. Tous les produits en vente flash bénéficient exactement des mêmes garanties que nos produits à prix régulier, notamment notre garantie étendue de 3 ans. Nous ne faisons jamais de compromis sur la qualité ou le service après-vente.',
		},
		{
			question:
				"Puis-je combiner la vente flash avec d'autres promotions ?",
			answer: "Les offres de la vente flash sont déjà optimisées pour vous offrir le meilleur rapport qualité-prix possible. Elles ne sont donc pas cumulables avec d'autres codes promotionnels ou offres en cours. Cependant, la livraison express offerte s'applique automatiquement à tous les produits de la vente flash.",
		},
		{
			question: 'Comment être informé des prochaines ventes flash ?',
			answer: "Nos ventes flash sont des événements rares et exclusifs. La meilleure façon d'être informé en priorité est de vous inscrire à notre newsletter. Nos abonnés sont toujours les premiers à recevoir l'information, avec parfois un accès anticipé aux offres.",
		},
	],
	cta: {
		title: 'Ne manquez pas cette opportunité unique',
		description:
			'Ces offres exceptionnelles ne reviendront pas de sitôt. Profitez de nos remises exclusives sur des produits de qualité premium avant la fin de la vente flash.',
		buttonText: 'Découvrir tous les produits en promotion',
		buttonLink: '/products?on_sale=true',
	},
};

export default function FlashSalePage() {
	return (
		<Suspense fallback={<FlashSaleLoading />}>
			<FlashSaleContent flashSaleData={flashSaleData} />
		</Suspense>
	);
}
