import React, { useState } from 'react';
import { ArrowRight, Activity, Building2, Sparkles, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { OnboardingWizardProps } from '../types';

// Adaptez l'interface si elle est définie dans types.ts, ou laissez TypeScript déduire
// Si besoin, modifiez dans types.ts : onComplete: (name: string) => Promise<void>;

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [studioName, setStudioName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (step === 1 && studioName) setStep(2);
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
        // On renvoie UNIQUEMENT le nom du studio
        await onComplete(studioName);
    } catch (error) {
        console.error("Erreur Onboarding:", error);
        setIsLoading(false);
        const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
        alert(`Erreur lors de la création : ${message}`);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-dot-pattern flex flex-col items-center justify-center p-4 sm:p-6 font-sans overflow-y-auto">
      
      {/* Progress (2 étapes seulement maintenant) */}
      <div className="w-full max-w-md mb-8 flex justify-center gap-2 shrink-0">
        <div className={`h-1.5 w-12 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-black' : 'bg-gray-200'}`}></div>
        <div className={`h-1.5 w-12 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
      </div>

      <div className="w-full max-w-md bg-white border border-gray-200 shadow-sm rounded-xl p-6 sm:p-8 relative">
        
        {/* Step 1: Studio Name */}
        {step === 1 && (
            <div className="animate-fade-in">
                <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-6 shadow-md">
                    <Building2 size={20} strokeWidth={1.5}/>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Bienvenue dans votre espace</h2>
                <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                    Commençons par le commencement. Quel est le nom de votre structure ?
                </p>
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Nom de l'activité</label>
                        <input 
                            autoFocus
                            type="text" 
                            value={studioName}
                            onChange={(e) => setStudioName(e.target.value)}
                            placeholder="Ex: Studio Nova, Agence Aura..."
                            className="w-full h-11 px-4 bg-white border border-gray-200 rounded-md text-base font-medium focus:border-black focus:ring-1 focus:ring-black transition-all outline-none text-gray-900 placeholder:text-gray-300 appearance-none"
                            onKeyDown={(e) => e.key === 'Enter' && studioName && handleNext()}
                        />
                    </div>
                    <Button variant="black" fullWidth onClick={handleNext} disabled={!studioName}>
                        Continuer <ArrowRight size={16} />
                    </Button>
                </div>
            </div>
        )}

        {/* Step 2: Success (Anciennement Step 3) */}
        {step === 2 && (
            <div className="animate-fade-in text-center py-6">
                <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-gray-900/20">
                    <Sparkles size={24} strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">L'expérience commence.</h2>
                <p className="text-gray-500 mb-8 text-sm font-medium leading-relaxed max-w-xs mx-auto">
                    Votre dashboard <strong className="text-gray-900">{studioName}</strong> est prêt à être utilisé.
                </p>
                
                <Button type="button" variant="black" fullWidth onClick={handleFinish} disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : "Accéder au Dashboard"}
                </Button>
            </div>
        )}

      </div>
      
      <div className="mt-8 flex items-center gap-2 text-gray-300 select-none shrink-0">
        <Activity size={16} strokeWidth={2.5} />
        <span className="text-[10px] font-bold tracking-widest uppercase">Peekit</span>
      </div>
    </div>
  );
};
