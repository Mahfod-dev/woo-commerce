import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/orders';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { standardizeUserId } from '@/lib/utils';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';

// GET - Récupérer une commande par ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    
    // Vérifier si l'utilisateur est authentifié avec NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    // Standardiser l'ID utilisateur
    const userId = standardizeUserId(session.user.id);

    // Récupérer l'ID de la commande
    const orderId = parseInt(resolvedParams.id);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'ID de commande invalide' },
        { status: 400 }
      );
    }

    // Créer un client Supabase avec la clé service_role pour contourner les RLS
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Récupérer la commande
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', userId) // Sécurité: vérifier que l'utilisateur est bien propriétaire de la commande
      .single();

    if (error) {
      console.error('Error fetching order:', error);
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
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    
    // Vérifier si l'utilisateur est authentifié avec NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    // Standardiser l'ID utilisateur
    const userId = standardizeUserId(session.user.id);

    // Récupérer l'ID de la commande
    const orderId = parseInt(resolvedParams.id);
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