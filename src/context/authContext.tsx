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

    try {
      const response = await fetch('/api/user-orders');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }
      const { orders } = await response.json();
      return orders || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      return [];
    }
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