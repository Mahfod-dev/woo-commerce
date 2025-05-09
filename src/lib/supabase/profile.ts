import { createClientFromRequest } from './server'
import { createClient as createBrowserClient } from './client'
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
 * Get user profile by user ID
 */
export async function getProfile(userId: string, req?: any, res?: any): Promise<Profile | null> {
  // Use appropriate client based on context
  const supabase = req 
    ? createClientFromRequest(req, res)
    : createBrowserClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  
  return data
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, profileData: Partial<Profile>) {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

/**
 * Update shipping address
 */
export async function updateShippingAddress(userId: string, address: AddressInfo) {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      shipping_address: address,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

/**
 * Update billing address
 */
export async function updateBillingAddress(userId: string, address: AddressInfo) {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      billing_address: address,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

/**
 * Get user orders
 */
export async function getUserOrders(userId: string, req?: any, res?: any) {
  // Use appropriate client based on context
  const supabase = req
    ? createClientFromRequest(req, res)
    : createBrowserClient();
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }
  
  return data
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: number, userId: string, req?: any, res?: any) {
  // Use appropriate client based on context
  const supabase = req
    ? createClientFromRequest(req, res)
    : createBrowserClient();
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('user_id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching order:', error)
    return null
  }
  
  return data
}