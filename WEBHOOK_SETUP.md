# 🔔 Configuration des Webhooks WooCommerce

Ce guide explique comment configurer la **synchronisation automatique** entre WooCommerce et Supabase.

---

## 🎯 **Objectif**

Quand une commande change de statut dans WooCommerce (processing → completed → shipped), Supabase est **automatiquement mis à jour** et vos clients voient le changement **en temps réel**.

---

## 🛠️ **Configuration dans WooCommerce**

### Étape 1 : Aller dans les Webhooks

1. Connectez-vous à votre **WordPress admin** : `https://selectura.shop/wp-admin`
2. Allez dans **WooCommerce → Settings → Advanced → Webhooks**
3. Cliquez sur **"Add webhook"**

---

### Étape 2 : Créer le Webhook "Order Updated"

#### Configuration principale

| Champ | Valeur |
|-------|--------|
| **Name** | `Order Updated - Sync to Supabase` |
| **Status** | ✅ Active |
| **Topic** | `Order updated` |
| **Delivery URL** | `https://VOTRE-DOMAINE.com/api/webhooks/woocommerce` |

> ⚠️ **Important** : Remplacez `VOTRE-DOMAINE.com` par :
> - **Production** : `selectura.shop` ou `selectura.co`
> - **Développement** : Utilisez [ngrok](https://ngrok.com/) pour exposer localhost

#### Exemple d'URL de production :
```
https://selectura.shop/api/webhooks/woocommerce
```

#### Sécurité

| Champ | Valeur |
|-------|--------|
| **Secret** | Générez une clé secrète forte |
| **API Version** | `WP REST API Integration v3` |

**Générer un secret** :
```bash
openssl rand -base64 32
```

Copiez le secret généré et **ajoutez-le à votre `.env.local`** :
```env
WOOCOMMERCE_WEBHOOK_SECRET=votre-secret-ici
```

---

### Étape 3 : Créer le Webhook "Order Created" (Optionnel)

Répétez l'étape 2 avec :

| Champ | Valeur |
|-------|--------|
| **Name** | `Order Created - Sync to Supabase` |
| **Topic** | `Order created` |
| **Delivery URL** | `https://VOTRE-DOMAINE.com/api/webhooks/woocommerce` |
| **Secret** | *Même secret que précédemment* |

---

### Étape 4 : Créer le Webhook "Order Deleted" (Optionnel)

Pour synchroniser les suppressions :

| Champ | Valeur |
|-------|--------|
| **Name** | `Order Deleted - Sync to Supabase` |
| **Topic** | `Order deleted` |
| **Delivery URL** | `https://VOTRE-DOMAINE.com/api/webhooks/woocommerce` |
| **Secret** | *Même secret que précédemment* |

---

## 🧪 **Tester la Configuration**

### Test 1 : Vérifier que l'endpoint fonctionne

Ouvrez cette URL dans votre navigateur :
```
https://VOTRE-DOMAINE.com/api/webhooks/woocommerce
```

Vous devriez voir :
```json
{
  "status": "ok",
  "message": "WooCommerce webhook endpoint is ready",
  "timestamp": "2025-11-16T18:30:00.000Z"
}
```

### Test 2 : Tester avec une vraie commande

1. Allez dans **WooCommerce → Orders**
2. Ouvrez une commande existante
3. Changez le statut (ex: `Processing` → `Completed`)
4. Cliquez **"Update"**

#### Vérifier les logs

**Dans votre terminal backend** :
```
🔔 Webhook received from WooCommerce
📋 Topic: order.updated
🆔 Order ID: 1704
✅ Webhook signature verified
🔄 Updating order in Supabase: 1704
✅ Order updated in Supabase: { status: 'completed', ... }
```

**Dans Supabase** :
1. Allez dans votre projet Supabase
2. Table Editor → `orders`
3. Vérifiez que le statut a changé

---

## 🔐 **Sécurité**

### Variables d'environnement requises

Ajoutez à votre `.env.local` :

```env
# Webhook WooCommerce
WOOCOMMERCE_WEBHOOK_SECRET=votre-secret-genere-ici

# Déjà configuré normalement
NEXT_PUBLIC_SUPABASE_URL=https://uhymzullpidcdtusxsnw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
WOOCOMMERCE_CONSUMER_KEY=ck_...
WOOCOMMERCE_CONSUMER_SECRET=cs_...
URL_WORDPRESS=https://selectura.shop
```

### Production vs Développement

#### **En Production** ✅
- URL webhook : `https://selectura.shop/api/webhooks/woocommerce`
- Certificat SSL actif
- Secret défini

#### **En Développement** 🛠️
- Utilisez **ngrok** pour exposer localhost :
  ```bash
  npx ngrok http 3000
  ```
- URL webhook : `https://abc123.ngrok.io/api/webhooks/woocommerce`
- Changez l'URL dans WooCommerce à chaque redémarrage de ngrok

---

## 📊 **Événements Synchronisés**

| Événement WooCommerce | Action Supabase | Champs mis à jour |
|----------------------|-----------------|-------------------|
| **Order Created** | INSERT | Tous les champs |
| **Order Updated** | UPDATE | `status`, `total`, `payment_intent`, `updated_at` |
| **Order Deleted** | DELETE | Suppression complète |

### Statuts synchronisés

- `pending` → En attente
- `processing` → En traitement
- `on-hold` → En pause
- `completed` → Terminée
- `cancelled` → Annulée
- `refunded` → Remboursée
- `failed` → Échouée

---

## 🐛 **Débogage**

### Le webhook ne fonctionne pas ?

**1. Vérifier l'URL**
```bash
curl https://VOTRE-DOMAINE.com/api/webhooks/woocommerce
```

**2. Vérifier les logs WooCommerce**
- WooCommerce → Settings → Advanced → Webhooks
- Cliquez sur votre webhook
- Onglet **"Deliveries"**
- Vérifiez le code de réponse (200 = OK)

**3. Vérifier les logs backend**
```bash
npm run dev
# Changez un statut de commande
# Regardez les logs console
```

**4. Tester sans signature (temporaire)**

Commentez la vérification de signature dans `/api/webhooks/woocommerce/route.ts` :
```typescript
// if (webhookSecret && signature) {
//   ... vérification ...
// }
```

---

## ✅ **Checklist de Configuration**

- [ ] Webhook créé dans WooCommerce
- [ ] URL webhook correcte
- [ ] Secret généré et ajouté à `.env.local`
- [ ] Test GET fonctionne (endpoint accessible)
- [ ] Test de changement de statut réussi
- [ ] Logs backend affichent les webhooks
- [ ] Supabase se met à jour automatiquement
- [ ] Variables d'environnement en production configurées

---

## 🎉 **Résultat**

Une fois configuré :

1. **Client passe commande** → Créée dans WooCommerce ET Supabase
2. **Vous changez le statut** dans WooCommerce
3. **Webhook déclenché** automatiquement
4. **Supabase mis à jour** en temps réel
5. **Client voit le changement** immédiatement sur son compte

**Aucune action manuelle nécessaire ! 🚀**

---

*Dernière mise à jour : 16 novembre 2025*
