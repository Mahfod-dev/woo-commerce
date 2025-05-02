'use client';

import { useEffect } from 'react';

interface ContactSchemaProps {
	organizationName: string;
	url: string;
	email: string;
	phone: string;
	address: string;
}

export default function ContactSchema({
	organizationName,
	url,
	email,
	phone,
	address,
}: ContactSchemaProps) {
	useEffect(() => {
		// Création du schéma JSON-LD pour la page Contact
		const contactSchema = {
			'@context': 'https://schema.org',
			'@type': 'ContactPage',
			name: 'Contact ' + organizationName,
			description:
				'Contactez-nous pour toute question sur nos produits et services.',
			url: url,
			mainEntity: {
				'@type': 'Organization',
				name: organizationName,
				email: email,
				telephone: phone,
				address: {
					'@type': 'PostalAddress',
					streetAddress: address.split(',')[0],
					addressLocality: address.split(',')[1] || 'Lyon',
					postalCode: (address.match(/\d{5}/) || [''])[0],
					addressCountry: 'FR',
				},
			},
		};

		// Ajout du schéma à la page
		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.text = JSON.stringify(contactSchema);
		document.head.appendChild(script);

		// Nettoyage lors du démontage du composant
		return () => {
			document.head.removeChild(script);
		};
	}, [organizationName, url, email, phone, address]);

	// Ce composant ne rend rien à l'écran
	return null;
}
