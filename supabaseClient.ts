import { createClient } from '@supabase/supabase-js';

// ==========================================
// ⚠️ DÉTECTION PRÉCOCE DU MODE RECOVERY
// Ce code s'exécute avant la création du client Supabase
// ==========================================
(function detectRecoveryModeEarly() {
  const hash = window.location.hash || '';
  const search = window.location.search || '';

  // Vérifier si c'est un lien de récupération de mot de passe
  if (hash.includes('type=recovery') || search.includes('type=recovery')) {
    sessionStorage.setItem('peekit_recovery_mode', 'true');
    console.log('[SupabaseClient] ✅ Mode recovery détecté et sauvegardé AVANT création client');
  }
})();

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

// Création du client Supabase avec configuration auth explicite
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  }
});

// ==========================================
// ⚠️ LISTENER PRÉCOCE POUR PASSWORD_RECOVERY
// Ce listener s'exécute IMMÉDIATEMENT après la création du client
// pour capturer l'événement PASSWORD_RECOVERY avant React
// ==========================================
supabase.auth.onAuthStateChange((event, _session) => {
  if (event === 'PASSWORD_RECOVERY') {
    sessionStorage.setItem('peekit_recovery_mode', 'true');
    console.log('[SupabaseClient] ✅ PASSWORD_RECOVERY event capturé par listener précoce!');
  }
});

// Export des variables pour usage externe si nécessaire
export { supabaseUrl, supabaseAnonKey };
