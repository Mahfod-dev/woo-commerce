import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { createOrder as createWooOrder } from '@/lib/woo';

export async function POST(req: NextRequest) {
  try {
    // Récupérer le client Supabase avec await pour cookies()
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);

    // Vérifier si l'utilisateur est authentifié avec getUser (plus sécurisé)
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer l'ID de l'utilisateur
    const userId = data.user.id;

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

    // 1. D'abord créer la commande dans WooCommerce
    const wooOrderData = {
      payment_method: 'card-direct',
      payment_method_title: 'Carte bancaire',
      set_paid: false,
      billing: orderData.billing_address,
      shipping: orderData.shipping_address,
      line_items: orderData.items.map(item => ({
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

    console.log('WooCommerce order created:', wooOrder);

    // 2. Puis créer la commande dans Supabase en utilisant directement le client admin
    // qui contourne les politiques RLS en utilisant la clé de service
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
    console.log('Tentative d\'insertion dans Supabase avec ID utilisateur:', userId);
    console.log('URL Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Clé de service disponible:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        status: 'processing',
        total: parseFloat(orderData.total),
        items: orderData.items,
        shipping_address: orderData.shipping_address || null,
        billing_address: orderData.billing_address || null,
        payment_intent: orderData.payment_intent || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de l\'insertion dans Supabase:', error);
      throw new Error(`Impossible de créer la commande dans Supabase: ${error.message}`);
    }

    // Retourner la commande créée avec les données combinées
    return NextResponse.json({ 
      order: {
        ...wooOrder,
        id: wooOrder.id,
        supabaseOrderId: order.id
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue lors de la création de la commande' },
      { status: 500 }
    );
  }
}