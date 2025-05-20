import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Récupérer les données de la requête
    const data = await request.json();
    const { email, password } = data;

    // Vérifier que tous les champs requis sont présents
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Créer un client Supabase Admin (côté serveur)
    const supabaseAdmin = createAdminClient();
    
    // Créer un client Supabase pour gérer les cookies
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Connexion avec Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Erreur lors de la connexion:', authError);
      return NextResponse.json(
        { error: authError.message || 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Si la connexion est réussie, récupérer le profil utilisateur
    let profile = null;
    if (authData.user) {
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError && !profileError.message.includes('No rows found')) {
        console.error('Erreur lors de la récupération du profil:', profileError);
      } else {
        profile = profileData;
      }
    }

    // Retourner l'utilisateur connecté
    return NextResponse.json({
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
        firstName: profile?.first_name || authData.user?.user_metadata?.first_name,
        lastName: profile?.last_name || authData.user?.user_metadata?.last_name,
      },
      session: authData.session,
    });
    
  } catch (error: any) {
    console.error('Erreur lors du traitement de la requête:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}