'use client';

import { useEffect } from 'react';

interface ReturnsSchemaProps {
	organizationName: string;
	url: string;
	lastUpdated: string;
}

export default function ReturnsSchema({
	organizationName,
	url,
	lastUpdated,
}: ReturnsSchemaProps) {
	useEffect(() => {
		// Création du schéma pour la page de politique de retour
		const returnsSchema = {
			'@context': 'https://schema.org',
			'@type': 'WebPage',
			name: 'Politique de Retour',
			description:
				"Informations sur nos procédures de retour, d'échange et de remboursement pour " +
				organizationName,
			url: url,
			dateModified: lastUpdated,
			publisher: {
				'@type': 'Organization',
				name: organizationName,
				url: url.split('/returns')[0],
			},
			speakable: {
				'@type': 'SpeakableSpecification',
				cssSelector: ['h1', 'h2', '.introduction'],
			},
			mainContentOfPage: {
				'@type': 'WebPageElement',
				cssSelector: '.returns-content-container',
			},
		};

		// Ajout du schéma à la page
		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.text = JSON.stringify(returnsSchema);
		document.head.appendChild(script);

		// Nettoyage lors du démontage du composant
		return () => {
			document.head.removeChild(script);
		};
	}, [organizationName, url, lastUpdated]);

	// Ce composant ne rend rien à l'écran
	return null;
}
