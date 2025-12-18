
import React, { useState } from 'react';
import { ArrowLeft, Mail, AlertCircle, Activity, Check } from 'lucide-react';
import { Button } from './Button';
import { AuthPageProps } from '../types';
import { supabase } from '../supabaseClient';

export const AuthPage: React.FC<AuthPageProps> = ({ onBack, onLogin, initialView = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialView === 'login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const getCleanErrorMessage = (err: any): string => {
    if (!err) return "Une erreur est survenue.";
    let msg = err.message || err.error_description || (typeof err === 'string' ? err : "Erreur technique");
    const lowerMsg = msg.toLowerCase();
    
    // Liste exhaustive de patterns pour les erreurs d'identification
    if (
        lowerMsg.includes("invalid login credentials") || 
        lowerMsg.includes("invalid_credentials") || 
        lowerMsg.includes("invalid credentials") ||
        err.status === 400 && lowerMsg.includes("credentials")
    ) {
         return "Email ou mot de passe incorrect. Veuillez vérifier vos accès.";
    }
    
    if (lowerMsg.includes("email not confirmed")) return "Veuillez confirmer votre adresse email.";
    if (lowerMsg.includes("already registered") || lowerMsg.includes("already_registered")) return "Cet email est déjà utilisé. Veuillez vous connecter.";
    if (lowerMsg.includes("password should be at least")) return "Le mot de passe est trop court (min 6 caractères).";
    
    return msg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShowConfirmationMessage(false);

    try {
        if (isLogin) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
        } else {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName
                    }
                }
            });

            if (error) throw error;
            
            if (data.user) {
                if (!data.session && data.user.identities && data.user.identities.length > 0) {
                     setShowConfirmationMessage(true);
                     setIsLoading(false);
                     return;
                } else if (data.user.identities && data.user.identities.length === 0) {
                     setError("Cet email est déjà utilisé. Essayez de vous connecter.");
                     setIsLoading(false);
                     return;
                } 
            }
        }
    } catch (err: any) {
        console.error('Erreur Auth:', err);
        setError(getCleanErrorMessage(err));
        setIsLoading(false); 
    }
  };

  if (showConfirmationMessage) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6 font-sans">
            <div className="max-w-md w-full text-center space-y-6 animate-fade-in bg-white p-8 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-black border border-gray-100 mb-2">
                    <Mail size={24} strokeWidth={1.5}/>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Vérifiez vos emails</h2>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Un lien de confirmation a été envoyé à <br/><span className="text-gray-900 font-bold">{email}</span>.
                    </p>
                </div>
                <Button variant="outline" onClick={() => { setShowConfirmationMessage(false); setIsLogin(true); }} className="mx-auto w-full rounded-xl h-12">
                    Retour à la connexion
                </Button>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-center py-12 px-6 sm:px-6 lg:px-8 bg-[#F9FAFB] font-sans relative overflow-hidden">
      
      <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none"></div>
      
      <button 
        onClick={onBack} 
        className="absolute top-8 left-8 text-gray-400 hover:text-black flex items-center gap-2 text-xs font-bold transition-colors uppercase tracking-wider group z-20"
      >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Retour
      </button>

      <div className="sm:mx-auto sm:w-full sm:max-w-[420px] relative z-10 animate-fade-in">
        
        <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-gray-900 text-white rounded-xl flex items-center justify-center shadow-lg shadow-gray-900/20 mb-6">
                <Activity size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {isLogin ? 'Bon retour parmi nous' : 'Créer un compte'}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
                {isLogin ? 'Entrez vos identifiants pour accéder au studio.' : 'Commencez à gérer vos projets sereinement.'}
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
                {!isLogin && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                                Prénom
                            </label>
                            <input
                                id="firstName"
                                type="text"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="appearance-none block w-full px-3 py-2.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                                Nom
                            </label>
                            <input
                                id="lastName"
                                type="text"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="appearance-none block w-full px-3 py-2.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm transition-all"
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        Adresse email
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full px-3 py-2.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm transition-all"
                            placeholder="vous@exemple.com"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                            Mot de passe
                        </label>
                        {isLogin && (
                            <div className="text-xs">
                                <a href="#" className="font-medium text-gray-500 hover:text-gray-900 transition-colors">
                                    Oublié ?
                                </a>
                            </div>
                        )}
                    </div>
                    <div className="mt-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none block w-full px-3 py-2.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div>
                    <Button 
                        type="submit" 
                        fullWidth 
                        isLoading={isLoading} 
                        variant="black" 
                        className="!rounded-xl h-11 text-sm shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20"
                    >
                        {isLogin ? 'Se connecter' : "S'inscrire"}
                    </Button>
                </div>
            </form>

            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-400 text-xs uppercase tracking-wider font-medium">
                            {isLogin ? "Nouveau ici ?" : "Déjà un compte ?"}
                        </span>
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(null); }}
                        className="text-sm font-bold text-gray-900 hover:text-black hover:underline transition-all"
                    >
                        {isLogin ? "Créer un compte gratuitement" : "Se connecter"}
                    </button>
                </div>
            </div>
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-8">
            &copy; {new Date().getFullYear()} Peekit. Sécurisé et chiffré.
        </p>
      </div>
    </div>
  );
};
