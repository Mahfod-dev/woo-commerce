import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order } from '@/lib/orders';
import { UserOrder } from '@/context/authContext';

// Clés de requête pour les commandes
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...orderKeys.lists(), { filters }] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
  user: (userId: string) => [...orderKeys.all, 'user', userId] as const,
};

// Hook pour récupérer les commandes de l'utilisateur connecté
export function useUserOrders() {
  return useQuery({
    queryKey: orderKeys.lists(),
    queryFn: async (): Promise<UserOrder[]> => {
      const response = await fetch('/api/user-orders');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }
      const { orders } = await response.json();
      return orders || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - les commandes peuvent changer
    gcTime: 5 * 60 * 1000,
  });
}

// Hook pour récupérer une commande spécifique par ID
export function useOrder(orderId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: async (): Promise<Order> => {
      const response = await fetch(`/api/order/${orderId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Commande non trouvée');
        }
        throw new Error('Erreur lors de la récupération de la commande');
      }
      const { order } = await response.json();
      return order;
    },
    enabled: enabled && !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
}

// Hook pour créer une nouvelle commande
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la commande');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalider les commandes utilisateur pour refetch
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

// Hook pour mettre à jour le statut d'une commande
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await fetch(`/api/order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la commande');
      }

      return response.json();
    },
    onSuccess: (data, { orderId }) => {
      // Mettre à jour la commande spécifique dans le cache
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      // Invalider aussi la liste des commandes
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}