# Tags WooCommerce - Système de Badges

Ce document liste tous les tags à utiliser dans WooCommerce pour activer automatiquement les badges stratégiques sur le site.

## 🌍 Badges de Provenance (Priorité Haute)

Ces badges s'affichent en premier pour renforcer la confiance dès le départ.

### Made in USA 🇺🇸
**Tags acceptés :**
- `made-in-usa`
- `usa`
- `états-unis`

### Made in EU 🇪🇺
**Tags acceptés :**
- `made-in-eu`
- `europe`
- `ue`

### Made in France 🇫🇷
**Tags acceptés :**
- `made-in-france`
- `france`
- `français`

### Made in Germany 🇩🇪
**Tags acceptés :**
- `made-in-germany`
- `allemagne`
- `germany`

### Made in Italy 🇮🇹
**Tags acceptés :**
- `made-in-italy`
- `italie`
- `italy`

---

## 🌱 Badges de Caractéristiques

### Éco-responsable 🌱
**Tags acceptés :**
- `eco-responsable`
- `eco-friendly`

### Qualité Premium 💎
**Tags acceptés :**
- `premium`
- `qualite-premium`

### Meilleur Prix 💰
**Tags acceptés :**
- `meilleur-prix`
- `best-value`

---

## ❤️ Badges Éditoriaux

### Coup de Cœur ❤️
**Tags acceptés :**
- `coup-de-coeur`
- `team-favorite`

### Choix de l'Expert ⭐
**Tags acceptés :**
- `expert-choice`
- `choix-expert`

---

## ⚡ Badges d'Urgence/Rareté

### Édition Limitée 🎯
**Tags acceptés :**
- `edition-limitee`
- `limited-edition`

---

## 📊 Badges Automatiques

Ces badges s'affichent automatiquement selon les données du produit (pas besoin de tags).

### Promo 🏷️
- S'affiche si `on_sale = true`

### Nouveau ✨
- S'affiche si le produit a été créé il y a moins de 14 jours

### Stock Limité ⚡
- S'affiche si `stock_quantity <= 10` et `> 3`

### Dernières Pièces ⏰
- S'affiche si `stock_quantity <= 3` et `> 0`

### Meilleure Vente 🔥
- S'affiche si `featured = true`

---

## 💡 Comment Ajouter des Tags dans WooCommerce

1. Dans l'admin WooCommerce, aller sur **Produits > Tous les produits**
2. Cliquer sur le produit à modifier
3. Dans la barre latérale droite, trouver la section **Étiquettes de produit**
4. Ajouter un ou plusieurs tags de la liste ci-dessus
5. Cliquer sur **Mettre à jour**

### Exemple d'utilisation :
Pour un produit fabriqué aux USA, de qualité premium et coup de cœur de l'équipe :
```
Tags: made-in-usa, premium, coup-de-coeur
```

Les badges s'afficheront automatiquement dans cet ordre :
1. 🇺🇸 Made in USA (provenance en premier)
2. 🔥 Meilleure vente (si featured)
3. 💎 Qualité premium
4. ❤️ Coup de cœur

---

## 📍 Où s'affichent les badges ?

### Page d'accueil - Hero Carousel
- Badges USA/EU affichés entre le texte et les boutons CTA
- Parfaitement visible sur mobile et desktop

### Grilles de produits
- 3 badges maximum par produit
- Affichés en haut de la carte produit
- Badges de provenance toujours en premier

### Page produit détaillée
- Tous les badges pertinents affichés
- Section badges en haut du produit

---

## 🎨 Ordre de Priorité d'Affichage

1. **Provenance** (USA, EU, France, etc.) - TOUJOURS EN PREMIER
2. **Promotions** (Promo, Nouveau)
3. **Stock** (Stock limité, Dernières pièces)
4. **Ventes** (Meilleure vente, Tendance)
5. **Caractéristiques** (Éco-responsable, Premium, etc.)
6. **Éditorial** (Coup de cœur, Choix expert)

---

## 🔧 Notes Techniques

- Les tags sont **insensibles à la casse**
- Les recherches se font sur le **slug** ET le **nom** du tag
- Maximum **3 badges** affichés sur les grilles pour éviter la surcharge visuelle
- Les badges de **provenance utilisent `unshift()`** pour être toujours en premier
