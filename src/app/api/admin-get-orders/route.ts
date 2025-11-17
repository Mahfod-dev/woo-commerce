import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';
import { standardizeUserId } from '@/lib/utils';

/**
 * API pour récupérer les commandes d'un utilisateur
 * Utilise directement le client admin avec la clé de service pour contourner les politiques RLS
 */
export async function GET(request: NextRequest) {
	try {
		// Récupérer l'ID utilisateur depuis les paramètres de la requête
		const { searchParams } = new URL(request.url);
		const rawUserId = searchParams.get('userId');

		if (!rawUserId) {
			return NextResponse.json(
				{ error: 'ID utilisateur requis' },
				{ status: 400 }
			);
		}
		
		// Standardiser l'ID utilisateur pour assurer la cohérence
		const userId = standardizeUserId(rawUserId);

		console.log('API: Récupération des commandes pour userId brut:', rawUserId, 'userId standardisé:', userId);

		// Vérifier que les variables d'environnement sont correctement chargées
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

		console.log('URL Supabase:', supabaseUrl);
		console.log('Clé disponible:', !!supabaseServiceKey);

		if (!supabaseUrl || !supabaseServiceKey) {
			throw new Error('Variables d\'environnement Supabase manquantes');
		}

		// Création directe du client admin
		const supabaseAdmin = createClient(
			supabaseUrl,
			supabaseServiceKey,
			{
				auth: {
					autoRefreshToken: false,
					persistSession: false
				}
			}
		);

		// Récupérer l'email de l'utilisateur pour aussi chercher les commandes invités
		const emailParam = searchParams.get('email');

		let data, error;

		// Chercher les commandes soit par user_id, soit par email de facturation (pour les commandes invités)
		if (emailParam) {
			console.log('API: Recherche aussi par email:', emailParam);
			const result = await supabaseAdmin
				.from('orders')
				.select('*')
				.or(`user_id.eq.${userId},billing_address->>email.eq.${emailParam}`)
				.order('created_at', { ascending: false });
			data = result.data;
			error = result.error;
		} else {
			const result = await supabaseAdmin
				.from('orders')
				.select('*')
				.eq('user_id', userId)
				.order('created_at', { ascending: false });
			data = result.data;
			error = result.error;
		}

		if (error) {
			console.error(
				'Erreur lors de la récupération des commandes:',
				error
			);
			return NextResponse.json(
				{ error: `Erreur de récupération: ${error.message}` },
				{ status: 500 }
			);
		}

		const orders = data || [];
		console.log(
			`API: ${orders.length} commandes récupérées pour l'utilisateur ${userId}`
		);

		return NextResponse.json({
			success: true,
			orders: orders,
		});
	} catch (error: any) {
		console.error(
			'Erreur inattendue lors de la récupération des commandes:',
			error
		);
		return NextResponse.json(
			{
				error:
					error.message ||
					'Erreur inattendue lors de la récupération',
			},
			{ status: 500 }
		);
	}
}