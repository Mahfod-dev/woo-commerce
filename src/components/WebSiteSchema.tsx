'use client';

import { useEffect } from 'react';

export default function WebSiteSchema() {
	useEffect(() => {
		const websiteSchema = {
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			'name': 'Selectura',
			'alternateName': 'Selectura - Boutique Premium',
			'url': 'https://selectura.co',
			'description':
				'Sélection exclusive de produits premium de qualité supérieure. Moins de choix, mais uniquement l\'excellence.',
			'publisher': {
				'@type': 'Organization',
				'name': 'Selectura',
				'url': 'https://selectura.co',
				'logo': {
					'@type': 'ImageObject',
					'url': 'https://selectura.co/favicon.ico',
					'width': 512,
					'height': 512,
				},
				'sameAs': [
					// Ajoutez vos réseaux sociaux ici
					// 'https://facebook.com/selectura',
					// 'https://instagram.com/selectura',
					// 'https://twitter.com/selectura',
				],
				'contactPoint': {
					'@type': 'ContactPoint',
					'telephone': '+19136759287',
					'contactType': 'customer service',
					'email': 'support@flowcontent.io',
					'availableLanguage': ['French'],
				},
			},
			'potentialAction': {
				'@type': 'SearchAction',
				'target': {
					'@type': 'EntryPoint',
					'urlTemplate':
						'https://selectura.co/products?search={search_term_string}',
				},
				'query-input': 'required name=search_term_string',
			},
		};

		// Créer ou mettre à jour le script JSON-LD
		const scriptId = 'website-schema';
		let script = document.getElementById(scriptId) as HTMLScriptElement | null;

		if (!script) {
			script = document.createElement('script') as HTMLScriptElement;
			script.id = scriptId;
			script.type = 'application/ld+json';
			document.head.appendChild(script);
		}

		script.textContent = JSON.stringify(websiteSchema);

		// Cleanup lors du démontage du composant
		return () => {
			const existingScript = document.getElementById(scriptId);
			if (existingScript) {
				existingScript.remove();
			}
		};
	}, []);

	return null;
}
