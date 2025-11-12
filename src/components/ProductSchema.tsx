'use client';

import { useEffect } from 'react';

interface ProductSchemaProps {
	product: {
		id: number;
		name: string;
		description: string;
		price: string;
		regular_price?: string;
		sale_price?: string;
		on_sale?: boolean;
		images: { src: string; alt: string }[];
		categories: { id: number; name: string; slug: string }[];
		average_rating?: string;
		rating_count?: number;
		slug: string;
	};
}

export default function ProductSchema({ product }: ProductSchemaProps) {
	useEffect(() => {
		// Nettoyer la description HTML
		const cleanDescription = product.description
			.replace(/<[^>]*>/g, '')
			.substring(0, 200);

		const productSchema = {
			'@context': 'https://schema.org',
			'@type': 'Product',
			'name': product.name,
			'description': cleanDescription,
			'image': product.images.map((img) => img.src),
			'sku': product.id.toString(),
			'brand': {
				'@type': 'Brand',
				'name': 'Selectura',
			},
			'offers': {
				'@type': 'Offer',
				'url': `https://selectura.co/products/${product.slug}`,
				'priceCurrency': 'EUR',
				'price': product.on_sale && product.sale_price
					? product.sale_price
					: product.price,
				'priceValidUntil': new Date(
					new Date().setFullYear(new Date().getFullYear() + 1)
				)
					.toISOString()
					.split('T')[0],
				'availability': 'https://schema.org/InStock',
				'itemCondition': 'https://schema.org/NewCondition',
			},
			...(product.average_rating &&
				product.rating_count && {
					aggregateRating: {
						'@type': 'AggregateRating',
						'ratingValue': product.average_rating,
						'reviewCount': product.rating_count,
					},
				}),
			'category': product.categories.map((cat) => cat.name).join(', '),
		};

		// Créer ou mettre à jour le script JSON-LD
		const scriptId = 'product-schema';
		let script = document.getElementById(scriptId) as HTMLScriptElement | null;

		if (!script) {
			script = document.createElement('script') as HTMLScriptElement;
			script.id = scriptId;
			script.type = 'application/ld+json';
			document.head.appendChild(script);
		}

		script.textContent = JSON.stringify(productSchema);

		// Cleanup lors du démontage du composant
		return () => {
			const existingScript = document.getElementById(scriptId);
			if (existingScript) {
				existingScript.remove();
			}
		};
	}, [product]);

	return null;
}
