import { createClient } from '@supabase/supabase-js';
import { Database } from './types';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Client Supabase standard pour les opérations côté client
 * Utilise la clé anonyme qui respecte les politiques RLS
 */
export const supabase = createClient<Database>(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
