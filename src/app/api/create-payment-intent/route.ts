// src/app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil', // Use the latest version
});

// Fonction pour convertir le nom du pays en code ISO 3166-1 alpha-2
function getCountryCode(country: string): string {
  const countryMap: { [key: string]: string } = {
    'France': 'FR',
    'United States': 'US',
    'United Kingdom': 'GB',
    'Germany': 'DE',
    'Spain': 'ES',
    'Italy': 'IT',
    'Belgium': 'BE',
    'Netherlands': 'NL',
    'Switzerland': 'CH',
    'Canada': 'CA',
  };

  // Si c'est déjà un code à 2 lettres, le retourner tel quel
  if (country.length === 2) {
    return country.toUpperCase();
  }

  // Sinon, chercher dans le mapping
  return countryMap[country] || country.toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing required orderId parameter' },
        { status: 400 }
      );
    }

    // Fetch order information from WooCommerce to verify the amount
    // This step is optional but recommended for security
    const wooCommerceUrl = process.env.URL_WORDPRESS || 'https://selectura.shop';
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || 'ck_57120178580c5210e18439965e0ed3bba5003573';
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || 'cs_04a583bcbe220c50f6eaf7012aa4cc2f2c284211';
    
    let orderTotal = amount;
    let customerEmail = '';
    let customerName = '';
    let shippingAddress = {};

    try {
      const orderResponse = await fetch(
        `${wooCommerceUrl}/wp-json/wc/v3/orders/${orderId}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${consumerKey}:${consumerSecret}`
            ).toString('base64')}`,
          },
        }
      );

      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        // Use the order total from WooCommerce to ensure the amount is correct
        orderTotal = parseFloat(orderData.total) * 100;
        
        // Get customer information for payment methods that require it
        if (orderData.billing) {
          customerEmail = orderData.billing.email || '';
          customerName = `${orderData.billing.first_name || ''} ${orderData.billing.last_name || ''}`.trim();
          
          // Prepare shipping address for payment methods that need it
          if (orderData.shipping) {
            shippingAddress = {
              line1: orderData.shipping.address_1 || '',
              line2: orderData.shipping.address_2 || '',
              city: orderData.shipping.city || '',
              state: orderData.shipping.state || '',
              postal_code: orderData.shipping.postcode || '',
              country: getCountryCode(orderData.shipping.country || ''),
            };
          }
        }
      } else {
        console.warn(`Couldn't verify order ${orderId} amount, using client-provided amount`);
      }
    } catch (error) {
      console.warn('Error fetching order details from WooCommerce:', error);
      // Continue with client-provided amount if WooCommerce fetch fails
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: Math.round(orderTotal), // amount in cents, rounded to avoid floating point issues
      currency: 'eur',
      metadata: {
        orderId: orderId.toString(),
        woocommerce_order_id: orderId.toString()
      },
      description: `Payment for order #${orderId}`,
      // Spécifier explicitement les méthodes de paiement disponibles
      // Maximum de méthodes pour montrer le professionnalisme
      payment_method_types: [
        'card',           // Cartes bancaires classiques
        'paypal',         // PayPal
        'link',           // Link (paiement rapide Stripe)
        'klarna',         // Klarna (paiement fractionné)
        'amazon_pay',     // Amazon Pay
        'ideal',          // iDEAL (Pays-Bas)
        'bancontact',     // Bancontact (Belgique)
        'sepa_debit',     // SEPA Direct Debit (Europe)
        'giropay',        // Giropay (Allemagne)
        'sofort',         // Sofort (Allemagne)
        'eps',            // EPS (Autriche)
        'p24'             // Przelewy24 (Pologne)
      ]
    };

    // Add customer details if available
    if (customerEmail || customerName) {
      paymentIntentParams.receipt_email = customerEmail;
      paymentIntentParams.shipping = {
        name: customerName,
        address: shippingAddress as Stripe.AddressParam
      };
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    console.log(`Created payment intent for order #${orderId}: ${paymentIntent.id}`);
    console.log('Payment Intent Details:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      automatic_payment_methods: paymentIntent.automatic_payment_methods,
      payment_method_types: paymentIntent.payment_method_types
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    );
  }
}