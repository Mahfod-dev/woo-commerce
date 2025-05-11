# Test d'insertion directe dans Supabase avec le client admin

Pour tester rapidement si l'insertion avec la clé de service fonctionne correctement, vous pouvez utiliser la nouvelle API `insert-order-admin`.

## Étapes pour tester

1. Ouvrez votre console de développement dans le navigateur (F12 ou Cmd+Option+I)

2. Exécutez le code JavaScript suivant dans la console:

```javascript
// Données de test pour une commande
const testOrderData = {
  user_id: "21681822-45bb-4884-a804-de8ca4a83ead", // Utilisez votre vrai ID utilisateur
  status: "processing",
  total: 59.99,
  items: [
    {
      product_id: 1234,
      product_name: "Produit de test",
      quantity: 2,
      price: 29.99,
      subtotal: 59.98,
      image_url: "/images/placeholder.jpg"
    }
  ],
  shipping_address: {
    first_name: "Test",
    last_name: "Utilisateur",
    address_1: "123 Rue Test",
    city: "Ville Test",
    postcode: "75000",
    country: "France"
  },
  billing_address: {
    first_name: "Test",
    last_name: "Utilisateur",
    email: "test@example.com",
    phone: "0123456789",
    address_1: "123 Rue Test",
    city: "Ville Test",
    postcode: "75000",
    country: "France"
  }
};

// Appel à l'API d'insertion admin
fetch('/api/insert-order-admin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testOrderData)
})
.then(response => response.json())
.then(data => {
  console.log('Résultat de l\'insertion:', data);
  if (data.success) {
    console.log('Commande insérée avec succès! ID:', data.order.id);
  } else {
    console.error('Échec de l\'insertion:', data.error);
  }
})
.catch(error => {
  console.error('Erreur lors de l\'appel API:', error);
});
```

3. Vérifiez dans la console les messages de succès ou d'erreur

4. Si la commande est insérée avec succès, vérifiez dans votre compte Supabase (table orders) que la nouvelle commande est bien présente

## Explication

Cette approche teste directement l'insertion avec la clé de service, en contournant tout le flux normal de création de commande. Si cette insertion fonctionne mais que votre processus normal échoue, cela confirme qu'il s'agit bien d'un problème avec les politiques RLS et que la solution de la clé de service est viable.

Une fois ce test réussi, vous pourrez adapter votre processus de création de commande complet pour utiliser cette nouvelle API.