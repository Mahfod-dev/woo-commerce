import { useQuery } from '@tanstack/react-query';
import { WooCategory, getCategories, getSubcategories } from '@/lib/woo';

// Clés de requête pour les catégories
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
  slug: (slug: string) => [...categoryKeys.all, 'slug', slug] as const,
  children: (parentId: number) => [...categoryKeys.all, 'children', parentId] as const,
};

// Hook pour récupérer toutes les catégories
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => getCategories(),
    staleTime: 15 * 60 * 1000, // 15 minutes - les catégories changent rarement
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Hook pour récupérer une catégorie par ID (utilise getCategories et filtre)
export function useCategory(categoryId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: categoryKeys.detail(categoryId),
    queryFn: async () => {
      const categories = await getCategories();
      return categories.find(cat => cat.id === categoryId) || null;
    },
    enabled: enabled && !!categoryId,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

// Hook pour récupérer une catégorie par slug (utilise getCategories et filtre)
export function useCategoryBySlug(slug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: categoryKeys.slug(slug),
    queryFn: async () => {
      const categories = await getCategories();
      return categories.find(cat => cat.slug === slug) || null;
    },
    enabled: enabled && !!slug,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

// Hook pour récupérer les sous-catégories d'une catégorie parent
export function useSubCategories(parentId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: categoryKeys.children(parentId),
    queryFn: () => getSubcategories(parentId),
    enabled: enabled && !!parentId,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}