# 🚀 Déploiement en Production - Guide Rapide

## 📋 **Checklist avant déploiement**

- [ ] Code committé dans Git
- [ ] Variables d'environnement préparées
- [ ] Secrets générés pour la production

---

## 🎯 **Option recommandée : Vercel (Gratuit + Simple)**

### Étape 1 : Commit votre code

```bash
git add .
git commit -m "Add webhook support and payment improvements"
git push origin main
```

### Étape 2 : Déployer sur Vercel

#### Si vous n'avez PAS encore de compte Vercel :

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez **"Sign Up"**
3. Connectez-vous avec **GitHub**
4. Cliquez **"Import Project"**
5. Sélectionnez votre repo `woo`
6. Cliquez **"Deploy"**

#### Si vous AVEZ déjà un compte Vercel :

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

### Étape 3 : Configurer les variables d'environnement

Dans Vercel Dashboard → Settings → Environment Variables, ajoutez **TOUTES** les variables de `.env.production.example` :

#### 🔐 **Secrets à générer MAINTENANT**

**1. WooCommerce Webhook Secret**
```bash
openssl rand -base64 32
```
Copiez le résultat → Variable : `WOOCOMMERCE_WEBHOOK_SECRET`

**2. NextAuth Secret**
```bash
openssl rand -base64 32
```
Copiez le résultat → Variable : `NEXTAUTH_SECRET`

#### 📝 **Variables à copier-coller**

Copiez toutes les autres variables depuis `.env.production.example`.

⚠️ **IMPORTANT** : Pour `NEXTAUTH_URL`, mettez votre vraie URL :
```
NEXTAUTH_URL=https://votre-app.vercel.app
```

Ou si vous avez un domaine custom :
```
NEXTAUTH_URL=https://selectura.shop
```

### Étape 4 : Redéployer après avoir ajouté les variables

Dans Vercel Dashboard :
1. Allez dans **Deployments**
2. Cliquez sur les **3 points** du dernier déploiement
3. Cliquez **"Redeploy"**

Ou en CLI :
```bash
vercel --prod
```

---

## 🔧 **Configurer le domaine custom (Optionnel)**

Si vous voulez `selectura.shop` au lieu de `votre-app.vercel.app` :

### Dans Vercel :
1. **Settings** → **Domains**
2. Ajoutez `selectura.shop`
3. Suivez les instructions DNS

### Dans votre registrar DNS :
Ajoutez un enregistrement CNAME :
```
Type: CNAME
Name: @  (ou www)
Value: cname.vercel-dns.com
```

---

## ✅ **Vérifier que le déploiement fonctionne**

### Test 1 : Site accessible
```
https://votre-app.vercel.app
```

### Test 2 : Webhook endpoint accessible
```
https://votre-app.vercel.app/api/webhooks/woocommerce
```

Devrait retourner :
```json
{"status":"ok","message":"WooCommerce webhook endpoint is ready",...}
```

### Test 3 : Login fonctionne
```
https://votre-app.vercel.app/login
```

---

## 🔔 **Configurer le Webhook WooCommerce**

Maintenant que votre app est en ligne :

1. Allez sur `https://selectura.shop/wp-admin`
2. **WooCommerce** → **Settings** → **Advanced** → **Webhooks**
3. Cliquez **"Add webhook"**

**Configuration** :

| Champ | Valeur |
|-------|--------|
| Name | `Order Updated - Production` |
| Status | ✅ Active |
| Topic | `Order updated` |
| Delivery URL | `https://votre-app.vercel.app/api/webhooks/woocommerce` |
| Secret | *Le secret généré à l'étape 3* |
| API Version | `WP REST API Integration v3` |

4. Cliquez **"Save webhook"**

---

## 🧪 **Tester le webhook en production**

1. Allez dans **WooCommerce** → **Orders**
2. Ouvrez une commande
3. Changez le statut : `Processing` → `Completed`
4. Cliquez **"Update"**

### Vérifier dans Vercel :

1. **Vercel Dashboard** → **Logs** → **Functions**
2. Cherchez `/api/webhooks/woocommerce`
3. Vous devriez voir :
```
🔔 Webhook received from WooCommerce
📋 Topic: order.updated
✅ Webhook signature verified
🔄 Updating order in Supabase
✅ Order updated in Supabase
```

### Vérifier dans Supabase :

1. Allez dans votre projet Supabase
2. **Table Editor** → `orders`
3. Vérifiez que le statut a changé

---

## 🎉 **Résultat**

Maintenant :
- ✅ Votre app est en ligne sur `votre-app.vercel.app`
- ✅ Les webhooks WooCommerce fonctionnent
- ✅ Supabase se synchronise automatiquement
- ✅ Les clients voient les changements en temps réel

---

## 🔥 **Commandes rapides**

### Déployer une mise à jour
```bash
git add .
git commit -m "Update"
git push origin main
# Vercel déploie automatiquement !
```

### Voir les logs en temps réel
```bash
vercel logs --follow
```

### Rollback si problème
Dans Vercel Dashboard → Deployments → Cliquez sur un ancien déploiement → "Promote to Production"

---

## 🐛 **Problèmes courants**

### Build failed ?
- Vérifiez que toutes les variables d'environnement sont définies
- Vérifiez les logs de build dans Vercel

### Webhook ne fonctionne pas ?
- Vérifiez l'URL du webhook dans WooCommerce
- Vérifiez que `WOOCOMMERCE_WEBHOOK_SECRET` est bien défini dans Vercel
- Vérifiez les logs Vercel Functions

### NextAuth ne fonctionne pas ?
- Vérifiez `NEXTAUTH_URL` (doit être l'URL complète)
- Vérifiez `NEXTAUTH_SECRET` (doit être défini)

---

## 📞 **Support**

- Vercel Docs : https://vercel.com/docs
- Vercel Discord : https://vercel.com/discord

---

**Prêt à déployer ? Lancez la commande !** 🚀
