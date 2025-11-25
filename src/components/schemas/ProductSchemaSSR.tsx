// Schéma Product Server-Side Rendered pour les moteurs IA et Google Merchant Center
// Ce composant est rendu côté serveur pour être visible par les crawlers

import { WooProduct } from '@/lib/woo';

interface ProductSchemaSSRProps {
	product: WooProduct;
}

export default function ProductSchemaSSR({ product }: ProductSchemaSSRProps) {
	// Nettoyer la description HTML
	const cleanDescription = product.description
		.replace(/<[^>]*>/g, '')
		.substring(0, 500);

	// Calculer le prix (utiliser sale_price si en promo, sinon price)
	const currentPrice = product.on_sale && product.sale_price
		? product.sale_price
		: product.price;

	// Préparer toutes les images du produit pour Google
	const productImages = product.images.map((img) => ({
		'@type': 'ImageObject',
		'url': img.src,
		'contentUrl': img.src,
		'name': img.alt || product.name,
	}));

	const productSchema = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		'@id': `https://selectura.co/products/${product.id}-${product.slug}#product`,
		'name': product.name,
		'description': cleanDescription,
		// Images multiples pour Google Merchant Center
		'image': product.images.map((img) => img.src),
		'photo': productImages,
		'sku': product.sku || product.id.toString(),
		'gtin': product.sku || undefined,
		'mpn': product.sku || undefined,
		'productID': product.id.toString(),
		'brand': {
			'@type': 'Brand',
			'name': 'Selectura',
			'logo': 'https://selectura.co/logo.png',
		},
		'manufacturer': {
			'@type': 'Organization',
			'name': 'Selectura',
		},
		'category': product.categories.map((cat) => cat.name).join(' > '),
		'url': `https://selectura.co/products/${product.id}-${product.slug}`,
		'mainEntityOfPage': `https://selectura.co/products/${product.id}-${product.slug}`,
		'offers': {
			'@type': 'Offer',
			'@id': `https://selectura.co/products/${product.id}-${product.slug}#offer`,
			'url': `https://selectura.co/products/${product.id}-${product.slug}`,
			'priceCurrency': 'EUR',
			'price': currentPrice,
			...(product.regular_price && product.on_sale && {
				'priceSpecification': {
					'@type': 'UnitPriceSpecification',
					'price': product.sale_price,
					'priceCurrency': 'EUR',
					'valueAddedTaxIncluded': true,
					'priceType': 'https://schema.org/SalePrice',
					'referenceQuantity': {
						'@type': 'QuantitativeValue',
						'value': 1,
					},
				}
			}),
			'priceValidUntil': new Date(
				new Date().setFullYear(new Date().getFullYear() + 1)
			).toISOString().split('T')[0],
			'availability': product.stock_status === 'instock'
				? 'https://schema.org/InStock'
				: product.stock_status === 'onbackorder'
				? 'https://schema.org/BackOrder'
				: 'https://schema.org/OutOfStock',
			'itemCondition': 'https://schema.org/NewCondition',
			'seller': {
				'@type': 'Organization',
				'name': 'Selectura',
				'url': 'https://selectura.co',
				'logo': 'https://selectura.co/logo.png',
			},
			// Politique de retour détaillée pour Google Merchant Center
			'hasMerchantReturnPolicy': {
				'@type': 'MerchantReturnPolicy',
				'@id': 'https://selectura.co/returns#policy',
				'name': 'Politique de retour Selectura',
				'applicableCountry': ['FR', 'BE', 'CH', 'LU'],
				'returnPolicyCategory': 'https://schema.org/MerchantReturnFiniteReturnWindow',
				'merchantReturnDays': 14,
				'returnMethod': 'https://schema.org/ReturnByMail',
				'returnFees': 'https://schema.org/ReturnFeesCustomerResponsibility',
				'returnShippingFeesAmount': {
					'@type': 'MonetaryAmount',
					'value': '4.90',
					'currency': 'EUR',
				},
				'refundType': 'https://schema.org/FullRefund',
				'returnPolicyCountry': 'FR',
				'url': 'https://selectura.co/returns',
			},
			// Détails de livraison pour Google Merchant Center - France
			'shippingDetails': [
				{
					'@type': 'OfferShippingDetails',
					'@id': 'https://selectura.co/shipping#france-standard',
					'shippingRate': {
						'@type': 'MonetaryAmount',
						'value': '4.90',
						'currency': 'EUR',
					},
					'shippingDestination': {
						'@type': 'DefinedRegion',
						'addressCountry': 'FR',
						'addressRegion': ['FR'],
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
							'maxValue': 3,
							'unitCode': 'DAY',
						},
						'businessDays': {
							'@type': 'OpeningHoursSpecification',
							'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
						},
					},
					'shippingLabel': 'Livraison Standard France',
				},
				// Livraison gratuite pour commandes > 50€
				{
					'@type': 'OfferShippingDetails',
					'@id': 'https://selectura.co/shipping#france-free',
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
							'maxValue': 3,
							'unitCode': 'DAY',
						},
					},
					'shippingLabel': 'Livraison Gratuite (commandes > 50€)',
					'doesNotShip': false,
				},
				// Livraison UE
				{
					'@type': 'OfferShippingDetails',
					'@id': 'https://selectura.co/shipping#eu-standard',
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
						'handlingTime': {
							'@type': 'QuantitativeValue',
							'minValue': 0,
							'maxValue': 1,
							'unitCode': 'DAY',
						},
						'transitTime': {
							'@type': 'QuantitativeValue',
							'minValue': 3,
							'maxValue': 5,
							'unitCode': 'DAY',
						},
					},
					'shippingLabel': 'Livraison Standard Europe',
				},
			],
		},
		...(product.average_rating && parseFloat(product.average_rating) > 0 && product.rating_count && product.rating_count > 0 && {
			'aggregateRating': {
				'@type': 'AggregateRating',
				'ratingValue': product.average_rating,
				'reviewCount': product.rating_count,
				'bestRating': '5',
				'worstRating': '1',
			},
		}),
		// Attributs additionnels pour les moteurs IA
		'additionalProperty': [
			...(product.attributes?.map((attr) => ({
				'@type': 'PropertyValue',
				'name': attr.name,
				'value': attr.options.join(', '),
			})) || []),
			{
				'@type': 'PropertyValue',
				'name': 'Origine',
				'value': 'Union Européenne',
			},
			{
				'@type': 'PropertyValue',
				'name': 'Garantie',
				'value': '2 ans',
			},
		],
		// Informations supplémentaires pour Google
		'isAccessoryOrSparePartFor': undefined,
		'isSimilarTo': undefined,
		'countryOfOrigin': {
			'@type': 'Country',
			'name': 'France',
		},
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
		/>
	);
}
