// app/terms/page.tsx
import { Suspense } from 'react';
import TermsContent from '@/components/TermsContent';
import '../styles/terms.css';

// Métadonnées pour le SEO
export const metadata = {
	title: 'Conditions Générales | Votre Boutique',
	description:
		"Consultez nos conditions générales de vente et d'utilisation. Informations détaillées sur nos services, responsabilités et vos droits en tant que client.",
	keywords:
		'conditions générales, CGV, CGU, termes, contrat, droits, responsabilités, boutique en ligne',
};

// Composant de chargement pour Suspense
function TermsLoading() {
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

// Date de dernière mise à jour des conditions générales
const lastUpdated = '1er mai 2025';

// Structure des conditions générales
const termsData = {
	lastUpdated,
	introduction: {
		title: 'Introduction',
		content: `
      <p>
        Bienvenue sur Votre Boutique, une plateforme de commerce électronique spécialisée dans la vente de produits soigneusement sélectionnés pour leur qualité supérieure. Les présentes Conditions Générales de Vente et d'Utilisation ("CGV/CGU") s'appliquent à toutes les visites et transactions effectuées sur notre site.
      </p>
      <p>
        En accédant à notre site et en effectuant un achat, vous reconnaissez avoir pris connaissance des présentes conditions générales et vous vous engagez à les respecter sans réserve. Nous vous invitons à les lire attentivement avant d'utiliser notre site ou de passer commande.
      </p>
      <p>
        Nous nous réservons le droit de modifier à tout moment les présentes conditions générales. Les modifications entrent en vigueur dès leur publication sur le site. Il vous appartient de consulter régulièrement cette page pour rester informé des mises à jour.
      </p>
    `,
	},
	sections: [
		{
			id: 'definitions',
			title: 'Définitions',
			content: `
        <p>Dans les présentes conditions générales, les termes suivants ont la signification qui leur est donnée ci-après :</p>
        <ul>
          <li><strong>"Nous", "Notre", "Nos"</strong> : désigne Votre Boutique, [raison sociale], dont le siège social est situé [adresse], immatriculée au Registre du Commerce et des Sociétés sous le numéro [numéro RCS].</li>
          <li><strong>"Vous", "Votre", "Vos"</strong> : désigne toute personne physique ou morale utilisant le site ou effectuant un achat sur le site.</li>
          <li><strong>"Site"</strong> : désigne le site web accessible à l'adresse www.votreboutique.com.</li>
          <li><strong>"Produits"</strong> : désigne l'ensemble des biens proposés à la vente sur le site.</li>
          <li><strong>"Commande"</strong> : désigne tout achat de produits effectué par un client sur le site.</li>
          <li><strong>"Compte client"</strong> : désigne l'espace personnel créé par l'utilisateur sur le site.</li>
        </ul>
      `,
		},
		{
			id: 'account',
			title: 'Compte utilisateur',
			content: `
        <p>Pour effectuer un achat sur notre site, vous pouvez créer un compte client ou commander en tant qu'invité. La création d'un compte client vous permet de :</p>
        <ul>
          <li>Suivre vos commandes et accéder à votre historique d'achats</li>
          <li>Enregistrer vos informations pour faciliter vos futures commandes</li>
          <li>Gérer vos préférences et abonnements</li>
          <li>Bénéficier de promotions et offres exclusives</li>
        </ul>
        <p>Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toutes les activités qui se déroulent sur votre compte. Vous vous engagez à nous informer immédiatement de toute utilisation non autorisée de votre compte.</p>
        <p>Nous nous réservons le droit de suspendre ou de supprimer votre compte en cas de non-respect des présentes conditions générales ou en cas d'inactivité prolongée.</p>
      `,
		},
		{
			id: 'products',
			title: 'Produits et prix',
			content: `
        <p>Nous proposons un catalogue limité mais soigneusement sélectionné de produits de haute qualité. Chaque produit fait l'objet d'une description détaillée comprenant ses caractéristiques essentielles et, le cas échéant, ses spécifications techniques.</p>
        <p>Les prix de nos produits sont indiqués en euros, toutes taxes comprises (TTC), hors frais de livraison. Les frais de livraison sont clairement indiqués avant la validation de votre commande.</p>
        <p>Nous nous réservons le droit de modifier nos prix à tout moment. Toutefois, les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de votre commande.</p>
        <p>Malgré tout le soin apporté à la présentation de nos produits, de légères différences peuvent apparaître entre les photographies ou illustrations et les produits réels, notamment en ce qui concerne les couleurs. Ces différences ne sauraient engager notre responsabilité.</p>
      `,
		},
		{
			id: 'orders',
			title: 'Commandes',
			content: `
        <p>Pour passer commande sur notre site, vous devez suivre le processus suivant :</p>
        <ol>
          <li>Sélectionner les produits souhaités et les ajouter à votre panier</li>
          <li>Accéder à votre panier pour vérifier le contenu et le montant total</li>
          <li>Choisir votre mode de livraison et indiquer l'adresse de livraison</li>
          <li>Sélectionner votre mode de paiement et procéder au règlement</li>
        </ol>
        <p>Une fois votre commande validée, vous recevrez un email de confirmation récapitulant les détails de votre achat. Cet email constitue l'acceptation de votre commande par nos services.</p>
        <p>Nous nous réservons le droit de refuser ou d'annuler toute commande en cas de :</p>
        <ul>
          <li>Litige existant avec le client</li>
          <li>Non-paiement total ou partiel d'une commande précédente</li>
          <li>Refus d'autorisation de paiement</li>
          <li>Commande anormale ou suspicion de fraude</li>
          <li>Indisponibilité du produit</li>
        </ul>
        <p>En cas d'indisponibilité d'un produit après la validation de votre commande, nous vous en informerons dans les plus brefs délais et vous proposerons soit de modifier votre commande, soit de l'annuler avec remboursement intégral.</p>
      `,
		},
		{
			id: 'payment',
			title: 'Paiement',
			content: `
        <p>Nous acceptons les modes de paiement suivants :</p>
        <ul>
          <li>Cartes bancaires (Visa, Mastercard, American Express)</li>
          <li>PayPal</li>
          <li>Apple Pay / Google Pay</li>
          <li>Virement bancaire (pour certaines commandes)</li>
        </ul>
        <p>Toutes les transactions sont sécurisées par un protocole de cryptage SSL pour garantir la confidentialité de vos données bancaires. Vos informations de paiement ne sont jamais stockées sur nos serveurs.</p>
        <p>Le paiement est débité au moment de la validation de votre commande, sauf en cas de paiement par virement bancaire où la commande sera traitée à réception du paiement.</p>
        <p>Une facture électronique sera générée et accessible dans votre espace client ou envoyée par email après la confirmation de votre commande.</p>
      `,
		},
		{
			id: 'shipping',
			title: 'Livraison',
			content: `
        <p>Nous proposons plusieurs options de livraison dont les délais et tarifs varient en fonction de votre localisation et du mode choisi. Les informations détaillées vous sont présentées avant la validation de votre commande.</p>
        <p>Les délais de livraison sont donnés à titre indicatif et courent à partir de la confirmation de votre commande. Nous mettons tout en œuvre pour respecter ces délais, mais ne pouvons être tenus responsables des retards dus à des événements indépendants de notre volonté.</p>
        <p>La livraison est considérée comme effectuée dès la remise du colis à l'adresse indiquée lors de la commande. Il vous appartient de vérifier l'état de l'emballage et des produits au moment de la livraison et de formuler, le cas échéant, toutes réserves auprès du transporteur.</p>
        <p>Pour toute commande supérieure à 50€ en France métropolitaine et à 100€ pour l'international, les frais de livraison sont offerts.</p>
      `,
		},
		{
			id: 'returns',
			title: 'Retours et remboursements',
			content: `
        <p>Conformément à la législation en vigueur, vous disposez d'un délai de rétractation de 14 jours à compter de la réception de votre commande pour retourner un produit et demander un remboursement, sans avoir à justifier de motifs ni à payer de pénalités.</p>
        <p>Pour exercer votre droit de rétractation, vous devez nous notifier votre décision par email à returns@votreboutique.com ou via le formulaire disponible dans votre espace client. Les produits doivent nous être retournés dans leur état d'origine, non utilisés, avec tous leurs accessoires et dans leur emballage d'origine.</p>
        <p>Les frais de retour sont à votre charge, sauf en cas de produit défectueux ou non conforme à votre commande. Dans ce cas, nous vous rembourserons également les frais de retour sur présentation d'un justificatif.</p>
        <p>Le remboursement sera effectué dans un délai de 14 jours suivant la réception des produits retournés, par le même moyen de paiement que celui utilisé lors de votre achat.</p>
        <p>Certains produits ne peuvent faire l'objet d'un droit de rétractation pour des raisons d'hygiène ou de protection de la santé. Ces exclusions sont clairement indiquées dans la description des produits concernés.</p>
      `,
		},
		{
			id: 'warranty',
			title: 'Garanties',
			content: `
        <p>Tous nos produits bénéficient de la garantie légale de conformité et de la garantie des vices cachés, conformément aux dispositions légales en vigueur.</p>
        <p>La garantie légale de conformité s'applique pendant une durée de 2 ans à compter de la délivrance du produit et vous permet d'obtenir gratuitement la réparation ou le remplacement du produit non conforme.</p>
        <p>Certains de nos produits bénéficient également d'une garantie commerciale supplémentaire dont les conditions sont précisées dans la documentation accompagnant le produit ou sur sa fiche descriptive.</p>
        <p>Pour mettre en œuvre une garantie, veuillez contacter notre service client à l'adresse support@votreboutique.com en précisant votre numéro de commande et en décrivant le problème rencontré.</p>
        <p>Les garanties ne couvrent pas les dommages résultant d'une utilisation anormale ou non conforme aux instructions du fabricant, d'un défaut d'entretien, d'une usure normale ou d'un accident.</p>
      `,
		},
		{
			id: 'intellectual-property',
			title: 'Propriété intellectuelle',
			content: `
        <p>L'ensemble des éléments de notre site (textes, images, logos, vidéos, sons, logiciels, etc.) sont protégés par les lois relatives à la propriété intellectuelle et sont la propriété exclusive de Votre Boutique ou de ses partenaires.</p>
        <p>Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie de ces éléments, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation préalable écrite de notre part.</p>
        <p>Les marques et logos figurant sur le site sont des marques déposées. Leur reproduction ou utilisation, de quelque manière que ce soit, est interdite sans notre accord préalable écrit.</p>
        <p>L'utilisation du site à des fins commerciales ou publicitaires est strictement interdite.</p>
      `,
		},
		{
			id: 'personal-data',
			title: 'Données personnelles',
			content: `
        <p>Dans le cadre de l'utilisation de notre site et de nos services, nous sommes amenés à collecter et traiter certaines de vos données personnelles. Nous nous engageons à respecter la confidentialité de ces données conformément au Règlement Général sur la Protection des Données (RGPD) et à la législation nationale applicable.</p>
        <p>Les informations collectées sont nécessaires au traitement de vos commandes, à la gestion de votre compte client et, avec votre consentement, à l'envoi d'informations commerciales. Elles peuvent être transmises aux prestataires qui contribuent à la réalisation de ces finalités (transporteurs, services de paiement, etc.).</p>
        <p>Vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données, ainsi que d'un droit d'opposition et de limitation du traitement. Pour exercer ces droits, vous pouvez nous contacter à l'adresse privacy@votreboutique.com ou par courrier à l'adresse de notre siège social.</p>
        <p>Pour plus d'informations sur la façon dont nous traitons vos données personnelles, veuillez consulter notre <a href="/privacy" className="text-indigo-600 hover:text-indigo-800">Politique de confidentialité</a>.</p>
      `,
		},
		{
			id: 'liability',
			title: 'Responsabilité',
			content: `
        <p>Nous mettons tout en œuvre pour assurer l'exactitude des informations présentées sur notre site et la disponibilité des produits. Toutefois, nous ne pouvons garantir que le site sera exempt d'erreurs ou disponible de manière ininterrompue.</p>
        <p>Notre responsabilité ne saurait être engagée dans les cas suivants :</p>
        <ul>
          <li>Interruption temporaire du site pour maintenance ou mise à jour</li>
          <li>Dysfonctionnements ou dommages liés à des événements de force majeure</li>
          <li>Utilisation anormale ou illicite du site par un utilisateur</li>
          <li>Dommages indirects résultant de l'utilisation de nos produits</li>
        </ul>
        <p>Dans tous les cas, notre responsabilité est limitée au montant de votre commande.</p>
        <p>Vous êtes seul responsable de l'adéquation des produits commandés à vos besoins spécifiques. Nous vous recommandons de consulter les descriptions détaillées et les spécifications techniques avant tout achat.</p>
      `,
		},
		{
			id: 'applicable-law',
			title: 'Loi applicable et juridiction compétente',
			content: `
        <p>Les présentes conditions générales sont soumises au droit français.</p>
        <p>En cas de litige, nous vous invitons à nous contacter préalablement afin de rechercher une solution amiable. Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, vous pouvez recourir au service de médiation de la consommation [nom et coordonnées du médiateur].</p>
        <p>À défaut de résolution amiable, tout litige relatif à l'interprétation ou à l'exécution des présentes conditions générales sera soumis aux tribunaux français compétents.</p>
      `,
		},
		{
			id: 'contact',
			title: 'Contact',
			content: `
        <p>Pour toute question relative aux présentes conditions générales ou pour toute réclamation, vous pouvez nous contacter :</p>
        <ul>
          <li>Par email : contact@votreboutique.com</li>
          <li>Par téléphone : [numéro de téléphone] (du lundi au vendredi, de 9h à 18h)</li>
          <li>Par courrier : Votre Boutique - Service Client, [adresse postale]</li>
        </ul>
        <p>Nous nous efforçons de répondre à toutes les demandes dans un délai de 48 heures ouvrées.</p>
      `,
		},
	],
};

export default function TermsPage() {
	return (
		<Suspense fallback={<TermsLoading />}>
			<TermsContent termsData={termsData} />
		</Suspense>
	);
}
