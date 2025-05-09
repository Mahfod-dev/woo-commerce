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

// Endpoint pour récupérer les commandes utilisateur
export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    );
  }

  // Valider le token et retourner les commandes
  // Pour la démo, nous retournons des commandes fictives
  const demoOrders = [
    {
      id: 101,
      status: 'completed',
      date_created: '2023-12-15T14:30:45',
      total: '159.99',
      line_items: [
        {
          id: 1001,
          name: 'Écouteurs Premium XS-700',
          quantity: 1,
          price: '129.99',
          product_id: 101,
        },
        {
          id: 1002,
          name: 'Étui de protection',
          quantity: 1,
          price: '29.99',
          product_id: 102,
        },
      ],
    },
    {
      id: 102,
      status: 'processing',
      date_created: '2024-01-20T09:15:30',
      total: '249.99',
      line_items: [
        {
          id: 1003,
          name: 'Lampe de Bureau Design',
          quantity: 1,
          price: '179.99',
          product_id: 103,
        },
        {
          id: 1004,
          name: 'Ensemble Premium Accessoires Tech',
          quantity: 1,
          price: '69.99',
          product_id: 104,
        },
      ],
    },
  ];

  return NextResponse.json({ orders: demoOrders });
}