// app/shipping/page.tsx
import { Suspense } from 'react';
import ShippingContent from '@/components/ShippingContent';
import { ShippingPageSchemaSSR } from '@/components/schemas';
import '../styles/shipping.css';

// Métadonnées pour le SEO
export const metadata = {
	title: 'Politique de Livraison | Selectura',
	description:
		'Consultez nos conditions de livraison, délais et frais. Livraison gratuite dès 50€ en France. Livraison 2-3 jours ouvrables.',
	keywords:
		'livraison, expédition, délais, frais de port, suivi, international, livraison gratuite',
	openGraph: {
		title: 'Politique de Livraison | Selectura',
		description: 'Livraison gratuite dès 50€. Délai 2-3 jours en France.',
		type: 'website',
		url: 'https://selectura.co/shipping',
	},
	alternates: {
		canonical: 'https://selectura.co/shipping',
	},
};

// Composant de chargement pour Suspense
function ShippingLoading() {
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

// Date de dernière mise à jour des conditions de livraison
const lastUpdated = '1er mai 2025';

// Structure des informations de livraison
const shippingData = {
	lastUpdated,
	introduction: {
		title: 'Notre Politique de Livraison',
		content: `
      <p>
        Chez Votre Boutique, nous nous engageons à vous offrir une expérience de livraison fiable, rapide et transparente. Nous comprenons que recevoir votre commande dans les meilleures conditions et dans les délais annoncés est essentiel pour votre satisfaction.
      </p>
      <p>
        Cette page détaille nos conditions de livraison, les délais à prévoir selon votre zone géographique, ainsi que les frais applicables. Nous vous expliquons également comment suivre votre commande et les précautions prises pour garantir l'intégrité de vos produits.
      </p>
      <p>
        Nous nous efforçons continuellement d'améliorer nos services de livraison et d'étendre notre couverture géographique. N'hésitez pas à nous contacter si vous avez des questions ou si vous souhaitez des informations spécifiques concernant votre zone de livraison.
      </p>
    `,
	},
	sections: [
		{
			id: 'delivery-options',
			title: 'Options de livraison',
			content: `
        <p>Nous proposons plusieurs options de livraison pour répondre à vos besoins :</p>
        <ul>
          <li><strong>Livraison Standard</strong> : Délai de 2 à 5 jours ouvrables selon votre localisation. C'est notre option par défaut, économique et fiable.</li>
          <li><strong>Livraison Express</strong> : Réception sous 24 à 48h ouvrables (selon éligibilité de votre zone). Idéale pour recevoir rapidement votre commande.</li>
          <li><strong>Livraison en Point Relais</strong> : Récupérez votre colis dans l'un de nos 15 000 points relais partenaires en France et en Europe. Votre commande reste disponible pendant 14 jours.</li>
          <li><strong>Livraison sur Rendez-vous</strong> : Choisissez votre créneau horaire pour les produits volumineux ou nécessitant une installation (disponible uniquement dans certaines zones géographiques).</li>
        </ul>
        <p>Le choix des options de livraison disponibles dépendra de votre adresse de livraison et des produits commandés. Toutes les options vous seront présentées lors du processus de commande.</p>
      `,
		},
		{
			id: 'shipping-fees',
			title: 'Frais de livraison',
			content: `
        <p>Les frais de livraison sont calculés en fonction de plusieurs facteurs :</p>
        <ul>
          <li>La destination de votre commande</li>
          <li>Le poids et les dimensions des produits</li>
          <li>L'option de livraison choisie</li>
          <li>Le montant total de votre commande</li>
        </ul>
        <p>Voici nos tarifs de base :</p>
        <table class="min-w-full border-collapse border border-gray-300 my-4">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2">Zone</th>
              <th class="border border-gray-300 px-4 py-2">Livraison Standard</th>
              <th class="border border-gray-300 px-4 py-2">Livraison Express</th>
              <th class="border border-gray-300 px-4 py-2">Point Relais</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-300 px-4 py-2">France métropolitaine</td>
              <td class="border border-gray-300 px-4 py-2">4,90 €</td>
              <td class="border border-gray-300 px-4 py-2">9,90 €</td>
              <td class="border border-gray-300 px-4 py-2">3,90 €</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-2">Union Européenne</td>
              <td class="border border-gray-300 px-4 py-2">9,90 €</td>
              <td class="border border-gray-300 px-4 py-2">19,90 €</td>
              <td class="border border-gray-300 px-4 py-2">7,90 €</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-2">Reste du monde</td>
              <td class="border border-gray-300 px-4 py-2">19,90 €</td>
              <td class="border border-gray-300 px-4 py-2">29,90 €</td>
              <td class="border border-gray-300 px-4 py-2">N/A</td>
            </tr>
          </tbody>
        </table>
        <p><strong>Livraison offerte</strong> : Pour toute commande supérieure à 50€ en France métropolitaine et à 100€ pour l'international (hors livraison Express et sur Rendez-vous).</p>
        <p>Les frais exacts vous seront toujours indiqués avant la validation de votre commande. Des frais supplémentaires peuvent s'appliquer pour les produits volumineux ou pour les livraisons dans des zones difficiles d'accès.</p>
      `,
		},
		{
			id: 'delivery-times',
			title: 'Délais de livraison',
			content: `
        <p>Les délais de livraison indiqués ci-dessous sont donnés à titre indicatif et sont calculés à partir de la confirmation de votre commande :</p>
        <ul>
          <li><strong>France métropolitaine</strong> :
            <ul>
              <li>Livraison Standard : 2-3 jours ouvrables</li>
              <li>Livraison Express : 24h (commande passée avant 14h)</li>
              <li>Point Relais : 2-4 jours ouvrables</li>
            </ul>
          </li>
          <li><strong>Union Européenne</strong> :
            <ul>
              <li>Livraison Standard : 3-5 jours ouvrables</li>
              <li>Livraison Express : 2-3 jours ouvrables</li>
              <li>Point Relais : 3-6 jours ouvrables</li>
            </ul>
          </li>
          <li><strong>Reste du monde</strong> :
            <ul>
              <li>Livraison Standard : 5-10 jours ouvrables</li>
              <li>Livraison Express : 3-5 jours ouvrables</li>
            </ul>
          </li>
        </ul>
        <p>Ces délais peuvent être prolongés pendant les périodes de forte affluence (soldes, fêtes de fin d'année, etc.) ou en cas de circonstances exceptionnelles (conditions météorologiques défavorables, grèves, etc.).</p>
        <p>La préparation de votre commande commence dès la réception de votre paiement. Un email de confirmation vous est envoyé à chaque étape du processus : validation de la commande, préparation, expédition.</p>
      `,
		},
		{
			id: 'order-tracking',
			title: 'Suivi de commande',
			content: `
        <p>Pour suivre votre commande :</p>
        <ol>
          <li>Connectez-vous à votre espace client sur notre site</li>
          <li>Accédez à la section "Mes commandes"</li>
          <li>Sélectionnez la commande que vous souhaitez suivre</li>
          <li>Consultez l'état actuel de votre commande et son numéro de suivi</li>
        </ol>
        <p>Vous recevrez également des emails automatiques à chaque étape importante du processus de livraison (confirmation de commande, préparation, expédition, livraison).</p>
        <p>Le numéro de suivi vous permet de localiser précisément votre colis via le site du transporteur. Un lien direct vers le suivi est inclus dans nos emails de confirmation d'expédition.</p>
        <p>En cas de retard important ou d'anomalie dans la livraison, notre service client prendra contact avec vous pour vous informer de la situation et des solutions proposées.</p>
      `,
		},
		{
			id: 'international-shipping',
			title: 'Livraison internationale',
			content: `
        <p>Nous livrons dans plus de 80 pays à travers le monde. Pour les livraisons internationales, veuillez tenir compte des informations suivantes :</p>
        <ul>
          <li><strong>Droits de douane et taxes</strong> : Les éventuels droits de douane, taxes et frais de dédouanement sont à la charge du destinataire et ne sont pas inclus dans le prix total de la commande. Ces frais varient selon les pays et sont perçus par les autorités locales, non par Votre Boutique.</li>
          <li><strong>Délais supplémentaires</strong> : Les livraisons internationales peuvent subir des retards liés aux procédures douanières. Ces délais sont indépendants de notre volonté et s'ajoutent aux délais de livraison standards.</li>
          <li><strong>Restrictions</strong> : Certains produits peuvent être soumis à des restrictions d'importation selon les pays. Nous vous invitons à vous renseigner sur la réglementation en vigueur dans votre pays avant de passer commande.</li>
          <li><strong>Documentation</strong> : Tous nos envois internationaux sont accompagnés des documents nécessaires au dédouanement (facture commerciale, déclaration de valeur, etc.).</li>
        </ul>
        <p>Pour connaître les conditions spécifiques de livraison vers votre pays, veuillez consulter la liste des pays éligibles lors du processus de commande ou contacter notre service client.</p>
      `,
		},
		{
			id: 'delivery-issues',
			title: 'Problèmes de livraison',
			content: `
        <p>En cas de problème avec votre livraison, voici la marche à suivre :</p>
        <ul>
          <li><strong>Colis endommagé</strong> : Si votre colis présente des signes visibles de dommages à la réception, nous vous recommandons de faire des réserves auprès du livreur et de prendre des photos. Contactez notre service client dans les 48 heures avec ces éléments pour que nous puissions traiter votre réclamation.</li>
          <li><strong>Colis non reçu mais indiqué comme livré</strong> : Vérifiez d'abord auprès de vos voisins, gardien ou à l'accueil de votre immeuble. Si vous ne trouvez pas le colis, contactez-nous en précisant votre numéro de commande et le numéro de suivi.</li>
          <li><strong>Retard de livraison</strong> : Si votre colis dépasse significativement les délais annoncés, contactez notre service client en indiquant votre numéro de commande et le délai dépassé.</li>
          <li><strong>Colis incomplet ou erreur de produit</strong> : Contactez-nous dans les 48 heures suivant la réception avec votre numéro de commande et les détails de l'anomalie constatée.</li>
        </ul>
        <p>Notre service client est à votre disposition pour résoudre tout problème de livraison dans les meilleurs délais. Vous pouvez nous contacter par email à support@flowcontent.io ou par téléphone au +19136759287 (du lundi au vendredi, de 9h à 18h).</p>
      `,
		},
		{
			id: 'sustainable-shipping',
			title: 'Livraison écoresponsable',
			content: `
        <p>Dans le cadre de notre engagement pour l'environnement, nous mettons en œuvre plusieurs initiatives pour réduire l'impact écologique de nos livraisons :</p>
        <ul>
          <li><strong>Emballages écologiques</strong> : Nous utilisons des matériaux d'emballage recyclés et recyclables. Nos cartons sont issus de forêts gérées durablement et nos calages sont biodégradables.</li>
          <li><strong>Optimisation des tournées</strong> : Nous travaillons avec des transporteurs engagés dans la réduction de leur empreinte carbone grâce à l'optimisation des itinéraires de livraison.</li>
          <li><strong>Compensation carbone</strong> : Pour chaque livraison, nous contribuons à des programmes de compensation carbone. Vous pouvez consulter notre bilan annuel de réduction d'émissions de CO2 sur notre page Responsabilité Environnementale.</li>
          <li><strong>Livraison groupée</strong> : Nous encourageons le regroupement des commandes pour réduire le nombre de trajets. Si vous passez plusieurs commandes rapprochées, vous avez la possibilité de demander un envoi groupé.</li>
        </ul>
        <p>Vous pouvez également contribuer à notre démarche écoresponsable en optant pour la livraison en point relais, qui génère moins d'émissions de CO2 que la livraison à domicile, ou en choisissant la livraison regroupée si vous commandez plusieurs articles à différents moments.</p>
      `,
		},
		{
			id: 'faq',
			title: 'Questions fréquentes sur la livraison',
			content: `
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Puis-je modifier mon adresse de livraison après avoir passé ma commande ?</h3>
            <p>Vous pouvez modifier votre adresse de livraison tant que votre commande n'est pas passée en statut "En préparation". Pour ce faire, contactez rapidement notre service client avec votre numéro de commande et la nouvelle adresse.</p>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Livrez-vous dans les DOM-TOM ?</h3>
            <p>Oui, nous livrons dans les DOM-TOM. Les délais de livraison sont généralement de 5 à 12 jours ouvrables, selon le département ou territoire. Des frais de livraison spécifiques s'appliquent et vous sont présentés lors du processus de commande.</p>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Comment sont gérées les livraisons volumineuses ?</h3>
            <p>Pour les produits volumineux, nous proposons une livraison spécifique avec prise de rendez-vous. Le transporteur vous contactera pour convenir d'un créneau de livraison. Dans certains cas, une livraison au pas de porte ou au pied de l'immeuble peut s'appliquer.</p>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Que faire si je suis absent lors de la livraison ?</h3>
            <p>Si vous êtes absent lors de la livraison, le livreur laissera un avis de passage avec les instructions pour programmer une nouvelle livraison ou récupérer votre colis à un point de retrait. Généralement, deux tentatives de livraison sont effectuées avant le retour du colis à notre entrepôt.</p>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Est-il possible de demander une livraison le samedi ?</h3>
            <p>La livraison le samedi est disponible dans certaines zones avec l'option de livraison Express. Cette option, si elle est disponible pour votre adresse, vous sera proposée lors du choix de votre mode de livraison pendant le processus de commande.</p>
          </div>
        </div>
      `,
		},
		{
			id: 'contact',
			title: 'Nous contacter',
			content: `
        <p>Pour toute question concernant notre politique de livraison ou pour un suivi spécifique de votre commande, notre équipe est à votre disposition :</p>
        <ul>
          <li><strong>Par email</strong> : support@flowcontent.io</li>
          <li><strong>Par téléphone</strong> : +19136759287 (du lundi au vendredi, de 9h à 18h)</li>
          <li><strong>Par chat</strong> : Disponible sur notre site du lundi au samedi, de 9h à 20h</li>
          <li><strong>Par courrier</strong> : Votre Boutique - Service Livraison, 254 rue Vendôme Lyon 003</li>
        </ul>
        <p>Pour un traitement plus rapide de votre demande, merci de toujours mentionner votre numéro de commande et/ou votre numéro de suivi.</p>
        <p>Nous nous engageons à répondre à toutes vos demandes dans un délai maximum de 48 heures ouvrées.</p>
      `,
		},
	],
};

export default function ShippingPage() {
	return (
		<>
			<ShippingPageSchemaSSR />
			<Suspense fallback={<ShippingLoading />}>
				<ShippingContent shippingData={shippingData} />
			</Suspense>
		</>
	);
}
