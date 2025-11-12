import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';

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

    // Créer un client Supabase directement avec les clés d'environnement
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Utiliser la clé service_role au lieu de anon
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        }
      }
    );
    
    // Authentifier l'utilisateur
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Erreur d\'authentification:', authError);
      return NextResponse.json(
        { error: authError.message || 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }
    
    if (!authData || !authData.user) {
      return NextResponse.json(
        { error: 'Échec de l\'authentification' },
        { status: 401 }
      );
    }
    
    // Récupérer le profil utilisateur
    let profile = null;
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError && !profileError.message.includes('No rows found')) {
      console.error('Erreur lors de la récupération du profil:', profileError);
    } else {
      profile = profileData;
    }

    // Configurer les cookies de session pour persister la session
    const cookieStore = await cookies();

    // Stocker la session dans un cookie spécial pour Next.js + Supabase
    if (authData.session) {
      cookieStore.set('sb-refresh-token', authData.session.refresh_token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 semaine
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      
      cookieStore.set('sb-access-token', authData.session.access_token, {
        path: '/',
        maxAge: 60 * 60 * 24, // 1 jour
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }

    // Retourner les informations de l'utilisateur au client
    return NextResponse.json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        firstName: profile?.first_name || authData.user.user_metadata?.first_name,
        lastName: profile?.last_name || authData.user.user_metadata?.last_name,
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