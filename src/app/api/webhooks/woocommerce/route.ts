// src/app/api/webhooks/woocommerce/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';

// Créer le client Supabase avec la clé service pour bypass RLS
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

/**
 * Webhook endpoint pour recevoir les notifications de WooCommerce
 *
 * Events supportés:
 * - order.created
 * - order.updated
 * - order.deleted
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    console.log('📨 Content-Type:', contentType);

    let payload: any;

    // WooCommerce envoie toujours en JSON dans le body
    const body = await request.text();
    console.log('📄 Raw body:', body.substring(0, 500));

    try {
      // Essayer de parser directement en JSON
      payload = JSON.parse(body);
      console.log('✅ Parsed as JSON directly');
    } catch (e) {
      // Si ça échoue, c'est URL-encoded (application/x-www-form-urlencoded)
      console.log('⚠️ Not JSON, parsing as URL-encoded...');

      // Parser les paramètres URL-encoded
      const params = new URLSearchParams(body);

      // WooCommerce envoie le JSON dans un paramètre (souvent sans nom de clé ou dans 'arg')
      let jsonString = null;

      // Essayer différentes clés possibles
      for (const [key, value] of params.entries()) {
        console.log(`🔑 Param: ${key} = ${value.substring(0, 100)}...`);

        // Si la valeur commence par { ou [, c'est probablement le JSON
        if (value.trim().startsWith('{') || value.trim().startsWith('[')) {
          jsonString = value;
          console.log(`✅ Found JSON in param: ${key}`);
          break;
        }
      }

      if (!jsonString) {
        // Si aucun paramètre ne contient de JSON, le body entier est peut-être le JSON encodé
        jsonString = decodeURIComponent(body);
        console.log('🔄 Trying to parse entire decoded body as JSON');
      }

      payload = JSON.parse(jsonString);
      console.log('✅ Parsed URL-encoded payload');
    }

    console.log('🔔 Webhook received from WooCommerce');
    console.log('📋 Topic:', request.headers.get('x-wc-webhook-topic'));
    console.log('📦 Payload:', payload);
    console.log('🆔 Order ID:', payload.id);

    // Vérifier la signature du webhook (sécurité)
    const signature = request.headers.get('x-wc-webhook-signature');
    const webhookSecret = process.env.WOOCOMMERCE_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('base64');

      if (signature !== expectedSignature) {
        console.error('❌ Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
      console.log('✅ Webhook signature verified');
    }

    // Traiter selon le type d'événement
    const topic = request.headers.get('x-wc-webhook-topic');

    switch (topic) {
      case 'order.created':
        await handleOrderCreated(payload);
        break;

      case 'order.updated':
        await handleOrderUpdated(payload);
        break;

      case 'order.deleted':
        await handleOrderDeleted(payload);
        break;

      default:
        console.log('⚠️ Unhandled webhook topic:', topic);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Gérer la création d'une commande
 */
async function handleOrderCreated(order: any) {
  console.log('📦 Creating order in Supabase:', order.id);

  try {
    // Extraire les données importantes
    const orderData = {
      id: order.id,
      user_id: order.customer_id ? `woo_${order.customer_id}` : null,
      status: order.status,
      total: parseFloat(order.total),
      items: order.line_items.map((item: any) => ({
        product_id: item.product_id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: parseFloat(item.subtotal),
        image_url: item.image?.src || null,
      })),
      shipping_address: {
        first_name: order.shipping.first_name,
        last_name: order.shipping.last_name,
        address_1: order.shipping.address_1,
        address_2: order.shipping.address_2,
        city: order.shipping.city,
        postcode: order.shipping.postcode,
        country: order.shipping.country,
        state: order.shipping.state,
      },
      billing_address: {
        first_name: order.billing.first_name,
        last_name: order.billing.last_name,
        address_1: order.billing.address_1,
        address_2: order.billing.address_2,
        city: order.billing.city,
        postcode: order.billing.postcode,
        country: order.billing.country,
        state: order.billing.state,
        email: order.billing.email,
        phone: order.billing.phone,
      },
      payment_intent: order.transaction_id || null,
    };

    // Insérer ou mettre à jour dans Supabase
    const { error } = await supabase
      .from('orders')
      .upsert(orderData, { onConflict: 'id' });

    if (error) {
      console.error('❌ Error creating order in Supabase:', error);
      throw error;
    }

    console.log('✅ Order created in Supabase');
  } catch (error) {
    console.error('❌ Error in handleOrderCreated:', error);
    throw error;
  }
}

/**
 * Gérer la mise à jour d'une commande
 */
async function handleOrderUpdated(order: any) {
  console.log('🔄 Updating order in Supabase:', order.id);

  try {
    // Vérifier si la commande existe dans Supabase
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order.id)
      .single();

    if (!existingOrder) {
      console.log('⚠️ Order not found in Supabase, creating it');
      await handleOrderCreated(order);
      return;
    }

    // Mettre à jour les champs modifiables
    const updateData: any = {
      status: order.status,
      total: parseFloat(order.total),
      updated_at: new Date().toISOString(),
    };

    // Si transaction_id a changé
    if (order.transaction_id) {
      updateData.payment_intent = order.transaction_id;
    }

    // Mettre à jour dans Supabase
    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', order.id);

    if (error) {
      console.error('❌ Error updating order in Supabase:', error);
      throw error;
    }

    console.log('✅ Order updated in Supabase:', updateData);
  } catch (error) {
    console.error('❌ Error in handleOrderUpdated:', error);
    throw error;
  }
}

/**
 * Gérer la suppression d'une commande
 */
async function handleOrderDeleted(order: any) {
  console.log('🗑️ Deleting order from Supabase:', order.id);

  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', order.id);

    if (error) {
      console.error('❌ Error deleting order from Supabase:', error);
      throw error;
    }

    console.log('✅ Order deleted from Supabase');
  } catch (error) {
    console.error('❌ Error in handleOrderDeleted:', error);
    throw error;
  }
}

// GET endpoint pour tester que le webhook est accessible
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'WooCommerce webhook endpoint is ready',
    timestamp: new Date().toISOString()
  });
}
