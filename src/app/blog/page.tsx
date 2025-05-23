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

// Exemple de données d'articles fictifs pour démo - Alignés avec notre philosophie de curation et qualité
const mockBlogPosts = [
	{
		id: 1,
		title: "Pourquoi moins de choix signifie de meilleurs achats",
		excerpt:
			'Découvrez comment notre approche de curation vous fait gagner du temps et vous garantit la qualité.',
		category: 'Philosophie',
		date: '2024-01-15',
		author: 'Pierre Martin',
		image: '/images/quality-focus.png',
		slug: 'moins-choix-meilleurs-achats',
	},
	{
		id: 2,
		title: 'Comment nous sélectionnons nos produits : les coulisses de notre processus',
		excerpt:
			'Un aperçu exclusif de notre méthode rigoureuse de sélection et de test des produits.',
		category: 'Qualité',
		date: '2024-01-10',
		author: 'Sophie Leroy',
		image: '/images/quality-focus.jpg',
		slug: 'processus-selection-produits',
	},
	{
		id: 3,
		title: "L'art d'investir dans la durabilité plutôt que dans la quantité",
		excerpt:
			'Pourquoi choisir des produits durables est un investissement intelligent à long terme.',
		category: 'Durabilité',
		date: '2024-01-05',
		author: 'Thomas Dubois',
		image: '/images/quality-lab.jpg',
		slug: 'investir-durabilite-vs-quantite',
	},
	{
		id: 4,
		title: 'Les critères cachés qui définissent un produit d\'exception',
		excerpt:
			"Décryptage des caractéristiques techniques et qualitatives qui distinguent l'excellence du standard.",
		category: 'Expertise',
		date: '2023-12-28',
		author: 'Pierre Martin',
		image: '/images/quality-testing.jpg',
		slug: 'criteres-produit-exception',
	},
	{
		id: 5,
		title: 'Curation vs. Catalogue : repenser l\'e-commerce moderne',
		excerpt:
			'Notre vision d\'un commerce en ligne centré sur la valeur plutôt que sur le volume.',
		category: 'Innovation',
		date: '2023-12-20',
		author: 'Sophie Leroy',
		image: '/images/collections.png',
		slug: 'curation-vs-catalogue-ecommerce',
	},
	{
		id: 6,
		title: 'Décoder les labels qualité : ce qu\'il faut vraiment regarder',
		excerpt:
			'Guide pratique pour identifier les véritables gages de qualité au-delà du marketing.',
		category: 'Conseils',
		date: '2023-12-15',
		author: 'Thomas Dubois',
		image: '/images/team-marc.jpg',
		slug: 'decoder-labels-qualite',
	},
	{
		id: 7,
		title: 'Notre sélection premium : la différence qui change tout',
		excerpt:
			'Pourquoi nos modèles premium justifient leur prix et transforment votre expérience.',
		category: 'Premium',
		date: '2023-12-10',
		author: 'Pierre Martin',
		image: '/images/promotions.png',
		slug: 'selection-premium-difference',
	},
	{
		id: 8,
		title: "L'obsession du détail : nos tests de qualité en laboratoire",
		excerpt:
			'Plongée dans notre laboratoire de tests où chaque produit prouve sa valeur.',
		category: 'Tests',
		date: '2023-12-05',
		author: 'Sophie Leroy',
		image: '/images/team-elise.jpg',
		slug: 'tests-qualite-laboratoire',
	},
	{
		id: 9,
		title: 'Transparence totale : la traçabilité de nos fournisseurs',
		excerpt:
			'Comment nous sélectionnons nos partenaires et garantissons l\'origine de nos produits.',
		category: 'Transparence',
		date: '2023-11-30',
		author: 'Thomas Dubois',
		image: '/images/team-lina.jpg',
		slug: 'transparence-tracabilite-fournisseurs',
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
