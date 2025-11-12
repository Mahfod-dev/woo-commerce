import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';
import { standardizeUserId } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
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

    // Récupérer le profil complet de Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      
      // Si pas de profil trouvé, créer un profil de base à partir des données de session
      if (error.code === 'PGRST116') {
        const newProfile = {
          id: userId,
          first_name: session.user.firstName || '',
          last_name: session.user.lastName || '',
          email: session.user.email || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();
          
        if (createError) {
          console.error('Erreur lors de la création du profil:', createError);
          return NextResponse.json(
            { error: 'Impossible de créer un profil utilisateur' },
            { status: 500 }
          );
        }
        
        return NextResponse.json({ profile: createdProfile });
      }
      
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la récupération du profil' },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile: data });
  } catch (error: any) {
    console.error('Erreur lors du traitement de la requête:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}