/**
 * Fonctions utilitaires pour l'application
 */

/**
 * Standardise un ID utilisateur pour assurer une cohérence entre création et récupération
 * @param userId ID utilisateur potentiellement non standardisé
 * @returns ID utilisateur standardisé ou chaîne vide en cas d'ID invalide
 */
export function standardizeUserId(userId: any): string {
  // S'assurer que l'ID est une chaîne valide et non vide
  if (userId && typeof userId === 'string' && userId.trim() !== '') {
    return userId.trim();
  }

  // En cas d'ID numérique, le convertir en chaîne
  if (userId && typeof userId === 'number') {
    return userId.toString();
  }

  // ID invalide, retourner une chaîne vide
  return '';
}

/**
 * Récupère l'ID utilisateur depuis NextAuth (côté serveur)
 * @returns Promise d'ID utilisateur ou null
 */
export async function getCurrentUserIdFromSession(): Promise<string | null> {
  try {
    const { getServerSession } = await import('next-auth');
    const { authOptions } = await import('@/app/api/auth/[...nextauth]/route');
    
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      return standardizeUserId(session.user.id);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la session utilisateur:', error);
  }
  
  return null;
}

/**
 * Récupère l'ID utilisateur depuis Supabase (côté client)
 * @returns Promise d'ID utilisateur ou chaîne vide
 */
export async function getCurrentUserId(): Promise<string> {
  try {
    // Import dynamique pour éviter les erreurs côté client/serveur
    const { createClient } = await import('./supabase/client');
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return standardizeUserId(user.id);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
  }
  
  return '';
}