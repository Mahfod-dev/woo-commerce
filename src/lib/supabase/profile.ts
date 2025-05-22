// This file now only contains types and uses NextAuth APIs instead of direct Supabase calls
import { Database } from './types'

type Profile = Database['public']['Tables']['profiles']['Row']

export type AddressInfo = {
  first_name: string
  last_name: string
  company?: string
  address_1: string
  address_2?: string
  city: string
  state: string
  postcode: string
  country: string
  email?: string
  phone?: string
}

/**
 * Get user profile by user ID - Uses NextAuth API
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const response = await fetch('/api/get-profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error fetching profile:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data.profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

/**
 * Update user profile - Uses NextAuth API
 */
export async function updateProfile(userId: string, profileData: Partial<Profile>) {
  try {
    const response = await fetch('/api/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update profile');
    }

    const data = await response.json();
    return data.profile;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

/**
 * Update shipping address - Uses NextAuth API
 */
export async function updateShippingAddress(userId: string, address: AddressInfo) {
  try {
    const response = await fetch('/api/update-shipping-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shipping_address: address }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update shipping address');
    }

    const data = await response.json();
    return data.profile;
  } catch (error) {
    console.error('Error updating shipping address:', error);
    throw error;
  }
}

/**
 * Update billing address - Uses NextAuth API  
 */
export async function updateBillingAddress(userId: string, address: AddressInfo) {
  try {
    const response = await fetch('/api/update-billing-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ billing_address: address }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update billing address');
    }

    const data = await response.json();
    return data.profile;
  } catch (error) {
    console.error('Error updating billing address:', error);
    throw error;
  }
}