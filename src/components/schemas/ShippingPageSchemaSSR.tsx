// Schéma pour la page Livraison - Améliore le score Google Merchant Center
// Ce composant est rendu côté serveur pour être visible par les crawlers

export default function ShippingPageSchemaSSR() {
	const shippingSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': 'https://selectura.co/shipping#webpage',
		'name': 'Politique de Livraison | Selectura',
		'description': 'Consultez nos conditions de livraison, délais et frais. Livraison gratuite dès 50€ en France.',
		'url': 'https://selectura.co/shipping',
		'isPartOf': {
			'@type': 'WebSite',
			'@id': 'https://selectura.co#website',
			'name': 'Selectura',
			'url': 'https://selectura.co',
		},
		'about': {
			'@type': 'OfferShippingDetails',
			'@id': 'https://selectura.co/shipping#details',
			'shippingRate': {
				'@type': 'MonetaryAmount',
				'value': '4.90',
				'currency': 'EUR',
			},
			'shippingDestination': [
				{
					'@type': 'DefinedRegion',
					'addressCountry': 'FR',
					'name': 'France métropolitaine',
				},
				{
					'@type': 'DefinedRegion',
					'addressCountry': ['BE', 'DE', 'ES', 'IT', 'NL', 'PT', 'AT', 'LU', 'CH'],
					'name': 'Union Européenne',
				},
			],
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
				'businessDays': {
					'@type': 'OpeningHoursSpecification',
					'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
				},
			},
		},
		'mainEntity': {
			'@type': 'FAQPage',
			'mainEntity': [
				{
					'@type': 'Question',
					'name': 'Quels sont les délais de livraison en France ?',
					'acceptedAnswer': {
						'@type': 'Answer',
						'text': 'Livraison standard en 2-3 jours ouvrables. Livraison express en 24h (commande avant 14h).',
					},
				},
				{
					'@type': 'Question',
					'name': 'Combien coûte la livraison ?',
					'acceptedAnswer': {
						'@type': 'Answer',
						'text': 'Livraison standard à 4,90€. Livraison gratuite pour toute commande supérieure à 50€ en France métropolitaine.',
					},
				},
				{
					'@type': 'Question',
					'name': 'Livrez-vous en Europe ?',
					'acceptedAnswer': {
						'@type': 'Answer',
						'text': 'Oui, nous livrons dans toute l\'Union Européenne. Livraison standard à 9,90€, délai de 3-5 jours ouvrables.',
					},
				},
			],
		},
	};

	// Schéma de tarification pour Google
	const shippingRatesSchema = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		'@id': 'https://selectura.co/shipping#rates',
		'name': 'Tarifs de livraison Selectura',
		'itemListElement': [
			{
				'@type': 'ListItem',
				'position': 1,
				'item': {
					'@type': 'OfferShippingDetails',
					'name': 'Livraison Standard France',
					'shippingRate': {
						'@type': 'MonetaryAmount',
						'value': '4.90',
						'currency': 'EUR',
					},
					'shippingDestination': {
						'@type': 'DefinedRegion',
						'addressCountry': 'FR',
					},
					'deliveryTime': {
						'@type': 'ShippingDeliveryTime',
						'transitTime': {
							'@type': 'QuantitativeValue',
							'minValue': 2,
							'maxValue': 3,
							'unitCode': 'DAY',
						},
					},
				},
			},
			{
				'@type': 'ListItem',
				'position': 2,
				'item': {
					'@type': 'OfferShippingDetails',
					'name': 'Livraison Express France',
					'shippingRate': {
						'@type': 'MonetaryAmount',
						'value': '9.90',
						'currency': 'EUR',
					},
					'shippingDestination': {
						'@type': 'DefinedRegion',
						'addressCountry': 'FR',
					},
					'deliveryTime': {
						'@type': 'ShippingDeliveryTime',
						'transitTime': {
							'@type': 'QuantitativeValue',
							'minValue': 1,
							'maxValue': 1,
							'unitCode': 'DAY',
						},
					},
				},
			},
			{
				'@type': 'ListItem',
				'position': 3,
				'item': {
					'@type': 'OfferShippingDetails',
					'name': 'Point Relais France',
					'shippingRate': {
						'@type': 'MonetaryAmount',
						'value': '3.90',
						'currency': 'EUR',
					},
					'shippingDestination': {
						'@type': 'DefinedRegion',
						'addressCountry': 'FR',
					},
					'deliveryTime': {
						'@type': 'ShippingDeliveryTime',
						'transitTime': {
							'@type': 'QuantitativeValue',
							'minValue': 2,
							'maxValue': 4,
							'unitCode': 'DAY',
						},
					},
				},
			},
			{
				'@type': 'ListItem',
				'position': 4,
				'item': {
					'@type': 'OfferShippingDetails',
					'name': 'Livraison Standard Europe',
					'shippingRate': {
						'@type': 'MonetaryAmount',
						'value': '9.90',
						'currency': 'EUR',
					},
					'shippingDestination': {
						'@type': 'DefinedRegion',
						'addressCountry': ['BE', 'DE', 'ES', 'IT', 'NL', 'PT', 'AT', 'LU', 'CH'],
					},
					'deliveryTime': {
						'@type': 'ShippingDeliveryTime',
						'transitTime': {
							'@type': 'QuantitativeValue',
							'minValue': 3,
							'maxValue': 5,
							'unitCode': 'DAY',
						},
					},
				},
			},
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(shippingSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(shippingRatesSchema) }}
			/>
		</>
	);
}
