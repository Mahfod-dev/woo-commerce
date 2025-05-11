-- Solution simplifiée pour les politiques RLS de la table orders

-- 1. Supprimer toutes les politiques existantes sur la table orders
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
DROP POLICY IF EXISTS "Users can delete their own orders" ON orders;
DROP POLICY IF EXISTS "Allow order insertion from backend or authenticated users" ON orders;

-- 2. Créer des politiques simples et permissives
-- Politique pour INSERT - Tout le monde peut insérer
CREATE POLICY "Allow all inserts" ON orders
  FOR INSERT WITH CHECK (true);

-- Politique pour SELECT - Les utilisateurs peuvent voir leurs propres commandes
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Politique pour UPDATE - Les utilisateurs peuvent mettre à jour leurs propres commandes
CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Politique pour DELETE - Les utilisateurs peuvent supprimer leurs propres commandes
CREATE POLICY "Users can delete their own orders" ON orders
  FOR DELETE USING (auth.uid() = user_id);

-- 3. Ajouter un commentaire sur la table pour référence future
COMMENT ON TABLE orders IS 'Commandes des utilisateurs. Politiques RLS simplifiées le 05/10/2025.';