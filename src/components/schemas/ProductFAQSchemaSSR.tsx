// Schéma FAQ dynamique pour les pages produits
// Génère des FAQ pertinentes basées sur les caractéristiques du produit

import { WooProduct } from '@/lib/woo';

interface ProductFAQSchemaSSRProps {
	product: WooProduct;
}

// Génère des FAQ dynamiques basées sur le produit
function generateProductFAQs(product: WooProduct) {
	const faqs: { question: string; answer: string }[] = [];
	const productName = product.name;
	const price = product.on_sale && product.sale_price ? product.sale_price : product.price;

	// FAQ sur la livraison (toujours pertinente)
	faqs.push({
		question: `Quels sont les délais de livraison pour ${productName} ?`,
		answer: `La livraison de ${productName} est gratuite en France métropolitaine. Comptez 2 à 5 jours ouvrés pour recevoir votre commande. Nous préparons et expédions votre colis sous 24 à 48h.`
	});

	// FAQ sur le retour
	faqs.push({
		question: `Puis-je retourner ${productName} si je ne suis pas satisfait ?`,
		answer: `Oui, vous disposez de 14 jours après réception pour retourner ${productName}. Le retour est gratuit et vous serez remboursé intégralement dès réception du produit en bon état.`
	});

	// FAQ sur le prix si en promo
	if (product.on_sale && product.sale_price && product.regular_price) {
		const discount = Math.round((1 - parseFloat(product.sale_price) / parseFloat(product.regular_price)) * 100);
		faqs.push({
			question: `Pourquoi ${productName} est-il en promotion ?`,
			answer: `${productName} bénéficie actuellement d'une réduction de ${discount}% (${product.sale_price}€ au lieu de ${product.regular_price}€). Cette promotion est valable dans la limite des stocks disponibles.`
		});
	}

	// FAQ sur la disponibilité
	if (product.stock_status === 'instock') {
		faqs.push({
			question: `${productName} est-il disponible immédiatement ?`,
			answer: `Oui, ${productName} est actuellement en stock et disponible pour expédition immédiate. Commandez aujourd'hui et recevez-le sous 2 à 5 jours.`
		});
	} else if (product.stock_status === 'onbackorder') {
		faqs.push({
			question: `Quand ${productName} sera-t-il disponible ?`,
			answer: `${productName} est actuellement sur commande. Vous pouvez le commander dès maintenant et il sera expédié dès sa disponibilité. Nous vous tiendrons informé par email.`
		});
	}

	// FAQ sur la qualité (toujours pertinente pour Selectura)
	faqs.push({
		question: `Comment est garantie la qualité de ${productName} ?`,
		answer: `Chez Selectura, chaque produit est rigoureusement sélectionné selon nos critères de qualité. ${productName} a été testé et validé par notre équipe avant d'être proposé. Nous garantissons sa qualité et son authenticité.`
	});

	// FAQ sur le paiement
	faqs.push({
		question: `Quels modes de paiement acceptez-vous pour ${productName} ?`,
		answer: `Vous pouvez régler ${productName} (${price}€) par carte bancaire (Visa, Mastercard) ou PayPal. Tous nos paiements sont 100% sécurisés avec cryptage SSL et 3D Secure.`
	});

	// FAQ spécifique catégorie si disponible
	if (product.categories && product.categories.length > 0) {
		const categoryName = product.categories[0].name;
		faqs.push({
			question: `Proposez-vous d'autres produits similaires à ${productName} ?`,
			answer: `Oui, découvrez notre collection complète dans la catégorie ${categoryName}. Nous proposons une sélection curatée de produits premium de qualité similaire.`
		});
	}

	return faqs;
}

export default function ProductFAQSchemaSSR({ product }: ProductFAQSchemaSSRProps) {
	const faqs = generateProductFAQs(product);

	const faqSchema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		'mainEntity': faqs.map(faq => ({
			'@type': 'Question',
			'name': faq.question,
			'acceptedAnswer': {
				'@type': 'Answer',
				'text': faq.answer,
			},
		})),
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
		/>
	);
}

// Export des FAQ pour utilisation dans le composant visuel
export { generateProductFAQs };
