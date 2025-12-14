import React, { useState } from 'react';
import { Lock, ArrowRight, Activity, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { ClientAccessGateProps } from './types';

export const ClientAccessGate: React.FC<ClientAccessGateProps> = ({ project, onAccessGranted }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    setTimeout(() => {
        if (password === project.accessPassword) {
            onAccessGranted();
        } else {
            setError(true);
            setIsLoading(false);
        }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-dot-pattern font-sans flex flex-col items-center justify-center p-6 text-gray-900">
      
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in ring-1 ring-gray-100">
        <div className="p-8 text-center">
            
            <div className="w-12 h-12 bg-gray-50 text-black border border-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Lock size={20} strokeWidth={1.5}/>
            </div>

            <h1 className="text-lg font-bold text-gray-900 mb-1 tracking-tight">Espace Sécurisé</h1>
            <p className="text-gray-500 text-xs font-medium mb-8">
                <span className="text-gray-900 font-bold">{project.clientName}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(false); }}
                        placeholder="Mot de passe"
                        className={`w-full px-4 py-3 bg-white border rounded-md text-center text-base font-bold tracking-widest outline-none transition-all placeholder:font-medium placeholder:tracking-normal placeholder:text-gray-300
                            ${error 
                                ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                                : 'border-gray-200 text-gray-900 focus:border-black focus:ring-1 focus:ring-black'
                            }
                        `}
                        autoFocus
                    />
                </div>

                {error && (
                    <div className="flex items-center justify-center gap-2 text-red-600 text-[10px] font-bold animate-slide-up uppercase tracking-wide">
                        <AlertCircle size={12} strokeWidth={2.5}/> Mot de passe incorrect
                    </div>
                )}

                <Button 
                    type="submit" 
                    fullWidth 
                    isLoading={isLoading}
                    disabled={!password} 
                    variant="black"
                    className="!py-3"
                >
                    Accéder <ArrowRight size={16}/>
                </Button>
            </form>
        </div>
        
        <div className="bg-gray-50 p-3 border-t border-gray-100 text-center">
             <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <ShieldCheck size={12} strokeWidth={2}/>
                Secured by Peekit
             </div>
        </div>
      </div>

    </div>
  );
};
