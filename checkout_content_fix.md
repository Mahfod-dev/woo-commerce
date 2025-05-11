# Correction pour CheckoutContent.tsx

Pour résoudre le problème de visualisation des commandes dans l'espace compte utilisateur, vous devez modifier la façon dont l'ID utilisateur est récupéré dans le composant CheckoutContent.tsx.

## Étapes à suivre:

1. D'abord, importez la fonction utilitaire `getCurrentUserId` au début du fichier:

```typescript
// src/components/CheckoutContent.tsx
import { getCurrentUserId } from '@/lib/utils';
```

2. Ensuite, remplacez la section qui récupère l'ID utilisateur (autour de la ligne 130) par ce code:

```typescript
// Récupération de l'ID utilisateur via la fonction d'utilitaire standardisée
let userId = '';
try {
  userId = await getCurrentUserId();
  console.log('CheckoutContent - ID utilisateur récupéré:', userId);
  
  if (!userId) {
    console.warn('Utilisateur non authentifié, la commande sera créée sans ID utilisateur');
  }
} catch (authError) {
  console.error('Erreur lors de la récupération de l\'ID utilisateur:', authError);
}

// Création de la commande dans WooCommerce et Supabase
console.log('CheckoutContent - Création de commande avec userId:', userId);
const order = await createOrder(orderData, userId);
```

Cette modification garantira que l'ID utilisateur est récupéré de la même manière lors de la création de commande et lors de la récupération des commandes dans l'espace compte.

## Pourquoi cette approche fonctionne:

1. Utilise le même client Supabase et la même méthode d'authentification que dans le reste de l'application
2. Standardise le format de l'ID utilisateur pour éviter des incohérences
3. Ajoute des logs pour faciliter le débogage en cas de problème
4. Garantit la cohérence entre création et récupération des commandes

Cette correction, combinée avec les modifications déjà apportées à `orderService.ts` et `orders.ts`, devrait résoudre le problème de visualisation des commandes dans l'espace compte utilisateur.