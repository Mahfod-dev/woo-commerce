// Schéma ItemList Server-Side Rendered
// Pour les pages de collection (catégories, best-sellers, nouveautés, etc.)

import { WooProduct } from '@/lib/woo';

interface ItemListSchemaSSRProps {
	products: WooProduct[];
	listName: string;
	listUrl: string;
	description?: string;
}

export default function ItemListSchemaSSR({
	products,
	listName,
	listUrl,
	description
}: ItemListSchemaSSRProps) {
	const itemListSchema = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		'name': listName,
		'description': description || `Liste de produits: ${listName}`,
		'url': listUrl,
		'numberOfItems': products.length,
		'itemListElement': products.slice(0, 50).map((product, index) => ({
			'@type': 'ListItem',
			'position': index + 1,
			'item': {
				'@type': 'Product',
				'@id': `https://selectura.co/products/${product.id}-${product.slug}#product`,
				'name': product.name,
				'description': product.short_description?.replace(/<[^>]*>/g, '').substring(0, 200) || '',
				'image': product.images[0]?.src,
				'url': `https://selectura.co/products/${product.id}-${product.slug}`,
				'offers': {
					'@type': 'Offer',
					'priceCurrency': 'EUR',
					'price': product.on_sale && product.sale_price ? product.sale_price : product.price,
					'availability': product.stock_status === 'instock'
						? 'https://schema.org/InStock'
						: 'https://schema.org/OutOfStock',
				},
			},
		})),
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
		/>
	);
}
