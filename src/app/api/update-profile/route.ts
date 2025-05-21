import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';
import { standardizeUserId } from '@/lib/utils';

// Type pour les données du profil
type ProfileUpdateData = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  shipping_address?: any;
  billing_address?: any;
};

export async function POST(req: NextRequest) {
  try {
    // Vérifier si l'utilisateur est authentifié avec NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer les données du corps de la requête
    const profileData: ProfileUpdateData = await req.json();

    // Standardiser l'ID utilisateur
    const userId = standardizeUserId(session.user.id);

    // Créer un client Supabase avec la clé service_role pour contourner les RLS
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        }
      }
    );

    // Mettre à jour le profil dans Supabase
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la mise à jour du profil' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      profile: data,
      message: 'Profil mis à jour avec succès' 
    });
  } catch (error: any) {
    console.error('Erreur lors du traitement de la requête:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}