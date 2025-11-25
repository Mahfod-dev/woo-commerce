// Schéma Breadcrumb Server-Side Rendered
// Génère automatiquement le fil d'Ariane pour les pages

interface BreadcrumbItem {
	name: string;
	url: string;
}

interface BreadcrumbSchemaSSRProps {
	items: BreadcrumbItem[];
}

export default function BreadcrumbSchemaSSR({ items }: BreadcrumbSchemaSSRProps) {
	// Toujours commencer par l'accueil
	const breadcrumbItems: BreadcrumbItem[] = [
		{
			name: 'Accueil',
			url: 'https://selectura.co',
		},
		...items,
	];

	const breadcrumbSchema = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		'itemListElement': breadcrumbItems.map((item, index) => ({
			'@type': 'ListItem',
			'position': index + 1,
			'name': item.name,
			'item': item.url,
		})),
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
		/>
	);
}
