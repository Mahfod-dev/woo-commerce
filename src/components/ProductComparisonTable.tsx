'use client';

import { WooProduct } from '@/lib/woo';
import Link from 'next/link';

interface ProductComparisonTableProps {
	currentProduct: WooProduct;
	similarProducts: WooProduct[];
	title?: string;
}

// Fonction pour extraire une valeur d'attribut
function getAttributeValue(product: WooProduct, attributeName: string): string {
	const attr = product.attributes?.find(
		a => a.name.toLowerCase() === attributeName.toLowerCase()
	);
	return attr?.options?.[0] || '-';
}

// Fonction pour calculer le score qualité/prix (fictif basé sur les données disponibles)
function getValueScore(product: WooProduct): string {
	const price = parseFloat(product.price || '0');
	const rating = parseFloat(product.average_rating || '0');

	if (rating > 4 && price < 50) return '⭐⭐⭐⭐⭐ Excellent';
	if (rating > 3.5 && price < 100) return '⭐⭐⭐⭐ Très bon';
	if (rating > 3) return '⭐⭐⭐ Bon';
	if (rating > 0) return '⭐⭐ Correct';
	return '- Non noté';
}

export default function ProductComparisonTable({
	currentProduct,
	similarProducts,
	title = 'Comparatif produits similaires',
}: ProductComparisonTableProps) {
	// Inclure le produit actuel dans la comparaison
	const allProducts = [currentProduct, ...similarProducts.slice(0, 2)];

	if (allProducts.length < 2) {
		return null; // Pas assez de produits pour comparer
	}

	return (
		<div className="mt-12 bg-gray-50 rounded-xl p-6">
			<h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>

			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-gray-200">
							<th className="text-left py-3 px-4 font-semibold text-gray-600">
								Caractéristique
							</th>
							{allProducts.map((product, index) => (
								<th
									key={product.id}
									className={`text-center py-3 px-4 font-semibold ${
										index === 0
											? 'bg-indigo-50 text-indigo-700'
											: 'text-gray-700'
									}`}
								>
									<div className="flex flex-col items-center gap-1">
										<span className="text-xs text-gray-500">
											{index === 0 ? 'Ce produit' : `Alternative ${index}`}
										</span>
										<span className="line-clamp-2">
											{product.name.length > 30
												? product.name.substring(0, 30) + '...'
												: product.name}
										</span>
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{/* Prix */}
						<tr className="border-b border-gray-100">
							<td className="py-3 px-4 font-medium text-gray-700">Prix</td>
							{allProducts.map((product, index) => (
								<td
									key={product.id}
									className={`text-center py-3 px-4 ${
										index === 0 ? 'bg-indigo-50' : ''
									}`}
								>
									<div className="flex flex-col items-center">
										{product.on_sale && product.sale_price ? (
											<>
												<span className="text-red-600 font-bold">
													{product.sale_price}€
												</span>
												<span className="text-gray-400 text-xs line-through">
													{product.regular_price}€
												</span>
											</>
										) : (
											<span className="font-bold">{product.price}€</span>
										)}
									</div>
								</td>
							))}
						</tr>

						{/* Disponibilité */}
						<tr className="border-b border-gray-100">
							<td className="py-3 px-4 font-medium text-gray-700">Disponibilité</td>
							{allProducts.map((product, index) => (
								<td
									key={product.id}
									className={`text-center py-3 px-4 ${
										index === 0 ? 'bg-indigo-50' : ''
									}`}
								>
									{product.stock_status === 'instock' ? (
										<span className="text-green-600 font-medium">✓ En stock</span>
									) : product.stock_status === 'onbackorder' ? (
										<span className="text-yellow-600 font-medium">Sur commande</span>
									) : (
										<span className="text-red-600 font-medium">Rupture</span>
									)}
								</td>
							))}
						</tr>

						{/* Note clients */}
						<tr className="border-b border-gray-100">
							<td className="py-3 px-4 font-medium text-gray-700">Note clients</td>
							{allProducts.map((product, index) => (
								<td
									key={product.id}
									className={`text-center py-3 px-4 ${
										index === 0 ? 'bg-indigo-50' : ''
									}`}
								>
									{product.average_rating && parseFloat(product.average_rating) > 0 ? (
										<div className="flex flex-col items-center">
											<span className="font-medium">{product.average_rating}/5</span>
											<span className="text-xs text-gray-500">
												({product.rating_count} avis)
											</span>
										</div>
									) : (
										<span className="text-gray-400">Pas encore noté</span>
									)}
								</td>
							))}
						</tr>

						{/* Rapport qualité/prix */}
						<tr className="border-b border-gray-100">
							<td className="py-3 px-4 font-medium text-gray-700">Rapport qualité/prix</td>
							{allProducts.map((product, index) => (
								<td
									key={product.id}
									className={`text-center py-3 px-4 ${
										index === 0 ? 'bg-indigo-50' : ''
									}`}
								>
									<span className="text-sm">{getValueScore(product)}</span>
								</td>
							))}
						</tr>

						{/* Livraison */}
						<tr className="border-b border-gray-100">
							<td className="py-3 px-4 font-medium text-gray-700">Livraison</td>
							{allProducts.map((product, index) => (
								<td
									key={product.id}
									className={`text-center py-3 px-4 ${
										index === 0 ? 'bg-indigo-50' : ''
									}`}
								>
									<span className="text-green-600 font-medium">Gratuite</span>
								</td>
							))}
						</tr>

						{/* Retours */}
						<tr className="border-b border-gray-100">
							<td className="py-3 px-4 font-medium text-gray-700">Retours</td>
							{allProducts.map((product, index) => (
								<td
									key={product.id}
									className={`text-center py-3 px-4 ${
										index === 0 ? 'bg-indigo-50' : ''
									}`}
								>
									<span className="text-gray-700">14 jours gratuit</span>
								</td>
							))}
						</tr>

						{/* Catégorie */}
						<tr className="border-b border-gray-100">
							<td className="py-3 px-4 font-medium text-gray-700">Catégorie</td>
							{allProducts.map((product, index) => (
								<td
									key={product.id}
									className={`text-center py-3 px-4 ${
										index === 0 ? 'bg-indigo-50' : ''
									}`}
								>
									<span className="text-gray-700">
										{product.categories?.[0]?.name || '-'}
									</span>
								</td>
							))}
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td className="py-4 px-4"></td>
							{allProducts.map((product, index) => (
								<td
									key={product.id}
									className={`text-center py-4 px-4 ${
										index === 0 ? 'bg-indigo-50' : ''
									}`}
								>
									{index === 0 ? (
										<span className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
											Produit actuel
										</span>
									) : (
										<Link
											href={`/products/${product.id}-${product.slug}`}
											className="inline-block px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors"
										>
											Voir ce produit
										</Link>
									)}
								</td>
							))}
						</tr>
					</tfoot>
				</table>
			</div>

			{/* Note explicative pour les IA */}
			<p className="mt-4 text-xs text-gray-500 text-center">
				Comparatif basé sur les caractéristiques disponibles. Tous nos produits bénéficient de la livraison gratuite et du retour sous 14 jours.
			</p>
		</div>
	);
}
