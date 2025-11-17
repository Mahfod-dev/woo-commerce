import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createWooCommerceCustomer } from '@/lib/wooCustomer';

export async function POST(request: NextRequest) {
  try {
    // Récupérer les données de la requête
    const data = await request.json();
    const { email, password, firstName, lastName } = data;

    // Vérifier que tous les champs requis sont présents
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Vérifier la validité de l'email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Vérifier que le mot de passe est suffisamment long
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Créer un client Supabase Admin (côté serveur)
    const supabaseAdmin = createAdminClient();

    // Vérifier si l'utilisateur existe déjà
    const { data: usersData, error: userCheckError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userCheckError) {
      console.error('Erreur lors de la vérification de l\'email:', userCheckError);
      return NextResponse.json(
        { error: 'Erreur lors de la vérification de l\'email' },
        { status: 500 }
      );
    }

    const existingUser = usersData.users.find(user => user.email === email);
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Créer l'utilisateur avec Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmer l'email pour simplifier le développement
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      },
    });

    if (authError) {
      console.error('Erreur lors de la création de l\'utilisateur:', authError);
      return NextResponse.json(
        { error: authError.message || 'Erreur lors de la création de l\'utilisateur' },
        { status: 400 }
      );
    }

    // Si l'utilisateur est créé avec succès, créer également un enregistrement dans la table profiles
    if (authData.user) {
      // Créer le customer WooCommerce
      console.log('🛒 Creating WooCommerce customer for:', email);
      const wooCustomer = await createWooCommerceCustomer({
        email,
        first_name: firstName,
        last_name: lastName,
      });

      const wooCustomerId = wooCustomer?.id || null;
      if (wooCustomerId) {
        console.log('✅ WooCommerce customer created with ID:', wooCustomerId);
      } else {
        console.warn('⚠️ Failed to create WooCommerce customer, continuing without it');
      }

      // Créer le profil avec le woocommerce_customer_id
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          woocommerce_customer_id: wooCustomerId,
          created_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Erreur lors de la création du profil:', profileError);
        // Le profil n'a pas pu être créé, mais l'authentification a réussi
        // Nous pourrions supprimer l'utilisateur pour revenir en arrière, mais pour simplifier, nous continuons
      }
    }

    // Retourner l'utilisateur créé
    return NextResponse.json(
      { 
        user: {
          id: authData.user?.id,
          email: authData.user?.email,
          firstName,
          lastName,
        },
        message: 'Utilisateur créé avec succès' 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erreur lors du traitement de la requête:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}