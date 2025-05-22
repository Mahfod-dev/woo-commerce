// app/faq/page.tsx
import { Suspense } from 'react';
import FaqContent from '@/components/FaqContent';
import '../styles/faq.css';

// Métadonnées pour le SEO
export const metadata = {
	title: 'Questions fréquentes | Votre Boutique',
	description:
		'Trouvez des réponses à toutes vos questions concernant nos produits, les commandes, la livraison, les retours et notre service client.',
	keywords:
		'FAQ, questions, aide, support, commandes, livraison, retours, garantie',
};

// Composant de chargement pour Suspense
function FaqLoading() {
	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
			<div className='animate-pulse mb-12'>
				<div className='h-10 bg-gray-200 max-w-md mb-4 rounded'></div>
				<div className='h-4 bg-gray-200 max-w-xl rounded'></div>
			</div>

			<div className='animate-pulse mb-8'>
				<div className='h-6 bg-gray-200 w-1/4 mb-4 rounded'></div>
				<div className='space-y-4'>
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className='bg-white rounded-lg shadow-sm p-6'>
							<div className='flex justify-between items-center mb-4'>
								<div className='h-6 bg-gray-200 w-3/4 rounded'></div>
								<div className='h-6 w-6 bg-gray-200 rounded-full'></div>
							</div>
							<div className='h-20 bg-gray-200 rounded'></div>
						</div>
					))}
				</div>
			</div>

			<div className='animate-pulse mb-8'>
				<div className='h-6 bg-gray-200 w-1/4 mb-4 rounded'></div>
				<div className='space-y-4'>
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className='bg-white rounded-lg shadow-sm p-6'>
							<div className='flex justify-between items-center mb-4'>
								<div className='h-6 bg-gray-200 w-3/4 rounded'></div>
								<div className='h-6 w-6 bg-gray-200 rounded-full'></div>
							</div>
							<div className='h-20 bg-gray-200 rounded'></div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// Données statiques des questions fréquentes pour notre boutique limitée
