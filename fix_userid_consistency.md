# Résolution du problème de visualisation des commandes

Ce document détaille les modifications à apporter pour résoudre le problème de visualisation des commandes dans la page du compte utilisateur. Le problème est lié à la cohérence de l'ID utilisateur entre la création des commandes et leur récupération.

## Problème identifié

L'analyse du code révèle un problème potentiel dans la manière dont l'ID utilisateur est récupéré et utilisé :

1. Dans `CheckoutContent.tsx`, l'ID utilisateur est récupéré via `/api/auth` puis passé à la fonction `createOrder`
2. Dans `AccountPage.tsx`, les commandes sont récupérées via `/api/user-orders` qui utilise l'ID provenant de `supabase.auth.getUser()`
3. Ces deux méthodes pourraient potentiellement fournir des formats d'ID différents ou inconsistants

## Solution proposée

### 1. Modification de la récupération de l'ID utilisateur dans CheckoutContent.tsx

```typescript
// src/components/CheckoutContent.tsx - Lignes 130-140
// Code actuel:
const userResponse = await fetch('/api/auth');
const userData = await userResponse.json();
const userId = userData?.user?.id;

if (!userId) {
  console.warn('Utilisateur non connecté, la commande sera créée sans ID utilisateur');
}

// Création de la commande dans WooCommerce et Supabase
const order = await createOrder(orderData, userId || '');
```

Remplacer par:

```typescript
// Utiliser le même client Supabase que dans les autres parties de l'application
import { createClient } from '@/lib/supabase/client';

// ...à l'intérieur de handleSubmit:
let userId = '';
try {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    userId = user.id;
    console.log('Utilisateur authentifié, ID récupéré:', userId);
  } else {
    console.warn('Utilisateur non authentifié, la commande sera créée sans ID utilisateur');
  }
} catch (authError) {
  console.error('Erreur lors de la récupération de l\'ID utilisateur:', authError);
}

// Création de la commande avec l'ID utilisateur récupéré de la même façon que dans l'API
const order = await createOrder(orderData, userId);
```

### 2. Modification dans orderService.ts pour standardiser le format de l'ID utilisateur

```typescript
// src/lib/orderService.ts - Ligne 9
// Code actuel:
export async function createOrder(orderData: any, userId: string) {
  try {
    console.log('Creating order with data:', orderData);
    console.log('Creating order with userId:', userId, 'type:', typeof userId);
    
    // ...
```

Remplacer par:

```typescript
export async function createOrder(orderData: any, userId: string) {
  try {
    console.log('Creating order with data:', orderData);
    
    // Standardiser l'ID utilisateur (s'assurer qu'il s'agit d'une chaîne valide)
    const validUserId = userId && typeof userId === 'string' && userId.trim() !== '' 
      ? userId.trim() 
      : '';
    
    console.log('Creating order with standardized userId:', validUserId);
    
    // ...continuation du code avec validUserId à la place de userId
    
    // 1. Créer la commande dans WooCommerce
    const wooOrder = await createWooOrder(orderData);
    
    // ...
    
    // Utiliser le client existant, qui a la politique RLS modifiée
    const supabaseOrder = await createSupabaseOrder({
      user_id: validUserId,
      // ...autres propriétés
    });
```

### 3. Vérifier la structure de la table `orders` dans Supabase

Assurez-vous que la structure de la table `orders` dans Supabase est correcte, en particulier que le champ `user_id` est de type `UUID` ou `Text` pour stocker l'ID utilisateur Supabase.

Si ce n'est pas le cas, exécutez la requête SQL suivante dans la console Supabase :

```sql
ALTER TABLE orders 
ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
-- ou, si l'ID ne peut pas être converti en UUID standard:
ALTER TABLE orders 
ALTER COLUMN user_id TYPE text;
```

### 4. Amélioration de la journalisation des erreurs dans orders.ts

```typescript
// src/lib/orders.ts - Ligne 40
// Ajouter des logs plus détaillés pour le débogage
const { data, error } = await supabase
  .from('orders')
  .insert({
    ...orderData,
    created_at: new Date().toISOString()
  })
  .select()
  .single();

if (error) {
  // Message d'erreur amélioré
  console.error('Error creating order in Supabase:', error);
  console.error('Failed order data:', {
    user_id: orderData.user_id,
    user_id_type: typeof orderData.user_id,
    user_id_length: orderData.user_id?.length || 0
  });
  throw new Error(`Impossible de créer la commande dans Supabase: ${error.message}`);
}
```

### 5. Ajouter un système de réessai pour la récupération des commandes dans AccountPage.tsx

```typescript
// src/components/AccountPage.tsx - Ligne 124
// Code actuel:
try {
  const response = await fetch('/api/user-orders');
  if (response.ok) {
    const data = await response.json();
    setOrders(data.orders || []);
  } else {
    console.error('Failed to fetch orders:', await response.text());
    setOrders([]);
  }
} catch (orderError) {
  console.error('Error fetching orders:', orderError);
  setOrders([]);
}
```

Remplacer par:

```typescript
const fetchOrders = async (retries = 3) => {
  try {
    console.log('Tentative de récupération des commandes...');
    const response = await fetch('/api/user-orders');
    
    if (response.ok) {
      const data = await response.json();
      console.log('Commandes récupérées avec succès:', data.orders?.length || 0);
      setOrders(data.orders || []);
    } else {
      const errorText = await response.text();
      console.error('Failed to fetch orders:', errorText);
      
      // Tenter à nouveau si des tentatives restent
      if (retries > 0) {
        console.log(`Nouvelle tentative de récupération (${retries} tentatives restantes)...`);
        setTimeout(() => fetchOrders(retries - 1), 1000);
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
    console.error('Error fetching orders:', orderError);
    
    // Tenter à nouveau si des tentatives restent
    if (retries > 0) {
      console.log(`Nouvelle tentative de récupération (${retries} tentatives restantes)...`);
      setTimeout(() => fetchOrders(retries - 1), 1000);
    } else {
      setOrders([]);
    }
  }
};

// Appeler la fonction avec les tentatives
fetchOrders();
```

## Vérification et tests

Après avoir implémenté ces modifications, testez en suivant ces étapes :

1. Connectez-vous à l'application
2. Créez une commande via le processus de checkout
3. Vérifiez les logs pour confirmer que le même format d'ID utilisateur est utilisé lors de la création et de la récupération des commandes
4. Vérifiez que les commandes apparaissent correctement dans la page du compte utilisateur

## Notes additionnelles

- Il est recommandé de stocker temporairement des journaux supplémentaires pour diagnostiquer le problème en production
- Si le problème persiste, examiner les logs de Supabase pour vérifier les requêtes RLS (Row Level Security) et les formats d'ID
- Considérer l'ajout d'un champ `email` dans la table des commandes pour une récupération alternative des commandes si l'ID pose problème