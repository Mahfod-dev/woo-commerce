import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { 
  WooProduct, 
  WooCategory, 
  getProducts, 
  getProductById, 
  searchProducts, 
  getProductsByCategory, 
  getFeaturedProducts 
} from '@/lib/woo';

// Clés de requête pour l'organisation du cache
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
  category: (categoryId: number) => [...productKeys.all, 'category', categoryId] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
  bestsellers: () => [...productKeys.all, 'bestsellers'] as const,
};

// Hook pour récupérer tous les produits
export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: () => getProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook pour récupérer les produits avec pagination infinie
export function useInfiniteProducts(filters: { 
  category?: number; 
  search?: string; 
  per_page?: number 
} = {}) {
  return useInfiniteQuery({
    queryKey: productKeys.list(filters),
    queryFn: ({ pageParam = 1 }) => 
      getProducts(), // Simplifié pour l'instant
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Si la dernière page a moins de produits que demandé, on est à la fin
      const expectedPerPage = filters.per_page || 12;
      if (lastPage.length < expectedPerPage) {
        return undefined;
      }
      return allPages.length + 1;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Hook pour récupérer un produit par ID
export function useProduct(productId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => getProductById(productId),
    enabled: enabled && !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes pour un produit individuel
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Hook pour récupérer un produit par slug (utilise getProducts et filtre)
export function useProductBySlug(slug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: [...productKeys.all, 'slug', slug],
    queryFn: async () => {
      const products = await getProducts();
      return products.find(product => product.slug === slug) || null;
    },
    enabled: enabled && !!slug,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

// Hook pour rechercher des produits
export function useProductSearch(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => searchProducts(query),
    enabled: enabled && query.length >= 2, // Minimum 2 caractères pour chercher
    staleTime: 2 * 60 * 1000, // 2 minutes pour la recherche
    gcTime: 5 * 60 * 1000,
  });
}

// Hook pour récupérer les produits d'une catégorie
export function useProductsByCategory(categoryId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: productKeys.category(categoryId),
    queryFn: () => getProductsByCategory(categoryId),
    enabled: enabled && !!categoryId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Hook pour récupérer les produits vedettes
export function useFeaturedProducts() {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => getFeaturedProducts(),
    staleTime: 10 * 60 * 1000, // 10 minutes pour les produits vedettes
    gcTime: 15 * 60 * 1000,
  });
}

// Hook pour récupérer les meilleures ventes
export function useBestsellerProducts() {
  return useQuery({
    queryKey: productKeys.bestsellers(),
    queryFn: () => getFeaturedProducts(), // Utilise getFeaturedProducts en attendant
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}