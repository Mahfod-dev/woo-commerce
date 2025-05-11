import { createClient } from '@supabase/supabase-js';
import { Database } from './types';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Crée un client admin Supabase avec la clé de service
 * Ne doit être utilisé que côté serveur (API routes, Server Components, etc.)
 */
export function createAdminClient() {
	// Vérification que nous sommes côté serveur
	if (typeof window !== 'undefined') {
		throw new Error(
			'createAdminClient ne doit être utilisé que côté serveur'
		);
	}

	return createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!
	);
}
