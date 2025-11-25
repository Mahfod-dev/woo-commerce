// Schéma pour la page Retours - Améliore le score Google Merchant Center
// Ce composant est rendu côté serveur pour être visible par les crawlers

export default function ReturnsPageSchemaSSR() {
	const returnsSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': 'https://selectura.co/returns#webpage',
		'name': 'Politique de Retour | Selectura',
		'description': 'Découvrez notre politique de retour, remboursement et échange. 14 jours pour retourner vos articles.',
		'url': 'https://selectura.co/returns',
		'isPartOf': {
			'@type': 'WebSite',
			'@id': 'https://selectura.co#website',
			'name': 'Selectura',
			'url': 'https://selectura.co',
		},
		'about': {
			'@type': 'MerchantReturnPolicy',
			'@id': 'https://selectura.co/returns#policy',
			'name': 'Politique de retour Selectura',
			'description': 'Retournez vos articles sous 14 jours pour un remboursement complet. Frais de retour à 4,90€.',
			'applicableCountry': ['FR', 'BE', 'CH', 'LU', 'DE', 'ES', 'IT', 'NL', 'PT', 'AT'],
			'returnPolicyCategory': 'https://schema.org/MerchantReturnFiniteReturnWindow',
			'merchantReturnDays': 14,
			'returnMethod': 'https://schema.org/ReturnByMail',
			'returnFees': 'https://schema.org/ReturnFeesCustomerResponsibility',
			'returnShippingFeesAmount': {
				'@type': 'MonetaryAmount',
				'value': '4.90',
				'currency': 'EUR',
			},
			'refundType': 'https://schema.org/FullRefund',
			'returnPolicyCountry': 'FR',
			'inStoreReturnsOffered': false,
			'itemCondition': 'https://schema.org/NewCondition',
		},
		'mainEntity': {
			'@type': 'FAQPage',
			'mainEntity': [
				{
					'@type': 'Question',
					'name': 'Combien de temps ai-je pour retourner un article ?',
					'acceptedAnswer': {
						'@type': 'Answer',
						'text': 'Vous disposez de 14 jours calendaires à compter de la réception de votre commande pour nous notifier votre souhait de retourner un article.',
					},
				},
				{
					'@type': 'Question',
					'name': 'Qui paie les frais de retour ?',
					'acceptedAnswer': {
						'@type': 'Answer',
						'text': 'Les frais de retour de 4,90€ sont à votre charge, sauf pour les produits défectueux, non conformes ou en cas d\'erreur de notre part. Dans ces cas, nous prenons en charge les frais de retour.',
					},
				},
				{
					'@type': 'Question',
					'name': 'Comment serai-je remboursé ?',
					'acceptedAnswer': {
						'@type': 'Answer',
						'text': 'Le remboursement est effectué dans un délai maximum de 14 jours après réception de votre retour, sur le même moyen de paiement utilisé lors de l\'achat.',
					},
				},
				{
					'@type': 'Question',
					'name': 'Puis-je échanger un article ?',
					'acceptedAnswer': {
						'@type': 'Answer',
						'text': 'Oui, vous pouvez échanger un article contre un autre de même catégorie (taille différente, couleur différente). Si l\'article de remplacement est plus cher, vous devrez régler la différence.',
					},
				},
				{
					'@type': 'Question',
					'name': 'Quels articles ne peuvent pas être retournés ?',
					'acceptedAnswer': {
						'@type': 'Answer',
						'text': 'Les produits personnalisés, les articles scellés descellés après livraison (hygiène, logiciels), et le contenu numérique dont l\'exécution a commencé ne peuvent pas être retournés.',
					},
				},
			],
		},
	};

	// Schéma MerchantReturnPolicy standalone pour Google Merchant Center
	const merchantReturnPolicySchema = {
		'@context': 'https://schema.org',
		'@type': 'MerchantReturnPolicy',
		'@id': 'https://selectura.co/returns#merchant-policy',
		'name': 'Politique de retour Selectura - 14 jours',
		'url': 'https://selectura.co/returns',
		'applicableCountry': ['FR', 'BE', 'CH', 'LU', 'DE', 'ES', 'IT', 'NL', 'PT', 'AT'],
		'returnPolicyCategory': 'https://schema.org/MerchantReturnFiniteReturnWindow',
		'merchantReturnDays': 14,
		'returnMethod': 'https://schema.org/ReturnByMail',
		'returnFees': 'https://schema.org/ReturnFeesCustomerResponsibility',
		'returnShippingFeesAmount': {
			'@type': 'MonetaryAmount',
			'value': '4.90',
			'currency': 'EUR',
		},
		'refundType': 'https://schema.org/FullRefund',
		'returnPolicyCountry': {
			'@type': 'Country',
			'name': 'France',
		},
		'returnPolicySeasonalOverride': {
			'@type': 'MerchantReturnPolicySeasonalOverride',
			'startDate': '2024-12-01',
			'endDate': '2025-01-15',
			'merchantReturnDays': 30,
			'returnPolicyCategory': 'https://schema.org/MerchantReturnFiniteReturnWindow',
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(returnsSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(merchantReturnPolicySchema) }}
			/>
		</>
	);
}
