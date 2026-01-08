import React, { useState, useEffect } from 'react';
import { Lock, AlertCircle, Check } from 'lucide-react';
import { Button } from './Button';
import { supabase } from '../supabaseClient';

interface ResetPasswordPageProps {
  onSuccess: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSuccess(true);

      // Rediriger vers le dashboard après 2 secondes
      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (err: any) {
      console.error('Erreur réinitialisation:', err);
      setError(err.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe.');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 w-full h-full bg-[#F9FAFB] font-sans">
        <div className="min-h-full flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6 animate-fade-in bg-white p-8 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-black border border-gray-100 mb-2">
              <Check size={24} strokeWidth={2.5} className="text-emerald-600"/>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Mot de passe modifié !</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Votre mot de passe a été mis à jour avec succès. Redirection en cours...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-[#F9FAFB] font-sans overflow-y-auto">
      <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none"></div>

      <div className="min-h-full flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-[420px] relative z-10 animate-fade-in">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-gray-900 text-white rounded-xl flex items-center justify-center shadow-lg shadow-gray-900/20 mb-6">
              <Lock size={24} strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Nouveau mot de passe
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Choisissez un nouveau mot de passe sécurisé.
            </p>
          </div>

          <div className="bg-white py-8 px-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:rounded-3xl sm:px-10 border border-gray-100 rounded-2xl">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium flex items-start gap-3 border border-red-100">
              <AlertCircle size={18} className="shrink-0 mt-0.5"/>
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="new-password" className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Nouveau mot de passe
              </label>
              <input
                id="new-password"
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm transition-all"
                placeholder="Minimum 6 caractères"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Confirmer le mot de passe
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm transition-all"
                placeholder="Confirmez votre mot de passe"
              />
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              variant="black"
              className="!rounded-xl h-11 text-sm shadow-lg shadow-gray-900/10"
            >
              Réinitialiser le mot de passe
            </Button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};
