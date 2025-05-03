// app/about-quality/page.tsx
import { Suspense } from 'react';
import AboutQualityContent from '@/components/AboutQualityContent';
import '../styles/about.css'; // Réutilisation des styles de la page à propos

// Métadonnées pour le SEO
export const metadata = {
	title: 'Notre Approche Qualité | Votre Boutique',
	description:
		"Découvrez notre processus rigoureux de sélection de produits et notre engagement envers l'excellence et la qualité durable.",
	keywords:
		'qualité, sélection produits, excellence, tests produits, approche qualité, durabilité, produits premium',
};

// Composant de chargement pour Suspense
function AboutQualityLoading() {
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

// Données de contenu pour la page À propos de la qualité
const aboutQualityData = {
	heroSection: {
		title: 'Notre engagement pour la qualité',
		description:
			'Une approche rigoureuse et sans compromis pour sélectionner uniquement les meilleurs produits pour nos clients.',
		imageUrl: '/img/quality-lab.jpg',
	},
	introduction: {
		title: 'Pourquoi la qualité est au cœur de notre démarche',
		content: `
            <p>Chez Votre Boutique, la qualité n'est pas un simple mot-clé marketing, mais une véritable philosophie qui guide chacune de nos décisions. Face à un marché saturé d'options médiocres et de produits conçus pour l'obsolescence, nous avons choisi une voie différente.</p>
            <p>Notre engagement envers la qualité se traduit par une sélection drastiquement limitée mais exceptionnellement performante. Nous préférons vous proposer un seul produit exceptionnel plutôt que dix options moyennes qui vous laisseraient perplexe et finalement déçu.</p>
            <p>Cette page vous dévoile les coulisses de notre processus de sélection, les critères intransigeants que nous appliquons et la raison pour laquelle notre approche de la qualité est fondamentalement différente de ce que vous trouverez ailleurs.</p>
        `,
	},
	selectionProcess: {
		title: 'Notre processus de sélection rigoureux',
		content: `
            <p>Chaque produit présent sur notre site a traversé un processus de sélection en plusieurs étapes, éliminant systématiquement tous les candidats qui ne répondent pas à nos standards d'excellence :</p>
        `,
		steps: [
			{
				number: '01',
				title: 'Recherche approfondie',
				description:
					"Notre équipe d'experts commence par une veille technologique et une analyse de marché complète pour identifier les meilleurs fabricants et innovations dans chaque catégorie.",
				detail: "Nous étudions les tendances, les avancées technologiques et les retours d'utilisateurs à travers le monde. Cette phase peut durer jusqu'à 3 mois pour certaines catégories de produits.",
			},
			{
				number: '02',
				title: 'Présélection des candidats',
				description:
					'Nous identifions les 5 à 10 produits les plus prometteurs qui semblent correspondre à nos critères exigeants.',
				detail: 'Cette présélection se base sur les spécifications techniques, la réputation du fabricant, les matériaux utilisés et les premières impressions de nos experts.',
			},
			{
				number: '03',
				title: 'Tests en laboratoire',
				description:
					'Nos ingénieurs soumettent chaque produit présélectionné à une batterie de tests techniques dans nos laboratoires.',
				detail: "Nous vérifions la résistance, la durabilité, la performance, la consommation d'énergie, et tous les paramètres techniques pertinents pour la catégorie de produit concernée.",
			},
			{
				number: '04',
				title: 'Tests utilisateurs',
				description:
					"Les produits qui ont passé les tests techniques sont ensuite évalués en conditions réelles par un panel diversifié d'utilisateurs.",
				detail: "Ces tests s'étendent sur 2 à 4 semaines et portent sur l'expérience utilisateur, le confort d'utilisation, l'intuitivité et la satisfaction globale.",
			},
			{
				number: '05',
				title: 'Audit du fabricant',
				description:
					'Pour les produits finalistes, nous effectuons un audit approfondi du fabricant pour garantir des pratiques éthiques et durables.',
				detail: "Nous examinons les conditions de travail, l'impact environnemental, la chaîne d'approvisionnement et la capacité du fabricant à assurer un service après-vente de qualité.",
			},
			{
				number: '06',
				title: 'Délibération finale',
				description:
					"Notre comité de sélection, composé d'experts de divers domaines, prend la décision finale après une analyse complète des résultats.",
				detail: 'Moins de 2% des produits évalués sont finalement sélectionnés pour notre catalogue.',
			},
		],
	},
	qualityCriteria: {
		title: 'Nos critères de qualité intransigeants',
		content: `
            <p>Nous évaluons chaque produit selon cinq critères fondamentaux, sans jamais faire de compromis :</p>
        `,
		criteria: [
			{
				icon: 'durability',
				title: 'Durabilité exceptionnelle',
				description:
					'Nous sélectionnons des produits conçus pour durer significativement plus longtemps que la moyenne du marché, avec des matériaux de première qualité et une conception robuste.',
			},
			{
				icon: 'performance',
				title: 'Performance supérieure',
				description:
					'Chaque produit doit exceller dans sa fonction première et offrir des performances mesurables supérieures à celles des alternatives disponibles sur le marché.',
			},
			{
				icon: 'design',
				title: 'Design fonctionnel',
				description:
					"Nous privilégions un design ergonomique et intuitif qui améliore l'expérience utilisateur, avec une esthétique intemporelle plutôt que des tendances éphémères.",
			},
			{
				icon: 'value',
				title: 'Rapport qualité-prix optimal',
				description:
					'Bien que nos produits ne soient pas les moins chers, ils offrent un retour sur investissement exceptionnel grâce à leur durée de vie prolongée et leurs performances supérieures.',
			},
			{
				icon: 'impact',
				title: 'Impact environnemental réduit',
				description:
					'Nous favorisons les produits avec une empreinte écologique minimisée, réparables, recyclables et issus de chaînes de production responsables.',
			},
		],
	},
	laboratorySection: {
		title: 'Notre laboratoire de tests',
		content: `
            <p>Au cœur de notre siège lyonnais, notre laboratoire de tests est équipé des technologies les plus avancées pour évaluer avec précision chaque aspect des produits :</p>
            <ul>
                <li>Chambres climatiques pour tester la résistance aux températures extrêmes</li>
                <li>Équipements de test d'impact et de résistance mécanique</li>
                <li>Analyseurs de performances énergétiques</li>
                <li>Systèmes de vieillissement accéléré pour simuler l'usage sur plusieurs années</li>
                <li>Instruments de mesure acoustique et vibratoire</li>
                <li>Laboratoire d'analyse chimique pour vérifier l'absence de substances nocives</li>
            </ul>
            <p>Notre équipe d'ingénieurs et de techniciens spécialisés utilise ces installations pour soumettre chaque produit à des tests bien plus rigoureux que les standards de l'industrie. Nous ne nous contentons pas de vérifier que le produit "fonctionne", nous nous assurons qu'il excelle dans toutes les conditions d'utilisation possibles.</p>
        `,
		imageUrl: '/img/quality-testing.jpg',
	},
	userFeedback: {
		title: "L'importance des retours clients",
		content: `
            <p>Notre processus de sélection ne s'arrête pas une fois qu'un produit est disponible dans notre catalogue. Nous avons mis en place un système de suivi continu de la satisfaction client et de la performance des produits "sur le terrain" :</p>
            <ul>
                <li>Entretiens approfondis avec les clients après 3, 6 et 12 mois d'utilisation</li>
                <li>Analyse détaillée de tous les retours et réclamations</li>
                <li>Veille continue pour détecter tout problème récurrent</li>
                <li>Audit biannuel de chaque produit pour confirmer qu'il mérite toujours sa place dans notre catalogue</li>
            </ul>
            <p>Si un produit ne maintient pas son niveau d'excellence dans le temps, nous n'hésitons pas à le retirer de notre catalogue, même s'il se vend bien. C'est cette rigueur qui nous permet de maintenir la confiance de nos clients à long terme.</p>
        `,
	},
	qualityTeam: {
		title: 'Notre équipe qualité',
		content: `
            <p>Derrière notre engagement qualité se trouve une équipe pluridisciplinaire de passionnés :</p>
        `,
		members: [
			{
				name: 'Dr. Élise Moreau',
				role: 'Directrice Qualité',
				bio: "Ingénieure matériaux avec 15 ans d'expérience dans le contrôle qualité pour l'industrie aérospatiale, Élise dirige notre laboratoire de tests et définit nos protocoles d'évaluation.",
				imageUrl: '/img/team-elise.jpg',
			},
			{
				name: 'Marc Dupont',
				role: 'Expert en durabilité',
				bio: "Spécialiste en cycle de vie des produits, Marc analyse l'impact environnemental et la durabilité de chaque article que nous considérons ajouter à notre catalogue.",
				imageUrl: '/img/team-marc.jpg',
			},
			{
				name: 'Lina Chen',
				role: 'Responsable des tests utilisateurs',
				bio: 'Avec un background en ergonomie et expérience utilisateur, Lina supervise les panels de testeurs et traduit leurs retours en améliorations concrètes.',
				imageUrl: '/img/team-lina.jpg',
			},
		],
	},
	qualityGuarantee: {
		title: 'Notre garantie qualité',
		content: `
            <p>Notre confiance dans notre processus de sélection nous permet d'offrir des garanties exceptionnelles :</p>
            <ul>
                <li><strong>Garantie satisfaction 30 jours</strong> : Si vous n'êtes pas entièrement satisfait de votre achat, nous vous remboursons intégralement, sans question et sans condition.</li>
                <li><strong>Garantie étendue 3 ans</strong> : Tous nos produits bénéficient d'une garantie fabricant étendue à 3 ans minimum, bien au-delà des standards du marché.</li>
                <li><strong>Support dédié</strong> : Une équipe spécialisée est à votre disposition pour répondre à toutes vos questions concernant l'utilisation et l'entretien de vos produits.</li>
                <li><strong>Engagement de suivi</strong> : Si un défaut est découvert après votre achat, nous vous contactons proactivement pour vous proposer un remplacement ou une solution.</li>
            </ul>
            <p>Ces garanties ne sont pas un argument marketing mais l'expression concrète de notre confiance dans les produits que nous sélectionnons.</p>
        `,
	},
	testimonials: {
		title: 'Ce que disent nos clients',
		quotes: [
			{
				text: "La différence est flagrante. J'ai acheté le même type de produit dans une grande enseigne avant de découvrir Votre Boutique. Le vôtre fonctionne toujours parfaitement après deux ans d'utilisation quotidienne.",
				author: 'François D., client depuis 2021',
			},
			{
				text: "Ce qui m'impressionne, c'est la constance de la qualité. Chaque produit que j'ai acheté chez vous depuis 3 ans a dépassé mes attentes en termes de durabilité et de performance.",
				author: 'Nadia K., cliente depuis 2020',
			},
			{
				text: "Au début, j'étais sceptique face aux prix légèrement plus élevés. Mais après plusieurs années d'utilisation sans le moindre problème, je comprends maintenant que c'est un investissement qui en vaut vraiment la peine.",
				author: 'Richard M., client depuis 2019',
			},
		],
	},
	faqs: {
		title: 'Questions fréquentes sur notre approche qualité',
		questions: [
			{
				question:
					'Pourquoi proposez-vous si peu de produits par catégorie ?',
				answer: "Notre philosophie est simple : moins mais mieux. Plutôt que de vous submerger avec des dizaines d'options similaires, nous sélectionnons uniquement le meilleur produit dans chaque catégorie, parfois avec une alternative premium. Cela simplifie votre choix tout en vous garantissant une qualité exceptionnelle quel que soit votre achat.",
			},
			{
				question:
					'Comment justifiez-vous des prix parfois plus élevés que la concurrence ?',
				answer: "Nos produits ne sont pas toujours plus chers, mais quand ils le sont, c'est pour une bonne raison. Nous privilégions des matériaux durables, une fabrication soignée et des performances supérieures qui se traduisent par une durée de vie bien plus longue. Sur le long terme, nos produits s'avèrent souvent plus économiques que des alternatives moins chères à remplacer fréquemment.",
			},
			{
				question:
					'Comment puis-je savoir si un produit correspond vraiment à mes besoins ?',
				answer: "Contrairement aux sites qui cherchent à vendre à tout prix, nos descriptions de produits sont précises et transparentes, indiquant clairement les cas d'usage idéaux. Notre service client est formé pour vous conseiller objectivement, quitte à vous déconseiller un achat si le produit ne correspond pas parfaitement à vos besoins.",
			},
			{
				question:
					'Que se passe-t-il si un produit ne répond plus à vos standards ?',
				answer: "Nous surveillons en permanence la qualité des produits de notre catalogue. Si un produit montre des signes de dégradation qualitative (changement de fabrication, retours clients négatifs, etc.), nous n'hésitons pas à le retirer de notre catalogue, même s'il est populaire. C'est arrivé plusieurs fois et c'est une décision difficile mais nécessaire pour maintenir notre promesse de qualité.",
			},
			{
				question:
					'Acceptez-vous les suggestions de nouveaux produits à évaluer ?',
				answer: 'Absolument ! Les recommandations de nos clients sont une source précieuse d\'information. Vous pouvez nous suggérer des produits via la section "Suggestions" de notre site. Chaque proposition est examinée par notre équipe et, si le produit semble prometteur, il entre dans notre processus d\'évaluation standard.',
			},
		],
	},
	conclusion: {
		title: "Notre vision pour l'avenir",
		content: `
            <p>Dans un monde de consommation effrénée et d'obsolescence programmée, nous pensons qu'une autre approche est non seulement possible, mais nécessaire. Notre vision est de contribuer à un changement de paradigme où :</p>
            <ul>
                <li>La qualité prévaut sur la quantité</li>
                <li>La durabilité supplante le jetable</li>
                <li>La valeur d'usage à long terme remplace la satisfaction immédiate</li>
                <li>La transparence devient la norme plutôt que l'exception</li>
            </ul>
            <p>En choisissant Votre Boutique, vous ne faites pas simplement un achat, vous soutenez cette vision et vous rejoignez une communauté grandissante de consommateurs exigeants qui veulent faire des choix plus éclairés et plus durables.</p>
            <p>Nous continuerons à perfectionner notre processus de sélection, à renforcer nos critères de qualité et à rechercher inlassablement les produits qui méritent véritablement votre confiance.</p>
        `,
	},
	cta: {
		title: 'Découvrez notre sélection',
		description:
			"Explorez notre catalogue de produits soigneusement sélectionnés et découvrez la différence qu'une qualité exceptionnelle peut faire.",
		buttonText: 'Voir nos produits',
		buttonLink: '/products',
	},
};

export default function AboutQualityPage() {
	return (
		<Suspense fallback={<AboutQualityLoading />}>
			<AboutQualityContent aboutQualityData={aboutQualityData} />
		</Suspense>
	);
}
