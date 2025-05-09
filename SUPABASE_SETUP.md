# Configuration de Supabase pour l'Application

Ce guide vous explique comment configurer Supabase pour votre application de commerce électronique.

## 1. Création d'un projet Supabase

1. Allez sur [Supabase](https://supabase.com) et connectez-vous ou créez un compte
2. Cliquez sur "New Project"
3. Entrez un nom pour votre projet
4. Définissez un mot de passe pour la base de données
5. Choisissez la région la plus proche de vos utilisateurs
6. Cliquez sur "Create new project"

## 2. Configuration des variables d'environnement

Une fois votre projet créé, récupérez les informations de connexion:

1. Dans le dashboard de votre projet Supabase, allez dans "Settings" > "API"
2. Copiez l'URL du projet (`Project URL`) et la clé anonyme (`anon/public`)
3. Créez un fichier `.env.local` à la racine de votre projet (basé sur le fichier `.env.local.example`)
4. Ajoutez ces variables:

```
NEXT_PUBLIC_SUPABASE_URL=votre-url-de-projet
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anonyme
```

## 3. Création des tables dans Supabase

Pour créer les tables nécessaires:

1. Dans le dashboard de votre projet Supabase, allez à l'onglet "SQL Editor"
2. Créez un nouveau SQL snippet
3. Copiez le contenu du fichier `supabase_schema.sql` dans l'éditeur
4. Exécutez le script SQL (bouton "Run")

Ce script crée:
- Une table `profiles` pour les données utilisateurs
- Une table `orders` pour l'historique des commandes
- Des politiques de sécurité (Row Level Security)
- Des triggers qui synchronisent les données entre l'authentification et les profils

## 4. Activation de l'authentification par email/mot de passe

1. Allez dans "Authentication" > "Providers"
2. Assurez-vous que "Email" est activé
3. Vous pouvez désactiver "Confirm email" pour un environnement de développement
4. Dans "Authentication" > "Email Templates", personnalisez les emails:
   - Confirmation d'email
   - Invitation
   - Réinitialisation de mot de passe
   - Changement d'email

## 5. Configuration des redirections pour l'authentification

Dans l'onglet "Authentication" > "URL Configuration":

1. Ajoutez les URLs de redirection autorisées:
   - `http://localhost:3000/**` (pour le développement)
   - `https://votre-domaine.com/**` (pour la production)
2. Configurez les redirections par défaut:
   - "Site URL": `http://localhost:3000` ou votre domaine de production

## 6. Test de l'authentification

Pour vérifier que tout fonctionne:

1. Lancez votre application avec `npm run dev`
2. Créez un compte via la page d'inscription
3. Vous devriez être automatiquement connecté et redirigé vers la page de compte
4. Dans Supabase, vérifiez que l'utilisateur apparaît dans "Authentication" > "Users"
5. Vérifiez que l'entrée correspondante a été créée dans la table `profiles`

## Notes importantes

- En production, activez "Confirm email" pour une meilleure sécurité
- Personnalisez les emails selon l'identité de votre marque
- Pensez à configurer un domaine personnalisé pour vos emails d'authentification
- Pour une récupération de mot de passe plus efficace, configurez un service SMTP dans "Authentication" > "Email Settings"