const faqData = {
	categories: [
		{
			id: 'general',
			name: 'Questions générales',
			questions: [
				{
					id: 'product-selection',
					question:
						'Pourquoi proposez-vous un catalogue limité de produits ?',
					answer: "Nous avons fait le choix de proposer moins de produits, mais des produits exceptionnels. Cette approche nous permet de nous concentrer sur la qualité plutôt que la quantité, d'offrir une expertise inégalée sur chaque produit, de simplifier votre choix face à trop d'options similaires, et de garantir une qualité supérieure à travers une sélection rigoureuse.",
				},
				{
					id: 'differences',
					question:
						'Comment choisir entre les différents modèles proposés ?',
					answer: 'Nos différents modèles sont conçus pour répondre à des besoins spécifiques. Les versions standard conviennent parfaitement à un usage quotidien, tandis que les versions premium offrent des fonctionnalités avancées et une performance supérieure pour les utilisateurs exigeants. Nous recommandons de comparer les spécifications détaillées sur nos pages produits ou de contacter notre équipe pour des conseils personnalisés.',
				},
				{
					id: 'accessories',
					question:
						'Les accessoires sont-ils nécessaires avec vos produits ?',
					answer: "Tous nos produits sont pleinement fonctionnels sans accessoires supplémentaires. Cependant, nos accessoires soigneusement sélectionnés permettent d'améliorer l'expérience utilisateur ou d'ajouter des fonctionnalités spécifiques pour répondre à des besoins particuliers. Ils forment un écosystème complet et parfaitement adapté à nos produits.",
				},
				{
					id: 'quality',
					question:
						'Comment garantissez-vous la qualité de vos produits ?',
					answer: "Chaque produit dans notre catalogue est rigoureusement testé et évalué avant d'être proposé à la vente. Nous travaillons avec des fabricants réputés qui partagent notre exigence de qualité. Tous nos produits sont couverts par une garantie de 2 ans minimum et nous effectuons un suivi qualité constant pour assurer votre satisfaction.",
				},
			],
		},
		{
			id: 'orders',
			name: 'Commandes et paiement',
			questions: [
				{
					id: 'payment-methods',
					question: 'Quels modes de paiement acceptez-vous ?',
					answer: 'Nous acceptons les cartes de crédit (Visa, Mastercard, American Express), PayPal, Apple Pay et les virements bancaires. Toutes les transactions sont sécurisées avec un cryptage SSL pour garantir la protection de vos données personnelles et bancaires.',
				},
				{
					id: 'order-tracking',
					question: 'Comment suivre ma commande ?',
					answer: "Une fois votre commande expédiée, vous recevrez un email contenant un numéro de suivi. Vous pouvez également suivre l'état de votre commande en vous connectant à votre compte client sur notre site. Pour toute question concernant votre commande, notre service client est disponible pour vous aider.",
				},
				{
					id: 'order-cancellation',
					question: 'Puis-je annuler ou modifier ma commande ?',
					answer: "Vous pouvez annuler ou modifier votre commande tant qu'elle n'a pas été expédiée. Pour ce faire, connectez-vous à votre compte client ou contactez notre service client dans les plus brefs délais. Une fois la commande expédiée, elle ne peut plus être annulée, mais vous pourrez effectuer un retour selon notre politique de retour.",
				},
				{
					id: 'promo-codes',
					question: 'Comment utiliser un code promo ?',
					answer: 'Lors du processus de paiement, vous trouverez un champ intitulé "Code promo" dans lequel vous pourrez saisir votre code. Cliquez ensuite sur "Appliquer" pour que la réduction soit prise en compte dans le montant total de votre commande. Les codes promo ne sont généralement pas cumulables et doivent être utilisés avant leur date d\'expiration.',
				},
			],
		},
		{
			id: 'shipping',
			name: 'Livraison et retours',
			questions: [
				{
					id: 'shipping-time',
					question: 'Quels sont les délais de livraison ?',
					answer: "Nous expédions généralement les commandes sous 24-48h ouvrables. Le délai de livraison dépend ensuite de votre localisation : 1-3 jours ouvrables pour la France métropolitaine, 3-5 jours pour l'Europe, et 5-10 jours pour le reste du monde. Ces délais sont indicatifs et peuvent varier selon les périodes d'affluence.",
				},
				{
					id: 'shipping-costs',
					question: 'Quels sont les frais de livraison ?',
					answer: "Les frais de livraison sont calculés en fonction du poids de votre commande et de votre localisation. Ils vous sont indiqués avant la validation de votre commande. Nous offrons la livraison gratuite pour toutes les commandes supérieures à 50€ en France métropolitaine et 100€ pour l'international.",
				},
				{
					id: 'return-policy',
					question: 'Quelle est votre politique de retour ?',
					answer: "Nous offrons un droit de retour de 30 jours à compter de la réception de votre commande. Les produits doivent être retournés dans leur état d'origine, non utilisés et dans leur emballage d'origine. Les frais de retour sont à votre charge sauf en cas de produit défectueux ou d'erreur de notre part.",
				},
				{
					id: 'refund-process',
					question:
						'Comment fonctionne le processus de remboursement ?',
					answer: 'Une fois votre retour reçu et vérifié, nous procédons au remboursement sur votre mode de paiement initial dans un délai de 5 à 10 jours ouvrables. Vous recevrez une confirmation par email lorsque le remboursement aura été effectué. Pour les échanges, nous expédions le nouveau produit dès la réception et la vérification du retour.',
				},
			],
		},
		{
			id: 'warranty',
			name: 'Garantie et service après-vente',
			questions: [
				{
					id: 'warranty-coverage',
					question: 'Que couvre votre garantie ?',
					answer: 'Tous nos produits sont couverts par une garantie de 2 ans contre tout défaut de fabrication. Cette garantie couvre les réparations ou le remplacement du produit défectueux. Elle ne couvre pas les dommages causés par une utilisation inappropriée, une usure normale ou des tentatives de réparation par des tiers non autorisés.',
				},
				{
					id: 'warranty-extension',
					question: 'Proposez-vous une extension de garantie ?',
					answer: "Oui, nous proposons une extension de garantie d'un an supplémentaire (portant la garantie totale à 3 ans) pour la plupart de nos produits. Cette extension peut être ajoutée à votre panier lors de l'achat. Elle offre les mêmes couvertures que la garantie standard avec une durée prolongée.",
				},
				{
					id: 'repair-service',
					question:
						'Comment fonctionne votre service de réparation ?',
					answer: "Si votre produit présente un dysfonctionnement, contactez notre service client qui vous guidera dans les démarches à suivre. Selon le cas, nous pourrons vous proposer une réparation, un remplacement ou des conseils pour résoudre le problème. Pour les produits sous garantie, les frais de réparation et d'expédition sont pris en charge par notre service.",
				},
				{
					id: 'technical-support',
					question: 'Comment contacter votre support technique ?',
					answer: 'Notre équipe de support technique est disponible par email à support@flowcontent.io, par téléphone au +19136759287 (du lundi au vendredi, 9h-18h) ou via le chat en ligne sur notre site. Nous proposons également une base de connaissances et des tutoriels détaillés dans la section Support de notre site.',
				},
			],
		},
		{
			id: 'account',
			name: 'Compte client et confidentialité',
			questions: [
				{
					id: 'create-account',
					question:
						'Est-il nécessaire de créer un compte pour commander ?',
					answer: "Il n'est pas obligatoire de créer un compte pour effectuer un achat sur notre site, vous pouvez commander en tant qu'invité. Cependant, la création d'un compte vous permet de suivre vos commandes, d'accéder à votre historique d'achats, de bénéficier de recommandations personnalisées et de simplifier vos futurs achats.",
				},
				{
					id: 'data-protection',
					question:
						'Comment protégez-vous mes données personnelles ?',
					answer: 'Nous accordons une importance capitale à la protection de vos données personnelles. Toutes les informations que vous nous fournissez sont stockées sur des serveurs sécurisés et ne sont jamais partagées avec des tiers sans votre consentement. Notre politique de confidentialité complète est disponible sur notre site.',
				},
				{
					id: 'newsletter',
					question: 'Comment gérer mes abonnements aux newsletters ?',
					answer: 'Vous pouvez vous abonner à notre newsletter lors de la création de votre compte ou via le formulaire dédié sur notre site. Pour modifier vos préférences ou vous désabonner, connectez-vous à votre compte client et accédez à la section "Préférences de communication" ou cliquez sur le lien de désabonnement présent dans chaque email.',
				},
				{
					id: 'delete-account',
					question: 'Comment supprimer mon compte ?',
					answer: 'Vous pouvez demander la suppression de votre compte en contactant notre service client par email ou en utilisant le formulaire dédié dans la section "Mon compte". Conformément au RGPD, nous supprimerons toutes vos données personnelles de nos systèmes dans un délai maximum de 30 jours après votre demande.',
				},
			],
		},
	],

	support: {
		title: "Vous n'avez pas trouvé de réponse à votre question ?",
		description:
			"Notre équipe de support client est là pour vous aider. N'hésitez pas à nous contacter.",
		contactOptions: [
			{
				icon: 'email',
				title: 'Par email',
				description: 'Réponse sous 24h ouvrées',
				action: 'support@flowcontent.io',
			},
			{
				icon: 'phone',
				title: 'Par téléphone',
				description: 'Lun-Ven, 9h-18h',
				action: '+19136759287',
			},
			{
				icon: 'chat',
				title: 'Chat en direct',
				description: 'Discussion instantanée',
				action: 'Démarrer un chat',
			},
		],
	},
};

export default function FaqPage() {
	return (
		<Suspense fallback={<FaqLoading />}>
			<FaqContent faqData={faqData} />
		</Suspense>
	);
}
