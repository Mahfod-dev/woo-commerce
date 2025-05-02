'use client';

import { useEffect } from 'react';

interface ShippingSchemaProps {
	organizationName: string;
	url: string;
	lastUpdated: string;
}

export default function ShippingSchema({
	organizationName,
	url,
	lastUpdated,
}: ShippingSchemaProps) {
	useEffect(() => {
		// Création du schéma pour la page de politique de livraison
		const shippingSchema = {
			'@context': 'https://schema.org',
			'@type': 'WebPage',
			name: 'Politique de Livraison',
			description:
				'Informations sur les options de livraison, délais et frais de ' +
				organizationName,
			url: url,
			dateModified: lastUpdated,
			publisher: {
				'@type': 'Organization',
				name: organizationName,
				url: url.split('/shipping')[0],
			},
			speakable: {
				'@type': 'SpeakableSpecification',
				cssSelector: ['h1', 'h2', '.introduction'],
			},
			mainContentOfPage: {
				'@type': 'WebPageElement',
				cssSelector: '.shipping-content-container',
			},
		};

		// Ajout du schéma à la page
		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.text = JSON.stringify(shippingSchema);
		document.head.appendChild(script);

		// Nettoyage lors du démontage du composant
		return () => {
			document.head.removeChild(script);
		};
	}, [organizationName, url, lastUpdated]);

	// Ce composant ne rend rien à l'écran
	return null;
}
