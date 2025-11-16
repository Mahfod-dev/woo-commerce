import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/orders';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { standardizeUserId } from '@/lib/utils';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';

// GET - Récupérer une commande par ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    
    // Vérifier si l'utilisateur est authentifié avec NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    // Standardiser l'ID utilisateur
    const userId = standardizeUserId(session.user.id);

    // Récupérer l'ID de la commande
    const orderId = parseInt(resolvedParams.id);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'ID de commande invalide' },
        { status: 400 }
      );
    }

    // Créer un client Supabase avec la clé service_role pour contourner les RLS
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('🔍 Fetching order:', orderId, 'for user:', userId);

    // Récupérer la commande depuis Supabase pour vérifier l'ownership
    const { data: supabaseOrder, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', userId) // Sécurité: vérifier que l'utilisateur est bien propriétaire de la commande
      .single();

    console.log('📦 Supabase order:', supabaseOrder);
    console.log('❌ Supabase error:', error);

    if (error) {
      console.error('Error fetching order from Supabase:', error);
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Récupérer les détails complets depuis WooCommerce
    const wooCommerceUrl = process.env.URL_WORDPRESS || 'https://selectura.shop';
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    console.log('🌐 WooCommerce URL:', wooCommerceUrl);
    console.log('🔑 Consumer Key:', consumerKey?.substring(0, 10) + '...');

    try {
      const wooUrl = `${wooCommerceUrl}/wp-json/wc/v3/orders/${orderId}`;
      console.log('📡 Fetching from WooCommerce:', wooUrl);

      const wooResponse = await fetch(wooUrl, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')}`,
        },
      });

      console.log('📊 WooCommerce response status:', wooResponse.status);

      if (wooResponse.ok) {
        const wooOrder = await wooResponse.json();
        console.log('✅ WooCommerce order:', wooOrder);
        console.log('📋 Line items:', wooOrder.line_items);

        // Combiner les données Supabase et WooCommerce
        const combinedOrder = {
          ...wooOrder,
          // Garder l'ID utilisateur de Supabase
          user_id: supabaseOrder.user_id,
          // Ajouter les données Supabase si nécessaires
          billing_address: wooOrder.billing,
          shipping_address: wooOrder.shipping,
        };

        console.log('🔄 Combined order:', combinedOrder);
        return NextResponse.json({ order: combinedOrder });
      } else {
        const errorText = await wooResponse.text();
        console.warn('⚠️ Could not fetch from WooCommerce:', wooResponse.status, errorText);
        console.log('🔙 Using Supabase data as fallback - mapping to WooCommerce format');

        // Mapper les données Supabase au format WooCommerce
        const mappedOrder = {
          id: supabaseOrder.id,
          number: supabaseOrder.id.toString(),
          status: supabaseOrder.status,
          date_created: supabaseOrder.created_at,
          date_modified: supabaseOrder.updated_at || supabaseOrder.created_at,
          total: supabaseOrder.total.toString(),
          currency: 'EUR',
          payment_method: 'stripe',
          payment_method_title: 'Carte bancaire',
          billing_address: supabaseOrder.billing_address,
          shipping: supabaseOrder.shipping_address,
          // Mapper items vers line_items
          line_items: supabaseOrder.items?.map((item: any, index: number) => ({
            id: index + 1,
            name: item.product_name,
            product_id: item.product_id,
            quantity: item.quantity,
            subtotal: item.subtotal?.toString() || item.price,
            total: (parseFloat(item.price) * item.quantity).toString(),
            price: parseFloat(item.price),
            sku: '',
            image: item.image_url,
          })) || [],
          shipping_lines: [
            {
              id: 1,
              method_title: 'Livraison gratuite',
              method_id: 'flat_rate',
              total: '0.00',
            }
          ],
        };

        console.log('🔄 Mapped Supabase order to WooCommerce format:', mappedOrder);
        return NextResponse.json({ order: mappedOrder });
      }
    } catch (wooError) {
      console.error('❌ Error fetching from WooCommerce:', wooError);
      console.log('🔙 Using Supabase data as fallback - mapping to WooCommerce format');

      // Mapper les données Supabase au format WooCommerce
      const mappedOrder = {
        id: supabaseOrder.id,
        number: supabaseOrder.id.toString(),
        status: supabaseOrder.status,
        date_created: supabaseOrder.created_at,
        date_modified: supabaseOrder.updated_at || supabaseOrder.created_at,
        total: supabaseOrder.total.toString(),
        currency: 'EUR',
        payment_method: 'stripe',
        payment_method_title: 'Carte bancaire',
        billing_address: supabaseOrder.billing_address,
        shipping: supabaseOrder.shipping_address,
        // Mapper items vers line_items
        line_items: supabaseOrder.items?.map((item: any, index: number) => ({
          id: index + 1,
          name: item.product_name,
          product_id: item.product_id,
          quantity: item.quantity,
          subtotal: item.subtotal?.toString() || item.price,
          total: (parseFloat(item.price) * item.quantity).toString(),
          price: parseFloat(item.price),
          sku: '',
          image: item.image_url,
        })) || [],
        shipping_lines: [
          {
            id: 1,
            method_title: 'Livraison gratuite',
            method_id: 'flat_rate',
            total: '0.00',
          }
        ],
      };

      console.log('🔄 Mapped Supabase order to WooCommerce format:', mappedOrder);
      return NextResponse.json({ order: mappedOrder });
    }
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue lors de la récupération de la commande' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour le statut d'une commande
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    
    // Vérifier si l'utilisateur est authentifié avec NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    // Standardiser l'ID utilisateur
    const userId = standardizeUserId(session.user.id);

    // Récupérer l'ID de la commande
    const orderId = parseInt(resolvedParams.id);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'ID de commande invalide' },
        { status: 400 }
      );
    }

    // Récupérer les données du corps de la requête
    const { status } = await req.json();
    if (!status) {
      return NextResponse.json(
        { error: 'Le statut est requis' },
        { status: 400 }
      );
    }

    // Valider le statut
    const validStatuses = ['processing', 'completed', 'on-hold', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }

    // Mettre à jour le statut de la commande
    const updatedOrder = await updateOrderStatus(orderId, status, userId);

    // Retourner la commande mise à jour
    return NextResponse.json({ order: updatedOrder });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue lors de la mise à jour de la commande' },
      { status: 500 }
    );
  }
}