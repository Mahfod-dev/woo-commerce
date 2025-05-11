-- Script pour corriger les politiques RLS et les triggers dans Supabase
-- Exécutez ce script dans l'éditeur SQL de Supabase

--------------------------------------------------------------
-- 1. DÉSACTIVER TEMPORAIREMENT RLS POUR DÉBLOQUER LA SITUATION
--------------------------------------------------------------

-- Désactiver temporairement RLS pour la table profiles
-- (Commentez cette ligne en production)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

--------------------------------------------------------------
-- 2. NETTOYER LES POLITIQUES EXISTANTES
--------------------------------------------------------------

-- Supprimer toutes les politiques existantes sur la table profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles can be created by the user" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Supprimer les politiques de la table orders si nécessaire
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;

--------------------------------------------------------------
-- 3. RECRÉER LES FONCTIONS ET TRIGGERS
--------------------------------------------------------------

-- Fonction pour créer automatiquement un profil lorsqu'un utilisateur s'inscrit
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, created_at)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email,
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer le trigger existant s'il existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recréer le trigger pour appeler la fonction handle_new_user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction pour mettre à jour le timestamp lors de la modification d'un profil
CREATE OR REPLACE FUNCTION public.handle_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour le timestamp
  NEW.updated_at = now();
  
  -- Mettre à jour l'email dans auth.users si nécessaire
  IF (NEW.email IS NOT NULL AND NEW.email <> OLD.email) THEN
    UPDATE auth.users SET email = NEW.email WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer le trigger existant s'il existe
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;

-- Recréer le trigger pour les mises à jour de profil
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_profile_update();

--------------------------------------------------------------
-- 4. AJOUTER DES POLITIQUES PLUS PERMISSIVES (DÉVELOPPEMENT)
--------------------------------------------------------------

-- Si vous souhaitez réactiver RLS avec des politiques plus permissives
-- Décommentez ces lignes et commentez la ligne ALTER TABLE... DISABLE ROW LEVEL SECURITY

-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politique permissive pour la lecture - tout le monde peut voir tous les profils (développement)
-- CREATE POLICY "Anyone can select profiles" ON profiles
--   FOR SELECT USING (true);

-- Politique permissive pour l'insertion - tout le monde peut créer des profils
-- CREATE POLICY "Anyone can insert profiles" ON profiles
--   FOR INSERT WITH CHECK (true);

-- Politique permissive pour la mise à jour - l'utilisateur peut mettre à jour son propre profil
-- CREATE POLICY "Users can update own profile" ON profiles
--   FOR UPDATE USING (auth.uid() = id);

--------------------------------------------------------------
-- 5. AJOUTER DES POLITIQUES SÉCURISÉES (PRODUCTION)
--------------------------------------------------------------

-- Pour la production, vous devriez utiliser ces politiques plus restrictives
-- Décommentez ces lignes et commentez les politiques permissives ci-dessus

-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politique sécurisée - utilisateur peut voir son propre profil
-- CREATE POLICY "Users can view their own profile" ON profiles
--   FOR SELECT USING (auth.uid() = id);

-- Politique sécurisée - utilisateur peut mettre à jour son propre profil
-- CREATE POLICY "Users can update their own profile" ON profiles
--   FOR UPDATE USING (auth.uid() = id);

-- Politique sécurisée - utilisateur peut créer son propre profil
-- CREATE POLICY "Users can insert their own profile" ON profiles
--   FOR INSERT WITH CHECK (auth.uid() = id);

--------------------------------------------------------------
-- 6. VÉRIFIER LA CONFIGURATION ACTUELLE
--------------------------------------------------------------

-- Vérifier les politiques sur la table profiles
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Vérifier si RLS est activé sur la table profiles
SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'profiles';

-- Vérifier les déclencheurs (triggers) sur la table auth.users
SELECT tgname, pg_get_triggerdef(oid) FROM pg_trigger WHERE tgrelid = 'auth.users'::regclass;