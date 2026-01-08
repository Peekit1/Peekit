// =====================================================
// DETECTION DU MODE RECOVERY POUR RESET PASSWORD
// =====================================================
// La capture du hash se fait dans index.html AVANT le chargement
// de React/Supabase. Ce fichier expose simplement les fonctions
// pour lire et effacer l'état stocké dans sessionStorage.

const RECOVERY_KEY = 'peekit_recovery_mode';

/**
 * Vérifie si on est en mode recovery (reset password)
 * Le flag est défini par le script inline dans index.html
 * qui s'exécute AVANT que Supabase ne nettoie le hash URL.
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
