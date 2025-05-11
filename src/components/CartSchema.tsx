'use client';

import { useCart } from '@/components/CartProvider';

export default function CartSchema() {
  const { items, subtotal } = useCart();
  
  // Créer le schéma JSON-LD pour la page du panier
  const cartSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Product',
        'name': item.name,
        'image': item.image,
        'offers': {
          '@type': 'Offer',
          'price': item.price,
          'priceCurrency': 'EUR'
        }
      }
    }))
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cartSchema) }}
    />
  );
}