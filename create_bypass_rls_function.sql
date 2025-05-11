-- Création d'une fonction SQL qui contourne les politiques RLS
-- Cette fonction sera appelée depuis l'API avec les privilèges appropriés

-- Créer la fonction qui récupère les commandes d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_orders(user_id_param UUID)
RETURNS SETOF orders
SECURITY DEFINER -- Cette directive fait que la fonction s'exécute avec les permissions du créateur (admin)
AS $$
BEGIN
  -- Retourne toutes les commandes pour cet utilisateur, en contournant les RLS
  RETURN QUERY
  SELECT *
  FROM orders
  WHERE user_id = user_id_param
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Commenter la fonction pour la documentation
COMMENT ON FUNCTION get_user_orders IS 'Récupère les commandes d''un utilisateur, en contournant les RLS. Ne doit être appelée que depuis l''API serveur authentifiée.';