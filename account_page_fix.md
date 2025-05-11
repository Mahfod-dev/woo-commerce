# Amélioration de la récupération des commandes dans AccountPage.tsx

Pour compléter les améliorations et s'assurer que les commandes s'affichent correctement dans l'espace compte, voici les modifications à apporter au composant AccountPage.tsx.

## Étapes à suivre:

1. Importez la fonction utilitaire `standardizeUserId` au début du fichier:

```typescript
// src/components/AccountPage.tsx
import { standardizeUserId } from '@/lib/utils';
```

2. Remplacez la section qui récupère les commandes (autour de la ligne 124) par un système de récupération plus robuste:

```typescript
// Fonction de récupération des commandes avec tentatives multiples
const fetchOrders = async (retries = 3) => {
  try {
    console.log('AccountPage - Tentative de récupération des commandes...');
    const response = await fetch('/api/user-orders');
    
    if (response.ok) {
      const data = await response.json();
      console.log('AccountPage - Commandes récupérées avec succès:', data.orders?.length || 0);
      
      // Si aucune commande n'est trouvée et que c'est la première tentative, essayer à nouveau
      if (data.orders?.length === 0 && retries === 3) {
        console.log('Aucune commande trouvée, nouvelle tentative dans 2 secondes...');
        setTimeout(() => fetchOrders(retries - 1), 2000);
        return;
      }
      
      setOrders(data.orders || []);
    } else {
      const errorText = await response.text();
      console.error('Échec de récupération des commandes:', errorText);
      
      // Tenter à nouveau si des tentatives restent
      if (retries > 0) {
        console.log(`Nouvelle tentative de récupération (${retries} tentatives restantes)...`);
        setTimeout(() => fetchOrders(retries - 1), 2000);
      } else {
        setOrders([]);
        addNotification({
          type: 'warning',
          message: 'Impossible de récupérer votre historique de commandes.',
          duration: 5000,
        });
      }
    }
  } catch (orderError) {
    console.error('Erreur lors de la récupération des commandes:', orderError);
    
    // Tenter à nouveau si des tentatives restent
    if (retries > 0) {
      console.log(`Nouvelle tentative de récupération (${retries} tentatives restantes)...`);
      setTimeout(() => fetchOrders(retries - 1), 2000);
    } else {
      setOrders([]);
    }
  }
};

// Appeler la fonction avec le nombre de tentatives
fetchOrders();
```

3. Pour un débogage supplémentaire, ajoutez un log de l'ID utilisateur avant d'essayer de récupérer les commandes:

```typescript
// Dans la fonction loadUserData, après avoir récupéré l'utilisateur
const user = await getUser();

if (!user) {
  // User not authenticated, redirect to login
  addNotification({
    type: 'warning',
    message: 'Veuillez vous connecter pour accéder à votre compte',
    duration: 5000,
  });
  router.push('/login');
  return;
}

console.log('AccountPage - ID utilisateur pour récupération des commandes:', 
  standardizeUserId(user.id), 'type:', typeof user.id);

// Get user profile from Supabase
const profile = await getUserProfile(user.id);
```

## Objectifs de ces modifications:

1. **Standardisation des ID**: Garantit que l'ID utilisateur est traité de manière cohérente
2. **Tentatives multiples**: Permet au système de réessayer si les commandes ne sont pas immédiatement disponibles
3. **Meilleure journalisation**: Facilite l'identification des problèmes avec les ID ou la récupération
4. **Expérience utilisateur améliorée**: Notification adaptée en cas d'échec persistant

Ces modifications complètent les améliorations apportées aux autres parties du système pour assurer un flux cohérent des ID utilisateur et une meilleure fiabilité dans l'affichage des commandes.