import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';
import dotenv from 'dotenv';
dotenv.config();

// Ensure environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Check your .env file.');
}

/**
 * Client Supabase standard pour les opérations côté client
 * Utilise la clé anonyme qui respecte les politiques RLS
 */
export const supabase = createSupabaseClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

/**
 * Fonction pour créer une instance du client Supabase
 * Pour compatibilité avec différents modèles d'import
 */
export function createClient() {
  return createSupabaseClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  );
}

// Exporter également la fonction comme export par défaut pour plus de flexibilité
export default createClient;
