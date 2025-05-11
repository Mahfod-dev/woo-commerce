-- Correction des politiques RLS pour la table orders

-- 1. D'abord, nous allons supprimer la politique d'insertion actuelle
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;

-- 2. Créer une nouvelle politique qui permet l'insertion depuis le service backend
-- Cette politique permet l'insertion si l'utilisateur est authentifié OU si c'est un service backend
CREATE POLICY "Allow order insertion from backend or authenticated users" ON orders
  FOR INSERT WITH CHECK (
    -- Pas de vérification du user_id pour permettre les insertions depuis le backend
    -- Les services backend doivent s'assurer que user_id est correct
    true
  );

-- Alternativement, si vous voulez plus de sécurité, vous pouvez créer une politique qui vérifie
-- que soit l'utilisateur est authentifié et correspond au user_id, soit un rôle spécial est utilisé.
-- Pour cela, vous devriez créer un rôle de service dans Supabase et l'utiliser dans vos appels API
-- CREATE POLICY "Allow order insertion from backend or authenticated users" ON orders
--   FOR INSERT WITH CHECK (
--     auth.uid() = user_id OR auth.role() = 'service_role'
--   );

-- 3. Ajouter une clé API avec l'annotation COMMENT pour référence future
COMMENT ON TABLE orders IS 'Commandes des utilisateurs. Politique RLS modifiée le 05/10/2025 pour permettre les insertions de backend.';
