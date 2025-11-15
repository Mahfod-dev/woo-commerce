// app/products/[id]/page.tsx
import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getProductById, getProducts, WooProduct } from '@/lib/woo';
import ProductDetailContent from '@/components/ProductDetailContent';
import ProductSchema from '@/components/ProductSchema';

// Configuration de revalidation - régénère la page toutes les 30 minutes
export const revalidate = 1800;

// Interface pour les propriétés de la page
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

/* ========================================
 * SECTION DOCUMENTS - DÉSACTIVÉE
 * ========================================
 * Cette section permet d'ajouter des documents téléchargeables aux produits.
 * Actuellement désactivée car elle génère des liens factices.
 *
 * Pour réactiver :
 * 1. Décommenter le code ci-dessous
 * 2. Ajouter de vrais URLs dans generateDocuments()
 * 3. Décommenter la section UI dans ProductDetailContent.tsx
 * ======================================== */

// Type pour les documents
/*
interface ProductDocument {
  id: string;
  name: string;
  description: string;
  url: string;
  size: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'other';
}
*/

// Interface pour le type Product défini dans ProductDetailContent
interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price?: string;
  sale_price?: string;
  on_sale?: boolean;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  stock_quantity?: number;
  short_description: string;
  description: string;
  images: { src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
  average_rating?: string;
  rating_count?: number;
  featured?: boolean;
  tags: { id: number; name: string; slug: string }[];
  // Documents et ressources - DÉSACTIVÉ
  // documents?: ProductDocument[];
}

// Fonction pour générer des documents selon le produit - DÉSACTIVÉE
/*
function generateDocuments(wooProduct: WooProduct): ProductDocument[] {
  const documents: ProductDocument[] = [];

  const isPremium = wooProduct.tags?.some(tag => tag.name.toLowerCase().includes('premium'));
  const isElectronic = wooProduct.categories?.some(cat =>
    cat.name.toLowerCase().includes('électronique') ||
    cat.name.toLowerCase().includes('electronic')
  );

  if (isPremium || isElectronic) {
    documents.push({
      id: `guide-${wooProduct.id}`,
      name: 'Guide d\'utilisation',
      description: 'Manuel complet d\'utilisation',
      url: '#', // TODO: Remplacer par une vraie URL
      size: '2.4 MB',
      type: 'pdf'
    });
  }

  if (isPremium) {
    documents.push({
      id: `specs-${wooProduct.id}`,
      name: 'Fiche technique détaillée',
      description: 'Spécifications techniques complètes',
      url: '#', // TODO: Remplacer par une vraie URL
      size: '1.8 MB',
      type: 'pdf'
    });
  }

  if (parseFloat(wooProduct.price) > 100) {
    documents.push({
      id: `warranty-${wooProduct.id}`,
      name: 'Certificat de garantie',
      description: 'Conditions de garantie et support',
      url: '#', // TODO: Remplacer par une vraie URL
      size: '450 KB',
      type: 'pdf'
    });
  }

  if (wooProduct.images && wooProduct.images.length > 2) {
    documents.push({
      id: `demo-${wooProduct.id}`,
      name: 'Vidéo de démonstration',
      description: 'Présentation complète du produit',
      url: '#', // TODO: Remplacer par une vraie URL
      size: '15.2 MB',
      type: 'video'
    });
  }

  return documents;
}
*/

// Fonction pour convertir WooProduct en Product
function convertToProduct(wooProduct: WooProduct): Product {
  return {
    ...wooProduct,
    stock_quantity: wooProduct.stock_quantity ?? undefined,
    // documents: generateDocuments(wooProduct) // DÉSACTIVÉ - Décommenter pour réactiver
  };
}

// ID de la catégorie "Accessoires"
const ACCESSORIES_CATEGORY_ID = 31;

// Composant de chargement
function ProductDetailLoading() {
	return (
		<div className='bg-gray-50 min-h-screen'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<div className='flex flex-col lg:flex-row gap-10'>
					<div className='w-full lg:w-3/5'>
						<div className='bg-gray-200 h-96 rounded-xl animate-pulse mb-4'></div>
						<div className='flex gap-2 overflow-x-auto'>
							{[...Array(4)].map((_, i) => (
								<div
									key={i}
									className='bg-gray-200 w-24 h-24 rounded-lg flex-shrink-0 animate-pulse'></div>
							))}
						</div>
					</div>
					<div className='w-full lg:w-2/5 space-y-6'>
						<div className='h-8 bg-gray-200 rounded w-3/4 animate-pulse'></div>
						<div className='h-6 bg-gray-200 rounded w-1/3 animate-pulse'></div>
						<div className='space-y-2'>
							<div className='h-4 bg-gray-200 rounded animate-pulse'></div>
							<div className='h-4 bg-gray-200 rounded animate-pulse'></div>
							<div className='h-4 bg-gray-200 rounded animate-pulse'></div>
						</div>
						<div className='h-10 bg-gray-200 rounded animate-pulse'></div>
						<div className='h-12 bg-gray-200 rounded animate-pulse'></div>
					</div>
				</div>
			</div>
		</div>
	);
}

