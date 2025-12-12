import React, { useState, useEffect } from 'react';
import { CheckCircle2, Activity, MapPin, Package, Sparkles } from 'lucide-react';

export const DemoPhone: React.FC = () => {
  const [activeStep, setActiveStep] = useState(2);

  // Auto-animate progress for the demo
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < 3 ? prev + 1 : 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { label: "Brief / Sécurisation", status: activeStep > 0 ? 'completed' : 'current' },
    { label: "Recherches / Moodboard", status: activeStep > 1 ? 'completed' : activeStep === 1 ? 'current' : 'pending' },
    { label: "Création / Design", status: activeStep > 2 ? 'completed' : activeStep === 2 ? 'current' : 'pending' },
    { label: "Livraison", status: 'pending' },
  ];

  return (
    // J'ai réduit les dimensions ici (h, w, sm:h, sm:w) et les arrondis (rounded)
    <div className="relative mx-auto bg-gray-900 rounded-[2rem] sm:rounded-[2.5rem] h-[420px] w-[210px] sm:h-[520px] sm:w-[260px] shadow-2xl flex flex-col overflow-hidden ring-4 ring-gray-900/20 transition-all duration-300">
      
      {/* Screen Content - Client View Replica */}
      <div className="bg-gray-50 w-full h-full pt-6 sm:pt-8 pb-4 overflow-hidden flex flex-col font-sans rounded-[1.7rem] sm:rounded-[2.2rem]">
        
        {/* Notch Area */}
        <div className="absolute top-0 inset-x-0 h-5 sm:h-6 bg-gray-900 z-20 w-24 sm:w-28 mx-auto rounded-b-lg sm:rounded-b-xl"></div>

        {/* HEADER REPLICA */}
        <div className="bg-white border-b border-gray-200 h-8 sm:h-10 flex items-center justify-between px-3 sm:px-4 shrink-0 z-10">
            <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gray-900 rounded flex items-center justify-center text-white shadow-sm">
                    <Activity size={8} strokeWidth={2.5}/>
                </div>
                <span className="font-bold text-[9px] sm:text-[10px] tracking-tight text-gray-900">Peekit</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-hidden p-2.5 sm:p-3 space-y-2.5 sm:space-y-3">
            
            {/* PROJECT CARD REPLICA */}
            <div className="bg-white border border-gray-200 rounded-lg p-2.5 sm:p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[6px] sm:text-[7px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Package size={6} strokeWidth={2}/> Branding
                    </span>
                    <div className="h-2 w-px bg-gray-200"></div>
                    <span className="flex items-center gap-1 text-[6px] sm:text-[7px] font-bold uppercase tracking-wider text-gray-400">
                        <MapPin size={6} strokeWidth={2}/> Paris
                    </span>
                </div>
                
                <h1 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight mb-1.5">
                    Bloom Coffee
                </h1>
                
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                    <div className="text-[6px] sm:text-[7px] font-bold text-gray-400 uppercase tracking-widest">Avancement</div>
                    <div className="text-[10px] sm:text-xs font-bold text-gray-900">{activeStep * 25}%</div>
                </div>
                
                <div className="mt-1.5 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gray-900 rounded-full transition-all duration-700 ease-out" 
                        style={{ width: `${activeStep * 25}%` }}
                    ></div>
                </div>
            </div>

            {/* STATUS MESSAGE CARD */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2 sm:p-2.5 flex items-start gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white text-indigo-600 rounded flex items-center justify-center shrink-0 border border-indigo-100 shadow-sm">
                    <Sparkles size={8} strokeWidth={2}/>
                </div>
                <div>
                    <h3 className="text-[8px] sm:text-[9px] font-bold text-indigo-900 mb-0.5">En cours</h3>
                    <p className="text-[7px] sm:text-[8px] text-indigo-700 leading-tight font-medium">
                        Nous travaillons sur les pistes créatives.
                    </p>
                </div>
            </div>

            {/* TIMELINE REPLICA */}
            <div className="bg-white border border-gray-200 rounded-lg p-2.5 sm:p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <h3 className="font-bold text-gray-900 text-[8px] sm:text-[9px] uppercase tracking-widest mb-2 sm:mb-3 pb-1.5 border-b border-gray-50">
                    Historique
                </h3>

                <div className="space-y-0 relative pl-1">
                    {/* Vertical Line */}
                    <div className="absolute left-[9px] sm:left-[11px] top-2 bottom-2 w-px bg-gray-100 -z-0"></div>

                    {steps.map((step, index) => {
                        const isCompleted = step.status === 'completed';
                        const isCurrent = step.status === 'current';
                        
                        return (
                            <div key={index} className="flex items-center gap-2 py-1 relative z-10">
                                <div className={`
                                    w-4 h-4 sm:w-5 sm:h-5 rounded sm:rounded-md flex items-center justify-center border shrink-0 transition-all duration-300
                                    ${isCompleted ? 'border-gray-900 bg-gray-900 text-white' : 
                                      isCurrent ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm scale-110' : 
                                      'border-gray-100 text-gray-300 bg-white'}
                                `}>
                                    {isCompleted ? <CheckCircle2 size={8} strokeWidth={2} /> : 
                                     isCurrent ? <div className="w-1 h-1 rounded-full bg-indigo-600 animate-pulse"/> : 
                                     <div className="w-1 h-1 rounded-full bg-gray-100"/>}
                                </div>
                                <span className={`text-[8px] sm:text-[9px] font-bold tracking-tight ${isCurrent ? 'text-indigo-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};
