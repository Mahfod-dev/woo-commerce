// app/about/page.tsx
import { Suspense } from 'react';
import AboutContent from '@/components/AboutContent';
import '../styles/about.css';

// Métadonnées pour le SEO
export const metadata = {
	title: 'À propos de nous | Votre Boutique',
	description:
		'Découvrez notre philosophie et notre engagement pour la qualité. Une sélection premium de produits soigneusement choisis pour vous offrir ce qui se fait de mieux.',
	keywords:
		'à propos, notre histoire, qualité, sélection, boutique, premium, philosophie',
};

// Composant de chargement pour Suspense
function AboutLoading() {
	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
			<div className='animate-pulse mb-12'>
				<div className='h-10 bg-gray-200 max-w-md mb-4 rounded'></div>
				<div className='h-4 bg-gray-200 max-w-xl rounded'></div>
			</div>

			<div className='animate-pulse mb-8'>
				<div className='h-6 bg-gray-200 w-1/4 mb-4 rounded'></div>
				<div className='space-y-2'>
					<div className='h-4 bg-gray-200 rounded w-full'></div>
					<div className='h-4 bg-gray-200 rounded w-full'></div>
					<div className='h-4 bg-gray-200 rounded w-3/4'></div>
				</div>
			</div>

			<div className='animate-pulse mb-8'>
				<div className='h-6 bg-gray-200 w-1/4 mb-4 rounded'></div>
				<div className='space-y-2'>
					<div className='h-4 bg-gray-200 rounded w-full'></div>
					<div className='h-4 bg-gray-200 rounded w-full'></div>
					<div className='h-4 bg-gray-200 rounded w-3/4'></div>
				</div>
			</div>
		</div>
	);
}

