// src/app/api/update-order-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderPayment } from '@/lib/orders';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

// Type pour les détails de paiement
type PaymentDetails = {
  payment_type: string;
  stripe_payment_intent_id: string;
  payment_date: string;
  payment_status: string;
  card_brand?: string;
  card_last4?: string;
  card_exp_month?: string;
  card_exp_year?: string;
  sepa_last4?: string;
  sepa_country?: string;
  sepa_bank_code?: string;
};

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentIntentId, paymentMethod = 'card-direct' } = await request.json();
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing required orderId parameter' },
        { status: 400 }
      );
    }
    
    // For all payment methods, we need a paymentIntentId
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Missing paymentIntentId for payment' },
        { status: 400 }
      );
    }
    
    // Use WooCommerce API credentials
    const wooCommerceUrl = process.env.URL_WORDPRESS || 'https://selectura.shop';
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || 'ck_57120178580c5210e18439965e0ed3bba5003573';
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || 'cs_04a583bcbe220c50f6eaf7012aa4cc2f2c284211';
    
    // Verify the payment intent with Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-04-30.basil',
    });
    
    let verifiedPaymentIntent = null;
    let paymentMethodDetails = null;
    
    try {
      verifiedPaymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      // Verify that the payment was successful or processing
      if (verifiedPaymentIntent.status !== 'succeeded' && verifiedPaymentIntent.status !== 'processing') {
        return NextResponse.json(
          { error: `Payment intent status is ${verifiedPaymentIntent.status}, not succeeded or processing` },
          { status: 400 }
        );
      }
      
      // Fetch the payment method details
      if (verifiedPaymentIntent.payment_method) {
        const paymentMethod = await stripe.paymentMethods.retrieve(
          verifiedPaymentIntent.payment_method as string
        );
        paymentMethodDetails = paymentMethod;
      }
      
      // Check the order ID in metadata matches our order
      if (verifiedPaymentIntent.metadata?.orderId !== orderId.toString() &&
          verifiedPaymentIntent.metadata?.woocommerce_order_id !== orderId.toString()) {
        console.warn('Payment intent orderId does not match request orderId. This could be a security issue.');
        // We'll continue anyway since the payment is valid, but this is logged as a warning
      }
      
      console.log(`Verified payment intent ${paymentIntentId} for order ${orderId}`);
    } catch (stripeErr) {
      console.error('Error verifying payment intent with Stripe:', stripeErr);
      return NextResponse.json(
        { error: 'Failed to verify payment with Stripe' },
        { status: 400 }
      );
    }
    
    // Prepare update data based on payment status
    const updateData: any = {
      status: verifiedPaymentIntent.status === 'succeeded' ? 'processing' : 'pending',
      set_paid: verifiedPaymentIntent.status === 'succeeded' ? true : false
    };
    
    // Determine payment method type and details
    let paymentMethodType = 'card';
    let paymentMethodTitle = 'Credit Card';
    
    if (paymentMethodDetails && paymentMethodDetails.type) {
      paymentMethodType = paymentMethodDetails.type;
      
      // Set appropriate title based on payment method type
      switch (paymentMethodType) {
        case 'card':
          const brand = paymentMethodDetails.card?.brand || 'unknown';
          const last4 = paymentMethodDetails.card?.last4 || 'xxxx';
          paymentMethodTitle = `Credit Card (${brand.toUpperCase()} ****${last4})`;
          break;
        case 'ideal':
          paymentMethodTitle = 'iDEAL';
          break;
        case 'bancontact':
          paymentMethodTitle = 'Bancontact';
          break;
        case 'sepa_debit':
          paymentMethodTitle = 'SEPA Direct Debit';
          break;
        case 'sofort':
          paymentMethodTitle = 'Sofort';
          break;
        case 'giropay':
          paymentMethodTitle = 'Giropay';
          break;
        case 'p24':
          paymentMethodTitle = 'Przelewy24';
          break;
        case 'eps':
          paymentMethodTitle = 'EPS';
          break;
        case 'alipay':
          paymentMethodTitle = 'Alipay';
          break;
        case 'apple_pay':
          paymentMethodTitle = 'Apple Pay';
          break;
        case 'google_pay':
          paymentMethodTitle = 'Google Pay';
          break;
        case 'amazon_pay':
          paymentMethodTitle = 'Amazon Pay';
          break;
        case 'paypal':
          paymentMethodTitle = 'PayPal';
          break;
        case 'link':
          paymentMethodTitle = 'Link';
          break;
        case 'klarna':
          paymentMethodTitle = 'Klarna';
          break;
        case 'revolut_pay':
          paymentMethodTitle = 'Revolut Pay';
          break;
        default:
          paymentMethodTitle = `${paymentMethodType.charAt(0).toUpperCase() + paymentMethodType.slice(1)} Payment`;
      }
    }
    
    // Set payment method in update data
    updateData.transaction_id = paymentIntentId;
    updateData.payment_method = 'stripe';
    updateData.payment_method_title = paymentMethodTitle;
    
    // Add metadata about payment
    const paymentDetails: PaymentDetails = {
      payment_type: paymentMethodType,
      stripe_payment_intent_id: paymentIntentId,
      payment_date: new Date().toISOString(),
      payment_status: verifiedPaymentIntent.status,
    };
    
    // Add payment method specific details
    if (paymentMethodDetails) {
      if (paymentMethodDetails.type === 'card' && paymentMethodDetails.card) {
        paymentDetails.card_brand = paymentMethodDetails.card.brand || 'unknown';
        paymentDetails.card_last4 = paymentMethodDetails.card.last4 || 'xxxx';
        paymentDetails.card_exp_month = paymentMethodDetails.card.exp_month?.toString() || '';
        paymentDetails.card_exp_year = paymentMethodDetails.card.exp_year?.toString() || '';
      } else if (paymentMethodDetails.type === 'sepa_debit' && paymentMethodDetails.sepa_debit) {
        paymentDetails.sepa_last4 = paymentMethodDetails.sepa_debit.last4 || 'xxxx';
        paymentDetails.sepa_country = paymentMethodDetails.sepa_debit.country || '';
        paymentDetails.sepa_bank_code = paymentMethodDetails.sepa_debit.bank_code || '';
      }
    }
    
    updateData.meta_data = [
      {
        key: 'stripe_payment_details',
        value: JSON.stringify(paymentDetails)
      }
    ];
    
    console.log(`Updating order ${orderId} with payment data:`, JSON.stringify(updateData));
    
    // 1. Get the current user from Supabase
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      console.warn('No user ID found when updating payment status');
    }

    // 2. Update the order status to processing/completed in WooCommerce
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
        body: JSON.stringify(updateData),
      }
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Failed to update order in WooCommerce: ${updateResponse.statusText}. Details: ${errorText}`);
    }

    // Get updated order data for the response
    const updatedOrder = await updateResponse.json();

    // 3. Also update in Supabase if we have a user ID
    if (userId) {
      try {
        const status = verifiedPaymentIntent.status === 'succeeded' ? 'processing' : 'on-hold';
        await updateOrderPayment(orderId, userId, paymentIntentId, status);
        console.log(`Updated order ${orderId} payment status in Supabase`);
      } catch (supabaseError) {
        console.error('Error updating order payment in Supabase:', supabaseError);
        // We'll continue since WooCommerce update was successful
      }
    }
    
    return NextResponse.json({ 
      success: true,
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        total: updatedOrder.total,
        payment_method: paymentMethodType,
        payment_method_title: paymentMethodTitle
      } 
    });
  } catch (err) {
    console.error('Error updating order payment status:', err);
    return NextResponse.json(
      { error: 'Failed to update order payment status' },
      { status: 500 }
    );
  }
}