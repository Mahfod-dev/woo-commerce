import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createOrder as createWooOrder } from '@/lib/woo';
import { standardizeUserId } from '@/lib/utils';

// Type pour les articles de commande
type OrderItem = {
  product_id: number;
  quantity: number;
  name?: string;
  price?: string;
};

export async function POST(req: NextRequest) {
  try {
    // Vérifier si l'utilisateur est authentifié avec NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer l'ID de l'utilisateur
    const userId = standardizeUserId(session.user.id);

    // Récupérer les données de la commande depuis le corps de la requête
    const orderData = await req.json();

    // Valider les données de la commande
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json(
        { error: 'Les articles de la commande sont requis' },
        { status: 400 }
      );
    }

    if (!orderData.total || isNaN(parseFloat(orderData.total))) {
      return NextResponse.json(
        { error: 'Le total de la commande est invalide' },
        { status: 400 }
      );
    }

    // S'assurer que l'utilisateur est le propriétaire de la commande
    orderData.user_id = userId;

    // Récupérer le woocommerce_customer_id depuis Supabase
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('woocommerce_customer_id')
      .eq('id', userId)
      .single();

    const customerId = profile?.woocommerce_customer_id || 0;
    console.log('🛒 Using WooCommerce customer ID:', customerId);

    // 1. D'abord créer la commande dans WooCommerce
    const wooOrderData = {
      customer_id: customerId, // ← Ajout du customer_id !
      payment_method: 'card-direct',
      payment_method_title: 'Carte bancaire',
      set_paid: false,
      billing: orderData.billing_address,
      shipping: orderData.shipping_address,
      line_items: orderData.items.map((item: OrderItem) => ({
        product_id: item.product_id,
        quantity: item.quantity
      })),
      shipping_lines: [{
        method_id: 'flat_rate',
        method_title: 'Livraison gratuite',
        total: '0'
      }]
    };

    const wooOrder = await createWooOrder(wooOrderData);
    if (!wooOrder) {
      throw new Error('Échec de création de la commande dans WooCommerce');
    }

    console.log('✅ WooCommerce order created:', wooOrder.id);

    // 2. Le webhook WooCommerce va automatiquement synchroniser dans Supabase
    // Pas besoin d'insérer manuellement !
    console.log('⏳ Webhook will sync order to Supabase automatically');

    // Retourner la commande WooCommerce
    return NextResponse.json({
      order: wooOrder
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue lors de la création de la commande' },
      { status: 500 }
    );
  }
}