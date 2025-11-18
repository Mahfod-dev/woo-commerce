// app/privacy/page.tsx
import { Suspense } from 'react';
import PrivacyContent from '@/components/PrivacyContent';
import '../styles/about.css';

// Métadonnées pour le SEO
export const metadata = {
	title: 'Politique de confidentialité | Selectura - Protection de vos données',
	description:
		'Découvrez comment Selectura collecte, utilise et protège vos données personnelles. Notre engagement pour votre vie privée et la sécurité de vos informations.',
	keywords:
		'politique de confidentialité, protection des données, vie privée, RGPD, données personnelles, sécurité',
	openGraph: {
		title: 'Politique de confidentialité | Selectura',
		description: 'Notre engagement pour la protection de vos données personnelles et le respect de votre vie privée.',
		type: 'website',
		locale: 'fr_FR',
		url: 'https://selectura.co/privacy',
		siteName: 'Selectura',
	},
	twitter: {
		card: 'summary',
		title: 'Politique de confidentialité | Selectura',
		description: 'Notre engagement pour la protection de vos données personnelles.',
	},
	alternates: {
		canonical: 'https://selectura.co/privacy',
	},
	robots: {
		index: true,
		follow: true,
	},
};

// Composant de chargement pour Suspense
function PrivacyLoading() {
	return (
		<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
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
		</div>
	);
}

