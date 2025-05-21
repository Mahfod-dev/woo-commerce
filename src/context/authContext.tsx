'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';

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
  id: string;
  email: string;
  firstName: string;
  lastName: string;
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
  logout: () => Promise<void>;
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
  logout: async () => {},
  clearError: () => {},
  updateUser: () => {},
  getOrders: async () => [],
};

// Création du contexte
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

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
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Convertir la session NextAuth en user local
  useEffect(() => {
    if (session?.user) {
      const userData: User = {
        id: session.user.id,
        email: session.user.email || '',
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || '',
        avatar: session.user.avatar || session.user.image || undefined,
      };
      setUser(userData);
    } else {
      setUser(null);
    }
  }, [session]);

  // Ces fonctions sont maintenant des placeholders car NextAuth gère l'authentification
  const login = async (email: string, password: string) => {
    // LoginPage utilise directement signIn de NextAuth
    // Cette fonction est garde pour la compatibilité
    throw new Error('Utilisez signIn de NextAuth dans LoginPage');
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Échec de l\'inscription');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'inscription');
      throw err;
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/' });
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  // Fonction pour effacer les erreurs
  const clearError = () => {
    setError(null);
  };

  // Fonction pour mettre à jour les informations utilisateur
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
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
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
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