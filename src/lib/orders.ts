import { supabase } from './supabase/client';
import { standardizeUserId } from './utils';

/**
 * Structure d'une commande 
 */
export interface Order {
  id: number;
  user_id: string;
  status: 'processing' | 'completed' | 'on-hold' | 'cancelled';
  total: number;
  items: OrderItem[];
  shipping_address: any;
  billing_address: any;
  payment_intent?: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Structure d'un item de commande
 */
export interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  image_url?: string;
  variant?: string;
}

/**
 * Enregistre une nouvelle commande dans Supabase
 */
export async function createOrder(orderData: Omit<Order, 'id' | 'created_at'>) {
  try {
    // Utiliser le client supabase standard

    console.log('Supabase createOrder - orderData:', orderData);
    console.log('Supabase createOrder - user_id:', orderData.user_id, 'type:', typeof orderData.user_id);

    // Transformer les données pour correspondre exactement au schéma de la base de données
    const sourceData = orderData as any;
    
    const dbOrderData = {
      user_id: sourceData.user_id,
      status: sourceData.status || 'processing',
      total: sourceData.total,
      items: sourceData.items,
      billing_address: sourceData.billing || sourceData.billing_address,
      shipping_address: sourceData.shipping || sourceData.shipping_address,
      payment_intent: sourceData.payment_intent || null,
      created_at: new Date().toISOString()
    };

    console.log('Transformed order data for DB:', dbOrderData);

    const { data, error } = await supabase
      .from('orders')
      .insert(dbOrderData)
      .select()
      .single();

    if (error) {
      // Message d'erreur amélioré
      console.error('Error creating order in Supabase:', error);
      console.error('Failed order data:', {
        user_id: orderData.user_id,
        user_id_type: typeof orderData.user_id,
        user_id_length: orderData.user_id?.length || 0
      });
      throw new Error(`Impossible de créer la commande dans Supabase: ${error.message}`);
    }

    return data;
  } catch (e) {
    console.error("Erreur inattendue lors de la création de commande:", e);
    throw e;
  }
}

/**
 * Met à jour le statut et les informations de paiement d'une commande
 */
export async function updateOrderPayment(orderId: number, userId: string, paymentIntent: string, status: Order['status'] = 'processing') {
  // Utiliser le client supabase standard
  
  const { data, error } = await supabase
    .from('orders')
    .update({
      payment_intent: paymentIntent,
      status: status,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)
    .eq('user_id', userId) // Sécurité: vérifier que l'utilisateur est bien propriétaire de la commande
    .select()
    .single();
  
  if (error) {
    console.error('Error updating order payment:', error);
    throw new Error(`Impossible de mettre à jour le paiement: ${error.message}`);
  }
  
  return data;
}

/**
 * Récupère toutes les commandes d'un utilisateur
 */
export async function getUserOrders(userId: string) {
  // Utiliser le client supabase standard

  // Utiliser la fonction de standardisation des IDs pour uniformiser le traitement
  const validUserId = standardizeUserId(userId);

  console.log('getUserOrders - Recherche des commandes pour userId:', validUserId, 'type:', typeof validUserId);

  // Ajout d'un log de débogage sur le comportement de la requête
  const query = supabase
    .from('orders')
    .select('*')
    .eq('user_id', validUserId)
    .order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }

  console.log('getUserOrders - Commandes trouvées:', data?.length || 0, 'commandes pour userId', userId);

  return data || [];
}

/**
 * Récupère une commande spécifique par son ID
 */
export async function getOrderById(orderId: number, userId: string) {
  // Utiliser le client supabase standard
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('user_id', userId) // Sécurité: vérifier que l'utilisateur est bien propriétaire de la commande
    .single();
  
  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }
  
  return data;
}

/**
 * Vérifie si une commande appartient à l'utilisateur
 */
export async function verifyOrderOwnership(orderId: number, userId: string): Promise<boolean> {
  // Utiliser le client supabase standard
  
  const { data, error } = await supabase
    .from('orders')
    .select('id')
    .eq('id', orderId)
    .eq('user_id', userId)
    .single();
  
  if (error || !data) {
    return false;
  }
  
  return true;
}

/**
 * Met à jour le statut d'une commande
 */
export async function updateOrderStatus(orderId: number, status: Order['status'], userId: string) {
  // Utiliser le client supabase standard
  
  const { data, error } = await supabase
    .from('orders')
    .update({
      status: status,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)
    .eq('user_id', userId) // Sécurité: vérifier que l'utilisateur est bien propriétaire de la commande
    .select()
    .single();
  
  if (error) {
    console.error('Error updating order status:', error);
    throw new Error(`Impossible de mettre à jour le statut: ${error.message}`);
  }
  
  return data;
}

/**
 * Récupère les statistiques de commandes d'un utilisateur
 */
export async function getUserOrderStats(userId: string) {
  const allOrders = await getUserOrders(userId);
  
  return {
    total: allOrders.length,
    completed: allOrders.filter(order => order.status === 'completed').length,
    processing: allOrders.filter(order => order.status === 'processing').length,
    cancelled: allOrders.filter(order => order.status === 'cancelled').length,
    totalSpent: allOrders
      .filter(order => order.status !== 'cancelled')
      .reduce((total, order) => total + (order.total || 0), 0)
  };
}