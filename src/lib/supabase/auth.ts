import { createClientFromRequest } from './server'
import { supabase } from './client'
import { redirect } from 'next/navigation'
import { cookies } from 'next/cookies'

export type AuthCredentials = {
  email: string
  password: string
}

export type UserRegistration = AuthCredentials & {
  firstName: string
  lastName: string
}

/**
 * Signs in a user using email and password
 */
export async function signInWithEmail({ email, password }: AuthCredentials) {
  // Utiliser le client supabase importé
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

/**
 * Signs up a new user with email and password
 */
export async function signUpWithEmail({ email, password, firstName, lastName }: UserRegistration) {
  // Utiliser le client supabase importé
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  })
  
  if (authError) {
    throw new Error(authError.message)
  }
  
  // Create a profile record for the user
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        first_name: firstName,
        last_name: lastName,
        email: email,
        created_at: new Date().toISOString(),
      })
    
    if (profileError) {
      console.error('Error creating profile:', profileError)
      // Consider what to do if profile creation fails but auth succeeds
    }
  }
  
  return authData
}

/**
 * Signs out the current user
 */
export async function signOut() {
  // Utiliser le client supabase importé
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Gets the current user session (server-side)
 * Can be used from getServerSideProps or API routes
 */
export async function getSession(req?: any, res?: any) {
  // If req is provided, use it to create a server client
  if (req) {
    const supabase = createClientFromRequest(req, res)
    const { data } = await supabase.auth.getSession()
    return data.session
  }
  
  // Fallback to browser client for client components
  // Utiliser le client supabase importé
  const { data } = await supabase.auth.getSession()
  return data.session
}

/**
 * Gets the current user (server-side)
 * Can be used from getServerSideProps or API routes
 */
export async function getUser(req?: any, res?: any) {
  // If req is provided, use it to create a server client
  if (req) {
    const supabase = createClientFromRequest(req, res)
    const { data } = await supabase.auth.getUser()
    return data.user
  }
  
  // Fallback to browser client for client components
  // Utiliser le client supabase importé
  const { data } = await supabase.auth.getUser()
  return data.user
}

/**
 * Server action to require authentication
 * Redirects to login if user is not authenticated
 */
export async function requireAuth(req?: any, res?: any) {
  const session = await getSession(req, res)
  
  if (!session) {
    if (typeof window === 'undefined' && !req) {
      // Server-side redirect in App Router
      redirect('/login')
    } else {
      // Client-side redirect or Pages Router
      window.location.href = '/login'
    }
  }
  
  return session
}

/**
 * Password reset request
 */
export async function resetPassword(email: string) {
  // Utiliser le client supabase importé
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  
  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Update user password
 */
export async function updatePassword(password: string) {
  // Utiliser le client supabase importé
  
  const { error } = await supabase.auth.updateUser({
    password,
  })
  
  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Get user profile data
 */
export async function getUserProfile(userId: string, req?: any, res?: any) {
  // If req is provided, use it to create a server client
  if (req) {
    const supabase = createClientFromRequest(req, res)
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
  
  // Fallback to browser client for client components
  // Utiliser le client supabase importé
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