// Données de contenu pour la page À propos
const aboutData = {
	heroSection: {
		title: 'Notre histoire et notre philosophie',
		description:
			'Découvrez ce qui nous anime et pourquoi nous proposons une sélection limitée mais exceptionnelle de produits.',
		imageUrl: '/img/about-header.jpg',
	},
	history: {
		title: 'Notre histoire',
		content: `
			<p>Fondée en 2018 à Lyon, Votre Boutique est née d'une frustration : l'impossibilité de trouver des produits alliant qualité exceptionnelle, design élégant et durabilité dans un marché saturé de choix médiocres.</p>
			<p>Notre fondateur, Pierre Martin, ingénieur de formation et passionné par la qualité, a décidé de créer une boutique différente : un lieu où chaque produit proposé serait rigoureusement sélectionné, testé et approuvé avant d'être présenté aux clients.</p>
			<p>Ce qui a commencé comme une petite boutique en ligne s'est rapidement transformé en une référence pour les consommateurs exigeants à la recherche de produits de qualité supérieure, sans avoir à passer des heures à comparer des dizaines d'options quasiment identiques.</p>
		`,
		imageUrl: '/img/about-founder.jpg',
	},
	philosophy: {
		title: 'Notre philosophie',
		content: `
			<p>Notre approche est à contre-courant des tendances actuelles du e-commerce. Plutôt que de vous submerger avec des milliers de références, nous avons fait le choix radical de la <strong>curation</strong>.</p>
			<p>Nous ne proposons qu'un nombre limité de produits dans chaque catégorie - généralement un modèle standard et un modèle premium - mais nous garantissons que chacun d'eux représente l'excellence dans sa catégorie.</p>
			<p>Cette philosophie "moins mais mieux" nous permet de :</p>
			<ul>
				<li>Connaître parfaitement chaque produit que nous vendons</li>
				<li>Vous offrir un accompagnement et des conseils personnalisés</li>
				<li>Vous faire gagner un temps précieux dans vos décisions d'achat</li>
				<li>Maintenir des relations privilégiées avec nos fournisseurs</li>
				<li>Garantir une qualité constante et irréprochable</li>
			</ul>
		`,
	},
	values: {
		title: 'Nos valeurs',
		items: [
			{
				icon: 'quality',
				title: 'Qualité sans compromis',
				description:
					"Nous sélectionnons uniquement des produits d'excellence qui répondent à nos critères stricts de qualité, de durabilité et de fonctionnalité.",
			},
			{
				icon: 'transparency',
				title: 'Transparence',
				description:
					"Nous communiquons clairement sur l'origine, la composition et les caractéristiques de chaque produit, sans exagération ni fausse promesse.",
			},
			{
				icon: 'sustainability',
				title: 'Durabilité',
				description:
					"Nous privilégions les produits conçus pour durer et favorisons les fournisseurs engagés dans des démarches respectueuses de l'environnement.",
			},
			{
				icon: 'simplicity',
				title: 'Simplicité',
				description:
					"Nous simplifions votre expérience d'achat en éliminant la confusion liée à trop de choix similaires et en vous guidant vers la meilleure option.",
			},
		],
	},
	selectionProcess: {
		title: 'Notre processus de sélection',
		steps: [
			{
				number: '01',
				title: 'Recherche',
				description:
					'Nous étudions en profondeur chaque catégorie de produits pour identifier les meilleurs fabricants et les innovations pertinentes.',
			},
			{
				number: '02',
				title: 'Évaluation',
				description:
					'Nos experts testent rigoureusement chaque produit potentiel selon des critères spécifiques à sa catégorie.',
			},
			{
				number: '03',
				title: 'Comparaison',
				description:
					"Nous mettons en concurrence les meilleurs candidats pour ne retenir que l'excellence.",
			},
			{
				number: '04',
				title: 'Tests utilisateurs',
				description:
					'Des panels de testeurs représentatifs de nos clients évaluent les produits finalistes en conditions réelles.',
			},
			{
				number: '05',
				title: 'Validation finale',
				description:
					"Seuls les produits répondant à tous nos critères d'excellence sont intégrés à notre catalogue.",
			},
		],
	},
	team: {
		title: 'Notre équipe',
		description:
			"Une équipe passionnée de spécialistes dans leurs domaines, unis par l'amour du travail bien fait et la recherche de l'excellence.",
		members: [
			{
				name: 'Pierre Martin',
				role: 'Fondateur & CEO',
				bio: "Ingénieur de formation, Pierre a travaillé 15 ans dans l'industrie du luxe avant de fonder Votre Boutique, réalisant ainsi sa vision d'une plateforme dédiée à l'excellence.",
				imageUrl: '/img/team-pierre.jpg',
			},
			{
				name: 'Sophie Leroy',
				role: 'Directrice Produits',
				bio: 'Avec son expertise en design et sa passion pour la qualité, Sophie dirige notre processus de sélection et de test des produits.',
				imageUrl: '/img/team-sophie.jpg',
			},
			{
				name: 'Thomas Dubois',
				role: 'Responsable Service Client',
				bio: "Fort d'une expérience dans le service client haut de gamme, Thomas veille à ce que chaque interaction avec nos clients soit exceptionnelle.",
				imageUrl: '/img/team-thomas.jpg',
			},
		],
	},
	testimonials: {
		title: 'Témoignages',
		quotes: [
			{
				text: "J'apprécie tellement le concept de Votre Boutique. Moins de choix mais des produits exceptionnels, c'est exactement ce que je recherchais.",
				author: 'Caroline D., cliente depuis 2020',
			},
			{
				text: "Le service client est tout simplement remarquable. Une équipe qui connaît parfaitement les produits qu'elle vend, c'est rare de nos jours.",
				author: 'Michel L., client depuis 2019',
			},
			{
				text: "J'ai acheté leur modèle premium d'écouteurs il y a deux ans, et ils fonctionnent toujours parfaitement. Un investissement que je ne regrette pas.",
				author: 'Julien M., client depuis 2021',
			},
		],
	},
	contact: {
		title: 'Contactez-nous',
		description:
			'Vous avez des questions ou des suggestions ? Notre équipe est là pour vous.',
		email: 'support@flowcontent.io',
		phone: '+19136759287',
		address: '254 rue Vendôme Lyon 003',
	},
};

export default function AboutPage() {
	return (
		<Suspense fallback={<AboutLoading />}>
			<AboutContent aboutData={aboutData} />
		</Suspense>
	);
}
