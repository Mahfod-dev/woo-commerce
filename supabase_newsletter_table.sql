-- Création de la table pour les inscriptions newsletter
-- À exécuter dans Supabase SQL Editor

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    source VARCHAR(50) DEFAULT 'website',
    ip_address VARCHAR(45),
    user_agent TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour rechercher rapidement par email
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Index pour les abonnés actifs
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_newsletter_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_newsletter_updated_at
    BEFORE UPDATE ON newsletter_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_newsletter_updated_at();

-- RLS (Row Level Security) - Activer la sécurité au niveau des lignes
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Politique : Lecture publique des emails actifs (pour vérification)
CREATE POLICY "Allow public read active subscribers"
ON newsletter_subscribers FOR SELECT
USING (is_active = true);

-- Politique : Insertion publique (pour les inscriptions)
CREATE POLICY "Allow public insert subscribers"
ON newsletter_subscribers FOR INSERT
WITH CHECK (true);

-- Politique : Les admins peuvent tout faire (à configurer selon tes besoins)
CREATE POLICY "Allow admin all operations"
ON newsletter_subscribers FOR ALL
USING (auth.role() = 'service_role');

-- Commentaires pour documentation
COMMENT ON TABLE newsletter_subscribers IS 'Table pour stocker les inscriptions à la newsletter';
COMMENT ON COLUMN newsletter_subscribers.email IS 'Email unique du subscriber';
COMMENT ON COLUMN newsletter_subscribers.is_active IS 'Indique si le subscriber est actif (non désabonné)';
COMMENT ON COLUMN newsletter_subscribers.source IS 'Source de l''inscription (website, popup, checkout, etc.)';
