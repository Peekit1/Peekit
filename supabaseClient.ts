import { createClient } from '@supabase/supabase-js';

// ✅ SÉCURISÉ : Utilisation des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérification que les variables sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Configuration Supabase manquante. ' +
    'Vérifiez que VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définis dans .env.local'
  );
}

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export des variables pour usage externe si nécessaire
export { supabaseUrl, supabaseAnonKey };
