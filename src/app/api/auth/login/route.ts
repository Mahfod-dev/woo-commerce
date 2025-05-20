import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { createBrowserClient } from '@supabase/ssr';
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

    const cookieStore = cookies();
    
    // Créer un client Supabase Admin (côté serveur) pour les opérations admin
    const supabaseAdmin = createAdminClient();
    
    // Créer un client standard pour l'authentification
    // Nous utilisons createBrowserClient car il permet de s'authentifier côté serveur
    // mais sans essayer de gérer les cookies (nous le ferons manuellement)
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Utiliser ce client pour l'authentification avec password
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

    // Si la connexion est réussie, récupérer le profil utilisateur avec le client admin
    // pour avoir accès à toutes les données sans restrictions RLS
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

    // Configurer les cookies de session pour Supabase
    // selon la documentation officielle 
    if (authData.session) {
      // Créer un cookie pour stocker la session
      cookieStore.set('sb-access-token', authData.session.access_token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 semaine
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      
      cookieStore.set('sb-refresh-token', authData.session.refresh_token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 jours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
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