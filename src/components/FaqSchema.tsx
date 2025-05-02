'use client';

import { useEffect } from 'react';

// Type pour les questions FAQ
interface FaqQuestion {
	id: string;
	question: string;
	answer: string;
}

interface FaqCategory {
	id: string;
	name: string;
	questions: FaqQuestion[];
}

interface FaqSchemaProps {
	categories: FaqCategory[];
	organizationName: string;
	url: string;
}

// Composant pour générer le schéma JSON-LD pour les FAQs
export default function FaqSchema({
	categories,
	organizationName,
	url,
}: FaqSchemaProps) {
	useEffect(() => {
		// Conversion des données de FAQ en format JSON-LD pour le schéma FAQPage
		const faqSchema = {
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			mainEntity: categories.flatMap((category) =>
				category.questions.map((question) => ({
					'@type': 'Question',
					name: question.question,
					acceptedAnswer: {
						'@type': 'Answer',
						text: question.answer,
					},
				}))
			),
		};

		// Schéma pour l'organisation
		const organizationSchema = {
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: organizationName,
			url: url,
			sameAs: [
				// Ajoutez ici vos profils sociaux si nécessaire
			],
		};

		// Création des balises script avec les schémas
		const faqScriptTag = document.createElement('script');
		faqScriptTag.type = 'application/ld+json';
		faqScriptTag.text = JSON.stringify(faqSchema);
		document.head.appendChild(faqScriptTag);

		const orgScriptTag = document.createElement('script');
		orgScriptTag.type = 'application/ld+json';
		orgScriptTag.text = JSON.stringify(organizationSchema);
		document.head.appendChild(orgScriptTag);

		// Nettoyage lors du démontage du composant
		return () => {
			document.head.removeChild(faqScriptTag);
			document.head.removeChild(orgScriptTag);
		};
	}, [categories, organizationName, url]);

	// Ce composant ne rend rien à l'écran
	return null;
}
