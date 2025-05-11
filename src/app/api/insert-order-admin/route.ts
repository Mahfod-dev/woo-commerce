import { NextRequest, NextResponse } from 'next/server';
import { createOrderAdmin } from '@/lib/ordersAdmin';

/**
 * API pour créer une commande directement dans Supabase avec le client admin
 * Contourne complètement les politiques RLS
 */
export async function POST(request: NextRequest) {
  try {
    // Récupérer les données de la requête
    const orderData = await request.json();

    if (!orderData || !orderData.user_id) {
      return NextResponse.json(
        { error: 'Données de commande ou ID utilisateur manquants' },
        { status: 400 }
      );
    }

    console.log('API: Tentative d\'insertion admin dans Supabase avec ID utilisateur:', orderData.user_id);

    try {
      // Utiliser la fonction admin pour créer la commande
      const data = await createOrderAdmin(orderData);

      console.log('API: Commande insérée avec succès dans Supabase:', data.id);

      return NextResponse.json({
        success: true,
        order: data
      });
    } catch (insertError: any) {
      console.error('API: Erreur d\'insertion admin dans Supabase:', insertError);
      return NextResponse.json(
        { error: `Erreur d'insertion: ${insertError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Erreur inattendue lors de l\'insertion admin:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur inattendue lors de l\'insertion' },
      { status: 500 }
    );
  }
}