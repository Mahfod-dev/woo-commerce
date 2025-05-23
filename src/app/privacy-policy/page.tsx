// app/privacy/page.tsx
import { Suspense } from 'react';
import PrivacyContent from '@/components/PrivacyContent';
import '../styles/privacy.css';

// Métadonnées pour le SEO
export const metadata = {
	title: 'Politique de Confidentialité | Votre Boutique',
	description:
		'Découvrez comment nous collectons, utilisons et protégeons vos données personnelles. Notre politique de confidentialité explique vos droits et nos engagements en matière de protection des données.',
	keywords:
		'politique de confidentialité, protection des données, RGPD, données personnelles, confidentialité, cookies, vie privée, boutique en ligne',
};

// Composant de chargement pour Suspense
function PrivacyLoading() {
	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
			<div className='animate-pulse mb-12'>
				<div className='h-10 bg-gray-200 max-w-md mb-4 rounded'></div>
				<div className='h-4 bg-gray-200 max-w-xl rounded'></div>
			</div>

			<div className='animate-pulse space-y-4 mb-8'>
				{[...Array(3)].map((_, i) => (
					<div key={i}>
						<div className='h-6 bg-gray-200 w-1/4 mb-4 rounded'></div>
						<div className='space-y-2'>
							<div className='h-4 bg-gray-200 rounded w-full'></div>
							<div className='h-4 bg-gray-200 rounded w-full'></div>
							<div className='h-4 bg-gray-200 rounded w-3/4'></div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// Date de dernière mise à jour de la politique de confidentialité
const lastUpdated = '1er mai 2025';

// Structure de la politique de confidentialité
const privacyData = {
	lastUpdated,
	introduction: {
		title: 'Introduction',
		content: `
      <p>
        Chez Votre Boutique, nous accordons une importance capitale à la protection de votre vie privée et de vos données personnelles. Cette politique de confidentialité a pour objectif de vous informer sur la manière dont nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre site web et nos services.
      </p>
      <p>
        En utilisant notre site et nos services, vous consentez à la collecte et à l'utilisation de vos informations conformément à la présente politique. Nous vous encourageons à lire attentivement ce document pour comprendre nos pratiques concernant le traitement de vos données personnelles.
      </p>
      <p>
        Cette politique de confidentialité est conforme au Règlement Général sur la Protection des Données (RGPD) et aux autres législations applicables en matière de protection des données.
      </p>
    `,
	},
	sections: [
		{
			id: 'collected-data',
			title: 'Données que nous collectons',
			content: `
        <p>Nous collectons différents types de données lorsque vous visitez notre site, créez un compte ou effectuez un achat :</p>
        <h3>Données fournies directement par vous :</h3>
        <ul>
          <li><strong>Informations d'identification</strong> : nom, prénom, adresse email, numéro de téléphone</li>
          <li><strong>Informations de livraison et de facturation</strong> : adresse postale, code postal, ville, pays</li>
          <li><strong>Informations de paiement</strong> : nous ne stockons pas vos données de carte bancaire complètes, mais uniquement les informations nécessaires pour identifier les transactions</li>
          <li><strong>Contenu des communications</strong> : messages envoyés via notre formulaire de contact, emails, commentaires ou avis</li>
          <li><strong>Préférences utilisateur</strong> : produits favoris, historique d'achats, préférences marketing</li>
        </ul>
        
        <h3>Données collectées automatiquement :</h3>
        <ul>
          <li><strong>Données techniques</strong> : adresse IP, type et version de navigateur, système d'exploitation, résolution d'écran</li>
          <li><strong>Données de navigation</strong> : pages visitées, durée de la visite, parcours sur le site, termes de recherche utilisés</li>
          <li><strong>Données de performance</strong> : temps de chargement des pages, erreurs rencontrées</li>
          <li><strong>Données de localisation</strong> : pays et ville d'origine de la connexion, fuseau horaire</li>
        </ul>
        
        <h3>Données obtenues via des tiers :</h3>
        <ul>
          <li><strong>Réseaux sociaux</strong> : si vous vous connectez via un réseau social, nous pouvons recevoir certaines informations de votre profil</li>
          <li><strong>Partenaires commerciaux</strong> : informations partagées par nos partenaires commerciaux avec votre consentement</li>
          <li><strong>Sources publiques</strong> : informations légalement disponibles auprès de bases de données publiques</li>
        </ul>
      `,
		},
		{
			id: 'data-usage',
			title: 'Utilisation de vos données',
			content: `
        <p>Nous utilisons vos données personnelles pour les finalités suivantes :</p>
        
        <h3>Exécution du contrat et fourniture de nos services :</h3>
        <ul>
          <li>Traiter et gérer vos commandes</li>
          <li>Assurer la livraison des produits commandés</li>
          <li>Gérer votre compte client et vos préférences</li>
          <li>Fournir un service client adapté à vos besoins</li>
          <li>Faciliter les retours et remboursements</li>
        </ul>
        
        <h3>Intérêts légitimes :</h3>
        <ul>
          <li>Améliorer nos produits et services</li>
          <li>Analyser le comportement des utilisateurs pour optimiser notre site</li>
          <li>Détecter et prévenir les fraudes</li>
          <li>Assurer la sécurité de notre site et de nos systèmes</li>
          <li>Effectuer des analyses statistiques et études de marché</li>
        </ul>
        
        <h3>Avec votre consentement :</h3>
        <ul>
          <li>Vous envoyer des communications marketing personnalisées</li>
          <li>Vous proposer des offres et promotions adaptées à vos préférences</li>
          <li>Déposer certains cookies non essentiels au fonctionnement du site</li>
          <li>Partager certaines de vos données avec des partenaires sélectionnés</li>
        </ul>
        
        <h3>Obligations légales :</h3>
        <ul>
          <li>Respecter nos obligations comptables et fiscales</li>
          <li>Répondre aux demandes des autorités compétentes</li>
          <li>Établir, exercer ou défendre des droits en justice</li>
        </ul>
        
        <p>Nous nous assurons que chaque traitement de données est basé sur une base légale appropriée conformément au RGPD.</p>
      `,
		},
		{
			id: 'data-sharing',
			title: 'Partage de vos données',
			content: `
        <p>Nous ne vendons pas vos données personnelles à des tiers. Toutefois, nous pouvons être amenés à partager vos informations avec :</p>
        
        <h3>Prestataires de services :</h3>
        <ul>
          <li><strong>Services de paiement</strong> : pour traiter vos paiements de manière sécurisée</li>
          <li><strong>Services de livraison</strong> : pour vous livrer les produits commandés</li>
          <li><strong>Services d'hébergement et cloud</strong> : pour stocker nos données et faire fonctionner notre site</li>
          <li><strong>Services d'analyse</strong> : pour améliorer notre site et comprendre comment il est utilisé</li>
          <li><strong>Services de support client</strong> : pour vous assister en cas de besoin</li>
        </ul>
        
        <p>Ces prestataires sont liés par des clauses contractuelles qui les obligent à protéger vos données et à ne les utiliser que pour les finalités spécifiques que nous leur avons assignées.</p>
        
        <h3>Autorités et organismes compétents :</h3>
        <p>Nous pouvons être amenés à divulguer vos données personnelles si nous y sommes contraints par la loi, une décision de justice, ou si cette divulgation est nécessaire pour :</p>
        <ul>
          <li>Respecter nos obligations légales</li>
          <li>Protéger et défendre nos droits ou nos biens</li>
          <li>Prévenir ou enquêter sur d'éventuelles fraudes ou violations de la loi</li>
          <li>Protéger la sécurité personnelle des utilisateurs de notre site ou du public</li>
        </ul>
        
        <h3>En cas de transfert d'activité :</h3>
        <p>Dans l'hypothèse où tout ou partie de notre activité serait vendue ou transférée, les données personnelles pourraient faire partie des actifs transférés. Dans ce cas, nous vous en informerions et nous nous assurerions que vos données restent protégées conformément à cette politique de confidentialité.</p>
        
        <h3>Transferts internationaux :</h3>
        <p>Certains de nos partenaires et prestataires de services peuvent être situés en dehors de l'Union Européenne. Dans ce cas, nous nous assurons que des garanties appropriées sont mises en place conformément au RGPD, telles que des clauses contractuelles types approuvées par la Commission européenne ou l'adhésion au Privacy Shield.</p>
      `,
		},
		{
			id: 'cookies',
			title: 'Utilisation des cookies',
			content: `
        <p>Notre site utilise des cookies et technologies similaires pour améliorer votre expérience utilisateur, analyser le trafic et personnaliser notre contenu.</p>
        
        <h3>Qu'est-ce qu'un cookie ?</h3>
        <p>Un cookie est un petit fichier texte placé sur votre ordinateur, tablette ou smartphone lorsque vous visitez un site web. Les cookies nous permettent de reconnaître votre appareil et de mémoriser certaines informations sur votre visite.</p>
        
        <h3>Types de cookies que nous utilisons :</h3>
        <ul>
          <li><strong>Cookies essentiels</strong> : nécessaires au fonctionnement du site (gestion de session, mémorisation des articles du panier, sécurité)</li>
          <li><strong>Cookies de performance</strong> : nous aident à comprendre comment les visiteurs interagissent avec notre site en collectant des informations anonymes</li>
          <li><strong>Cookies de fonctionnalité</strong> : permettent au site de se souvenir de vos choix et préférences pour offrir une expérience personnalisée</li>
          <li><strong>Cookies de ciblage/publicitaires</strong> : utilisés pour vous proposer des publicités pertinentes en fonction de vos centres d'intérêt et de votre comportement sur notre site</li>
        </ul>
        
        <h3>Gestion des cookies :</h3>
        <p>Lors de votre première visite sur notre site, un bandeau d'information vous informe de l'utilisation des cookies et vous demande votre consentement pour les cookies non essentiels. Vous pouvez à tout moment modifier vos préférences en matière de cookies via notre centre de préférences accessible en bas de page.</p>
        
        <p>Vous pouvez également configurer votre navigateur pour qu'il refuse tous les cookies ou vous avertisse lorsqu'un cookie est envoyé. Cependant, certaines fonctionnalités de notre site peuvent ne pas fonctionner correctement si vous désactivez les cookies.</p>
        
        <p>Pour plus d'informations sur les cookies spécifiques que nous utilisons et leur durée de conservation, veuillez consulter notre <a href="/cookie-policy" class="text-indigo-600 hover:text-indigo-800">Politique de cookies</a>.</p>
      `,
		},
		{
			id: 'data-security',
			title: 'Sécurité de vos données',
			content: `
        <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre toute perte, accès non autorisé, divulgation, altération ou destruction.</p>
        
        <h3>Nos mesures de sécurité comprennent :</h3>
        <ul>
          <li><strong>Chiffrement</strong> : toutes les données transmises entre votre navigateur et notre site sont chiffrées à l'aide du protocole SSL/TLS</li>
          <li><strong>Accès restreint</strong> : seuls les employés, agents et prestataires qui ont besoin d'accéder à vos données pour accomplir leurs tâches y ont accès</li>
          <li><strong>Authentification</strong> : mise en place de systèmes d'authentification robustes, incluant l'authentification à deux facteurs pour les accès administratifs</li>
          <li><strong>Surveillance</strong> : nos systèmes sont surveillés en permanence pour détecter d'éventuelles vulnérabilités ou tentatives d'intrusion</li>
          <li><strong>Sauvegardes</strong> : réalisation régulière de sauvegardes pour prévenir toute perte de données</li>
          <li><strong>Formation</strong> : sensibilisation et formation régulière de notre personnel aux bonnes pratiques en matière de sécurité des données</li>
        </ul>
        
        <h3>En cas de violation de données :</h3>
        <p>En cas de violation de données susceptible d'engendrer un risque élevé pour vos droits et libertés, nous nous engageons à vous en informer dans les meilleurs délais et à prendre toutes les mesures nécessaires pour limiter les conséquences de cette violation.</p>
        
        <p>Bien que nous mettions tout en œuvre pour protéger vos données, aucune méthode de transmission sur Internet ou de stockage électronique n'est totalement sécurisée. Nous ne pouvons donc pas garantir une sécurité absolue.</p>
      `,
		},
		{
			id: 'data-retention',
			title: 'Conservation des données',
			content: `
        <p>Nous conservons vos données personnelles aussi longtemps que nécessaire pour atteindre les finalités pour lesquelles elles ont été collectées, notamment pour satisfaire à nos obligations légales, résoudre les litiges et faire respecter nos accords.</p>
        
        <h3>Durées de conservation spécifiques :</h3>
        <ul>
          <li><strong>Données de compte client</strong> : conservées tant que votre compte est actif ou pour la durée nécessaire à la fourniture de nos services</li>
          <li><strong>Données de commande</strong> : conservées pendant 10 ans à compter de la commande, conformément à nos obligations légales en matière comptable et fiscale</li>
          <li><strong>Données de navigation et cookies</strong> : selon le type de cookie, de 30 jours à 13 mois maximum</li>
          <li><strong>Données de prospection commerciale</strong> : conservées pendant 3 ans à compter du dernier contact avec vous</li>
        </ul>
        
        <p>À l'expiration de ces périodes, vos données sont soit supprimées, soit anonymisées pour être utilisées à des fins statistiques.</p>
        
        <h3>Comptes inactifs :</h3>
        <p>Si vous n'utilisez pas votre compte pendant une période prolongée (généralement plus de 3 ans), nous pouvons être amenés à le désactiver ou à le supprimer après vous avoir préalablement contacté pour vous informer de cette démarche.</p>
      `,
		},
		{
			id: 'user-rights',
			title: 'Vos droits sur vos données',
			content: `
        <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants concernant vos données personnelles :</p>
        
        <h3>Droits d'accès et d'information :</h3>
        <ul>
          <li><strong>Droit d'accès</strong> : vous pouvez obtenir une copie des données personnelles que nous détenons à votre sujet</li>
          <li><strong>Droit à l'information</strong> : vous pouvez demander des informations complémentaires sur la façon dont nous traitons vos données</li>
        </ul>
        
        <h3>Droits de rectification et de suppression :</h3>
        <ul>
          <li><strong>Droit de rectification</strong> : vous pouvez demander la correction des données inexactes ou incomplètes</li>
          <li><strong>Droit à l'effacement</strong> : vous pouvez demander la suppression de vos données dans certaines circonstances</li>
        </ul>
        
        <h3>Droits de limitation et d'opposition :</h3>
        <ul>
          <li><strong>Droit à la limitation</strong> : vous pouvez demander la limitation du traitement de vos données</li>
          <li><strong>Droit d'opposition</strong> : vous pouvez vous opposer au traitement de vos données, notamment à des fins de marketing direct</li>
        </ul>
        
        <h3>Autres droits :</h3>
        <ul>
          <li><strong>Droit à la portabilité</strong> : vous pouvez demander à recevoir vos données dans un format structuré, couramment utilisé et lisible par machine</li>
          <li><strong>Droit de retirer votre consentement</strong> : vous pouvez retirer votre consentement à tout moment lorsque le traitement est basé sur celui-ci</li>
        </ul>
        
        <h3>Comment exercer vos droits :</h3>
        <p>Pour exercer l'un de ces droits, vous pouvez nous contacter via :</p>
        <ul>
          <li>Notre formulaire dédié dans la section "Mon compte" de notre site</li>
          <li>Par email à l'adresse : privacy@votreboutique.com</li>
          <li>Par courrier à : Votre Boutique - Service Protection des Données, [adresse postale]</li>
        </ul>
        
        <p>Nous nous efforçons de répondre à toutes les demandes légitimes dans un délai d'un mois. Ce délai peut être prolongé si votre demande est particulièrement complexe ou si vous avez fait plusieurs demandes. Dans ce cas, nous vous informerons de cette prolongation et des motifs du report.</p>
        
        <h3>Réclamation auprès d'une autorité de contrôle :</h3>
        <p>Si vous estimez que nous n'avons pas répondu à vos préoccupations de manière satisfaisante, vous avez le droit d'introduire une réclamation auprès de l'autorité de protection des données de votre pays de résidence. En France, il s'agit de la Commission Nationale de l'Informatique et des Libertés (CNIL) que vous pouvez contacter sur <a href="https://www.cnil.fr" class="text-indigo-600 hover:text-indigo-800">www.cnil.fr</a>.</p>
      `,
		},
		{
			id: 'children-privacy',
			title: 'Protection des mineurs',
			content: `
        <p>Notre site et nos services ne s'adressent pas aux personnes de moins de 16 ans et nous ne collectons pas sciemment des données personnelles concernant des enfants de moins de 16 ans.</p>
        
        <p>Si vous êtes un parent ou un tuteur et que vous pensez que votre enfant nous a fourni des informations personnelles sans votre consentement, veuillez nous contacter immédiatement à privacy@votreboutique.com. Si nous découvrons que nous avons collecté des données personnelles d'un enfant sans vérification du consentement parental, nous prenons des mesures pour supprimer ces informations de nos serveurs.</p>
        
        <p>Pour les personnes âgées de 16 à 18 ans, l'utilisation de nos services est possible avec l'autorisation du titulaire de l'autorité parentale. Nous nous réservons le droit de vérifier cette autorisation à tout moment.</p>
      `,
		},
		{
			id: 'third-party-links',
			title: 'Liens vers des sites tiers',
			content: `
        <p>Notre site peut contenir des liens vers des sites web, des plug-ins et des applications de tiers. Cliquer sur ces liens ou activer ces connexions peut permettre à des tiers de collecter ou de partager des données vous concernant.</p>
        
        <p>Nous n'avons aucun contrôle sur ces sites web tiers et ne sommes pas responsables de leurs déclarations de confidentialité. Lorsque vous quittez notre site, nous vous encourageons à lire la politique de confidentialité de chaque site que vous visitez.</p>
        
        <p>Ces sites tiers peuvent inclure :</p>
        <ul>
          <li>Réseaux sociaux (Facebook, Instagram, Twitter, LinkedIn...)</li>
          <li>Plateformes de paiement (PayPal, Stripe...)</li>
          <li>Services d'analyse et de publicité (Google Analytics, Facebook Pixel...)</li>
          <li>Partenaires commerciaux et affiliés</li>
        </ul>
        
        <p>Nous vous recommandons de consulter les politiques de confidentialité de ces sites avant de leur fournir vos données personnelles.</p>
      `,
		},
		{
			id: 'policy-updates',
			title: 'Modifications de notre politique',
			content: `
        <p>Nous pouvons être amenés à modifier cette politique de confidentialité de temps à autre pour refléter des changements dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires.</p>
        
        <p>En cas de modification substantielle, nous vous en informerons par email ou par un avis visible sur notre site avant que les changements ne prennent effet. Nous vous encourageons à consulter régulièrement cette page pour prendre connaissance des dernières informations sur nos pratiques en matière de confidentialité.</p>
        
        <p>La date de dernière mise à jour en haut de cette politique vous permet de savoir quand elle a été révisée pour la dernière fois.</p>
        
        <p>En continuant à utiliser notre site après ces modifications, vous reconnaissez avoir pris connaissance de la version mise à jour de notre politique de confidentialité et vous acceptez de vous y conformer.</p>
      `,
		},
		{
			id: 'contact-us',
			title: 'Nous contacter',
			content: `
        <p>Si vous avez des questions concernant cette politique de confidentialité ou nos pratiques en matière de protection des données, n'hésitez pas à nous contacter :</p>
        
        <ul>
          <li><strong>Par email</strong> : privacy@votreboutique.com</li>
          <li><strong>Par courrier</strong> : Votre Boutique - Service Protection des Données, [adresse postale]</li>
          <li><strong>Par téléphone</strong> : [numéro de téléphone] (du lundi au vendredi, de 9h à 18h)</li>
        </ul>
        
        <h3>Délégué à la protection des données :</h3>
        <p>Nous avons désigné un délégué à la protection des données (DPO) qui est chargé de superviser les questions relatives à cette politique de confidentialité. Pour toute question ou préoccupation concernant vos données personnelles, vous pouvez contacter notre DPO directement à dpo@votreboutique.com.</p>
        
        <p>Nous nous efforçons de répondre à toutes les demandes dans un délai raisonnable et de résoudre tout problème à votre entière satisfaction.</p>
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
