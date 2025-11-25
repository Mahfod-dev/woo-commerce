// Schéma AboutPage Server-Side Rendered
// Inclut Organization, Person (auteurs), et AboutPage pour E-E-A-T

interface TeamMember {
	name: string;
	role: string;
	bio: string;
	imageUrl?: string;
	linkedIn?: string;
	twitter?: string;
}

interface AboutPageSchemaSSRProps {
	teamMembers?: TeamMember[];
	foundingDate?: string;
	founderName?: string;
}

export default function AboutPageSchemaSSR({
	teamMembers = [],
	foundingDate = '2024',
	founderName = 'Équipe Selectura',
}: AboutPageSchemaSSRProps) {
	// Schema AboutPage
	const aboutPageSchema = {
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		'@id': 'https://selectura.co/about#aboutpage',
		'name': 'À propos de Selectura',
		'description': 'Découvrez l\'histoire, la philosophie et l\'équipe derrière Selectura, votre boutique premium de produits de qualité.',
		'url': 'https://selectura.co/about',
		'mainEntity': {
			'@id': 'https://selectura.co/#organization',
		},
	};

	// Schema Organization enrichi
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
		'description': 'Boutique e-commerce française spécialisée dans la sélection curatée de produits premium de haute qualité.',
		'slogan': 'Moins de choix, uniquement l\'excellence',
		'foundingDate': foundingDate,
		'founder': {
			'@type': 'Person',
			'name': founderName,
		},
		'address': {
			'@type': 'PostalAddress',
			'addressCountry': 'FR',
			'addressLocality': 'France',
		},
		'contactPoint': {
			'@type': 'ContactPoint',
			'contactType': 'customer service',
			'email': 'support@selectura.co',
			'availableLanguage': ['French', 'English'],
		},
		'sameAs': [
			// Ajouter les réseaux sociaux ici
		],
		// Membres de l'équipe
		...(teamMembers.length > 0 && {
			'employee': teamMembers.map(member => ({
				'@type': 'Person',
				'name': member.name,
				'jobTitle': member.role,
				'description': member.bio,
				...(member.imageUrl && {
					'image': member.imageUrl.startsWith('http')
						? member.imageUrl
						: `https://selectura.co${member.imageUrl}`,
				}),
				...(member.linkedIn && {
					'sameAs': [member.linkedIn],
				}),
				'worksFor': {
					'@id': 'https://selectura.co/#organization',
				},
			})),
		}),
	};

	// Schema pour chaque membre de l'équipe (Person)
	const personSchemas = teamMembers.map(member => ({
		'@context': 'https://schema.org',
		'@type': 'Person',
		'@id': `https://selectura.co/about#${member.name.toLowerCase().replace(/\s+/g, '-')}`,
		'name': member.name,
		'jobTitle': member.role,
		'description': member.bio,
		...(member.imageUrl && {
			'image': member.imageUrl.startsWith('http')
				? member.imageUrl
				: `https://selectura.co${member.imageUrl}`,
		}),
		'worksFor': {
			'@type': 'Organization',
			'name': 'Selectura',
			'url': 'https://selectura.co',
		},
		...(member.linkedIn && {
			'sameAs': [member.linkedIn],
		}),
	}));

	// Schema BreadcrumbList
	const breadcrumbSchema = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		'itemListElement': [
			{
				'@type': 'ListItem',
				'position': 1,
				'name': 'Accueil',
				'item': 'https://selectura.co',
			},
			{
				'@type': 'ListItem',
				'position': 2,
				'name': 'À propos',
				'item': 'https://selectura.co/about',
			},
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
			/>
			{personSchemas.map((schema, index) => (
				<script
					key={index}
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
				/>
			))}
		</>
	);
}
