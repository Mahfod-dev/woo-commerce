// Bibliothèque pour gérer les articles de blog

export interface BlogPost {
	id: number;
	title: string;
	excerpt: string;
	content?: string;
	category: string;
	date: string;
	author: string;
	authorAvatar?: string;
	image: string;
	slug: string;
	readTime?: string;
	tags?: string[];
}

// Articles de blog - En production, ceux-ci viendraient d'un CMS ou API
export const blogPosts: BlogPost[] = [
	{
		id: 1,
		title: "Pourquoi moins de choix signifie de meilleurs achats",
		excerpt: 'Découvrez comment notre approche de curation vous fait gagner du temps et vous garantit la qualité.',
		content: `Dans un monde où le commerce en ligne offre des milliers d'options pour chaque catégorie de produits, on pourrait penser que plus de choix est toujours mieux. Pourtant, les recherches en psychologie du consommateur nous disent le contraire.

## Le paradoxe du choix

Le psychologue Barry Schwartz a démontré que trop de choix peut conduire à l'anxiété, la paralysie décisionnelle et finalement au regret. Chez Selectura, nous avons fait le choix radical de limiter notre catalogue pour vous offrir uniquement l'excellence.

## Notre méthode de sélection

Chaque produit que nous proposons a été testé, comparé et validé par nos experts. Au lieu de vous présenter 50 paires d'écouteurs différentes, nous vous proposons les 2 meilleures options : une standard et une premium.

## Les bénéfices concrets

- **Gain de temps** : Plus besoin de passer des heures à comparer des produits similaires
- **Confiance** : Chaque produit est garanti de haute qualité
- **Expertise** : Notre équipe connaît parfaitement chaque article
- **Support** : Un accompagnement personnalisé sur chaque produit
`,
		category: 'Philosophie',
		date: '2024-01-15',
		author: 'Pierre Martin',
		authorAvatar: '/images/pierre.png',
		image: '/blog/moinsdechoix.png',
		slug: 'moins-choix-meilleurs-achats',
		readTime: '5 min',
		tags: ['curation', 'philosophie', 'qualité'],
	},
	{
		id: 2,
		title: 'Comment nous sélectionnons nos produits : les coulisses de notre processus',
		excerpt: 'Un aperçu exclusif de notre méthode rigoureuse de sélection et de test des produits.',
		content: `La sélection de produits chez Selectura suit un processus en 5 étapes que nous avons perfectionné au fil des années.

## Étape 1 : La recherche de marché

Nous analysons en profondeur chaque catégorie de produits, étudions les tendances, les innovations et identifions les fabricants de référence.

## Étape 2 : Les tests en laboratoire

Chaque produit candidat passe par notre laboratoire de tests où nous vérifions les spécifications techniques, la durabilité et la qualité de fabrication.

## Étape 3 : Les tests utilisateurs

Des panels de testeurs représentatifs de nos clients utilisent les produits en conditions réelles pendant plusieurs semaines.

## Étape 4 : La comparaison finale

Nous mettons en concurrence les meilleurs candidats pour ne retenir que l'excellence absolue.

## Étape 5 : La validation

Un comité d'experts valide définitivement chaque produit avant son intégration au catalogue.
`,
		category: 'Qualité',
		date: '2024-01-10',
		author: 'Sophie Leroy',
		authorAvatar: '/images/sophie.png',
		image: '/blog/selection.png',
		slug: 'processus-selection-produits',
		readTime: '7 min',
		tags: ['processus', 'qualité', 'tests'],
	},
	{
		id: 3,
		title: "L'art d'investir dans la durabilité plutôt que dans la quantité",
		excerpt: 'Pourquoi choisir des produits durables est un investissement intelligent à long terme.',
		content: `Dans une société de consommation rapide, nous prônons une approche différente : investir dans des produits qui durent.

## Le coût réel de la qualité

Un produit premium peut coûter 2 à 3 fois plus cher qu'un produit standard, mais il dure généralement 5 à 10 fois plus longtemps. Le calcul est simple : la qualité est toujours plus rentable à long terme.

## Impact environnemental

Acheter moins mais mieux signifie également réduire son empreinte écologique. Moins de déchets, moins de ressources consommées, moins de transport.

## La garantie Selectura

Tous nos produits premium bénéficient d'une garantie étendue et d'un support technique à vie. Nous assumons notre engagement qualité.
`,
		category: 'Durabilité',
		date: '2024-01-05',
		author: 'Thomas Dubois',
		authorAvatar: '/images/thomas.png',
		image: '/blog/investir.png',
		slug: 'investir-durabilite-vs-quantite',
		readTime: '6 min',
		tags: ['durabilité', 'environnement', 'investissement'],
	},
];

// Fonction pour obtenir tous les articles
export function getAllBlogPosts(): BlogPost[] {
	return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Fonction pour obtenir un article par slug
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
	return blogPosts.find(post => post.slug === slug);
}

// Fonction pour obtenir les articles d'une catégorie
export function getBlogPostsByCategory(category: string): BlogPost[] {
	return blogPosts.filter(post => post.category === category);
}

// Fonction pour obtenir les articles récents
export function getRecentBlogPosts(limit: number = 3): BlogPost[] {
	return getAllBlogPosts().slice(0, limit);
}
