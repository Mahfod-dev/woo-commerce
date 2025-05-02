'use client';

import { useEffect } from 'react';

interface TermsSchemaProps {
	organizationName: string;
	url: string;
	lastUpdated: string;
}

export default function TermsSchema({
	organizationName,
	url,
	lastUpdated,
}: TermsSchemaProps) {
	useEffect(() => {
		// Création du schéma pour la page des conditions générales
		const termsSchema = {
			'@context': 'https://schema.org',
			'@type': 'WebPage',
			name: 'Conditions Générales',
			description:
				"Conditions générales de vente et d'utilisation de " +
				organizationName,
			url: url,
			dateModified: lastUpdated,
			publisher: {
				'@type': 'Organization',
				name: organizationName,
				url: url.split('/terms')[0],
			},
			speakable: {
				'@type': 'SpeakableSpecification',
				cssSelector: ['h1', 'h2', '.introduction'],
			},
			mainContentOfPage: {
				'@type': 'WebPageElement',
				cssSelector: '.terms-content-container',
			},
		};

		// Ajout du schéma à la page
		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.text = JSON.stringify(termsSchema);
		document.head.appendChild(script);

		// Nettoyage lors du démontage du composant
		return () => {
			document.head.removeChild(script);
		};
	}, [organizationName, url, lastUpdated]);

	// Ce composant ne rend rien à l'écran
	return null;
}