// Fonction helper pour parser l'ID depuis le paramètre
function parseProductId(idParam: string): { id: number; providedSlug?: string } {
	// Format attendu: "123" ou "123-mon-produit-slug"
	const match = idParam.match(/^(\d+)(?:-(.+))?$/);

	if (!match) {
		// Si le format ne correspond pas à ID ou ID-slug, c'est peut-être un ancien slug
		return { id: 0 }; // Retourne 0 pour indiquer que ce n'est pas valide
	}

	const id = parseInt(match[1], 10);
	const providedSlug = match[2];

	return { id, providedSlug };
}

// Métadonnées dynamiques pour SEO
export async function generateMetadata({ params }: PageProps) {
	try {
		const { id: idParam } = await params;
		const { id } = parseProductId(idParam);

		if (id === 0) {
			return { title: 'Produit non trouvé' };
		}

		const product = await getProductById(id);

		if (!product) {
			return { title: 'Produit non trouvé' };
		}

		return {
			title: `${product.name} | Selectura`,
			description: product.short_description
				.replace(/<[^>]*>/g, '')
				.slice(0, 160),
			openGraph: {
				title: product.name,
				description: product.short_description
					.replace(/<[^>]*>/g, '')
					.slice(0, 160),
				images:
					product.images.length > 0
						? [{ url: product.images[0].src }]
						: [],
			},
		};
	} catch (error) {
		console.error('Erreur lors de la génération des métadonnées:', error);
		return {
			title: 'Détail produit | Selectura',
		};
	}
}

// Génération des chemins statiques avec ID
export async function generateStaticParams() {
	try {
		const products = await getProducts();
		return products.map((product) => ({
			id: `${product.id}-${product.slug}`,
		}));
	} catch (error) {
		console.error(
			'Erreur lors de la génération des chemins statiques:',
			error
		);
		return [];
	}
}

export default async function ProductPage({ params }: PageProps) {
	try {
		const { id: idParam } = await params;
		const { id, providedSlug } = parseProductId(idParam);

		// Si l'ID est invalide, chercher par slug (compatibilité ancienne route)
		if (id === 0) {
			const products = await getProducts(`?slug=${idParam}`);
			if (products && products.length > 0) {
				// Redirection 301 vers la nouvelle URL avec ID
				redirect(`/products/${products[0].id}-${products[0].slug}`);
			}
			notFound();
		}

		// Récupération du produit par ID
		const product = await getProductById(id);

		if (!product) {
			notFound();
		}

		// Vérifier si le slug fourni correspond au slug actuel
		// Si non, rediriger vers l'URL canonique (bon slug)
		if (providedSlug && providedSlug !== product.slug) {
			redirect(`/products/${product.id}-${product.slug}`);
		}

		// Si pas de slug fourni (juste l'ID), rediriger vers l'URL complète
		if (!providedSlug) {
			redirect(`/products/${product.id}-${product.slug}`);
		}

		// Récupérer tous les produits pour les suggestions
		const allProducts = await getProducts();

		// Filtrer les accessoires
		const accessories = allProducts
			.filter((p) =>
				p.categories.some((cat) => cat.id === ACCESSORIES_CATEGORY_ID)
			)
			.slice(0, 4);

		// Vérifier s'il existe une version premium
		let premiumVariant = null;
		if (
			product.tags &&
			product.tags.some((tag) => tag.name === 'standard')
		) {
			const premiumProducts = allProducts.filter(
				(p) => p.tags && p.tags.some((tag) => tag.name === 'premium')
			);
			if (premiumProducts.length > 0) {
				premiumVariant = premiumProducts[0];
			}
		}

		// Produits similaires (même catégorie, exclus accessoires)
		const similarProducts: WooProduct[] = [];
		if (product.categories && product.categories.length > 0) {
			const filteredProducts = allProducts
				.filter(
					(p) =>
						p.id !== product.id &&
						p.categories &&
						p.categories.some((cat) =>
							product.categories.some(
								(prodCat) => prodCat.id === cat.id
							)
						) &&
						!p.categories.some(
							(cat) => cat.id === ACCESSORIES_CATEGORY_ID
						)
				)
				.slice(0, 3);

			similarProducts.push(...filteredProducts);
		}

		if (similarProducts.length === 0 && allProducts.length <= 5) {
			const filteredProducts = allProducts
				.filter(
					(p) =>
						p.id !== product.id &&
						!p.categories.some(
							(cat) => cat.id === ACCESSORIES_CATEGORY_ID
						)
				)
				.slice(0, 3);

			similarProducts.push(...filteredProducts);
		}

		// Convertir les produits
		const productConverted = convertToProduct(product);
		const accessoriesConverted = accessories.map(convertToProduct);
		const premiumVariantConverted = premiumVariant ? convertToProduct(premiumVariant) : null;
		const similarProductsConverted = similarProducts.map(convertToProduct);

		return (
			<>
				<ProductSchema product={productConverted} />
				<Suspense fallback={<ProductDetailLoading />}>
					<ProductDetailContent
						product={productConverted}
						accessories={accessoriesConverted}
						premiumVariant={premiumVariantConverted}
						similarProducts={similarProductsConverted}
					/>
				</Suspense>
			</>
		);
	} catch (error) {
		console.error('Erreur de chargement du produit:', error);
		throw error;
	}
}
