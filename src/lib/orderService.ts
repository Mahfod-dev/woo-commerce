import { createOrder as createWooOrder } from '@/lib/woo';
import { createOrder as createSupabaseOrder } from '@/lib/orders';
import { formatPrice } from '@/lib/wooClient';
import { createClient } from '@supabase/supabase-js';

/**
 * Crée une commande à la fois dans WooCommerce et dans Supabase
 */
export async function createOrder(orderData: any, userId: string) {
  try {
    console.log('Creating order with data:', orderData);

    // Standardiser l'ID utilisateur (s'assurer qu'il s'agit d'une chaîne valide)
    const validUserId = userId && typeof userId === 'string' && userId.trim() !== ''
      ? userId.trim()
      : '';

    console.log('Creating order with standardized userId:', validUserId);

    // 1. Créer la commande dans WooCommerce
    const wooOrder = await createWooOrder(orderData);

    if (!wooOrder) {
      throw new Error('Échec de création de la commande dans WooCommerce');
    }

    console.log('WooCommerce order created:', wooOrder);

    // 2. Préparer les données pour Supabase
    const items = orderData.line_items.map((item: any) => {
      return {
        product_id: item.product_id,
        product_name: `Produit #${item.product_id}`, // Le nom réel viendrait de WooCommerce
        quantity: item.quantity,
        price: 0, // Prix à définir
        subtotal: 0, // Sous-total à calculer
        image_url: '/images/placeholder.jpg', // Image à récupérer depuis WooCommerce
      };
    });

    // Calculer les prix si disponibles dans wooOrder
    if (wooOrder.line_items && Array.isArray(wooOrder.line_items)) {
      wooOrder.line_items.forEach((wooItem: any, index: number) => {
        if (index < items.length) {
          items[index].product_name = wooItem.name || items[index].product_name;
          items[index].price = parseFloat(wooItem.price) || 0;
          items[index].subtotal = items[index].price * items[index].quantity;
        }
      });
    }

    // 3. Créer un client Supabase avec la clé de service pour contourner RLS
    try {
      // Ajouter plus de logs pour débogage
      console.log('Tentative d\'insertion de commande dans Supabase avec user_id:', userId);

      // Utiliser le client existant, qui a la politique RLS modifiée
      const supabaseOrder = await createSupabaseOrder({
        user_id: validUserId,
        status: 'processing',
        total: parseFloat(wooOrder.total || orderData.total || '0'),
        items: items,
        shipping_address: orderData.shipping,
        billing_address: orderData.billing,
        payment_intent: undefined, // Sera mis à jour après le paiement
      });

      console.log('Supabase order created successfully:', supabaseOrder);

      // 4. Retourner les détails combinés de la commande
      return {
        ...wooOrder,
        id: wooOrder.id || supabaseOrder.id,
        supabaseOrderId: supabaseOrder.id,
      };
    } catch (supabaseError) {
      console.error('Error creating order in Supabase:', supabaseError);

      // Même si l'enregistrement dans Supabase échoue, nous retournons quand même la commande WooCommerce
      // car c'est le système principal de e-commerce
      return {
        ...wooOrder,
        id: wooOrder.id,
        supabaseOrderId: null,
        supabaseError: (supabaseError as Error).message || 'Unknown error',
      };
    }
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Met à jour le statut de paiement d'une commande
 */
export async function updateOrderPayment(
  orderId: number, 
  wooOrderId: number | null,
  userId: string, 
  paymentIntentId: string, 
  status: string = 'processing'
) {
  try {
    // 1. Mettre à jour la commande dans Supabase
    const result = await fetch('/api/update-order-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        paymentIntentId,
        status,
      }),
    });
    
    if (!result.ok) {
      throw new Error('Échec de mise à jour du statut de paiement dans Supabase');
    }
    
    // 2. Si WooCommerce est configuré, mettre à jour la commande dans WooCommerce
    if (wooOrderId) {
      // Code pour mettre à jour la commande dans WooCommerce si nécessaire
    }
    
    return await result.json();
  } catch (error) {
    console.error('Error updating order payment:', error);
    throw error;
  }
}