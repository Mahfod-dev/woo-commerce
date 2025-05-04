// app/blog/[slug]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import BlogArticleContent from '@/components/BlogArticleContent';

// Interface pour les propriétés de la page
interface PageProps {
	params: { slug: string };
	searchParams: Record<string, string | string[] | undefined>;
}

// Composant de chargement
function ArticleLoading() {
	return (
		<div className='max-w-4xl mx-auto px-4 sm:px-6 py-12'>
			<div className='animate-pulse space-y-8'>
				<div className='h-8 bg-gray-200 max-w-lg rounded'></div>
				<div className='flex gap-4'>
					<div className='h-6 w-24 bg-gray-200 rounded'></div>
					<div className='h-6 w-32 bg-gray-200 rounded'></div>
				</div>
				<div className='h-96 bg-gray-200 rounded-lg'></div>
				<div className='space-y-4'>
					<div className='h-4 bg-gray-200 rounded w-full'></div>
					<div className='h-4 bg-gray-200 rounded w-full'></div>
					<div className='h-4 bg-gray-200 rounded w-3/4'></div>
				</div>
			</div>
		</div>
	);
}

// Métadonnées dynamiques pour SEO
export async function generateMetadata({ params }: PageProps) {
	// Résoudre le slug avant de l'utiliser
	const slug = await Promise.resolve(params.slug);

	const article = await getArticleBySlug(slug);

	if (!article) {
		return {
			title: 'Article non trouvé | Votre Boutique',
		};
	}

	return {
		title: `${article.title} | Blog Votre Boutique`,
		description: article.excerpt,
		openGraph: {
			title: article.title,
			description: article.excerpt,
			images: [article.image],
		},
	};
}

// Fonction pour récupérer un article par son slug
async function getArticleBySlug(slug: string) {
	// Simulons un délai pour montrer le chargement
	await new Promise((resolve) => setTimeout(resolve, 500));

	// Liste d'articles fictifs pour démo - à remplacer par un appel API
	const mockBlogPosts = [
		{
			id: 1,
			title: "Les tendances mode de l'automne 2023",
			excerpt:
				'Découvrez les couleurs, matières et coupes qui feront sensation cette saison.',
			category: 'Mode',
			date: '2023-09-15',
			author: {
				name: 'Sophie Martin',
				avatar: '/images/placeholder.jpg',
				bio: 'Rédactrice mode et passionnée de tendances depuis plus de 10 ans',
			},
			image: '/images/placeholder.jpg',
			slug: 'tendances-mode-automne-2023',
			content: `
# Les tendances mode de l'automne 2023

## Les couleurs de la saison

L'automne 2023 nous réserve une palette riche et chaleureuse. Les teintes terreuses comme le marron glacé, le kaki et le bordeaux profond dominent les collections. On note également un retour remarqué du violet dans toutes ses nuances, du lilas pâle au prune intense.

Le bleu pétrole et le vert sapin apportent une touche de couleur tout en restant dans l'ambiance automnale. Pour égayer ces teintes profondes, des touches de jaune moutarde ou d'orange cuivré viennent parfaire les silhouettes.

## Les matières à privilégier

Le velours fait un retour en force cette saison, notamment sur les vestes et les accessoires. La maille se réinvente avec des torsades XXL et des points fantaisie élaborés.

Le cuir reste un incontournable, décliné cette année dans des finitions plus souples et des teintes naturelles. La fausse fourrure se fait discrète mais présente, notamment sur les cols et les parements.

Les tissus techniques inspirés de l'outdoor s'invitent dans le quotidien, avec des matières déperlantes et coupe-vent qui ne sacrifient pas le style.

## Les coupes et les pièces phares

La silhouette de cet automne joue sur les contrastes : volumes amples sur le haut compensés par des bas plus structurés. Les manches bouffantes persistent, tandis que les épaules se font plus douces que les saisons précédentes.

Le retour du tailleur se confirme, mais dans des versions décontractées, portées avec des baskets ou des bottines plates. La jupe midi plissée s'impose comme la pièce maîtresse, accompagnée de bottes hautes pour un look sophistiqué.

Le cardigan oversized remplace progressivement le blazer comme pièce de superposition, porté comme une veste sur un t-shirt basique.`,
		},
		{
			id: 2,
			title: 'Comment choisir le parfait accessoire pour chaque tenue',
			excerpt:
				'Guide complet pour assortir bijoux, sacs et chaussures à vos vêtements.',
			category: 'Accessoires',
			date: '2023-09-10',
			author: {
				name: 'Marie Dupont',
				avatar: '/images/placeholder.jpg',
				bio: 'Styliste personnelle et consultante en image depuis 8 ans',
			},
			image: '/images/placeholder.jpg',
			slug: 'choisir-parfait-accessoire-tenue',
			content: `# Comment choisir le parfait accessoire pour chaque tenue

## L'art de l'accessoirisation

Choisir les bons accessoires peut transformer complètement une tenue basique en un look remarquable. Les accessoires sont la touche finale qui vient équilibrer, structurer et personnaliser votre style.

## Comprendre l'équilibre visuel

La règle d'or pour accessoiriser est de maintenir un équilibre visuel. Si votre tenue est déjà chargée ou colorée, optez pour des accessoires discrets. À l'inverse, une tenue minimaliste peut être réhaussée par des accessoires plus audacieux.`,
		},
		// Ajoutez d'autres articles au besoin...
	];

	return mockBlogPosts.find((post) => post.slug === slug);
}

export default async function ArticlePage({ params }: PageProps) {
	try {
		// Résoudre le slug avant de l'utiliser
		const slug = await Promise.resolve(params.slug);

		const article = await getArticleBySlug(slug);

		if (!article) {
			notFound();
		}

		return (
			<Suspense fallback={<ArticleLoading />}>
				<BlogArticleContent article={article} />
			</Suspense>
		);
	} catch (error) {
		console.error("Erreur lors du chargement de l'article:", error);
		notFound();
	}
}