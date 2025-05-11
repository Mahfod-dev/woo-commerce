import { NextRequest, NextResponse } from 'next/server';
import { getUserOrders } from '@/lib/orders';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { standardizeUserId } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    // Récupérer le client Supabase avec await pour cookies()
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Vérifier si l'utilisateur est authentifié
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer et standardiser l'ID de l'utilisateur
    const rawUserId = data.user.id;
    const userId = standardizeUserId(rawUserId);
    console.log('API user-orders - ID brut:', rawUserId, 'ID standardisé:', userId);

    // Récupérer les commandes de l'utilisateur avec l'ID standardisé
    const orders = await getUserOrders(userId);
    console.log(`API user-orders - ${orders.length} commandes récupérées pour l'utilisateur ${userId}`);

    // Retourner les commandes
    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}