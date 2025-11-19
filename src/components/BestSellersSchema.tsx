'use client';

import { useEffect } from 'react';

// Types pour les produits
interface Product {
	id: number;
	name: string;
	description: string;
	price: string;
	sale_price?: string;
	regular_price: string;
	rating: number;
	reviews: number;
	image: string;
	badge: string;
	badgeColor: string;
	slug: string;
	featured: boolean;
	on_sale: boolean;
	stock_status: string;
	categories: { id: number; name: string }[];
}

interface BestSellersSchemaProps {
	organizationName: string;
	url: string;
	products: Product[];
}

export default function BestSellersSchema({
	organizationName,
	url,
	products,
}: BestSellersSchemaProps) {
	useEffect(() => {
		// Création du schéma JSON-LD pour la page des best-sellers
		const bestSellersSchema = {
			'@context': 'https://schema.org',
			'@type': 'CollectionPage',
			name: 'Produits Best-Sellers - ' + organizationName,
			description:
				'Découvrez notre sélection de produits best-sellers, choisis avec soin et plébiscités par nos clients pour leur qualité exceptionnelle.',
			url: url,
			mainEntity: {
				'@type': 'ItemList',
				itemListElement: products.map((product, index) => ({
					'@type': 'ListItem',
					position: index + 1,
					item: {
						'@type': 'Product',
						name: product.name,
						description: product.description,
						image: product.image,
						url: `${url.split('/best-sellers')[0]}/products/${
							product.slug
						}`,
						brand: {
							'@type': 'Brand',
							name: organizationName,
						},
						offers: {
							'@type': 'Offer',
							price: product.sale_price || product.price,
							priceCurrency: 'EUR',
							availability:
								product.stock_status === 'instock'
									? 'https://schema.org/InStock'
									: 'https://schema.org/OutOfStock',
							hasMerchantReturnPolicy: {
								'@type': 'MerchantReturnPolicy',
								'applicableCountry': 'FR',
								'returnPolicyCategory': 'https://schema.org/MerchantReturnFiniteReturnWindow',
								'merchantReturnDays': 14,
								'returnMethod': 'https://schema.org/ReturnByMail',
								'returnFees': 'https://schema.org/FreeReturn',
							},
							shippingDetails: {
								'@type': 'OfferShippingDetails',
								'shippingRate': {
									'@type': 'MonetaryAmount',
									'value': '0',
									'currency': 'EUR',
								},
								'shippingDestination': {
									'@type': 'DefinedRegion',
									'addressCountry': 'FR',
								},
								'deliveryTime': {
									'@type': 'ShippingDeliveryTime',
									'handlingTime': {
										'@type': 'QuantitativeValue',
										'minValue': 0,
										'maxValue': 1,
										'unitCode': 'DAY',
									},
									'transitTime': {
										'@type': 'QuantitativeValue',
										'minValue': 2,
										'maxValue': 5,
										'unitCode': 'DAY',
									},
								},
							},
						},
						aggregateRating: {
							'@type': 'AggregateRating',
							ratingValue: product.rating,
							reviewCount: product.reviews,
						},
					},
				})),
			},
		};

		// Ajout du schéma à la page
		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.text = JSON.stringify(bestSellersSchema);
		document.head.appendChild(script);

		// Nettoyage lors du démontage du composant
		return () => {
			document.head.removeChild(script);
		};
	}, [organizationName, url, products]);

	// Ce composant ne rend rien à l'écran
	return null;
}
