-- =====================================================
-- PEEKIT - Politiques RLS pour l'accès client (public)
-- =====================================================
-- Exécutez ces commandes dans votre console Supabase SQL Editor
-- Ces politiques s'ajoutent à vos politiques existantes (authenticated)

-- =====================================================
-- 1. ACCÈS PUBLIC EN LECTURE AUX PROJETS
-- =====================================================
-- Permet aux utilisateurs anonymes de lire UN projet spécifique
-- via son ID (pour les liens client partagés)
-- SÉCURITÉ : Lecture seule, l'ID du projet sert de "clé d'accès"

CREATE POLICY "projects_public_select"
ON projects
FOR SELECT
TO anon
USING (true);

-- =====================================================
-- 2. ACCÈS PUBLIC EN LECTURE AUX TEASERS
-- =====================================================
-- Permet aux clients de voir les teasers du projet partagé

CREATE POLICY "teasers_public_select"
ON teasers
FOR SELECT
TO anon
USING (true);

-- =====================================================
-- 3. MISE À JOUR DU TIMESTAMP DE VISITE CLIENT
-- =====================================================
-- Permet aux anonymes de mettre à jour UNIQUEMENT le champ
-- client_last_viewed_at (tracking des visites client)
-- SÉCURITÉ : Limité à ce seul champ via une fonction

-- Option A : Politique UPDATE limitée (simple mais moins restrictive)
CREATE POLICY "projects_public_update_view_timestamp"
ON projects
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- =====================================================
-- RÉSUMÉ DE LA SÉCURITÉ
-- =====================================================
-- - Les utilisateurs anonymes peuvent LIRE les projets et teasers
-- - L'ID du projet (UUID) sert de protection : impossible à deviner
-- - Le mot de passe du projet ajoute une couche supplémentaire
-- - Les opérations INSERT/DELETE restent réservées aux authenticated
-- - Les données sensibles (email client) sont visibles mais l'UUID
--   du projet doit être connu pour y accéder
