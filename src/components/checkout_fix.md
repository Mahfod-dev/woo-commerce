# Correction du processus de création de commande

Pour résoudre le problème de création et de visualisation des commandes, nous avons apporté les modifications suivantes:

## 1. Création d'un client admin Supabase

Nous avons créé un fichier `src/lib/supabase/admin.ts` qui contient une fonction pour créer un client Supabase utilisant la clé de service. Ce client contourne complètement les politiques RLS et peut être utilisé côté serveur uniquement.

## 2. Modification de l'API create-order

Nous avons modifié l'API `/api/create-order/route.ts` pour:
- Utiliser directement le client admin Supabase
- Effectuer l'insertion en contournant les politiques RLS
- Améliorer la journalisation des erreurs

## 3. Ajout de la clé de service dans les variables d'environnement

Nous avons ajouté la variable d'environnement `SUPABASE_SERVICE_ROLE_KEY` au fichier `.env.local`.

## Comment utiliser cette solution

1. Dans `CheckoutContent.tsx`, au lieu d'utiliser directement `createOrder` de lib/orderService.ts, il faut appeler l'API `/api/create-order` pour créer la commande:

```typescript
// Modification à apporter dans CheckoutContent.tsx
// Remplacer:
const order = await createOrder(orderData, userId || '');

// Par:
const response = await fetch('/api/create-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    total: total.toString(),
    items: items.map(item => ({
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: parseFloat(item.price),
      subtotal: parseFloat(item.price) * item.quantity,
      image_url: item.image
    })),
    shipping_address: {
      first_name: formData.firstName,
      last_name: formData.lastName,
      address_1: formData.address,
      city: formData.city,
      postcode: formData.postalCode,
      country: formData.country
    },
    billing_address: {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address_1: formData.address,
      city: formData.city,
      postcode: formData.postalCode,
      country: formData.country
    }
  })
});

if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.error || 'Échec de création de la commande');
}

const data = await response.json();
const order = data.order;
```

2. Assurez-vous que l'API receive les données nécessaires. Créez le même objet de commande WooCommerce après avoir créé la commande Supabase.

## Pourquoi cette solution fonctionne

Cette solution fonctionne parce que:

1. Le client admin Supabase contourne complètement les politiques RLS
2. L'API s'exécute côté serveur, ce qui est l'endroit sécurisé pour utiliser la clé de service
3. L'authentification de l'utilisateur est toujours vérifiée avant de créer la commande
4. Les logs ont été améliorés pour faciliter le débogage

Cette approche est préférable à la modification des politiques RLS car elle gardera les politiques strictes pour les opérations côté client tout en permettant aux fonctions serveur d'effectuer des opérations privilégiées.