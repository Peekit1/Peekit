import React, { useState } from 'react';
import { ArrowRight, Activity, Building2, User, Sparkles, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { OnboardingWizardProps, Project } from '../types';

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [studioName, setStudioName] = useState('');
  
  // Project Details
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectDate, setProjectDate] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [projectType, setProjectType] = useState('Mariage');
  const [projectExpectedDate, setProjectExpectedDate] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (step === 1 && studioName) setStep(2);
    if (step === 2 && clientName && clientEmail && projectDate) setStep(3);
  };

  const handleFinish = () => {
    setIsLoading(true);
    
    // Format date to French long format (e.g. "30 avril 2025")
    let formattedDate = projectDate;
    if (projectDate) {
        const [year, month, day] = projectDate.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        formattedDate = dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    // Format expected date if present
    let formattedExpectedDate = projectExpectedDate;
    if (projectExpectedDate) {
        const [year, month, day] = projectExpectedDate.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        formattedExpectedDate = dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    const firstProject: Project = {
        id: Date.now().toString(),
        userId: '', // Placeholder, correctly assigned in App.tsx handleCreateProject
        clientName: clientName,
        clientEmail: clientEmail,
        date: formattedDate, 
        location: projectLocation || 'Non spécifié',
        type: projectType,
        coverImage: '', // No default image
        currentStage: 'secured',
        lastUpdate: "À l'instant",
        expectedDeliveryDate: formattedExpectedDate,
        teasers: []
    };

    setTimeout(() => {
        onComplete(studioName, firstProject);
    }, 1500);
  };

  return (
    <div className="min-h-[100dvh] bg-dot-pattern flex flex-col items-center justify-center p-4 sm:p-6 font-sans overflow-y-auto">
      
      {/* Progress */}
      <div className="w-full max-w-md mb-8 flex justify-center gap-2 shrink-0">
        <div className={`h-1.5 w-12 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-black' : 'bg-gray-200'}`}></div>
        <div className={`h-1.5 w-12 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
        <div className={`h-1.5 w-12 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-black' : 'bg-gray-200'}`}></div>
      </div>

      <div className="w-full max-w-md bg-white border border-gray-200 shadow-sm rounded-xl p-6 sm:p-8 relative">
        
        {/* Step 1: Studio Name */}
        {step === 1 && (
            <div className="animate-fade-in">
                <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-6 shadow-md">
                    <Building2 size={20} strokeWidth={1.5}/>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Bienvenue dans votre Studio</h2>
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

        {/* Step 2: First Project */}
        {step === 2 && (
            <div className="animate-fade-in">
                 <div className="w-12 h-12 bg-white text-gray-900 border border-gray-200 rounded-lg flex items-center justify-center mb-6 shadow-sm">
                    <User size={20} strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Initialisons votre espace</h2>
                <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                    Ajoutez un premier projet pour voir la magie opérer.
                </p>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Nom du Client</label>
                            <input 
                                autoFocus
                                type="text" 
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Ex: Sophie & Marc"
                                className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Email de contact</label>
                            <input 
                                type="email" 
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                                placeholder="email@client.com"
                                className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"
                            />
                        </div>
                        
                        {/* FIX: h-11 and appearance-none applied to date/select inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Date</label>
                                <input 
                                    type="date" 
                                    value={projectDate}
                                    onChange={(e) => setProjectDate(e.target.value)}
                                    className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Lieu</label>
                                <input 
                                    type="text" 
                                    value={projectLocation}
                                    onChange={(e) => setProjectLocation(e.target.value)}
                                    placeholder="Ville"
                                    className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Type</label>
                                <select 
                                    value={projectType}
                                    onChange={(e) => setProjectType(e.target.value)}
                                    className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none appearance-none cursor-pointer"
                                >
                                    <option value="Mariage">Mariage</option>
                                    <option value="Shooting Mode">Shooting Mode</option>
                                    <option value="Vidéo Publicitaire">Vidéo Publicitaire</option>
                                    <option value="Identité Visuelle">Identité Visuelle</option>
                                    <option value="Corporate">Corporate</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Rendu Estimé</label>
                                <input 
                                    type="date" 
                                    value={projectExpectedDate}
                                    onChange={(e) => setProjectExpectedDate(e.target.value)}
                                    className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"
                                />
                            </div>
                        </div>
                    </div>
                    <Button variant="black" fullWidth onClick={handleNext} disabled={!clientName || !clientEmail || !projectDate} className="mt-4">
                        Créer le projet <ArrowRight size={16} />
                    </Button>
                </div>
            </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
            <div className="animate-fade-in text-center py-6">
                <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-gray-900/20">
                    <Sparkles size={24} strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">L'expérience commence.</h2>
                <p className="text-gray-500 mb-8 text-sm font-medium leading-relaxed max-w-xs mx-auto">
                    Votre dashboard <strong className="text-gray-900">{studioName}</strong> est prêt à être utilisé.
                </p>
                <Button variant="black" fullWidth onClick={handleFinish} disabled={isLoading}>
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
