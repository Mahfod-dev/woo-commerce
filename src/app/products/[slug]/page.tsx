// app/products/[slug]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProducts, WooProduct } from '@/lib/woo';
import ProductDetailContent from '@/components/ProductDetailContent';
import ProductSchema from '@/components/ProductSchema';

// Interface pour les propriétés de la page
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Type pour les documents
interface ProductDocument {
  id: string;
  name: string;
  description: string;
  url: string;
  size: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'other';
}

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
  // Documents et ressources
  documents?: ProductDocument[];
}

// Fonction pour générer des documents selon le produit
function generateDocuments(wooProduct: WooProduct): ProductDocument[] {
  const documents: ProductDocument[] = [];
  
  // Ajouter des documents selon certaines conditions
  // Par exemple, si le produit est premium ou de certaines catégories
  const isPremium = wooProduct.tags?.some(tag => tag.name.toLowerCase().includes('premium'));
  const isElectronic = wooProduct.categories?.some(cat => 
    cat.name.toLowerCase().includes('électronique') || 
    cat.name.toLowerCase().includes('electronic')
  );
  
  // Document guide d'utilisation pour tous les produits premium ou électroniques
  if (isPremium || isElectronic) {
    documents.push({
      id: `guide-${wooProduct.id}`,
      name: 'Guide d\'utilisation',
      description: 'Manuel complet d\'utilisation',
      url: '#', // En production, ici serait l'URL réelle du document
      size: '2.4 MB',
      type: 'pdf'
    });
  }
  
  // Fiche technique pour les produits premium
  if (isPremium) {
    documents.push({
      id: `specs-${wooProduct.id}`,
      name: 'Fiche technique détaillée',
      description: 'Spécifications techniques complètes',
      url: '#',
      size: '1.8 MB',
      type: 'pdf'
    });
  }
  
  // Certificat de garantie pour certains produits
  if (parseFloat(wooProduct.price) > 100) { // Produits > 100€
    documents.push({
      id: `warranty-${wooProduct.id}`,
      name: 'Certificat de garantie',
      description: 'Conditions de garantie et support',
      url: '#',
      size: '450 KB',
      type: 'pdf'
    });
  }
  
  // Vidéo de démonstration pour les produits avec des images multiples
  if (wooProduct.images && wooProduct.images.length > 2) {
    documents.push({
      id: `demo-${wooProduct.id}`,
      name: 'Vidéo de démonstration',
      description: 'Présentation complète du produit',
      url: '#',
      size: '15.2 MB',
      type: 'video'
    });
  }
  
  return documents;
}

// Fonction pour convertir WooProduct en Product
function convertToProduct(wooProduct: WooProduct): Product {
  return {
    ...wooProduct,
    stock_quantity: wooProduct.stock_quantity ?? undefined,
    documents: generateDocuments(wooProduct)
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
					{/* Partie gauche - Galerie */}
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

					{/* Partie droite - Infos produit */}
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

// Métadonnées dynamiques pour SEO
export async function generateMetadata({ params }: PageProps) {
	try {
		const { slug } = await params;
		const products = await getProducts(`?slug=${slug}`);

		if (!products || products.length === 0) {
			return {
				title: 'Produit non trouvé',
			};
		}

		const product = products[0];

		return {
			title: `${product.name} | Votre Boutique`,
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
			title: 'Détail produit | Votre Boutique',
		};
	}
}

// Génération des chemins statiques - plus efficace avec un catalogue limité
export async function generateStaticParams() {
	try {
		// Avec un catalogue limité, on peut récupérer tous les produits sans paginer
		const products = await getProducts();
		return products.map((product) => ({
			slug: product.slug,
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
		const { slug } = await params;

		// Récupération des données du produit
		const products = await getProducts(`?slug=${slug}`);

		if (!products || products.length === 0) {
			notFound();
		}

		const product = products[0];

		// Récupérer tous les produits en une seule requête (efficace avec un catalogue limité)
		const allProducts = await getProducts();

		// Filtrer les produits pour obtenir les accessoires (produits de la catégorie "Accessoires")
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

		// Récupérer des produits similaires (même catégorie que le produit actuel)
		// mais en excluant les accessoires
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
						// Exclure les produits de la catégorie Accessoires des produits similaires
						!p.categories.some(
							(cat) => cat.id === ACCESSORIES_CATEGORY_ID
						)
				)
				.slice(0, 3);
			
			similarProducts.push(...filteredProducts);
		}

		// Si on a très peu de produits, on peut simplement montrer les autres produits
		// qui ne sont pas des accessoires
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

		// Convertir les produits WooProduct en Product
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