// app/blog/[slug]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import BlogArticleContent from '@/components/BlogArticleContent';

// Interface pour les propriétés de la page
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
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
	const { slug } = await params;

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
		{
			id: 3,
			title: '5 astuces pour entretenir vos vêtements plus longtemps',
			excerpt:
				'Conseils pratiques pour préserver la qualité de votre garde-robe.',
			category: 'Conseils',
			date: '2023-09-05',
			author: {
				name: 'Thomas Bernard',
				avatar: '/images/placeholder.jpg',
				bio: 'Expert en textiles et conseiller en entretien depuis 15 ans',
			},
			image: '/images/placeholder.jpg',
			slug: 'astuces-entretenir-vetements',
			content: `# 5 astuces pour entretenir vos vêtements plus longtemps

Dans un monde où la fast fashion domine, apprendre à bien entretenir ses vêtements devient un acte à la fois écologique et économique. Voici 5 astuces essentielles pour prolonger la vie de votre garde-robe.

## 1. Maîtriser l'art du lavage

### Lire et respecter les étiquettes
Chaque vêtement a ses spécificités. Les symboles sur les étiquettes ne sont pas là par hasard :
- **Température** : respectez la température maximale indiquée
- **Programme** : délicat, synthétique ou coton selon le textile
- **Essorage** : adaptez la vitesse selon la fragilité

### Trier efficacement
- **Couleurs** : séparez les blancs, les couleurs foncées et les couleurs vives
- **Matières** : évitez de mélanger lin et synthétique, laine et coton
- **Niveau de saleté** : lavez séparément les vêtements très sales

## 2. Séchage et repassage intelligents

Le séchage naturel à l'ombre préserve les couleurs et les fibres. Pour le repassage, adaptez toujours la température selon le textile.

## 3. Stockage optimal

Utilisez des cintres appropriés et laissez respirer vos vêtements dans la penderie.

## 4. Traiter les taches immédiatement

Agissez vite avec des solutions naturelles comme le bicarbonate ou le vinaigre blanc.

## 5. Rotation et entretien préventif

Alternez vos vêtements et effectuez des réparations immédiates pour éviter l'usure prématurée.`,
		},
		{
			id: 4,
			title: 'Les matières éco-responsables qui révolutionnent la mode',
			excerpt:
				"Zoom sur les innovations durables qui façonnent l'avenir de l'industrie textile.",
			category: 'Développement durable',
			date: '2023-08-28',
			author: {
				name: 'Lucie Moreau',
				avatar: '/images/placeholder.jpg',
				bio: 'Journaliste spécialisée en mode durable et innovation textile',
			},
			image: '/images/placeholder.jpg',
			slug: 'matieres-eco-responsables-mode',
			content: `# Les matières éco-responsables qui révolutionnent la mode

L'industrie textile se réinvente face aux défis environnementaux. Découvrez les matières innovantes qui dessinent l'avenir d'une mode plus responsable.

## Les fibres végétales innovantes

### Le Tencel (Lyocell)
Issu de la pulpe d'eucalyptus, le Tencel offre :
- Douceur semblable à la soie
- Propriétés antibactériennes naturelles
- Production en circuit fermé avec recyclage des solvants

### Le chanvre moderne
Longtemps boudé, le chanvre revient en force :
- Culture sans pesticides
- Résistance exceptionnelle
- Amélioration du confort grâce aux nouveaux procédés

## Les alternatives au cuir

### Le cuir de champignon (Mylo)
Développé à partir du mycélium, cette alternative :
- Reproduit l'aspect et le toucher du cuir
- Biodégradable en fin de vie
- Production rapide (quelques semaines vs années pour le cuir animal)

### Le cuir d'ananas (Piñatex)
Fabriqué à partir des déchets de l'industrie de l'ananas :
- Valorise des déchets agricoles
- Soutient les communautés rurales
- Résistance comparable au cuir traditionnel

## Les fibres recyclées nouvelle génération

### Le polyester recyclé premium
- Qualité équivalente au polyester vierge
- Réduction de 70% de la consommation énergétique
- Possibilité de recyclage infini

### Le coton recyclé mécanique
- Process sans produits chimiques
- Conservation des fibres naturelles
- Mélange avec du coton vierge pour optimiser la qualité

## L'impact positif sur l'industrie

Ces innovations transforment les pratiques :
- Réduction drastique de la consommation d'eau
- Diminution des émissions de CO2
- Création de nouveaux emplois dans la tech verte
- Sensibilisation des consommateurs

L'avenir de la mode se dessine avec ces matières révolutionnaires qui prouvent qu'innovation et responsabilité peuvent aller de pair.`,
		},
		{
			id: 5,
			title: 'Comment composer une garde-robe capsule efficace',
			excerpt:
				'Le guide ultime pour créer une garde-robe minimaliste mais polyvalente.',
			category: 'Style',
			date: '2023-08-20',
			author: {
				name: 'Emma Laurent',
				avatar: '/images/placeholder.jpg',
				bio: 'Consultante en style minimaliste et auteure du livre "Moins mais mieux"',
			},
			image: '/images/placeholder.jpg',
			slug: 'composer-garde-robe-capsule',
			content: `# Comment composer une garde-robe capsule efficace

La garde-robe capsule révolutionne notre approche de la mode en privilégiant la qualité sur la quantité. Découvrez comment créer la vôtre.

## Les principes fondamentaux

### Définir son style personnel
Avant de commencer, identifiez :
- Votre mode de vie (travail, loisirs, sorties)
- Vos couleurs de prédilection
- Les coupes qui vous mettent en valeur
- Votre budget global

### La règle des 30 pièces
Une garde-robe capsule idéale contient environ 30 pièces :
- 8 hauts (t-shirts, chemises, pulls)
- 6 bas (pantalons, jupes, shorts)
- 4 robes polyvalentes
- 6 pièces de superposition (vestes, cardigans)
- 6 paires de chaussures

## Sélectionner les pièces essentielles

### Les basiques incontournables
- **Jean brut** : la base polyvalente par excellence
- **Chemise blanche** : élégance garantie
- **Pull en cachemire noir** : luxe et confort
- **Trench beige** : l'indémodable pour toutes saisons
- **Robe noire** : solution miracle pour toutes occasions

### Les pièces de caractère
Ajoutez 20% de pièces plus audacieuses :
- Une veste colorée
- Un imprimé signature
- Des accessoires marquants

## L'art de la combinaison

### La règle du 3
Chaque pièce doit se marier avec au moins 3 autres de votre garde-robe.

### Les multiplicateurs de looks
- Accessoires variés (foulards, bijoux, ceintures)
- Chaussures différentes
- Jeux de superposition

## Planification et entretien

### Rotation saisonnière
Adaptez votre capsule aux saisons :
- Stockez les pièces hors saison
- Intégrez 5-6 pièces spécifiques par saison
- Gardez les basiques toute l'année

### L'importance de la qualité
Investissez dans :
- Des matières nobles et durables
- Des coupes intemporelles
- Des marques reconnues pour leur qualité

Une garde-robe capsule bien pensée simplifie votre quotidien tout en vous garantissant d'être toujours bien habillé(e).`,
		}
	];

	return mockBlogPosts.find((post) => post.slug === slug);
}

export default async function ArticlePage({ params }: PageProps) {
	try {
		// Résoudre le slug avant de l'utiliser
		const { slug } = await params;

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