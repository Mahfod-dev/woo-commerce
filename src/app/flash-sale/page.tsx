// app/flash-sale/page.tsx
import { Suspense } from 'react';
import FlashSaleContent from '@/components/FlashSaleContent';
import '../styles/flash-sale.css'; // Fichier de style dédié
import { getSaleProducts } from '@/lib/woo';
import { WooProduct } from '@/lib/woo';

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

// Informations statiques de la vente flash
const flashSaleStaticData = {
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

// Fonction pour calculer le pourcentage de réduction
function calculateDiscountPercentage(regularPrice: string, salePrice: string): number {
	const regular = parseFloat(regularPrice);
	const sale = parseFloat(salePrice);
	
	if (isNaN(regular) || isNaN(sale) || regular <= 0 || sale <= 0) {
		return 0;
	}
	
	return Math.round(((regular - sale) / regular) * 100);
}

// Fonction pour assigner des badges et couleurs en fonction des catégories et réductions
function assignBadgeAndColor(product: WooProduct, discountPercentage: number): { badge: string; badgeColor: string } {
	// Badge basé sur le pourcentage de réduction
	if (discountPercentage >= 40) {
		return { badge: 'Économie max', badgeColor: 'bg-green-600' };
	}
	if (discountPercentage >= 30) {
		return { badge: 'Offre spéciale', badgeColor: 'bg-teal-600' };
	}
	if (discountPercentage >= 20) {
		return { badge: 'Promotion', badgeColor: 'bg-blue-600' };
	}

	// Badge basé sur les catégories
	if (product.categories && product.categories.length > 0) {
		const categoryName = product.categories[0].name.toLowerCase();
		
		if (categoryName.includes('nouv')) {
			return { badge: 'Nouveau', badgeColor: 'bg-purple-600' };
		}
		if (categoryName.includes('best') || categoryName.includes('vente')) {
			return { badge: 'Bestseller', badgeColor: 'bg-yellow-500' };
		}
		if (categoryName.includes('limit') || categoryName.includes('exclus')) {
			return { badge: 'Édition Limitée', badgeColor: 'bg-amber-600' };
		}
	}
	
	// Badge par défaut
	return { badge: 'En promotion', badgeColor: 'bg-pink-600' };
}

// Fonction pour mapper les produits WooCommerce au format FlashSaleProduct
function mapWooProductsToFlashSaleProducts(products: WooProduct[]) {
	return products.map(product => {
		const discountPercentage = calculateDiscountPercentage(product.regular_price, product.sale_price);
		const { badge, badgeColor } = assignBadgeAndColor(product, discountPercentage);
		
		return {
			id: product.id,
			name: product.name,
			description: product.short_description || product.description.substring(0, 120) + '...',
			price: product.price,
			sale_price: product.sale_price,
			regular_price: product.regular_price,
			discount_percentage: discountPercentage,
			rating: parseFloat(product.average_rating) || 4.0,
			reviews: product.rating_count || Math.floor(Math.random() * 50) + 10,
			image: product.images && product.images.length > 0 ? product.images[0].src : '/img/placeholder.jpg',
			badge,
			badgeColor,
			slug: product.slug,
			featured: product.featured,
			on_sale: product.on_sale,
			stock_status: product.stock_status,
			stock_quantity: product.stock_quantity || 10,
			categories: product.categories,
		};
	});
}

export default async function FlashSalePage() {
	// Récupérer les produits en promotion à partir de l'API WooCommerce
	const saleProducts = await getSaleProducts(12); // Récupérer 12 produits en promotion
	
	// Mapper les produits WooCommerce au format attendu par FlashSaleContent
	const mappedProducts = mapWooProductsToFlashSaleProducts(saleProducts);
	
	// Créer les données complètes de la vente flash en combinant les données statiques et dynamiques
	const flashSaleData = {
		...flashSaleStaticData,
		products: mappedProducts,
	};

	return (
		<Suspense fallback={<FlashSaleLoading />}>
			<FlashSaleContent flashSaleData={flashSaleData} />
		</Suspense>
	);
}
