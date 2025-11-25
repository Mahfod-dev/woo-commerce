// Schéma Product Server-Side Rendered pour les moteurs IA
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

	const productSchema = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		'@id': `https://selectura.co/products/${product.id}-${product.slug}#product`,
		'name': product.name,
		'description': cleanDescription,
		'image': product.images.map((img) => img.src),
		'sku': product.sku || product.id.toString(),
		'mpn': product.sku || undefined,
		'brand': {
			'@type': 'Brand',
			'name': 'Selectura',
		},
		'category': product.categories.map((cat) => cat.name).join(' > '),
		'offers': {
			'@type': 'Offer',
			'@id': `https://selectura.co/products/${product.id}-${product.slug}#offer`,
			'url': `https://selectura.co/products/${product.id}-${product.slug}`,
			'priceCurrency': 'EUR',
			'price': product.on_sale && product.sale_price
				? product.sale_price
				: product.price,
			...(product.regular_price && product.on_sale && {
				'priceSpecification': {
					'@type': 'PriceSpecification',
					'price': product.sale_price,
					'priceCurrency': 'EUR',
					'valueAddedTaxIncluded': true,
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
			},
			'hasMerchantReturnPolicy': {
				'@type': 'MerchantReturnPolicy',
				'@id': 'https://selectura.co/returns#policy',
				'applicableCountry': 'FR',
				'returnPolicyCategory': 'https://schema.org/MerchantReturnFiniteReturnWindow',
				'merchantReturnDays': 14,
				'returnMethod': 'https://schema.org/ReturnByMail',
				'returnFees': 'https://schema.org/FreeReturn',
			},
			'shippingDetails': {
				'@type': 'OfferShippingDetails',
				'@id': 'https://selectura.co/shipping#details',
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
		'additionalProperty': product.attributes?.map((attr) => ({
			'@type': 'PropertyValue',
			'name': attr.name,
			'value': attr.options.join(', '),
		})) || [],
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
		/>
	);
}
