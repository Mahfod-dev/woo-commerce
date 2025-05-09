import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/userService';

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

    // Vérifier si l'email existe déjà
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Créer l'utilisateur
    try {
      const newUser = createUser({
        email,
        password,
        firstName,
        lastName,
      });

      // Retourner l'utilisateur créé (sans le mot de passe)
      return NextResponse.json(
        { 
          user: newUser,
          message: 'Utilisateur créé avec succès' 
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la création de l\'utilisateur' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erreur lors du traitement de la requête:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}