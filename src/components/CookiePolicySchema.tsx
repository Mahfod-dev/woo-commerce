'use client';

import { useEffect } from 'react';

interface CookiePolicyData {
	lastUpdated: string;
	introduction: {
		title: string;
		content: string;
	};
	sections: Array<{
		id: string;
		title: string;
		content: string;
	}>;
}

interface CookiePolicySchemaProps {
	cookiePolicyData: CookiePolicyData;
}

export default function CookiePolicySchema({ cookiePolicyData }: CookiePolicySchemaProps) {
	useEffect(() => {
		// Créer le schema JSON-LD pour la politique de cookies
		const schema = {
			'@context': 'https://schema.org',
			'@type': 'WebPage',
			name: 'Politique de Cookies - Selectura',
			description:
				'Politique de cookies de Selectura expliquant l\'utilisation des cookies, leur finalité et comment les gérer selon vos préférences.',
			url: 'https://selectura.co/cookie-policy',
			inLanguage: 'fr-FR',
			isPartOf: {
				'@type': 'WebSite',
				name: 'Selectura',
				url: 'https://selectura.co',
				description: 'Boutique en ligne de produits sélectionnés avec soin selon notre philosophie "moins mais mieux"',
			},
			mainEntity: {
				'@type': 'Article',
				headline: 'Politique de Cookies',
				description:
					'Document expliquant l\'utilisation des cookies sur le site Selectura, les types de cookies utilisés et comment les gérer.',
				datePublished: '2025-01-15',
				dateModified: '2025-01-15',
				author: {
					'@type': 'Organization',
					name: 'Selectura',
					url: 'https://selectura.co',
				},
				publisher: {
					'@type': 'Organization',
					name: 'Selectura',
					url: 'https://selectura.co',
					logo: {
						'@type': 'ImageObject',
						url: 'https://selectura.co/logo.png',
						width: 200,
						height: 60,
					},
				},
				about: [
					{
						'@type': 'Thing',
						name: 'Cookies',
						description: 'Petits fichiers stockés sur l\'appareil pour améliorer l\'expérience utilisateur',
					},
					{
						'@type': 'Thing',
						name: 'Protection des données',
						description: 'Mesures de protection de la vie privée et des données personnelles',
					},
					{
						'@type': 'Thing',
						name: 'RGPD',
						description: 'Règlement Général sur la Protection des Données',
					},
					{
						'@type': 'Thing',
						name: 'Consentement',
						description: 'Accord donné par l\'utilisateur pour l\'utilisation de ses données',
					},
				],
				articleSection: cookiePolicyData.sections.map((section) => ({
					'@type': 'WebPageElement',
					name: section.title,
					description: section.content.substring(0, 200).replace(/<[^>]*>/g, '') + '...',
				})),
			},
			breadcrumb: {
				'@type': 'BreadcrumbList',
				itemListElement: [
					{
						'@type': 'ListItem',
						position: 1,
						name: 'Accueil',
						item: 'https://selectura.co',
					},
					{
						'@type': 'ListItem',
						position: 2,
						name: 'Politique de Cookies',
						item: 'https://selectura.co/cookie-policy',
					},
				],
			},
			potentialAction: {
				'@type': 'ReadAction',
				target: 'https://selectura.co/cookie-policy',
			},
			// Schema spécifique pour les politiques de confidentialité
			legislationResponsible: 'RGPD - Règlement Général sur la Protection des Données',
			jurisdiction: 'EU',
			// Liens vers documents connexes
			relatedLink: [
				'https://selectura.co/privacy-policy',
				'https://selectura.co/terms',
				'https://selectura.co/returns',
			],
		};

		// Ajouter le script JSON-LD à la page
		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.textContent = JSON.stringify(schema);
		document.head.appendChild(script);

		// Nettoyer le script au démontage du composant
		return () => {
			document.head.removeChild(script);
		};
	}, [cookiePolicyData]);

	// Ce composant ne rend rien visuellement
	return null;
}