// src/app/api/update-order-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentIntentId } = await request.json();
    
    if (!orderId || !paymentIntentId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Use your WooCommerce API credentials
    const wooCommerceUrl = process.env.URL_WORDPRESS || 'https://your-wordpress-site.com';
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';
    
    // Update the order status to processing/completed
    const updateResponse = await fetch(
      `${wooCommerceUrl}/wp-json/wc/v3/orders/${orderId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(
            `${consumerKey}:${consumerSecret}`
          ).toString('base64')}`,
        },
        body: JSON.stringify({
          status: 'processing',
          transaction_id: paymentIntentId,
          set_paid: true,
          payment_method: 'stripe',
          payment_method_title: 'Credit Card (Stripe)',
        }),
      }
    );
    
    if (!updateResponse.ok) {
      throw new Error(`Failed to update order: ${updateResponse.statusText}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating order payment status:', err);
    return NextResponse.json(
      { error: 'Failed to update order payment status' },
      { status: 500 }
    );
  }
}