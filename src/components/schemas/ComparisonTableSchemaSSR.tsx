// Schema Table/ItemList pour les tableaux comparatifs
// Les IA utilisent ce format pour extraire des données de comparaison

import { WooProduct } from '@/lib/woo';

interface ComparisonTableSchemaSSRProps {
	currentProduct: WooProduct;
	comparedProducts: WooProduct[];
}

export default function ComparisonTableSchemaSSR({
	currentProduct,
	comparedProducts,
}: ComparisonTableSchemaSSRProps) {
	const allProducts = [currentProduct, ...comparedProducts];

	// Schema ItemList avec les produits comparés
	const comparisonSchema = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		'name': `Comparatif: ${currentProduct.name} et produits similaires`,
		'description': `Tableau comparatif de ${currentProduct.name} avec ${comparedProducts.length} produits similaires de la même catégorie.`,
		'numberOfItems': allProducts.length,
		'itemListElement': allProducts.map((product, index) => ({
			'@type': 'ListItem',
			'position': index + 1,
			'item': {
				'@type': 'Product',
				'@id': `https://selectura.co/products/${product.id}-${product.slug}#product`,
				'name': product.name,
				'url': `https://selectura.co/products/${product.id}-${product.slug}`,
				'image': product.images?.[0]?.src,
				'description': product.short_description?.replace(/<[^>]*>/g, '').substring(0, 200) || '',
				'offers': {
					'@type': 'Offer',
					'price': product.on_sale && product.sale_price ? product.sale_price : product.price,
					'priceCurrency': 'EUR',
					'availability': product.stock_status === 'instock'
						? 'https://schema.org/InStock'
						: 'https://schema.org/OutOfStock',
				},
				...(product.average_rating && parseFloat(product.average_rating) > 0 && {
					'aggregateRating': {
						'@type': 'AggregateRating',
						'ratingValue': product.average_rating,
						'reviewCount': product.rating_count || 0,
					},
				}),
			},
		})),
	};

	// Schema Table avec les caractéristiques comparées
	const tableSchema = {
		'@context': 'https://schema.org',
		'@type': 'Table',
		'about': `Comparaison des caractéristiques de ${currentProduct.name}`,
		'abstract': `Tableau comparatif détaillé incluant prix, disponibilité, notes clients et livraison pour ${allProducts.length} produits similaires.`,
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(tableSchema) }}
			/>
		</>
	);
}
