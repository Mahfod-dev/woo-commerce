# Système d'URLs Produits - SEO Optimisé

## Format d'URL

Les URLs de produits utilisent désormais le format : `/products/[id]-[slug]`

### Exemples
- ✅ `/products/123-mon-super-produit`
- ✅ `/products/456-sac-michael-kors`

## Fonctionnalités

### 1. **Résistance aux changements de slug**
L'ID reste constant même si le nom du produit (slug) change.

**Exemple :**
- Ancien nom : "Sac à main noir" → `/products/123-sac-a-main-noir`
- Nouveau nom : "Sac élégant noir" → `/products/123-sac-elegant-noir`
- L'ancienne URL `/products/123-sac-a-main-noir` **redirige automatiquement (301)** vers la nouvelle

### 2. **Compatibilité avec anciennes URLs**
Les anciennes URLs au format `/products/[slug]` sont supportées :
- `/products/mon-produit` → Redirige 301 vers `/products/123-mon-produit`

### 3. **URLs incomplètes acceptées**
- `/products/123` → Redirige 301 vers `/products/123-mon-produit`

### 4. **URL Canonique**
Le système garantit qu'il n'y a qu'une seule URL valide par produit (évite le duplicate content).

## Avantages SEO

✅ **Pas de liens cassés** : Les anciennes URLs redirigent automatiquement
✅ **Préservation du PageRank** : Les redirections 301 transfèrent le "jus SEO"
✅ **Slug SEO-friendly** : Le nom du produit est toujours visible dans l'URL
✅ **Évite duplicate content** : Une seule URL canonique par produit
✅ **Flexibilité** : Changez les noms de produits sans impact SEO

## Utilisation dans le code

### Générer une URL de produit

```typescript
import { getProductUrl } from '@/lib/productUrl';

const product = { id: 123, slug: 'mon-produit' };
const url = getProductUrl(product);
// Résultat : /products/123-mon-produit
```

### Dans les composants

```tsx
<Link href={`/products/${product.id}-${product.slug}`}>
  {product.name}
</Link>
```

## Migration

Les composants suivants ont été mis à jour pour utiliser le nouveau format :
- ✅ ProductsGrid
- ✅ FocusedProductPage
- ✅ ProductDetailContent
- ✅ BestSellerProductCard
- ✅ MegaMenu
- ✅ FlashSaleContent
- ✅ Et tous les autres composants affichant des liens produits

## Notes techniques

- La route `/products/[id]/page.tsx` gère tous les cas (ID, ID-slug, slug seul)
- Les redirections sont gérées via `redirect()` de Next.js (301 permanent)
- Compatible avec ISR (Incremental Static Regeneration)
- L'ancienne route `/products/[slug]/page.tsx` peut être supprimée après migration complète
