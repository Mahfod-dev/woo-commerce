// Schéma Organization Server-Side Rendered
// Visible par tous les crawlers et LLMs

export default function OrganizationSchemaSSR() {
	const organizationSchema = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': 'https://selectura.co/#organization',
		'name': 'Selectura',
		'alternateName': 'Selectura - Boutique Premium',
		'url': 'https://selectura.co',
		'logo': {
			'@type': 'ImageObject',
			'url': 'https://selectura.co/logo.png',
			'width': 512,
			'height': 512,
		},
		'description': 'Sélection exclusive de produits premium de qualité supérieure. Moins de choix, mais uniquement l\'excellence.',
		'slogan': 'Moins de choix, uniquement l\'excellence',
		'foundingDate': '2024',
		'contactPoint': [
			{
				'@type': 'ContactPoint',
				'telephone': '+33-1-23-45-67-89',
				'contactType': 'customer service',
				'email': 'support@selectura.co',
				'availableLanguage': ['French', 'English'],
				'areaServed': 'FR',
				'hoursAvailable': {
					'@type': 'OpeningHoursSpecification',
					'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
					'opens': '09:00',
					'closes': '18:00',
				},
			},
		],
		'address': {
			'@type': 'PostalAddress',
			'addressCountry': 'FR',
		},
		'sameAs': [
			// Ajouter vos réseaux sociaux ici
			// 'https://facebook.com/selectura',
			// 'https://instagram.com/selectura',
			// 'https://twitter.com/selectura',
		],
		'potentialAction': {
			'@type': 'SearchAction',
			'target': {
				'@type': 'EntryPoint',
				'urlTemplate': 'https://selectura.co/products?search={search_term_string}',
			},
			'query-input': 'required name=search_term_string',
		},
	};

	const websiteSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': 'https://selectura.co/#website',
		'name': 'Selectura',
		'url': 'https://selectura.co',
		'description': 'Boutique en ligne de produits premium sélectionnés avec soin.',
		'publisher': {
			'@id': 'https://selectura.co/#organization',
		},
		'potentialAction': {
			'@type': 'SearchAction',
			'target': {
				'@type': 'EntryPoint',
				'urlTemplate': 'https://selectura.co/products?search={search_term_string}',
			},
			'query-input': 'required name=search_term_string',
		},
		'inLanguage': 'fr-FR',
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
			/>
		</>
	);
}
