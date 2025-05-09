'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types pour l'utilisateur et les commandes
export interface UserOrder {
  id: number;
  status: string;
  date_created: string;
  total: string;
  line_items: {
    id: number;
    name: string;
    quantity: number;
    price: string;
    product_id: number;
  }[];
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  avatar?: string;
  orders?: UserOrder[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
  getOrders: () => Promise<UserOrder[]>;
}

// Valeurs par défaut du contexte
const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
  updateUser: () => {},
  getOrders: async () => [],
};

// Création du contexte
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Données utilisateur de démo pour tester l'authentification
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

// Commandes de démo
const DEMO_ORDERS: UserOrder[] = [
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

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier s'il y a un utilisateur stocké dans localStorage au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Vérifier les identifiants avec nos utilisateurs de démo
      const foundUser = DEMO_USERS.find(
        user => user.email === email && user.password === password
      );

      if (foundUser) {
        // Créer l'objet utilisateur sans le mot de passe
        const { password, ...userWithoutPassword } = foundUser;
        const authenticatedUser: User = {
          ...userWithoutPassword,
          token: `demo-token-${foundUser.id}`,
        };

        // Stocker l'utilisateur dans localStorage
        localStorage.setItem('user', JSON.stringify(authenticatedUser));
        setUser(authenticatedUser);
      } else {
        throw new Error('Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur de connexion:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Vérifier si l'email existe déjà
      if (DEMO_USERS.some(user => user.email === email)) {
        throw new Error('Cet email est déjà utilisé');
      }

      // Créer un nouvel utilisateur (simulation)
      const newUser: User = {
        id: Math.floor(Math.random() * 1000) + 10, // ID aléatoire
        email,
        firstName,
        lastName,
        token: `new-user-token-${Date.now()}`,
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${
          Math.floor(Math.random() * 99) + 1
        }.jpg`,
      };

      // Stocker l'utilisateur dans localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'inscription');
      console.error('Erreur d\'inscription:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Fonction pour effacer les erreurs
  const clearError = () => {
    setError(null);
  };

  // Fonction pour mettre à jour les informations utilisateur
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  // Fonction pour récupérer les commandes de l'utilisateur
  const getOrders = async (): Promise<UserOrder[]> => {
    if (!user) return [];

    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Retourner les commandes de démo
    return DEMO_ORDERS;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
    clearError,
    updateUser,
    getOrders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};