// Données de contenu pour la politique de confidentialité
const privacyData = {
	lastUpdated: '15 janvier 2025',
	introduction: {
		title: 'Introduction',
		content: `
			<p>Chez Selectura, nous prenons très au sérieux la protection de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations lorsque vous utilisez notre site web et nos services.</p>
			<p>En utilisant nos services, vous acceptez les pratiques décrites dans cette politique de confidentialité. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.</p>
		`,
	},
	sections: [
		{
			id: 'data-collection',
			title: 'Données que nous collectons',
			content: `
				<p>Nous collectons différents types de données pour vous fournir nos services et les améliorer :</p>
				<h3>Informations que vous nous fournissez</h3>
				<ul>
					<li><strong>Informations de compte :</strong> nom, prénom, adresse e-mail, mot de passe (crypté)</li>
					<li><strong>Informations de livraison :</strong> adresse postale, numéro de téléphone</li>
					<li><strong>Informations de paiement :</strong> les informations de carte bancaire sont traitées directement par nos prestataires de paiement sécurisés (Stripe, PayPal) et ne sont jamais stockées sur nos serveurs</li>
					<li><strong>Communications :</strong> contenu de vos messages lorsque vous nous contactez</li>
				</ul>

				<h3>Informations collectées automatiquement</h3>
				<ul>
					<li><strong>Données de navigation :</strong> pages visitées, durée des visites, liens cliqués</li>
					<li><strong>Informations techniques :</strong> adresse IP, type de navigateur, système d'exploitation, identifiant unique de l'appareil</li>
					<li><strong>Cookies :</strong> voir notre section dédiée ci-dessous</li>
				</ul>
			`,
		},
		{
			id: 'data-usage',
			title: 'Comment nous utilisons vos données',
			content: `
				<p>Nous utilisons vos données personnelles pour :</p>
				<ul>
					<li><strong>Traiter vos commandes :</strong> préparer, expédier et livrer vos achats</li>
					<li><strong>Gérer votre compte :</strong> vous permettre d'accéder à votre espace client et à l'historique de vos commandes</li>
					<li><strong>Communiquer avec vous :</strong> répondre à vos questions, vous informer de l'état de vos commandes, vous envoyer des notifications importantes</li>
					<li><strong>Améliorer nos services :</strong> analyser l'utilisation de notre site pour optimiser l'expérience utilisateur</li>
					<li><strong>Marketing (avec votre consentement) :</strong> vous envoyer des offres promotionnelles, newsletters et recommandations de produits</li>
					<li><strong>Prévenir la fraude :</strong> détecter et prévenir les activités frauduleuses ou illégales</li>
					<li><strong>Respecter nos obligations légales :</strong> conformité fiscale, comptable et réglementaire</li>
				</ul>
			`,
		},
		{
			id: 'data-sharing',
			title: 'Partage de vos données',
			content: `
				<p>Nous ne vendons jamais vos données personnelles à des tiers. Nous partageons vos informations uniquement dans les cas suivants :</p>
				<ul>
					<li><strong>Prestataires de services :</strong> entreprises qui nous aident à fournir nos services (hébergement, paiement, livraison, support client). Ces prestataires ont accès uniquement aux données nécessaires à l'exécution de leurs services et sont tenus par des accords de confidentialité.</li>
					<li><strong>Obligations légales :</strong> si la loi l'exige ou pour protéger nos droits, notre sécurité ou celle d'autrui</li>
					<li><strong>Fusion ou acquisition :</strong> en cas de fusion, vente ou transfert de tout ou partie de notre entreprise</li>
				</ul>

				<h3>Nos principaux partenaires</h3>
				<ul>
					<li><strong>Hébergement :</strong> Vercel (États-Unis)</li>
					<li><strong>Paiement :</strong> Stripe et PayPal (conformes PCI-DSS)</li>
					<li><strong>Livraison :</strong> transporteurs agréés selon votre localisation</li>
					<li><strong>Analytique :</strong> Google Analytics (données anonymisées)</li>
				</ul>
			`,
		},
		{
			id: 'cookies',
			title: 'Cookies et technologies similaires',
			content: `
				<p>Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience sur notre site.</p>

				<h3>Types de cookies utilisés</h3>
				<ul>
					<li><strong>Cookies essentiels :</strong> nécessaires au fonctionnement du site (panier, authentification). Ces cookies ne peuvent pas être désactivés.</li>
					<li><strong>Cookies de performance :</strong> collectent des informations anonymes sur l'utilisation du site</li>
					<li><strong>Cookies fonctionnels :</strong> mémorisent vos préférences (langue, devise)</li>
					<li><strong>Cookies marketing :</strong> suivent votre navigation pour afficher des publicités pertinentes (avec votre consentement)</li>
				</ul>

				<h3>Gestion des cookies</h3>
				<p>Vous pouvez gérer vos préférences de cookies à tout moment via notre bannière de cookies ou les paramètres de votre navigateur. Notez que désactiver certains cookies peut affecter le fonctionnement du site.</p>
			`,
		},
		{
			id: 'data-security',
			title: 'Sécurité de vos données',
			content: `
				<p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données personnelles :</p>
				<ul>
					<li><strong>Chiffrement :</strong> connexion HTTPS/SSL pour toutes les communications</li>
					<li><strong>Authentification sécurisée :</strong> mots de passe cryptés avec des algorithmes robustes</li>
					<li><strong>Accès limité :</strong> seuls les employés autorisés ont accès aux données personnelles</li>
					<li><strong>Surveillance :</strong> détection et prévention des intrusions</li>
					<li><strong>Sauvegardes régulières :</strong> pour prévenir la perte de données</li>
					<li><strong>Audits de sécurité :</strong> tests et mises à jour réguliers de nos systèmes</li>
				</ul>
				<p>Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est 100% sécurisée. Nous ne pouvons donc garantir une sécurité absolue.</p>
			`,
		},
		{
			id: 'data-retention',
			title: 'Conservation des données',
			content: `
				<p>Nous conservons vos données personnelles uniquement le temps nécessaire aux finalités pour lesquelles elles ont été collectées :</p>
				<ul>
					<li><strong>Données de compte :</strong> tant que votre compte est actif, puis 3 ans après la dernière activité</li>
					<li><strong>Données de commande :</strong> 10 ans pour les obligations comptables et fiscales</li>
					<li><strong>Données marketing :</strong> 3 ans après le dernier contact</li>
					<li><strong>Cookies analytiques :</strong> 13 mois maximum</li>
				</ul>
				<p>À l'expiration de ces délais, vos données sont supprimées ou anonymisées de manière sécurisée.</p>
			`,
		},
		{
			id: 'your-rights',
			title: 'Vos droits',
			content: `
				<p>Conformément au Règlement Général sur la Protection des Données (RGPD) et aux lois applicables, vous disposez des droits suivants :</p>
				<ul>
					<li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
					<li><strong>Droit de rectification :</strong> corriger des données inexactes ou incomplètes</li>
					<li><strong>Droit à l'effacement :</strong> demander la suppression de vos données (« droit à l'oubli »)</li>
					<li><strong>Droit à la limitation :</strong> restreindre le traitement de vos données dans certains cas</li>
					<li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré et les transférer à un autre responsable de traitement</li>
					<li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données pour des raisons légitimes</li>
					<li><strong>Droit de retirer votre consentement :</strong> pour les traitements basés sur le consentement (marketing notamment)</li>
					<li><strong>Droit de déposer une plainte :</strong> auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés)</li>
				</ul>

				<h3>Comment exercer vos droits</h3>
				<p>Pour exercer l'un de ces droits, contactez-nous à <strong>support@flowcontent.io</strong> en précisant votre demande. Nous vous répondrons dans un délai d'un mois maximum.</p>
				<p>Pour protéger votre vie privée, nous pouvons vous demander de vérifier votre identité avant de traiter votre demande.</p>
			`,
		},
		{
			id: 'children',
			title: 'Protection des mineurs',
			content: `
				<p>Notre site n'est pas destiné aux enfants de moins de 16 ans. Nous ne collectons pas sciemment d'informations personnelles auprès d'enfants.</p>
				<p>Si vous êtes parent ou tuteur légal et que vous pensez que votre enfant nous a fourni des informations personnelles, contactez-nous immédiatement à <strong>support@flowcontent.io</strong> pour que nous puissions supprimer ces données.</p>
			`,
		},
		{
			id: 'international',
			title: 'Transferts internationaux',
			content: `
				<p>Vos données peuvent être transférées et stockées sur des serveurs situés en dehors de l'Union Européenne, notamment aux États-Unis (hébergement Vercel).</p>
				<p>Dans ce cas, nous nous assurons que des garanties appropriées sont en place pour protéger vos données conformément au RGPD, notamment :</p>
				<ul>
					<li>Clauses contractuelles types approuvées par la Commission Européenne</li>
					<li>Certifications de conformité (Privacy Shield successeur, etc.)</li>
					<li>Engagement de nos prestataires à respecter les normes européennes de protection des données</li>
				</ul>
			`,
		},
		{
			id: 'updates',
			title: 'Modifications de cette politique',
			content: `
				<p>Nous pouvons mettre à jour cette politique de confidentialité de temps en temps pour refléter les changements dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires.</p>
				<p>Toute modification sera publiée sur cette page avec une nouvelle date de « Dernière mise à jour ». Pour les changements importants, nous vous informerons par e-mail ou via une notification sur notre site.</p>
				<p>Nous vous encourageons à consulter régulièrement cette page pour rester informé de nos pratiques en matière de confidentialité.</p>
			`,
		},
		{
			id: 'contact',
			title: 'Nous contacter',
			content: `
				<p>Pour toute question concernant cette politique de confidentialité ou nos pratiques en matière de données personnelles, vous pouvez nous contacter :</p>
				<ul>
					<li><strong>Par e-mail :</strong> support@flowcontent.io</li>
					<li><strong>Par téléphone :</strong> +19136759287</li>
					<li><strong>Par courrier :</strong> Selectura, 254 rue Vendôme, Lyon 003, France</li>
				</ul>

				<p><strong>Délégué à la Protection des Données (DPO) :</strong></p>
				<p>Si vous avez des préoccupations spécifiques concernant le traitement de vos données personnelles, vous pouvez contacter notre DPO à : <strong>dpo@flowcontent.io</strong></p>
			`,
		},
	],
};

export default function PrivacyPage() {
	return (
		<Suspense fallback={<PrivacyLoading />}>
			<PrivacyContent privacyData={privacyData} />
		</Suspense>
	);
}
