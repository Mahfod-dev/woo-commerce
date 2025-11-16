# 🚀 Guide Rapide : Activer les Webhooks WooCommerce

## ⚡ **Configuration en 5 minutes**

### 1️⃣ **Générer un secret sécurisé**

Dans votre terminal :
```bash
openssl rand -base64 32
```

Copiez le résultat (ex: `dG9rZW5fc2VjcmV0X2hlcmVfMTIzNDU2Nzg5MA==`)

---

### 2️⃣ **Ajouter le secret à votre .env.local**

Ouvrez `.env.local` et remplacez :
```env
WOOCOMMERCE_WEBHOOK_SECRET=your-woocommerce-webhook-secret-change-this
```

Par :
```env
WOOCOMMERCE_WEBHOOK_SECRET=dG9rZW5fc2VjcmV0X2hlcmVfMTIzNDU2Nzg5MA==
```

---

### 3️⃣ **Redémarrer votre serveur**

```bash
# Arrêtez le serveur (Ctrl+C)
npm run dev
```

---

### 4️⃣ **Tester que l'endpoint fonctionne**

Ouvrez dans votre navigateur :
```
http://localhost:3000/api/webhooks/woocommerce
```

Vous devriez voir :
```json
{
  "status": "ok",
  "message": "WooCommerce webhook endpoint is ready",
  "timestamp": "..."
}
```

✅ **Si vous voyez ce message, l'endpoint fonctionne !**

---

### 5️⃣ **Configurer WooCommerce (EN PRODUCTION UNIQUEMENT)**

⚠️ **Important** : Les webhooks ne fonctionnent PAS avec `localhost` !

#### Option A : Déployer en production
1. Déployez votre app sur Vercel/Railway/etc.
2. URL webhook : `https://selectura.shop/api/webhooks/woocommerce`

#### Option B : Utiliser ngrok pour tester en local
```bash
npx ngrok http 3000
```

Vous obtenez une URL comme : `https://abc123.ngrok.io`

---

### 6️⃣ **Ajouter le webhook dans WooCommerce**

1. Allez sur `https://selectura.shop/wp-admin`
2. **WooCommerce** → **Settings** → **Advanced** → **Webhooks**
3. Cliquez **"Add webhook"**

#### Configuration :

| Champ | Valeur |
|-------|--------|
| Name | `Order Updated - Sync` |
| Status | ✅ Active |
| Topic | `Order updated` |
| Delivery URL | `https://selectura.shop/api/webhooks/woocommerce` |
| Secret | *Collez votre secret généré à l'étape 1* |
| API Version | `WP REST API Integration v3` |

4. Cliquez **"Save webhook"**

---

### 7️⃣ **Tester**

1. Allez dans **WooCommerce** → **Orders**
2. Ouvrez une commande
3. Changez le statut : `Processing` → `Completed`
4. Cliquez **"Update"**

#### Dans votre terminal backend, vous devriez voir :
```
🔔 Webhook received from WooCommerce
📋 Topic: order.updated
🆔 Order ID: 1704
✅ Webhook signature verified
🔄 Updating order in Supabase: 1704
✅ Order updated in Supabase
```

---

## ✅ **C'est tout !**

Maintenant :
- ✅ Quand une commande change dans WooCommerce
- ✅ Supabase est automatiquement mis à jour
- ✅ Vos clients voient les changements en temps réel

---

## 🐛 **Problèmes ?**

### Le webhook ne se déclenche pas ?

1. **Vérifiez l'URL** dans WooCommerce → Webhooks → Deliveries
2. **Vérifiez les logs** de votre terminal backend
3. **Vérifiez le secret** dans `.env.local`

### Erreur 401 "Invalid signature" ?

Le secret dans WooCommerce est différent de celui dans `.env.local`. Assurez-vous qu'ils sont identiques.

---

Pour plus de détails, consultez `WEBHOOK_SETUP.md`.
