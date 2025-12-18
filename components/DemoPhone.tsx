import React, { useState, useEffect } from 'react';
import { CheckCircle2, Activity, Calendar, MapPin, Package, Sparkles } from 'lucide-react';

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
    <div className="relative mx-auto bg-gray-900 rounded-[2.5rem] sm:rounded-[3rem] h-[500px] w-[260px] sm:h-[640px] sm:w-[320px] shadow-2xl flex flex-col overflow-hidden ring-4 sm:ring-8 ring-gray-900/20 transition-all duration-300">
      
      {/* Screen Content - Client View Replica */}
      <div className="bg-gray-50 w-full h-full pt-8 sm:pt-10 pb-6 overflow-hidden flex flex-col font-sans rounded-[2rem] sm:rounded-[2.5rem]">
        
        {/* Notch Area */}
        <div className="absolute top-0 inset-x-0 h-6 sm:h-7 bg-gray-900 z-20 w-28 sm:w-36 mx-auto rounded-b-xl sm:rounded-b-2xl"></div>

        {/* HEADER REPLICA */}
        <div className="bg-white border-b border-gray-200 h-10 sm:h-12 flex items-center justify-between px-4 sm:px-5 shrink-0 z-10">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-900 rounded-md flex items-center justify-center text-white shadow-sm">
                    <Activity size={8} className="sm:hidden" strokeWidth={2.5}/>
                    <Activity size={10} className="hidden sm:block" strokeWidth={2.5}/>
                </div>
                <span className="font-bold text-[10px] sm:text-xs tracking-tight text-gray-900">Peekit</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-hidden p-3 sm:p-4 space-y-3 sm:space-y-4">
            
            {/* PROJECT CARD REPLICA */}
            <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                    <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[7px] sm:text-[8px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Package size={8} strokeWidth={2}/> Branding
                    </span>
                    <div className="h-2 w-px bg-gray-200"></div>
                    <span className="flex items-center gap-1 text-[7px] sm:text-[8px] font-bold uppercase tracking-wider text-gray-400">
                        <MapPin size={8} strokeWidth={2}/> Paris
                    </span>
                </div>
                
                <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight mb-2">
                    Bloom Coffee
                </h1>
                
                <div className="flex items-center justify-between mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-50">
                    <div className="text-[7px] sm:text-[8px] font-bold text-gray-400 uppercase tracking-widest">Avancement</div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900">{activeStep * 25}%</div>
                </div>
                
                <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gray-900 rounded-full transition-all duration-700 ease-out" 
                        style={{ width: `${activeStep * 25}%` }}
                    ></div>
                </div>
            </div>

            {/* STATUS MESSAGE CARD */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-2.5 sm:p-3 flex items-start gap-2 sm:gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white text-indigo-600 rounded-lg flex items-center justify-center shrink-0 border border-indigo-100 shadow-sm">
                    <Sparkles size={10} strokeWidth={2}/>
                </div>
                <div>
                    <h3 className="text-[9px] sm:text-[10px] font-bold text-indigo-900 mb-0.5">En cours</h3>
                    <p className="text-[8px] sm:text-[9px] text-indigo-700 leading-tight font-medium">
                        Nous travaillons sur les pistes créatives.
                    </p>
                </div>
            </div>

            {/* TIMELINE REPLICA */}
            <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <h3 className="font-bold text-gray-900 text-[9px] sm:text-[10px] uppercase tracking-widest mb-3 sm:mb-4 pb-2 border-b border-gray-50">
                    Historique
                </h3>

                <div className="space-y-0 relative pl-1">
                    {/* Vertical Line */}
                    <div className="absolute left-[14px] sm:left-[18px] top-2 bottom-2 w-px bg-gray-100 -z-0"></div>

                    {steps.map((step, index) => {
                        const isCompleted = step.status === 'completed';
                        const isCurrent = step.status === 'current';
                        
                        return (
                            <div key={index} className="flex items-center gap-2.5 sm:gap-3 py-1.5 sm:py-2 relative z-10">
                                <div className={`
                                    w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg flex items-center justify-center border shrink-0 transition-all duration-300
                                    ${isCompleted ? 'border-gray-900 bg-gray-900 text-white' : 
                                      isCurrent ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm scale-110' : 
                                      'border-gray-100 text-gray-300 bg-white'}
                                `}>
                                    {isCompleted ? <CheckCircle2 size={10} strokeWidth={2} className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : 
                                     isCurrent ? <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-indigo-600 animate-pulse"/> : 
                                     <div className="w-1 h-1 rounded-full bg-gray-100"/>}
                                </div>
                                <span className={`text-[9px] sm:text-[10px] font-bold tracking-tight ${isCurrent ? 'text-indigo-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
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