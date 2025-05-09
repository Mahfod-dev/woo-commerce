import { WooCommerceRestApi } from '@woocommerce/woocommerce-rest-api';

// Types pour l'authentification
export interface LoginCredentials {
  username: string; // WooCommerce utilise username pour l'authentification
  password: string;
}

export interface RegistrationData {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
}

export interface WooCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar_url?: string;
  billing?: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping?: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
}

// Configuration du client WooCommerce
let wooCommerceClient: WooCommerceRestApi;

// Initialisation du client WooCommerce
function getWooCommerceClient() {
  if (wooCommerceClient) {
    return wooCommerceClient;
  }

  wooCommerceClient = new WooCommerceRestApi({
    url: process.env.URL_WORDPRESS || 'https://selectura.shop',
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || '',
    version: 'wc/v3',
  });

  return wooCommerceClient;
}

// Authentification avec WooCommerce
export async function authenticateUser(credentials: LoginCredentials): Promise<WooCustomer | null> {
  try {
    // Note: L'API WooCommerce standard n'offre pas d'endpoint d'authentification directe
    // Cette implémentation utilise une approche commune via un proxy WP REST API custom
    // Dans un environnement réel, vous devriez avoir un plugin comme JWT Auth for WP REST API
    
    const response = await fetch(`${process.env.URL_WORDPRESS}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Authentication error:', error);
      return null;
    }

    const auth = await response.json();
    
    // Récupérer les détails du client à partir de l'ID utilisateur
    if (auth.user_id) {
      const api = getWooCommerceClient();
      const { data } = await api.get(`customers/${auth.user_id}`);
      
      return {
        ...data,
        username: credentials.username,
        // Le token JWT peut être stocké pour des requêtes futures
        token: auth.token,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    
    // Pour la démonstration: Si l'API JWT n'est pas disponible, utiliser la validation locale
    if (credentials.username === 'demo@example.com' && credentials.password === 'password') {
      return {
        id: 1,
        email: 'demo@example.com',
        first_name: 'John',
        last_name: 'Doe',
        username: 'demo@example.com',
        avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg',
      };
    }
    
    if (credentials.username === 'test@example.com' && credentials.password === 'password') {
      return {
        id: 2,
        email: 'test@example.com',
        first_name: 'Jane',
        last_name: 'Smith',
        username: 'test@example.com',
        avatar_url: 'https://randomuser.me/api/portraits/women/1.jpg',
      };
    }
    
    return null;
  }
}

// Enregistrement d'un nouvel utilisateur
export async function registerUser(userData: RegistrationData): Promise<WooCustomer | null> {
  try {
    const api = getWooCommerceClient();
    
    // Vérifier si l'utilisateur existe déjà
    try {
      const existingCustomers = await api.get('customers', {
        email: userData.email,
      });
      
      if (existingCustomers.data.length > 0) {
        throw new Error('Cet email est déjà utilisé');
      }
    } catch (error) {
      // Si l'erreur est autre que "utilisateur déjà existant", on la propage
      if (!(error instanceof Error && error.message === 'Cet email est déjà utilisé')) {
        console.error('Error checking existing user:', error);
        // On continue car ce n'est pas une erreur bloquante
      } else {
        throw error; // Propager l'erreur d'email déjà utilisé
      }
    }
    
    // Créer le nouvel utilisateur
    const { data } = await api.post('customers', {
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      username: userData.username,
      password: userData.password,
    });
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    
    // Pour la démonstration: Si l'API n'est pas disponible, simuler un enregistrement
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock registration in development mode');
      
      // Vérifier si l'email existe déjà dans notre démo
      if (userData.email === 'demo@example.com' || userData.email === 'test@example.com') {
        throw new Error('Cet email est déjà utilisé');
      }
      
      return {
        id: Math.floor(Math.random() * 1000) + 10,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        avatar_url: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${
          Math.floor(Math.random() * 99) + 1
        }.jpg`,
      };
    }
    
    throw error;
  }
}

// Récupérer les informations d'un utilisateur par son ID
export async function getUserById(userId: number): Promise<WooCustomer | null> {
  try {
    const api = getWooCommerceClient();
    const { data } = await api.get(`customers/${userId}`);
    return data;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    return null;
  }
}

// Récupérer les informations d'un utilisateur par son email
export async function getUserByEmail(email: string): Promise<WooCustomer | null> {
  try {
    const api = getWooCommerceClient();
    const { data } = await api.get('customers', {
      email,
    });
    
    if (data.length > 0) {
      return data[0];
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error);
    
    // Pour la démonstration: Si l'API n'est pas disponible, utiliser des données locales
    if (process.env.NODE_ENV === 'development') {
      if (email === 'demo@example.com') {
        return {
          id: 1,
          email: 'demo@example.com',
          first_name: 'John',
          last_name: 'Doe',
          username: 'demo@example.com',
          avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg',
        };
      }
      
      if (email === 'test@example.com') {
        return {
          id: 2,
          email: 'test@example.com',
          first_name: 'Jane',
          last_name: 'Smith',
          username: 'test@example.com',
          avatar_url: 'https://randomuser.me/api/portraits/women/1.jpg',
        };
      }
    }
    
    return null;
  }
}

// Mettre à jour les informations d'un utilisateur
export async function updateUser(userId: number, userData: Partial<WooCustomer>): Promise<WooCustomer | null> {
  try {
    const api = getWooCommerceClient();
    const { data } = await api.put(`customers/${userId}`, userData);
    return data;
  } catch (error) {
    console.error(`Error updating user with ID ${userId}:`, error);
    return null;
  }
}