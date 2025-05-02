'use client';

import { useEffect } from 'react';

interface AboutSchemaProps {
	organizationName: string;
	url: string;
	foundingDate: string;
	founders: string[];
	location: string;
}

export default function AboutSchema({
	organizationName,
	url,
	foundingDate,
	founders,
	location,
}: AboutSchemaProps) {
	useEffect(() => {
		// Création du schéma JSON-LD pour la page À propos
		const aboutSchema = {
			'@context': 'https://schema.org',
			'@type': 'AboutPage',
			name: 'À propos de ' + organizationName,
			mainEntity: {
				'@type': 'Organization',
				name: organizationName,
				url: url.split('/about')[0],
				foundingDate: foundingDate,
				founder: founders.map((name) => ({
					'@type': 'Person',
					name: name,
				})),
				location: {
					'@type': 'Place',
					name: location,
				},
			},
		};

		// Schéma pour l'organisation
		const organizationSchema = {
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: organizationName,
			url: url.split('/about')[0],
			foundingDate: foundingDate,
			founders: founders.map((name) => ({
				'@type': 'Person',
				name: name,
			})),
			address: {
				'@type': 'PostalAddress',
				addressLocality: location,
			},
			description:
				'Boutique en ligne proposant une sélection limitée mais rigoureuse de produits de qualité supérieure.',
		};

		// Ajout des schémas à la page
		const aboutScriptTag = document.createElement('script');
		aboutScriptTag.type = 'application/ld+json';
		aboutScriptTag.text = JSON.stringify(aboutSchema);
		document.head.appendChild(aboutScriptTag);

		const orgScriptTag = document.createElement('script');
		orgScriptTag.type = 'application/ld+json';
		orgScriptTag.text = JSON.stringify(organizationSchema);
		document.head.appendChild(orgScriptTag);

		// Nettoyage lors du démontage du composant
		return () => {
			document.head.removeChild(aboutScriptTag);
			document.head.removeChild(orgScriptTag);
		};
	}, [organizationName, url, foundingDate, founders, location]);

	// Ce composant ne rend rien à l'écran
	return null;
}
