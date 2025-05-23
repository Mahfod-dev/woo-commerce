import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProductById } from '@/lib/woo';

export interface CartItem {
  id: number;
  key: string;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

// Clés de requête pour le panier
export const cartKeys = {
  all: ['cart'] as const,
  items: () => [...cartKeys.all, 'items'] as const,
  count: () => [...cartKeys.all, 'count'] as const,
  total: () => [...cartKeys.all, 'total'] as const,
};

// Hook pour récupérer les items du panier (utilise localStorage pour l'instant)
export function useCartItems() {
  return useQuery({
    queryKey: cartKeys.items(),
    queryFn: (): CartItem[] => {
      if (typeof window === 'undefined') return [];
      const stored = localStorage.getItem('cart-items');
      return stored ? JSON.parse(stored) : [];
    },
    staleTime: Infinity, // Le localStorage ne devient jamais "stale"
    gcTime: Infinity,
  });
}

// Hook pour ajouter un produit au panier avec mise à jour optimiste
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: number; quantity?: number }) => {
      // Récupérer les informations du produit
      const product = await getProductById(productId);
      
      if (!product) {
        throw new Error('Produit non trouvé');
      }

      // Créer l'item du panier
      const cartItem: CartItem = {
        id: product.id,
        key: `item_${product.id}_${Date.now()}`,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images?.[0]?.src || '/images/placeholder.jpg',
      };

      return cartItem;
    },
    onMutate: async ({ productId, quantity = 1 }) => {
      // Annuler les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: cartKeys.items() });

      // Snapshot de l'état actuel
      const previousItems = queryClient.getQueryData<CartItem[]>(cartKeys.items()) || [];

      // Mise à jour optimiste
      const optimisticItem: CartItem = {
        id: productId,
        key: `temp_${productId}_${Date.now()}`,
        name: `Produit #${productId}`,
        price: '0.00',
        quantity: quantity,
        image: '/images/placeholder.jpg',
      };

      queryClient.setQueryData<CartItem[]>(cartKeys.items(), (old = []) => [...old, optimisticItem]);

      // Retourner le contexte pour rollback si nécessaire
      return { previousItems };
    },
    onError: (err, variables, context) => {
      // Rollback en cas d'erreur
      if (context?.previousItems) {
        queryClient.setQueryData(cartKeys.items(), context.previousItems);
      }
    },
    onSuccess: (newItem) => {
      // Remplacer l'item optimiste par l'item réel
      queryClient.setQueryData<CartItem[]>(cartKeys.items(), (old = []) => {
        // Supprimer l'item temporaire et ajouter le réel
        const withoutTemp = old.filter(item => !item.key.startsWith('temp_'));
        const updated = [...withoutTemp, newItem];
        
        // Sauvegarder dans localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart-items', JSON.stringify(updated));
        }
        
        return updated;
      });
    },
  });
}

// Hook pour mettre à jour la quantité d'un item
export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemKey, quantity }: { itemKey: string; quantity: number }) => {
      if (quantity < 1) {
        throw new Error('La quantité doit être supérieure à 0');
      }
      return { itemKey, quantity };
    },
    onMutate: async ({ itemKey, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.items() });
      
      const previousItems = queryClient.getQueryData<CartItem[]>(cartKeys.items()) || [];
      
      queryClient.setQueryData<CartItem[]>(cartKeys.items(), (old = []) =>
        old.map(item => item.key === itemKey ? { ...item, quantity } : item)
      );

      return { previousItems };
    },
    onError: (err, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(cartKeys.items(), context.previousItems);
      }
    },
    onSuccess: () => {
      // Sauvegarder dans localStorage
      const items = queryClient.getQueryData<CartItem[]>(cartKeys.items()) || [];
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart-items', JSON.stringify(items));
      }
    },
  });
}

// Hook pour supprimer un item du panier
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemKey }: { itemKey: string }) => {
      return itemKey;
    },
    onMutate: async ({ itemKey }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.items() });
      
      const previousItems = queryClient.getQueryData<CartItem[]>(cartKeys.items()) || [];
      
      queryClient.setQueryData<CartItem[]>(cartKeys.items(), (old = []) =>
        old.filter(item => item.key !== itemKey)
      );

      return { previousItems };
    },
    onError: (err, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(cartKeys.items(), context.previousItems);
      }
    },
    onSuccess: () => {
      // Sauvegarder dans localStorage
      const items = queryClient.getQueryData<CartItem[]>(cartKeys.items()) || [];
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart-items', JSON.stringify(items));
      }
    },
  });
}

// Hook pour vider le panier
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return true;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: cartKeys.items() });
      
      const previousItems = queryClient.getQueryData<CartItem[]>(cartKeys.items()) || [];
      
      queryClient.setQueryData<CartItem[]>(cartKeys.items(), []);

      return { previousItems };
    },
    onError: (err, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(cartKeys.items(), context.previousItems);
      }
    },
    onSuccess: () => {
      // Vider localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart-items');
      }
    },
  });
}

// Hook pour calculer le nombre total d'items
export function useCartCount() {
  const { data: items = [] } = useCartItems();
  return items.reduce((total, item) => total + item.quantity, 0);
}

// Hook pour calculer le total du panier
export function useCartTotal() {
  const { data: items = [] } = useCartItems();
  return items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
}