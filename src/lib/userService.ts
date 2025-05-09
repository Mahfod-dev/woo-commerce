// Types pour l'authentification
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string; // Dans une application réelle, ne jamais stocker les mots de passe en clair
  avatar?: string;
}

// Base d'utilisateurs de démonstration initiale
const DEMO_USERS: User[] = [
  {
    id: 1,
    email: "demo@example.com",
    firstName: "John",
    lastName: "Doe",
    password: "password", // Dans une application réelle, on stockerait un hash
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    email: "test@example.com",
    firstName: "Jane",
    lastName: "Smith",
    password: "password",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
];

// Clé de stockage localStorage
const USERS_STORAGE_KEY = 'demo_users';

// Fonctions pour gérer les utilisateurs en local storage
function saveUsers(users: User[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
}

function loadUsers(): User[] {
  if (typeof window !== 'undefined') {
    const usersString = localStorage.getItem(USERS_STORAGE_KEY);
    if (usersString) {
      try {
        return JSON.parse(usersString);
      } catch (e) {
        console.error('Error parsing users from localStorage:', e);
      }
    }
  }
  
  // Si le localStorage n'est pas disponible ou vide, utiliser les utilisateurs de démo
  return [...DEMO_USERS];
}

// Initialiser la base d'utilisateurs au démarrage si elle n'existe pas
function initializeUsers(): User[] {
  const users = loadUsers();
  if (users.length === 0) {
    saveUsers(DEMO_USERS);
    return [...DEMO_USERS];
  }
  return users;
}

let users = initializeUsers();

// Rechercher un utilisateur par email
export function findUserByEmail(email: string): User | undefined {
  users = loadUsers(); // Recharger les utilisateurs au cas où ils ont été modifiés
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Rechercher un utilisateur par ID
export function findUserById(id: number): User | undefined {
  users = loadUsers();
  return users.find(user => user.id === id);
}

// Authentifier un utilisateur
export function authenticateUser(email: string, password: string): User | null {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    // Ne jamais renvoyer l'utilisateur avec son mot de passe
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  return null;
}

// Créer un nouvel utilisateur
export function createUser(userData: Omit<User, 'id'>): User | null {
  users = loadUsers();
  
  // Vérifier si l'email existe déjà
  if (findUserByEmail(userData.email)) {
    throw new Error('Cet email est déjà utilisé');
  }
  
  // Créer un nouvel ID (dans une application réelle, ce serait géré par la base de données)
  const newId = users.length > 0 
    ? Math.max(...users.map(u => u.id)) + 1 
    : 1;
  
  // Créer le nouvel utilisateur
  const newUser: User = {
    id: newId,
    ...userData,
  };
  
  // Ajouter l'utilisateur à la liste
  users.push(newUser);
  saveUsers(users);
  
  // Retourner l'utilisateur sans son mot de passe
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword as User;
}

// Mettre à jour un utilisateur
export function updateUser(id: number, userData: Partial<User>): User | null {
  users = loadUsers();
  
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return null;
  }
  
  // Si l'email est mis à jour, vérifier qu'il n'est pas déjà utilisé
  if (userData.email && userData.email !== users[userIndex].email) {
    const existingUser = findUserByEmail(userData.email);
    if (existingUser && existingUser.id !== id) {
      throw new Error('Cet email est déjà utilisé');
    }
  }
  
  // Mettre à jour l'utilisateur
  users[userIndex] = {
    ...users[userIndex],
    ...userData,
  };
  
  saveUsers(users);
  
  // Retourner l'utilisateur mis à jour sans son mot de passe
  const { password, ...userWithoutPassword } = users[userIndex];
  return userWithoutPassword as User;
}

// Supprimer un utilisateur
export function deleteUser(id: number): boolean {
  users = loadUsers();
  
  const initialLength = users.length;
  users = users.filter(user => user.id !== id);
  
  if (users.length !== initialLength) {
    saveUsers(users);
    return true;
  }
  
  return false;
}

// Obtenir tous les utilisateurs (sans leurs mots de passe)
export function getAllUsers(): Omit<User, 'password'>[] {
  users = loadUsers();
  return users.map(({ password, ...user }) => user);
}