import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus } from '@/lib/orders';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

// GET - Récupérer une commande par ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Récupérer le client Supabase avec await pour cookies()
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Vérifier si l'utilisateur est authentifié avec getUser (plus sécurisé)
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer l'ID de l'utilisateur
    const userId = data.user.id;

    // Récupérer l'ID de la commande
    const orderId = parseInt(params.id);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'ID de commande invalide' },
        { status: 400 }
      );
    }

    // Récupérer la commande
    const order = await getOrderById(orderId, userId);
    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Retourner la commande
    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue lors de la récupération de la commande' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour le statut d'une commande
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Récupérer le client Supabase avec await pour cookies()
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Vérifier si l'utilisateur est authentifié avec getUser (plus sécurisé)
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer l'ID de l'utilisateur
    const userId = data.user.id;

    // Récupérer l'ID de la commande
    const orderId = parseInt(params.id);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'ID de commande invalide' },
        { status: 400 }
      );
    }

    // Récupérer les données du corps de la requête
    const { status } = await req.json();
    if (!status) {
      return NextResponse.json(
        { error: 'Le statut est requis' },
        { status: 400 }
      );
    }

    // Valider le statut
    const validStatuses = ['processing', 'completed', 'on-hold', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }

    // Mettre à jour le statut de la commande
    const updatedOrder = await updateOrderStatus(orderId, status, userId);

    // Retourner la commande mise à jour
    return NextResponse.json({ order: updatedOrder });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue lors de la mise à jour de la commande' },
      { status: 500 }
    );
  }
}