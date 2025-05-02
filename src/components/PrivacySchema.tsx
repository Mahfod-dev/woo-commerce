'use client';

import { useEffect } from 'react';

interface PrivacySchemaProps {
	organizationName: string;
	url: string;
	lastUpdated: string;
}

export default function PrivacySchema({
	organizationName,
	url,
	lastUpdated,
}: PrivacySchemaProps) {
	useEffect(() => {
		// Création du schéma pour la page de politique de confidentialité
		const privacySchema = {
			'@context': 'https://schema.org',
			'@type': 'PrivacyPolicy',
			name: 'Politique de Confidentialité',
			description:
				'Politique de confidentialité et protection des données de ' +
				organizationName,
			url: url,
			dateModified: lastUpdated,
			publisher: {
				'@type': 'Organization',
				name: organizationName,
				url: url.split('/privacy')[0],
			},
			inLanguage: 'fr-FR',
			contentUrl: url,
			thumbnailUrl: url.split('/privacy')[0] + '/logo.png',
			mainEntity: {
				'@type': 'WebPage',
				name: 'Politique de Confidentialité',
				description:
					'Comment nous collectons, utilisons et protégeons vos données personnelles',
				url: url,
				publisher: {
					'@type': 'Organization',
					name: organizationName,
				},
				dateModified: lastUpdated,
			},
		};

		// Schéma des coordonnées de contact pour la protection des données
		const contactSchema = {
			'@context': 'https://schema.org',
			'@type': 'ContactPoint',
			contactType: 'Data Protection Officer',
			email: 'privacy@votreboutique.com',
			telephone: '+33123456789',
			availableLanguage: ['French', 'English'],
			areaServed: 'FR',
			productSupported: 'Privacy questions and data requests',
			hoursAvailable: {
				'@type': 'OpeningHoursSpecification',
				dayOfWeek: [
					'Monday',
					'Tuesday',
					'Wednesday',
					'Thursday',
					'Friday',
				],
				opens: '09:00',
				closes: '18:00',
			},
		};

		// Ajout des schémas à la page
		const privacyScriptTag = document.createElement('script');
		privacyScriptTag.type = 'application/ld+json';
		privacyScriptTag.text = JSON.stringify(privacySchema);
		document.head.appendChild(privacyScriptTag);

		const contactScriptTag = document.createElement('script');
		contactScriptTag.type = 'application/ld+json';
		contactScriptTag.text = JSON.stringify(contactSchema);
		document.head.appendChild(contactScriptTag);

		// Nettoyage lors du démontage du composant
		return () => {
			document.head.removeChild(privacyScriptTag);
			document.head.removeChild(contactScriptTag);
		};
	}, [organizationName, url, lastUpdated]);

	// Ce composant ne rend rien à l'écran
	return null;
}
