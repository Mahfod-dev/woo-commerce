// Schéma Article Server-Side Rendered pour le blog
// Optimisé pour les moteurs IA et Google News

interface ArticleSchemaSSRProps {
	title: string;
	description: string;
	slug: string;
	publishDate: string;
	modifiedDate?: string;
	author?: {
		name: string;
		url?: string;
	};
	image?: string;
	category?: string;
	tags?: string[];
	readingTime?: number;
}

export default function ArticleSchemaSSR({
	title,
	description,
	slug,
	publishDate,
	modifiedDate,
	author = { name: 'Équipe Selectura', url: 'https://selectura.co/about' },
	image,
	category,
	tags = [],
	readingTime,
}: ArticleSchemaSSRProps) {
	const articleSchema = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		'@id': `https://selectura.co/blog/${slug}#article`,
		'headline': title,
		'description': description,
		'image': image || 'https://selectura.co/images/blog-default.jpg',
		'datePublished': publishDate,
		'dateModified': modifiedDate || publishDate,
		'author': {
			'@type': 'Person',
			'name': author.name,
			'url': author.url,
		},
		'publisher': {
			'@type': 'Organization',
			'@id': 'https://selectura.co/#organization',
			'name': 'Selectura',
			'logo': {
				'@type': 'ImageObject',
				'url': 'https://selectura.co/logo.png',
			},
		},
		'mainEntityOfPage': {
			'@type': 'WebPage',
			'@id': `https://selectura.co/blog/${slug}`,
		},
		'inLanguage': 'fr-FR',
		...(category && {
			'articleSection': category,
		}),
		...(tags.length > 0 && {
			'keywords': tags.join(', '),
		}),
		...(readingTime && {
			'timeRequired': `PT${readingTime}M`,
		}),
	};

	// Schema BreadcrumbList pour l'article
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
				'name': 'Blog',
				'item': 'https://selectura.co/blog',
			},
			{
				'@type': 'ListItem',
				'position': 3,
				'name': title,
				'item': `https://selectura.co/blog/${slug}`,
			},
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
			/>
		</>
	);
}
