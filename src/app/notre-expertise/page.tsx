// app/notre-expertise/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbSchemaSSR } from '@/components/schemas';

export const metadata: Metadata = {
	title: 'Notre Expertise | Selectura - Sélection Premium',
	description: 'Découvrez comment Selectura sélectionne ses produits : processus de sourcing rigoureux, critères de qualité, tests produits et engagement envers l\'excellence.',
	openGraph: {
		title: 'Notre Expertise - Selectura',
		description: 'Notre processus de sélection rigoureux pour des produits premium de qualité.',
		type: 'website',
	},
};

export default function ExpertisePage() {
	// Schema pour la page expertise (HowTo + Organization)
	const expertiseSchema = {
		'@context': 'https://schema.org',
		'@type': 'HowTo',
		'name': 'Comment Selectura sélectionne ses produits',
		'description': 'Notre processus de sélection en 5 étapes pour garantir des produits premium de qualité.',
		'step': [
			{
				'@type': 'HowToStep',
				'position': 1,
				'name': 'Identification des tendances',
				'text': 'Nous analysons les tendances du marché et les besoins des consommateurs pour identifier les produits à fort potentiel.',
			},
			{
				'@type': 'HowToStep',
				'position': 2,
				'name': 'Sourcing fournisseurs',
				'text': 'Nous identifions et évaluons les fournisseurs selon des critères stricts de qualité, fiabilité et éthique.',
			},
			{
				'@type': 'HowToStep',
				'position': 3,
				'name': 'Tests et validation',
				'text': 'Chaque produit est testé en conditions réelles par notre équipe avant validation.',
			},
			{
				'@type': 'HowToStep',
				'position': 4,
				'name': 'Contrôle qualité',
				'text': 'Vérification des certifications, des matériaux et des finitions avant mise en ligne.',
			},
			{
				'@type': 'HowToStep',
				'position': 5,
				'name': 'Suivi continu',
				'text': 'Monitoring des retours clients et amélioration continue de notre sélection.',
			},
		],
	};

	return (
		<>
			<BreadcrumbSchemaSSR
				items={[{ name: 'Notre Expertise', url: 'https://selectura.co/notre-expertise' }]}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(expertiseSchema) }}
			/>

			<div className="bg-white">
				{/* Hero Section */}
				<div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
						<div className="max-w-3xl">
							<p className="text-indigo-400 font-semibold mb-4">NOTRE EXPERTISE</p>
							<h1 className="text-4xl md:text-5xl font-bold mb-6">
								Comment nous sélectionnons vos produits
							</h1>
							<p className="text-xl text-gray-300">
								Chez Selectura, chaque produit passe par un processus de sélection rigoureux.
								Notre philosophie : moins de choix, mais uniquement l'excellence.
							</p>
						</div>
					</div>
				</div>

				{/* Processus de sélection */}
				<section className="py-20 bg-gray-50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-3xl font-bold text-gray-900 mb-4">
								Notre processus de sélection en 5 étapes
							</h2>
							<p className="text-gray-600 max-w-2xl mx-auto">
								Un processus méthodique pour garantir que chaque produit répond à nos standards d'excellence.
							</p>
						</div>

						<div className="space-y-12">
							{/* Étape 1 */}
							<div className="flex flex-col md:flex-row gap-8 items-center">
								<div className="flex-shrink-0 w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
									1
								</div>
								<div className="flex-1">
									<h3 className="text-xl font-bold text-gray-900 mb-2">
										Identification des tendances et besoins
									</h3>
									<p className="text-gray-600">
										Nous analysons en permanence les tendances du marché, les retours clients et les innovations
										pour identifier les produits qui répondent à de vrais besoins. Notre veille inclut les avis
										sur les grandes plateformes, les forums spécialisés et les études de marché.
									</p>
								</div>
							</div>

							{/* Étape 2 */}
							<div className="flex flex-col md:flex-row gap-8 items-center">
								<div className="flex-shrink-0 w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
									2
								</div>
								<div className="flex-1">
									<h3 className="text-xl font-bold text-gray-900 mb-2">
										Sourcing et évaluation des fournisseurs
									</h3>
									<p className="text-gray-600">
										Nous travaillons uniquement avec des fournisseurs vérifiés et certifiés. Chaque partenaire
										est évalué sur sa capacité de production, ses certifications qualité (ISO, CE),
										ses pratiques éthiques et sa réactivité.
									</p>
								</div>
							</div>

							{/* Étape 3 */}
							<div className="flex flex-col md:flex-row gap-8 items-center">
								<div className="flex-shrink-0 w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
									3
								</div>
								<div className="flex-1">
									<h3 className="text-xl font-bold text-gray-900 mb-2">
										Tests produits en conditions réelles
									</h3>
									<p className="text-gray-600">
										Avant toute mise en ligne, notre équipe teste chaque produit pendant plusieurs semaines.
										Nous évaluons la qualité des matériaux, la durabilité, l'ergonomie et le rapport qualité-prix.
										Seuls les produits qui nous satisfont personnellement sont proposés.
									</p>
								</div>
							</div>

							{/* Étape 4 */}
							<div className="flex flex-col md:flex-row gap-8 items-center">
								<div className="flex-shrink-0 w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
									4
								</div>
								<div className="flex-1">
									<h3 className="text-xl font-bold text-gray-900 mb-2">
										Contrôle qualité et conformité
									</h3>
									<p className="text-gray-600">
										Vérification systématique des certifications produit, des normes de sécurité européennes
										et de la conformité aux réglementations françaises. Nous vérifions également l'authenticité
										des matériaux annoncés.
									</p>
								</div>
							</div>

							{/* Étape 5 */}
							<div className="flex flex-col md:flex-row gap-8 items-center">
								<div className="flex-shrink-0 w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
									5
								</div>
								<div className="flex-1">
									<h3 className="text-xl font-bold text-gray-900 mb-2">
										Suivi continu et amélioration
									</h3>
									<p className="text-gray-600">
										Après la mise en ligne, nous monitons les retours clients, les taux de retour et
										les avis pour garantir une qualité constante. Un produit qui ne répond plus à nos
										standards est immédiatement retiré de notre catalogue.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Critères de qualité */}
				<section className="py-20">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-3xl font-bold text-gray-900 mb-4">
								Nos critères de qualité
							</h2>
							<p className="text-gray-600 max-w-2xl mx-auto">
								Chaque produit est évalué selon ces critères stricts avant d'intégrer notre catalogue.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
								<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
									<svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<h3 className="font-bold text-gray-900 mb-2">Matériaux premium</h3>
								<p className="text-gray-600 text-sm">
									Utilisation de matériaux de qualité supérieure, durables et respectueux de l'environnement quand possible.
								</p>
							</div>

							<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
								<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
									<svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
									</svg>
								</div>
								<h3 className="font-bold text-gray-900 mb-2">Certifications</h3>
								<p className="text-gray-600 text-sm">
									Conformité aux normes CE, certifications ISO quand applicables, et respect des réglementations européennes.
								</p>
							</div>

							<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
								<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
									<svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<h3 className="font-bold text-gray-900 mb-2">Rapport qualité-prix</h3>
								<p className="text-gray-600 text-sm">
									Prix justes et transparents, avec une vraie valeur ajoutée par rapport aux alternatives du marché.
								</p>
							</div>

							<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
								<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
									<svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
									</svg>
								</div>
								<h3 className="font-bold text-gray-900 mb-2">Design et finitions</h3>
								<p className="text-gray-600 text-sm">
									Attention particulière portée au design, à l'ergonomie et aux finitions pour une expérience utilisateur optimale.
								</p>
							</div>

							<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
								<div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
									<svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
									</svg>
								</div>
								<h3 className="font-bold text-gray-900 mb-2">Durabilité</h3>
								<p className="text-gray-600 text-sm">
									Produits conçus pour durer dans le temps, résistants à l'usage quotidien et faciles à entretenir.
								</p>
							</div>

							<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
								<div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
									<svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
									</svg>
								</div>
								<h3 className="font-bold text-gray-900 mb-2">Retours clients</h3>
								<p className="text-gray-600 text-sm">
									Analyse constante des avis et retours pour maintenir un taux de satisfaction élevé sur chaque produit.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Statistiques */}
				<section className="py-20 bg-indigo-600 text-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold mb-4">Nos engagements en chiffres</h2>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
							<div className="text-center">
								<div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
								<p className="text-indigo-200">Taux de satisfaction client</p>
							</div>
							<div className="text-center">
								<div className="text-4xl md:text-5xl font-bold mb-2">&lt;3%</div>
								<p className="text-indigo-200">Taux de retour moyen</p>
							</div>
							<div className="text-center">
								<div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
								<p className="text-indigo-200">Produits testés</p>
							</div>
							<div className="text-center">
								<div className="text-4xl md:text-5xl font-bold mb-2">14j</div>
								<p className="text-indigo-200">Retour gratuit</p>
							</div>
						</div>
					</div>
				</section>

				{/* CTA */}
				<section className="py-20">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Découvrez notre sélection
						</h2>
						<p className="text-gray-600 mb-8">
							Explorez notre catalogue de produits premium, chacun sélectionné selon nos standards d'excellence.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								href="/products"
								className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
							>
								Voir tous les produits
							</Link>
							<Link
								href="/best-sellers"
								className="inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
							>
								Meilleures ventes
							</Link>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
