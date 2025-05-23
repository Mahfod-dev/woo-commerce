// app/cookie-policy/page.tsx
import { Suspense } from 'react';
import CookiePolicyContent from '@/components/CookiePolicyContent';
import '../styles/privacy.css';

// Métadonnées pour le SEO
export const metadata = {
	title: 'Politique de Cookies | Selectura',
	description:
		'Découvrez comment nous utilisons les cookies sur notre site. Notre politique de cookies explique les types de cookies utilisés, leur finalité et comment les gérer.',
	keywords:
		'politique cookies, cookies, navigation, préférences, données de navigation, Selectura, protection données',
	themeColor: '#4338ca',
	openGraph: {
		title: 'Politique de Cookies | Selectura',
		description: 'Comprenez notre utilisation des cookies et comment les gérer selon vos préférences.',
		type: 'website',
	},
};

// Composant de chargement pour Suspense
function CookiePolicyLoading() {
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

// Date de dernière mise à jour de la politique de cookies
const lastUpdated = '15 janvier 2025';

// Structure de la politique de cookies
const cookiePolicyData = {
	lastUpdated,
	introduction: {
		title: 'Qu\'est-ce qu\'un cookie ?',
		content: `
      <p>
        Un cookie est un petit fichier texte stocké sur votre ordinateur, tablette ou smartphone lorsque vous visitez notre site web Selectura. Les cookies nous permettent de reconnaître votre appareil et de vous offrir une expérience de navigation personnalisée et optimisée.
      </p>
      <p>
        Cette politique de cookies vous explique comment nous utilisons les cookies, pourquoi nous les utilisons et comment vous pouvez les gérer selon vos préférences. En continuant à naviguer sur notre site, vous acceptez l'utilisation des cookies conformément à cette politique.
      </p>
      <p>
        Nous respectons votre vie privée et nous nous engageons à vous donner le contrôle sur les cookies que nous utilisons, conformément au Règlement Général sur la Protection des Données (RGPD).
      </p>
    `,
	},
	sections: [
		{
			id: 'cookie-types',
			title: 'Types de cookies que nous utilisons',
			content: `
        <p>Nous utilisons différents types de cookies sur notre site Selectura, chacun ayant des finalités spécifiques :</p>
        
        <h3>1. Cookies essentiels (obligatoires)</h3>
        <p>Ces cookies sont indispensables au fonctionnement de notre site et ne peuvent pas être désactivés. Ils vous permettent de :</p>
        <ul>
          <li><strong>Naviguer sur le site</strong> : maintenir votre session active pendant que vous parcourez nos pages</li>
          <li><strong>Gérer votre panier</strong> : mémoriser les produits que vous ajoutez à votre panier d'achat</li>
          <li><strong>Sécuriser vos interactions</strong> : protéger votre navigation contre les attaques CSRF</li>
          <li><strong>Maintenir vos préférences de cookies</strong> : se souvenir de vos choix concernant les cookies</li>
          <li><strong>Authentification</strong> : vous maintenir connecté à votre compte client</li>
        </ul>
        <p><em>Durée de vie :</em> Session (supprimés à la fermeture du navigateur) ou 24h maximum</p>
        
        <h3>2. Cookies de performance et d'analyse</h3>
        <p>Ces cookies nous aident à comprendre comment vous utilisez notre site pour l'améliorer en continu :</p>
        <ul>
          <li><strong>Google Analytics</strong> : collecte des données anonymes sur votre navigation (pages visitées, durée, rebond)</li>
          <li><strong>Statistiques de performance</strong> : mesure les temps de chargement et détecte les erreurs</li>
          <li><strong>Analyse du comportement</strong> : comprend les parcours d'achat pour optimiser l'expérience</li>
          <li><strong>A/B Testing</strong> : teste différentes versions de pages pour améliorer l'ergonomie</li>
        </ul>
        <p><em>Durée de vie :</em> 13 mois maximum</p>
        
        <h3>3. Cookies de fonctionnalité</h3>
        <p>Ces cookies améliorent votre expérience en mémorisant vos préférences :</p>
        <ul>
          <li><strong>Langue préférée</strong> : mémorise votre choix de langue</li>
          <li><strong>Localisation</strong> : retient votre région pour afficher les prix et disponibilités</li>
          <li><strong>Produits vus récemment</strong> : affiche les articles que vous avez consultés</li>
          <li><strong>Préférences d'affichage</strong> : grille ou liste de produits, tri par défaut</li>
          <li><strong>Favoris</strong> : sauvegarde temporaire de vos produits favoris avant connexion</li>
        </ul>
        <p><em>Durée de vie :</em> 12 mois maximum</p>
        
        <h3>4. Cookies de ciblage et publicitaires</h3>
        <p>Ces cookies nous permettent de vous proposer des contenus et publicités pertinents :</p>
        <ul>
          <li><strong>Publicités personnalisées</strong> : affichent des produits similaires à vos centres d'intérêt</li>
          <li><strong>Retargeting</strong> : vous proposent des produits vus sur d'autres sites partenaires</li>
          <li><strong>Réseaux sociaux</strong> : boutons de partage Facebook, Instagram, Pinterest</li>
          <li><strong>Mesure publicitaire</strong> : évaluent l'efficacité de nos campagnes marketing</li>
        </ul>
        <p><em>Durée de vie :</em> 13 mois maximum</p>
      `,
		},
		{
			id: 'cookie-purposes',
			title: 'Pourquoi utilisons-nous des cookies ?',
			content: `
        <p>Les cookies nous permettent d'améliorer continuellement votre expérience sur Selectura :</p>
        
        <h3>Améliorer votre expérience de navigation</h3>
        <ul>
          <li>Accélérer le chargement des pages en mémorisant certains éléments</li>
          <li>Personnaliser le contenu selon vos préférences et votre historique</li>
          <li>Maintenir votre panier d'achat même si vous fermez votre navigateur</li>
          <li>Éviter de vous redemander certaines informations déjà fournies</li>
        </ul>
        
        <h3>Analyser et optimiser notre site</h3>
        <ul>
          <li>Comprendre quelles pages sont les plus populaires et utiles</li>
          <li>Identifier les problèmes techniques et les corriger rapidement</li>
          <li>Optimiser nos parcours d'achat pour réduire les abandons de panier</li>
          <li>Adapter notre contenu aux besoins réels de nos visiteurs</li>
        </ul>
        
        <h3>Assurer la sécurité</h3>
        <ul>
          <li>Protéger votre compte contre les accès non autorisés</li>
          <li>Détecter et prévenir les tentatives de fraude</li>
          <li>Vérifier que vous êtes bien à l'origine de vos actions</li>
        </ul>
        
        <h3>Personnaliser votre expérience</h3>
        <ul>
          <li>Vous recommander des produits qui correspondent à vos goûts</li>
          <li>Adapter nos offres et promotions à vos intérêts</li>
          <li>Vous proposer du contenu pertinent selon votre profil</li>
        </ul>
      `,
		},
		{
			id: 'cookie-list',
			title: 'Liste détaillée des cookies',
			content: `
        <p>Voici la liste complète des cookies utilisés sur notre site Selectura :</p>
        
        <h3>Cookies essentiels</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200 mt-4">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-900">Nom</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-900">Finalité</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-900">Durée</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr>
                <td class="px-4 py-2 text-sm text-gray-900 font-mono">next-auth.session-token</td>
                <td class="px-4 py-2 text-sm text-gray-600">Authentification utilisateur</td>
                <td class="px-4 py-2 text-sm text-gray-600">Session</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm text-gray-900 font-mono">cart-items</td>
                <td class="px-4 py-2 text-sm text-gray-600">Mémorisation du panier d'achat</td>
                <td class="px-4 py-2 text-sm text-gray-600">7 jours</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm text-gray-900 font-mono">cookie-preferences</td>
                <td class="px-4 py-2 text-sm text-gray-600">Mémorisation de vos choix de cookies</td>
                <td class="px-4 py-2 text-sm text-gray-600">12 mois</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm text-gray-900 font-mono">csrf-token</td>
                <td class="px-4 py-2 text-sm text-gray-600">Protection contre les attaques CSRF</td>
                <td class="px-4 py-2 text-sm text-gray-600">Session</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h3>Cookies d'analyse</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200 mt-4">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-900">Nom</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-900">Finalité</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-900">Durée</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr>
                <td class="px-4 py-2 text-sm text-gray-900 font-mono">_ga</td>
                <td class="px-4 py-2 text-sm text-gray-600">Google Analytics - Identification unique</td>
                <td class="px-4 py-2 text-sm text-gray-600">2 ans</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm text-gray-900 font-mono">_ga_*</td>
                <td class="px-4 py-2 text-sm text-gray-600">Google Analytics - État de session</td>
                <td class="px-4 py-2 text-sm text-gray-600">2 ans</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm text-gray-900 font-mono">_gid</td>
                <td class="px-4 py-2 text-sm text-gray-600">Google Analytics - Distinction des utilisateurs</td>
                <td class="px-4 py-2 text-sm text-gray-600">24 heures</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h3>Cookies de fonctionnalité</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200 mt-4">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-900">Nom</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-900">Finalité</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-900">Durée</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr>
                <td class="px-4 py-2 text-sm text-gray-900 font-mono">user-preferences</td>
                <td class="px-4 py-2 text-sm text-gray-600">Mémorisation des préférences d'affichage</td>
                <td class="px-4 py-2 text-sm text-gray-600">12 mois</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm text-gray-900 font-mono">recently-viewed</td>
                <td class="px-4 py-2 text-sm text-gray-600">Produits vus récemment</td>
                <td class="px-4 py-2 text-sm text-gray-600">30 jours</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm text-gray-900 font-mono">wishlist-temp</td>
                <td class="px-4 py-2 text-sm text-gray-600">Liste de souhaits temporaire</td>
                <td class="px-4 py-2 text-sm text-gray-600">30 jours</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
		},
		{
			id: 'manage-cookies',
			title: 'Comment gérer vos cookies',
			content: `
        <p>Vous avez le contrôle total sur les cookies que nous utilisons. Voici comment les gérer :</p>
        
        <h3>Centre de préférences Selectura</h3>
        <p>Vous pouvez à tout moment modifier vos préférences concernant les cookies en utilisant notre centre de préférences accessible :</p>
        <ul>
          <li>En cliquant sur le lien "Gestion des cookies" en bas de page</li>
          <li>Via le bouton "Paramètres des cookies" dans votre compte client</li>
          <li>En cliquant <a href="#" onclick="openCookieSettings()" class="text-indigo-600 hover:text-indigo-800 underline">ici pour ouvrir le centre de préférences</a></li>
        </ul>
        
        <h3>Paramètres de votre navigateur</h3>
        <p>Vous pouvez également gérer les cookies directement dans votre navigateur :</p>
        
        <h4>Google Chrome :</h4>
        <ol>
          <li>Cliquez sur les trois points verticaux > Paramètres</li>
          <li>Allez dans "Confidentialité et sécurité" > "Cookies et autres données de sites"</li>
          <li>Choisissez vos préférences ou gérez les cookies site par site</li>
        </ol>
        
        <h4>Firefox :</h4>
        <ol>
          <li>Cliquez sur le menu hamburger > Paramètres</li>
          <li>Allez dans "Vie privée et sécurité"</li>
          <li>Dans la section "Cookies et données de sites web", cliquez sur "Gérer les données"</li>
        </ol>
        
        <h4>Safari :</h4>
        <ol>
          <li>Allez dans Safari > Préférences</li>
          <li>Cliquez sur l'onglet "Confidentialité"</li>
          <li>Ajustez vos paramètres de cookies et de suivi</li>
        </ol>
        
        <h4>Microsoft Edge :</h4>
        <ol>
          <li>Cliquez sur les trois points > Paramètres</li>
          <li>Allez dans "Cookies et autorisations de site"</li>
          <li>Gérez vos préférences de cookies</li>
        </ol>
        
        <h3>Impact de la désactivation des cookies</h3>
        <p><strong>Important :</strong> La désactivation de certains cookies peut affecter votre expérience sur notre site :</p>
        <ul>
          <li><strong>Cookies essentiels</strong> : leur désactivation peut empêcher le bon fonctionnement du site</li>
          <li><strong>Cookies de fonctionnalité</strong> : vous devrez ressaisir vos préférences à chaque visite</li>
          <li><strong>Cookies d'analyse</strong> : nous ne pourrons plus améliorer le site selon vos usages</li>
          <li><strong>Cookies publicitaires</strong> : vous verrez toujours des publicités, mais moins pertinentes</li>
        </ul>
      `,
		},
		{
			id: 'third-party',
			title: 'Cookies tiers',
			content: `
        <p>Certains cookies sur notre site sont déposés par des services tiers que nous utilisons pour améliorer votre expérience :</p>
        
        <h3>Services d'analyse</h3>
        <ul>
          <li><strong>Google Analytics</strong> : analyse du trafic et du comportement des utilisateurs
            <br><em>Politique de confidentialité :</em> <a href="https://policies.google.com/privacy" target="_blank" class="text-indigo-600 hover:text-indigo-800">https://policies.google.com/privacy</a></li>
        </ul>
        
        <h3>Réseaux sociaux</h3>
        <ul>
          <li><strong>Facebook</strong> : boutons de partage et pixels de suivi
            <br><em>Politique de confidentialité :</em> <a href="https://www.facebook.com/privacy/policy" target="_blank" class="text-indigo-600 hover:text-indigo-800">https://www.facebook.com/privacy/policy</a></li>
          <li><strong>Instagram</strong> : intégration de contenu et partage
            <br><em>Politique de confidentialité :</em> <a href="https://privacycenter.instagram.com/policy" target="_blank" class="text-indigo-600 hover:text-indigo-800">https://privacycenter.instagram.com/policy</a></li>
        </ul>
        
        <h3>Services de paiement</h3>
        <ul>
          <li><strong>Stripe</strong> : traitement sécurisé des paiements
            <br><em>Politique de confidentialité :</em> <a href="https://stripe.com/privacy" target="_blank" class="text-indigo-600 hover:text-indigo-800">https://stripe.com/privacy</a></li>
        </ul>
        
        <h3>Services de support client</h3>
        <ul>
          <li><strong>Intercom</strong> : chat en direct et support client
            <br><em>Politique de confidentialité :</em> <a href="https://www.intercom.com/legal/privacy" target="_blank" class="text-indigo-600 hover:text-indigo-800">https://www.intercom.com/legal/privacy</a></li>
        </ul>
        
        <p><strong>Note importante :</strong> Nous ne contrôlons pas les cookies déposés par ces services tiers. Nous vous encourageons à consulter leurs politiques de confidentialité respectives pour comprendre comment ils utilisent vos données.</p>
        
        <h3>Désactivation des cookies tiers</h3>
        <p>Vous pouvez désactiver les cookies tiers via :</p>
        <ul>
          <li><strong>Your Online Choices :</strong> <a href="http://www.youronlinechoices.com/fr/" target="_blank" class="text-indigo-600 hover:text-indigo-800">www.youronlinechoices.com</a></li>
          <li><strong>Network Advertising Initiative :</strong> <a href="https://optout.networkadvertising.org/" target="_blank" class="text-indigo-600 hover:text-indigo-800">optout.networkadvertising.org</a></li>
          <li><strong>Google Ad Settings :</strong> <a href="https://adssettings.google.com/" target="_blank" class="text-indigo-600 hover:text-indigo-800">adssettings.google.com</a></li>
        </ul>
      `,
		},
		{
			id: 'legal-basis',
			title: 'Base légale et vos droits',
			content: `
        <p>Notre utilisation des cookies repose sur différentes bases légales selon le RGPD :</p>
        
        <h3>Bases légales</h3>
        <ul>
          <li><strong>Cookies essentiels</strong> : intérêt légitime (fonctionnement du site)</li>
          <li><strong>Cookies de fonctionnalité</strong> : consentement et intérêt légitime</li>
          <li><strong>Cookies d'analyse</strong> : consentement</li>
          <li><strong>Cookies publicitaires</strong> : consentement</li>
        </ul>
        
        <h3>Vos droits</h3>
        <p>Concernant les données collectées via les cookies, vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Droit d'accès</strong> : obtenir des informations sur les données collectées</li>
          <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
          <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
          <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
          <li><strong>Droit de portabilité</strong> : récupérer vos données dans un format lisible</li>
          <li><strong>Droit de retrait du consentement</strong> : retirer votre accord à tout moment</li>
        </ul>
        
        <h3>Exercer vos droits</h3>
        <p>Pour exercer ces droits, contactez-nous :</p>
        <ul>
          <li><strong>Email :</strong> privacy@selectura.co</li>
          <li><strong>Formulaire de contact :</strong> <a href="/contact" class="text-indigo-600 hover:text-indigo-800">Page contact</a></li>
          <li><strong>Compte client :</strong> Section "Mes données personnelles"</li>
        </ul>
      `,
		},
		{
			id: 'updates',
			title: 'Mises à jour de cette politique',
			content: `
        <p>Nous pouvons mettre à jour cette politique de cookies pour refléter les changements dans notre utilisation des cookies ou pour se conformer aux évolutions légales.</p>
        
        <h3>Comment vous êtes informé des changements</h3>
        <ul>
          <li><strong>Modifications mineures</strong> : mise à jour de la date en haut de cette page</li>
          <li><strong>Modifications importantes</strong> : notification par email et bannière sur le site</li>
          <li><strong>Nouveaux cookies</strong> : nouvelle demande de consentement si nécessaire</li>
        </ul>
        
        <h3>Historique des versions</h3>
        <ul>
          <li><strong>15 janvier 2025</strong> : Création de la politique de cookies</li>
        </ul>
        
        <p>Nous vous encourageons à consulter régulièrement cette page pour rester informé de notre utilisation des cookies.</p>
      `,
		},
		{
			id: 'contact',
			title: 'Nous contacter',
			content: `
        <p>Pour toute question concernant notre utilisation des cookies ou cette politique, n'hésitez pas à nous contacter :</p>
        
        <div class="bg-gray-50 p-6 rounded-lg mt-4">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Contactez-nous</h4>
          <ul class="space-y-2">
            <li><strong>Email :</strong> privacy@selectura.co</li>
            <li><strong>Téléphone :</strong> +33 (0)1 XX XX XX XX</li>
            <li><strong>Courrier :</strong> Selectura - Service Protection des Données<br>
            [Adresse postale complète]</li>
            <li><strong>Formulaire de contact :</strong> <a href="/contact" class="text-indigo-600 hover:text-indigo-800">Nous contacter</a></li>
          </ul>
        </div>
        
        <h3>Délégué à la protection des données (DPO)</h3>
        <p>Pour toute question spécifique à la protection de vos données personnelles, vous pouvez contacter notre DPO :</p>
        <ul>
          <li><strong>Email :</strong> dpo@selectura.co</li>
        </ul>
        
        <p>Nous nous engageons à répondre à toutes vos questions dans un délai de 72 heures maximum.</p>
      `,
		},
	],
};

export default function CookiePolicyPage() {
	return (
		<Suspense fallback={<CookiePolicyLoading />}>
			<CookiePolicyContent cookiePolicyData={cookiePolicyData} />
		</Suspense>
	);
}