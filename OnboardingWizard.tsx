import React, { useState } from 'react';
import { ArrowRight, Activity, Building2, User, Sparkles, Loader2, MapPin, Calendar, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { OnboardingWizardProps, Project } from './types';

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [studioName, setStudioName] = useState('');
  
  // Project Details
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectDate, setProjectDate] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [projectType, setProjectType] = useState('Mariage');
  
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

    const firstProject: Project = {
        id: Date.now().toString(),
        clientName: clientName,
        clientEmail: clientEmail,
        date: formattedDate, 
        location: projectLocation || 'Non spécifié',
        type: projectType,
        coverImage: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800',
        currentStage: 'secured',
        lastUpdate: "À l'instant",
        teasers: []
    };

    setTimeout(() => {
        onComplete(studioName, firstProject);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-dot-pattern flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Progress */}
      <div className="w-full max-w-md mb-8 flex justify-center gap-2">
        <div className={`h-1.5 w-12 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-black' : 'bg-gray-200'}`}></div>
        <div className={`h-1.5 w-12 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
        <div className={`h-1.5 w-12 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-black' : 'bg-gray-200'}`}></div>
      </div>

      <div className="w-full max-w-md bg-white border border-gray-200 shadow-sm rounded-xl p-8 relative">
        
        {/* Step 1: Studio Name */}
        {step === 1 && (
            <div className="animate-fade-in">
                <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-6 shadow-md">
                    <Building2 size={20} strokeWidth={1.5}/>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Configuration du Studio</h2>
                <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                    Quel est le nom de votre activité ou de votre agence ?
                </p>
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Nom du Studio</label>
                        <input 
                            autoFocus
                            type="text" 
                            value={studioName}
                            onChange={(e) => setStudioName(e.target.value)}
                            placeholder="Ex: Studio Lumière"
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md text-base font-medium focus:border-black focus:ring-1 focus:ring-black transition-all outline-none text-gray-900 placeholder:text-gray-300"
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Premier Projet</h2>
                <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                    Créez votre premier dossier client pour initialiser le dashboard.
                </p>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Client</label>
                            <input 
                                autoFocus
                                type="text" 
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Nom du client"
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Email</label>
                            <input 
                                type="email" 
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                                placeholder="email@client.com"
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Date</label>
                                <input 
                                    type="date" 
                                    value={projectDate}
                                    onChange={(e) => setProjectDate(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Lieu</label>
                                <input 
                                    type="text" 
                                    value={projectLocation}
                                    onChange={(e) => setProjectLocation(e.target.value)}
                                    placeholder="Ville"
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Type</label>
                            <select 
                                value={projectType}
                                onChange={(e) => setProjectType(e.target.value)}
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none appearance-none cursor-pointer"
                            >
                                <option value="Mariage">Mariage</option>
                                <option value="Shooting Mode">Shooting Mode</option>
                                <option value="Vidéo Publicitaire">Vidéo Publicitaire</option>
                                <option value="Identité Visuelle">Identité Visuelle</option>
                            </select>
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
                <div className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-brand-600/30">
                    <Sparkles size={24} strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Tout est prêt.</h2>
                <p className="text-gray-500 mb-8 text-sm font-medium leading-relaxed max-w-xs mx-auto">
                    Votre espace <strong className="text-gray-900">{studioName}</strong> est configuré.
                </p>
                <Button variant="black" fullWidth onClick={handleFinish} disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : "Accéder au Dashboard"}
                </Button>
            </div>
        )}

      </div>
      
      <div className="mt-8 flex items-center gap-2 text-gray-300 select-none">
        <Activity size={16} strokeWidth={2.5} />
        <span className="text-[10px] font-bold tracking-widest uppercase">Peekit</span>
      </div>
    </div>
  );
};
