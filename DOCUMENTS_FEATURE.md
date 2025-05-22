# Fonctionnalité Documents et Ressources

## Vue d'ensemble

La section "Documents et ressources" dans les pages produits s'affiche maintenant **conditionnellement** uniquement si des documents sont disponibles pour le produit.

## Comment ça fonctionne

### 1. Logique d'affichage conditionnelle

La section ne s'affiche que si `product.documents` existe et contient au moins un document :

```typescript
{product.documents && product.documents.length > 0 && (
  <div className='mt-12'>
    <h3>Documents et ressources</h3>
    // Contenu de la section
  </div>
)}
```

### 2. Génération automatique des documents

Les documents sont générés automatiquement selon certains critères du produit :

#### Critères d'inclusion :

- **Guide d'utilisation** : Produits premium OU électroniques
- **Fiche technique détaillée** : Produits premium uniquement  
- **Certificat de garantie** : Produits > 100€
- **Vidéo de démonstration** : Produits avec plus de 2 images

#### Types de documents supportés :

- `pdf` - Documents PDF
- `doc` - Documents Word/Office
- `image` - Images haute résolution
- `video` - Vidéos de démonstration
- `other` - Autres types de fichiers

### 3. Structure des données

```typescript
interface ProductDocument {
  id: string;
  name: string;
  description: string;
  url: string;
  size: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'other';
}
```

### 4. Interface utilisateur

- **Icônes dynamiques** : Chaque type de document a sa propre icône
- **Informations détaillées** : Nom, description et taille affichés
- **Liens de téléchargement** : Ouverture dans un nouvel onglet
- **Design responsive** : S'adapte à tous les écrans

## Exemples

### Produit avec documents
Si un produit est premium et coûte plus de 100€, il aura :
- Guide d'utilisation (PDF, 2.4 MB)
- Fiche technique détaillée (PDF, 1.8 MB)  
- Certificat de garantie (PDF, 450 KB)

### Produit sans documents  
Si un produit ne correspond à aucun critère, la section "Documents et ressources" n'apparaîtra pas du tout.

## Personnalisation

Pour ajouter des documents personnalisés, modifiez la fonction `generateDocuments()` dans `/src/app/products/[slug]/page.tsx` :

```typescript
function generateDocuments(wooProduct: WooProduct): ProductDocument[] {
  const documents: ProductDocument[] = [];
  
  // Ajoutez vos propres conditions ici
  if (votre_condition) {
    documents.push({
      id: `custom-${wooProduct.id}`,
      name: 'Nom du document',
      description: 'Description',
      url: 'https://example.com/document.pdf',
      size: '1.2 MB',
      type: 'pdf'
    });
  }
  
  return documents;
}
```

## Avantages

1. **Expérience utilisateur améliorée** : Pas de section vide inutile
2. **Flexibilité** : Ajout facile de nouveaux types de documents
3. **Automatisation** : Génération automatique selon les critères du produit
4. **Design cohérent** : Interface unifiée avec le reste de l'application