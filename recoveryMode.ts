// =====================================================
// DETECTION DU MODE RECOVERY AVANT SUPABASE
// =====================================================
// Ce fichier DOIT être importé AVANT supabaseClient.ts
// car Supabase nettoie automatiquement le hash URL lors
// de son initialisation, ce qui empêche notre code de
// détecter le paramètre type=recovery.

const RECOVERY_KEY = 'peekit_recovery_mode';

// Capture immédiate du hash avant que Supabase ne le nettoie
const initialHash = window.location.hash;

// Détection du mode recovery dans le hash
if (initialHash.includes('type=recovery')) {
  sessionStorage.setItem(RECOVERY_KEY, 'true');
  console.log('[RecoveryMode] Mode recovery détecté et sauvegardé');
}

/**
 * Vérifie si on est en mode recovery (reset password)
 * Cette fonction doit être appelée pour déterminer si on
 * doit afficher la page de reset password.
 */
export function isInRecoveryMode(): boolean {
  return sessionStorage.getItem(RECOVERY_KEY) === 'true';
}

/**
 * Efface le mode recovery après que l'utilisateur a
 * réinitialisé son mot de passe avec succès.
 */
export function clearRecoveryMode(): void {
  sessionStorage.removeItem(RECOVERY_KEY);
  console.log('[RecoveryMode] Mode recovery effacé');
}

/**
 * Force le mode recovery (utile pour les tests)
 */
export function forceRecoveryMode(): void {
  sessionStorage.setItem(RECOVERY_KEY, 'true');
}
