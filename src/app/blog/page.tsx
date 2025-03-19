// app/blog/page.tsx
import { Suspense } from 'react';
import BlogContent from '@/components/BlogContent';

// Métadonnées pour le SEO
export const metadata = {
	title: 'Blog | Votre Boutique',
	description:
		'Découvrez nos derniers articles, guides et tendances pour rester informé et inspiré.',
};

// Composant de chargement pour Suspense
function BlogLoading() {
	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans'>
			<div className='animate-pulse mb-8'>
				<div className='h-10 bg-gray-200 max-w-md mb-4 rounded'></div>
				<div className='h-4 bg-gray-200 max-w-xl rounded'></div>
			</div>

			<div className='animate-pulse mb-8 font-sans'>
				<div className='h-6 bg-gray-200 w-1/4 mb-4 rounded'></div>
				<div className='flex gap-4 overflow-x-auto pb-4'>
					{[...Array(5)].map((_, i) => (
						<div
							key={i}
							className='flex-none w-40 h-10 bg-gray-200 rounded'></div>
					))}
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className='bg-white rounded-lg shadow-sm overflow-hidden'>
						<div className='bg-gray-200 h-64 w-full'></div>
						<div className='p-4 space-y-3'>
							<div className='h-4 bg-gray-200 rounded w-1/4'></div>
							<div className='h-6 bg-gray-200 rounded w-3/4'></div>
							<div className='h-4 bg-gray-200 rounded w-full'></div>
							<div className='h-4 bg-gray-200 rounded w-2/3'></div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// Exemple de données d'articles fictifs pour démo
const mockBlogPosts = [
	{
		id: 1,
		title: "Les tendances mode de l'automne 2023",
		excerpt:
			'Découvrez les couleurs, matières et coupes qui feront sensation cette saison.',
		category: 'Mode',
		date: '2023-09-15',
		author: 'Sophie Martin',
		image: '/blog/fashion-trends.jpg',
		slug: 'tendances-mode-automne-2023',
	},
	{
		id: 2,
		title: 'Comment choisir le parfait accessoire pour chaque tenue',
		excerpt:
			'Guide complet pour assortir bijoux, sacs et chaussures à vos vêtements.',
		category: 'Accessoires',
		date: '2023-09-10',
		author: 'Marie Dupont',
		image: '/blog/accessories-guide.jpg',
		slug: 'choisir-parfait-accessoire-tenue',
	},
	{
		id: 3,
		title: '5 astuces pour entretenir vos vêtements plus longtemps',
		excerpt:
			'Conseils pratiques pour préserver la qualité de votre garde-robe.',
		category: 'Conseils',
		date: '2023-09-05',
		author: 'Thomas Bernard',
		image: '/blog/clothing-care.jpg',
		slug: 'astuces-entretenir-vetements',
	},
	{
		id: 4,
		title: 'Les matières éco-responsables qui révolutionnent la mode',
		excerpt:
			"Zoom sur les innovations durables qui façonnent l'avenir de l'industrie textile.",
		category: 'Développement durable',
		date: '2023-08-28',
		author: 'Lucie Moreau',
		image: '/blog/sustainable-fashion.jpg',
		slug: 'matieres-eco-responsables-mode',
	},
	{
		id: 5,
		title: 'Comment composer une garde-robe capsule efficace',
		excerpt:
			'Le guide ultime pour créer une garde-robe minimaliste mais polyvalente.',
		category: 'Style',
		date: '2023-08-20',
		author: 'Emma Laurent',
		image: '/blog/capsule-wardrobe.jpg',
		slug: 'composer-garde-robe-capsule',
	},
	{
		id: 6,
		title: 'Les couleurs qui vous mettront en valeur selon votre teint',
		excerpt:
			'Apprenez à identifier votre palette de couleurs idéale pour sublimer votre look.',
		category: 'Conseils',
		date: '2023-08-15',
		author: 'Julie Petit',
		image: '/blog/color-analysis.jpg',
		slug: 'couleurs-teint-palette',
	},
	{
		id: 7,
		title: 'Notre sélection de pièces intemporelles à avoir absolument',
		excerpt:
			'Les basiques indémodables qui traversent les saisons et ne se démodent jamais.',
		category: 'Mode',
		date: '2023-08-10',
		author: 'Sophie Martin',
		image: '/blog/timeless-pieces.jpg',
		slug: 'selection-pieces-intemporelles',
	},
	{
		id: 8,
		title: "Comment s'habiller pour une soirée professionnelle",
		excerpt:
			'Nos conseils pour un look élégant et approprié en milieu professionnel.',
		category: 'Style',
		date: '2023-08-05',
		author: 'Thomas Bernard',
		image: '/blog/business-attire.jpg',
		slug: 'habiller-soiree-professionnelle',
	},
	{
		id: 9,
		title: 'Les tendances bijoux à ne pas manquer cette saison',
		excerpt:
			'Découvrez les pièces qui feront sensation et complèteront parfaitement vos tenues.',
		category: 'Accessoires',
		date: '2023-07-30',
		author: 'Marie Dupont',
		image: '/blog/jewelry-trends.jpg',
		slug: 'tendances-bijoux-saison',
	},
];

// Dans une vraie application, ces données viendraient d'une API ou CMS
export default async function BlogPage() {
	// À l'avenir, remplacez par un appel API réel
	const blogPosts = mockBlogPosts;

	return (
		<Suspense fallback={<BlogLoading />}>
			<BlogContent articles={blogPosts} />
		</Suspense>
	);
}
