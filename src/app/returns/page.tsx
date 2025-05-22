// app/returns/page.tsx
import { Suspense } from 'react';
import ReturnsContent from '@/components/ReturnsContent';
import '../styles/returns.css';

// Métadonnées pour le SEO
export const metadata = {
	title: 'Politique de Retour | Votre Boutique',
	description:
		"Découvrez notre politique de retour, les modalités de remboursement et d'échange. Informations détaillées sur vos droits et les démarches à suivre.",
	keywords:
		'retour, remboursement, échange, garantie, satisfaction, droit de rétractation',
};

// Composant de chargement pour Suspense
function ReturnsLoading() {
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

// Date de dernière mise à jour de la politique de retour
const lastUpdated = '1er mai 2025';

// Structure des informations de retour
const returnsData = {
	lastUpdated,
	introduction: {
		title: 'Notre Politique de Retour',
		content: `
      <p>
        Chez Votre Boutique, nous souhaitons que vous soyez entièrement satisfait de vos achats. Si pour une raison quelconque, vous n'êtes pas pleinement satisfait, nous avons mis en place une politique de retour simple et transparente pour faciliter vos démarches.
      </p>
      <p>
        Cette page détaille vos droits en matière de rétractation, les conditions et procédures pour retourner un article, ainsi que nos politiques de remboursement et d'échange. Nous vous expliquons également comment bénéficier de nos garanties et le traitement réservé aux produits défectueux.
      </p>
      <p>
        Notre objectif est de vous offrir une expérience d'achat sereine, en vous accompagnant même après votre commande. N'hésitez pas à contacter notre service client si vous avez des questions spécifiques non couvertes par cette page.
      </p>
    `,
	},
	sections: [
		{
			id: 'right-of-withdrawal',
			title: 'Droit de rétractation',
			content: `
        <p>Conformément à la législation européenne et française en vigueur, vous disposez d'un droit de rétractation pour tout achat effectué sur notre site :</p>
        <ul>
          <li><strong>Délai</strong> : Vous avez 14 jours calendaires à compter de la réception de votre commande pour nous notifier votre décision de vous rétracter, sans avoir à justifier de motifs ni à payer de pénalités.</li>
          <li><strong>Extension de garantie</strong> : Chez Votre Boutique, nous étendons ce délai légal à 30 jours pour vous offrir plus de flexibilité dans votre décision.</li>
          <li><strong>Notification</strong> : Pour exercer ce droit, vous devez nous informer de votre décision de vous rétracter avant l'expiration du délai, soit en utilisant le formulaire de rétractation disponible dans votre espace client, soit par email ou courrier.</li>
        </ul>
        <p><strong>Exceptions</strong> : Conformément à la loi, certains produits ne peuvent faire l'objet d'un droit de rétractation :</p>
        <ul>
          <li>Produits confectionnés selon vos spécifications ou personnalisés</li>
          <li>Produits scellés ne pouvant être renvoyés pour des raisons d'hygiène et qui ont été descellés après la livraison</li>
          <li>Enregistrements audio ou vidéo scellés qui ont été descellés</li>
          <li>Logiciels informatiques scellés qui ont été descellés</li>
          <li>Contenu numérique fourni sur un support immatériel dont l'exécution a commencé avec votre accord</li>
        </ul>
        <p>Ces exceptions sont clairement indiquées dans les descriptions des produits concernés sur notre site.</p>
      `,
		},
		{
			id: 'return-conditions',
			title: 'Conditions de retour',
			content: `
        <p>Pour être accepté, tout retour doit respecter les conditions suivantes :</p>
        <ul>
          <li><strong>État du produit</strong> : L'article doit être retourné dans son état d'origine, non utilisé, non endommagé, avec toutes ses étiquettes d'origine et dans son emballage d'origine. Vous pouvez l'essayer comme vous l'auriez fait en magasin, mais sans l'utiliser de manière prolongée.</li>
          <li><strong>Emballage</strong> : Nous vous recommandons d'utiliser l'emballage d'origine ou un emballage adapté pour protéger l'article pendant le transport retour. L'article reste sous votre responsabilité jusqu'à ce qu'il nous parvienne.</li>
          <li><strong>Documents</strong> : Joignez à votre retour le formulaire de retour dûment complété ou indiquez clairement votre numéro de commande et vos coordonnées.</li>
          <li><strong>Délai d'expédition</strong> : Une fois la demande de retour validée, vous disposez de 14 jours pour nous renvoyer l'article.</li>
        </ul>
        <p><strong>Inspection</strong> : À réception de votre retour, nous procédons à une inspection pour vérifier que l'article répond aux conditions ci-dessus. Tout article ne respectant pas ces conditions pourra faire l'objet d'une déduction sur le montant remboursé ou d'un refus de retour.</p>
        <p><strong>Articles multiples</strong> : Si votre commande comportait plusieurs articles, vous pouvez exercer votre droit de rétractation pour un ou plusieurs articles sans avoir à retourner l'ensemble de la commande.</p>
      `,
		},
		{
			id: 'return-procedure',
			title: 'Procédure de retour',
			content: `
        <p>Pour retourner un article, suivez ces étapes simples :</p>
        <ol>
          <li><strong>Connexion</strong> : Connectez-vous à votre compte client sur notre site.</li>
          <li><strong>Demande de retour</strong> : Accédez à la section "Mes commandes", sélectionnez la commande concernée et cliquez sur "Retourner un article".</li>
          <li><strong>Sélection</strong> : Choisissez le ou les articles que vous souhaitez retourner et indiquez la raison du retour (cette information nous aide à améliorer constamment nos produits).</li>
          <li><strong>Validation</strong> : Validez votre demande de retour. Vous recevrez immédiatement un email de confirmation avec toutes les instructions et l'étiquette de retour à imprimer.</li>
          <li><strong>Préparation</strong> : Emballez soigneusement l'article avec tous ses accessoires dans un colis adapté.</li>
          <li><strong>Expédition</strong> : Collez l'étiquette de retour sur votre colis et déposez-le au point de dépôt indiqué dans l'email de confirmation.</li>
        </ol>
        <p><strong>Sans compte client</strong> : Si vous avez commandé en tant qu'invité, vous pouvez initier un retour en utilisant le formulaire disponible dans la section "Retours" de notre site, en indiquant votre numéro de commande et votre email.</p>
        <p><strong>Suivi du retour</strong> : Une fois votre retour expédié, vous pouvez suivre son traitement dans votre espace client ou via le lien fourni dans l'email de confirmation.</p>
      `,
		},
		{
			id: 'refund-policy',
			title: 'Politique de remboursement',
			content: `
        <p>Après réception et validation de votre retour, nous procédons au remboursement selon les modalités suivantes :</p>
        <ul>
          <li><strong>Délai</strong> : Le remboursement est effectué dans un délai maximum de 14 jours à compter de la réception et validation de votre retour, ou dès que nous avons reçu la preuve d'expédition.</li>
          <li><strong>Mode de remboursement</strong> : Nous utilisons le même moyen de paiement que celui utilisé lors de votre achat, sauf si vous avez expressément accepté un autre moyen.</li>
          <li><strong>Montant</strong> : Le remboursement concerne le prix d'achat de l'article et les frais de livraison standard initiaux. Les frais supplémentaires liés au choix d'un mode de livraison plus coûteux que le mode standard ne sont pas remboursés.</li>
        </ul>
        <p><strong>Frais de retour</strong> : Les frais de retour sont à votre charge, sauf dans les cas suivants :</p>
        <ul>
          <li>Produit défectueux ou non conforme à la description</li>
          <li>Erreur de notre part dans l'article expédié</li>
          <li>Article arrivé endommagé</li>
        </ul>
        <p>Dans ces cas, nous prenons en charge les frais de retour et vous fournissons une étiquette de retour prépayée.</p>
        <p><strong>Remboursement partiel</strong> : Dans certains cas, notamment si l'article retourné présente des signes d'utilisation dépassant un simple essai ou si l'emballage d'origine est manquant, nous nous réservons le droit d'appliquer une déduction sur le montant remboursé, proportionnelle à la dépréciation de l'article.</p>
      `,
		},
		{
			id: 'exchange-policy',
			title: "Politique d'échange",
			content: `
        <p>Si vous souhaitez échanger un article contre un autre (taille différente, couleur différente, etc.), voici la procédure à suivre :</p>
        <ol>
          <li><strong>Demande d'échange</strong> : Connectez-vous à votre compte, accédez à la commande concernée et sélectionnez "Demander un échange" pour l'article concerné.</li>
          <li><strong>Choix du nouvel article</strong> : Sélectionnez l'article de remplacement souhaité parmi les options disponibles.</li>
          <li><strong>Différence de prix</strong> : Si l'article de remplacement est plus cher, vous devrez régler la différence. Si l'article est moins cher, nous vous rembourserons la différence.</li>
          <li><strong>Validation</strong> : Confirmez votre demande d'échange et suivez les instructions pour le retour du premier article.</li>
          <li><strong>Réception et envoi</strong> : Dès la réception de l'article retourné, nous préparons et expédions l'article de remplacement.</li>
        </ol>
        <p><strong>Disponibilité</strong> : L'échange est soumis à la disponibilité de l'article de remplacement. Si celui-ci n'est plus disponible, nous vous proposerons soit un remboursement, soit un avoir, soit un article alternatif.</p>
        <p><strong>Délai</strong> : Le traitement d'un échange peut prendre jusqu'à 5 jours ouvrables après la réception de l'article retourné. L'article de remplacement sera expédié selon les délais de livraison standards indiqués sur notre site.</p>
        <p><strong>Limitations</strong> : Les échanges ne sont possibles que pour des articles de même catégorie. Par exemple, un vêtement peut être échangé contre un autre vêtement, mais pas contre un accessoire. De plus, les articles personnalisés ne peuvent pas faire l'objet d'un échange.</p>
      `,
		},
		{
			id: 'warranty',
			title: 'Garanties',
			content: `
        <p>Tous nos produits bénéficient des garanties suivantes :</p>
        <ul>
          <li><strong>Garantie légale de conformité</strong> : Tous nos produits sont couverts par la garantie légale de conformité d'une durée de 2 ans à compter de la délivrance du produit. Cette garantie vous permet d'obtenir gratuitement la réparation ou le remplacement du produit non conforme à ce qui était annoncé.</li>
          <li><strong>Garantie contre les vices cachés</strong> : Conformément aux articles 1641 à 1649 du Code civil, vous bénéficiez d'une garantie contre les défauts cachés qui existaient au moment de la vente et qui rendent le produit impropre à l'usage auquel il est destiné.</li>
          <li><strong>Garantie commerciale</strong> : En plus des garanties légales, certains de nos produits bénéficient d'une garantie commerciale supplémentaire dont les conditions et la durée sont précisées sur la fiche produit et dans la documentation accompagnant le produit.</li>
        </ul>
        <p><strong>Mise en œuvre des garanties</strong> : Pour faire valoir l'une de ces garanties, contactez notre service client en précisant le problème rencontré et en joignant des photos si possible. Nous vous indiquerons alors la marche à suivre.</p>
        <p><strong>Exclusions</strong> : Les garanties ne couvrent pas :</p>
        <ul>
          <li>Les dommages résultant d'une utilisation anormale ou non conforme aux instructions du fabricant</li>
          <li>Les dommages résultant d'un défaut d'entretien</li>
          <li>L'usure normale du produit</li>
          <li>Les dommages d'origine externe (choc, chute, exposition à l'humidité, etc.)</li>
          <li>Les dommages résultant d'une modification ou réparation effectuée par un tiers non autorisé</li>
        </ul>
        <p>Pour plus d'informations sur les garanties applicables à chaque produit, consultez nos fiches produits ou contactez notre service client.</p>
      `,
		},
		{
			id: 'defective-products',
			title: 'Produits défectueux',
			content: `
        <p>En cas de réception d'un produit défectueux ou endommagé, voici la procédure à suivre :</p>
        <ol>
          <li><strong>Délai</strong> : Signalez le problème dans un délai de 48 heures après la réception de votre commande.</li>
          <li><strong>Notification</strong> : Connectez-vous à votre compte client, accédez à la commande concernée et cliquez sur "Signaler un problème", ou contactez directement notre service client.</li>
          <li><strong>Description</strong> : Décrivez précisément le défaut constaté et joignez des photos si possible.</li>
          <li><strong>Solution</strong> : Selon la nature du défaut, nous vous proposerons, à notre discrétion et conformément à la législation en vigueur :
            <ul>
              <li>Une réparation du produit</li>
              <li>Un remplacement par un produit identique</li>
              <li>Un remboursement intégral si les options précédentes ne sont pas possibles</li>
            </ul>
          </li>
        </ol>
        <p><strong>Frais de retour</strong> : Pour les produits défectueux ou endommagés, les frais de retour sont à notre charge. Nous vous fournirons une étiquette de retour prépayée ou organiserons l'enlèvement du produit à votre domicile pour les articles volumineux.</p>
        <p><strong>Vérification</strong> : À réception du produit défectueux, notre service qualité procédera à une vérification pour confirmer la nature du défaut. En cas de désaccord sur la nature du défaut, nous pourrons faire appel à un expert indépendant.</p>
      `,
		},
		{
			id: 'gift-returns',
			title: 'Retours de cadeaux',
			content: `
        <p>Si vous avez reçu un article en cadeau, nous avons mis en place une procédure spécifique pour vous permettre de le retourner ou de l'échanger :</p>
        <ul>
          <li><strong>Identification</strong> : Toutes les commandes cadeaux sont accompagnées d'un code cadeau unique que le destinataire peut utiliser pour accéder aux informations de la commande sans voir le prix payé.</li>
          <li><strong>Retour</strong> : En utilisant ce code sur notre site, dans la section "Retour cadeau", vous pouvez initier une procédure de retour sans que l'acheteur original n'en soit informé.</li>
          <li><strong>Options</strong> : Pour les cadeaux, nous proposons les options suivantes :
            <ul>
              <li>Échange contre un autre article de valeur équivalente ou inférieure</li>
              <li>Crédit boutique du montant de l'article, valable 1 an sur notre site</li>
              <li>Remboursement sur votre compte bancaire (nécessite la fourniture de vos coordonnées bancaires)</li>
            </ul>
          </li>
        </ul>
        <p><strong>Remboursement</strong> : Par défaut, si vous optez pour un remboursement, celui-ci sera effectué sous forme de crédit boutique. Si vous préférez un remboursement sur votre compte bancaire, vous devrez fournir vos coordonnées bancaires.</p>
        <p><strong>Confidentialité</strong> : Nous garantissons une discrétion totale : l'acheteur original ne sera pas informé du retour ou de l'échange, sauf si vous nous en faites la demande expresse.</p>
      `,
		},
		{
			id: 'international-returns',
			title: 'Retours internationaux',
			content: `
        <p>Pour les commandes expédiées hors de l'Union Européenne, les retours sont soumis à des conditions particulières :</p>
        <ul>
          <li><strong>Délai</strong> : Le délai de rétractation reste de 30 jours, mais compte tenu des délais postaux internationaux, nous vous recommandons d'initier votre demande de retour dès que possible.</li>
          <li><strong>Frais</strong> : Les frais de retour international sont à votre charge, sauf en cas de produit défectueux ou non conforme. Ces frais peuvent être significatifs, nous vous conseillons donc de vous renseigner auprès des services postaux avant d'effectuer votre retour.</li>
          <li><strong>Douanes</strong> : Pour les retours internationaux, vous êtes responsable de toutes les formalités douanières liées au retour. Assurez-vous que le colis est correctement déclaré comme "Retour de marchandise" pour éviter des frais supplémentaires.</li>
        </ul>
        <p><strong>Tracking</strong> : Pour les retours internationaux, nous vous recommandons vivement d'utiliser un service avec suivi et assurance, car les colis peuvent être soumis à des délais plus longs et des risques accrus de perte.</p>
        <p><strong>Remboursement</strong> : Les taxes et droits de douane que vous avez pu payer lors de la réception de votre commande initiale sont remboursables uniquement sur présentation d'un justificatif émis par les autorités douanières de votre pays.</p>
      `,
		},
		{
			id: 'faq',
			title: 'Questions fréquentes',
			content: `
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Combien de temps ai-je pour retourner un article ?</h3>
            <p>Vous disposez de 30 jours calendaires à compter de la réception de votre commande pour nous notifier votre souhait de retourner un article. Ce délai est une extension commerciale du délai légal de rétractation de 14 jours.</p>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Qui paie les frais de retour ?</h3>
            <p>En règle générale, les frais de retour sont à votre charge, sauf dans les cas de produits défectueux, non conformes ou si nous avons commis une erreur dans votre commande. Pour ces exceptions, nous prenons en charge les frais de retour et vous fournissons une étiquette prépayée.</p>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Comment suivre mon remboursement ?</h3>
            <p>Vous pouvez suivre l'état de votre remboursement dans votre espace client, dans la section "Mes retours". Vous recevrez également des notifications par email à chaque étape du processus : réception de votre retour, validation et remboursement.</p>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Puis-je retourner un article soldé ou en promotion ?</h3>
            <p>Oui, les articles soldés ou en promotion bénéficient des mêmes conditions de retour que les articles à prix régulier, à l'exception des articles spécifiquement marqués comme "Vente finale" ou "Non retournable" dans leur description.</p>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Comment emballer mon retour ?</h3>
            <p>Utilisez l'emballage d'origine ou un emballage adapté qui protégera l'article pendant le transport. Assurez-vous que l'article est propre, avec toutes ses étiquettes d'origine et tous ses accessoires. Incluez le formulaire de retour ou une note avec votre numéro de commande. Ne collez pas d'étiquette directement sur l'emballage d'origine du produit.</p>
          </div>
        </div>
      `,
		},
		{
			id: 'contact',
			title: 'Nous contacter',
			content: `
        <p>Pour toute question concernant notre politique de retour ou pour un suivi spécifique de votre retour en cours, notre équipe est à votre disposition :</p>
        <ul>
          <li><strong>Par email</strong> : support@flowcontent.io</li>
          <li><strong>Par téléphone</strong> : +19136759287 (du lundi au vendredi, de 9h à 18h)</li>
          <li><strong>Par chat</strong> : Disponible sur notre site du lundi au samedi, de 9h à 20h</li>
          <li><strong>Par courrier</strong> : Votre Boutique - Service Retours, 254 rue Vendôme Lyon 003</li>
        </ul>
        <p>Pour un traitement plus rapide de votre demande, merci de toujours mentionner votre numéro de commande et/ou votre numéro de retour.</p>
        <p>Nous nous engageons à répondre à toutes vos demandes dans un délai maximum de 48 heures ouvrées.</p>
      `,
		},
	],
};

export default function ReturnsPage() {
	return (
		<Suspense fallback={<ReturnsLoading />}>
			<ReturnsContent returnsData={returnsData} />
		</Suspense>
	);
}
