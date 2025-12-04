
import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Activity, Loader2, AlertCircle, User, CheckCircle2, ChevronRight } from 'lucide-react';
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
                     setError("Cet email est déjà utilisé.");
                     setIsLoading(false);
                     return;
                } 
            }
        }
    } catch (err: any) {
        console.error('Erreur Auth:', err);
        let msg = err.message || "Une erreur est survenue.";
        if (msg.includes("Email not confirmed")) {
             msg = "Veuillez confirmer votre adresse email avant de vous connecter.";
        } else if (msg.includes("Invalid login credentials")) {
             msg = "Email ou mot de passe incorrect.";
        }
        setError(msg);
        setIsLoading(false); 
    }
  };

  if (showConfirmationMessage) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-dot-pattern p-6 font-sans">
            <div className="max-w-md w-full text-center space-y-6 animate-fade-in bg-white p-10 rounded-2xl shadow-xl border border-gray-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100 ring-4 ring-emerald-50/50">
                    <Mail size={28} strokeWidth={1.5}/>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Vérifiez vos emails</h2>
                    <p className="text-gray-500 font-medium leading-relaxed text-sm">
                        Un lien de confirmation a été envoyé à <span className="text-gray-900 font-bold">{email}</span>.
                        <br/>Cliquez dessus pour activer votre compte.
                    </p>
                </div>
                <Button variant="outline" onClick={() => { setShowConfirmationMessage(false); setIsLogin(true); }} className="mx-auto w-full h-12 rounded-xl">
                    Retour à la connexion
                </Button>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] bg-dot-pattern p-4 sm:p-6 font-sans relative">
      
      {/* Background Gradient Spot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-900 flex items-center gap-2 text-xs font-bold transition-colors group uppercase tracking-wider bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Retour
        </button>
      </div>

      <div className="w-full max-w-[400px] relative z-10 animate-slide-up">
        
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center mb-4 shadow-xl shadow-gray-200 ring-4 ring-white">
                <Activity size={24} strokeWidth={2}/>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {isLogin ? 'Connexion' : 'Créer un compte'}
            </h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">
                {isLogin ? 'Accédez à votre espace de gestion.' : 'Rejoignez les studios qui performent.'}
            </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-[0_2px_40px_-12px_rgba(0,0,0,0.08)] border border-gray-200 p-6 sm:p-8">
            
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold flex items-start gap-3 border border-red-100 mb-6">
                    <AlertCircle size={16} className="shrink-0 mt-0.5"/>
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest" htmlFor="firstName">Prénom</label>
                            <input 
                                id="firstName" 
                                required 
                                type="text" 
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm transition-all focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-gray-900 placeholder:text-gray-300"
                                placeholder="Jean"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest" htmlFor="lastName">Nom</label>
                            <input 
                                id="lastName" 
                                required 
                                type="text" 
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm transition-all focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-gray-900 placeholder:text-gray-300"
                                placeholder="Dupont"
                            />
                        </div>
                    </div>
                )}
                
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest" htmlFor="email">Email pro</label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3 top-2.5 text-gray-400"/>
                        <input 
                            id="email" 
                            required 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nom@studio.com" 
                            className="w-full h-10 pl-9 pr-4 bg-white border border-gray-200 rounded-lg text-sm transition-all focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-gray-900 placeholder:text-gray-300"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest" htmlFor="password">Mot de passe</label>
                        {isLogin && (
                            <a href="#" className="text-[10px] font-bold text-gray-400 hover:text-gray-900 transition-colors">Oublié ?</a>
                        )}
                    </div>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-2.5 text-gray-400"/>
                        <input 
                            id="password" 
                            required 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••" 
                            className="w-full h-10 pl-9 pr-4 bg-white border border-gray-200 rounded-lg text-sm transition-all focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-gray-900 placeholder:text-gray-300"
                        />
                    </div>
                </div>

                <Button variant="black" type="submit" fullWidth size="lg" className="mt-2 rounded-xl h-11 shadow-lg shadow-gray-200 hover:shadow-gray-300 hover:-translate-y-0.5 transition-all font-bold" isLoading={isLoading}>
                    {isLogin ? 'Accéder au Dashboard' : "Créer mon compte"}
                </Button>
            </form>
        </div>

        {/* Footer Toggle */}
        <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 font-medium">
                {isLogin ? "Pas encore de compte ?" : "Vous avez déjà un compte ?"}
            </p>
            <button 
                onClick={() => { setIsLogin(!isLogin); setError(null); }} 
                className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors group"
            >
                {isLogin ? "Créer un compte maintenant" : "Se connecter"}
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform"/>
            </button>
        </div>

        <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Système Sécurisé par Peekit
            </div>
        </div>

      </div>
    </div>
  );
};
