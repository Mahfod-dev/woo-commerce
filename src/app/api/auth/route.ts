import { NextRequest, NextResponse } from 'next/server';

// Démo utilisateurs pour simuler une base de données
const DEMO_USERS = [
  {
    id: 1,
    email: 'demo@example.com',
    password: 'password',
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 2,
    email: 'test@example.com',
    password: 'password',
    firstName: 'Jane',
    lastName: 'Smith',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, firstName, lastName } = body;

    if (action === 'login') {
      // Logique de connexion
      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email et mot de passe requis' },
          { status: 400 }
        );
      }

      // Recherche de l'utilisateur
      const user = DEMO_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        return NextResponse.json(
          { error: 'Email ou mot de passe incorrect' },
          { status: 401 }
        );
      }

      // Créer l'objet utilisateur sans le mot de passe
      const { password: pwd, ...userWithoutPassword } = user;

      return NextResponse.json({
        user: {
          ...userWithoutPassword,
          token: `demo-token-${user.id}`,
        },
      });
    } else if (action === 'register') {
      // Logique d'inscription
      if (!email || !password || !firstName || !lastName) {
        return NextResponse.json(
          { error: 'Tous les champs sont requis' },
          { status: 400 }
        );
      }

      // Vérifier si l'email existe déjà
      if (DEMO_USERS.some((u) => u.email === email)) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 409 }
        );
      }

      // Créer un nouvel utilisateur (simulation)
      const newUser = {
        id: Math.floor(Math.random() * 1000) + 10, // ID aléatoire
        email,
        firstName,
        lastName,
        token: `new-user-token-${Date.now()}`,
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${
          Math.floor(Math.random() * 99) + 1
        }.jpg`,
      };

      return NextResponse.json({
        user: newUser,
      });
    } else if (action === 'validate') {
      // Validation du token (pour des sessions persistantes)
      const { token } = body;
      if (!token) {
        return NextResponse.json(
          { error: 'Token invalide' },
          { status: 401 }
        );
      }

      // Ici, nous simulons une validation de token
      // Dans un cas réel, vous voudriez vérifier le token JWT, etc.
      if (token.startsWith('demo-token-')) {
        const userId = parseInt(token.split('-').pop() || '0');
        const user = DEMO_USERS.find((u) => u.id === userId);

        if (user) {
          const { password, ...userInfo } = user;
          return NextResponse.json({
            user: { ...userInfo, token },
          });
        }
      }

      return NextResponse.json(
        { error: 'Session invalide' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Action non reconnue' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Erreur API auth:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Endpoint pour récupérer les informations de l'utilisateur via Supabase
export async function GET(request: NextRequest) {
  try {
    // Import dynamique pour éviter les erreurs de serveur
    const { createClient } = await import('@/lib/supabase/server');
    const { cookies } = await import('next/headers');

    // Récupérer le client Supabase avec await pour cookies()
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Obtenir les informations de l'utilisateur authentifié
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    return NextResponse.json({ user: data.user });
  } catch (error: any) {
    console.error('Error getting user:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue lors de la récupération des informations utilisateur' },
      { status: 500 }
    );
  }
}