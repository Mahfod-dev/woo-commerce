/**
 * Fonctions pour gérer les customers WooCommerce
 */

interface WooCustomerData {
  email: string;
  first_name: string;
  last_name: string;
  username?: string;
}

interface WooCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  billing: any;
  shipping: any;
}

/**
 * Créer un customer dans WooCommerce
 */
export async function createWooCommerceCustomer(
  customerData: WooCustomerData
): Promise<WooCustomer | null> {
  try {
    const wooUrl = process.env.URL_WORDPRESS || 'https://selectura.shop';
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      console.error('❌ WooCommerce credentials missing');
      return null;
    }

    // Générer un username à partir de l'email si non fourni
    const username = customerData.username || customerData.email.split('@')[0];

    const response = await fetch(`${wooUrl}/wp-json/wc/v3/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')}`,
      },
      body: JSON.stringify({
        email: customerData.email,
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        username: username,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to create WooCommerce customer:', response.status, errorText);

      // Si le customer existe déjà, essayer de le récupérer
      if (response.status === 400 && errorText.includes('email')) {
        console.log('🔍 Customer might exist, searching by email...');
        return await getWooCommerceCustomerByEmail(customerData.email);
      }

      return null;
    }

    const customer = await response.json();
    console.log('✅ WooCommerce customer created:', customer.id);
    return customer;
  } catch (error) {
    console.error('❌ Error creating WooCommerce customer:', error);
    return null;
  }
}

/**
 * Récupérer un customer WooCommerce par email
 */
export async function getWooCommerceCustomerByEmail(
  email: string
): Promise<WooCustomer | null> {
  try {
    const wooUrl = process.env.URL_WORDPRESS || 'https://selectura.shop';
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    const response = await fetch(
      `${wooUrl}/wp-json/wc/v3/customers?email=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')}`,
        },
      }
    );

    if (!response.ok) {
      console.error('❌ Failed to fetch WooCommerce customer by email');
      return null;
    }

    const customers = await response.json();
    if (customers.length === 0) {
      console.log('⚠️ No WooCommerce customer found with email:', email);
      return null;
    }

    console.log('✅ Found WooCommerce customer:', customers[0].id);
    return customers[0];
  } catch (error) {
    console.error('❌ Error fetching WooCommerce customer:', error);
    return null;
  }
}

/**
 * Récupérer un customer WooCommerce par ID
 */
export async function getWooCommerceCustomerById(
  customerId: number
): Promise<WooCustomer | null> {
  try {
    const wooUrl = process.env.URL_WORDPRESS || 'https://selectura.shop';
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    const response = await fetch(`${wooUrl}/wp-json/wc/v3/customers/${customerId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      console.error('❌ Failed to fetch WooCommerce customer by ID');
      return null;
    }

    const customer = await response.json();
    console.log('✅ Found WooCommerce customer:', customer.id);
    return customer;
  } catch (error) {
    console.error('❌ Error fetching WooCommerce customer:', error);
    return null;
  }
}
