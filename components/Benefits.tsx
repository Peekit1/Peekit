import React from 'react';
import { ShieldCheck, Sliders, Sparkles, Smartphone } from 'lucide-react';
import { Reveal } from './Reveal';

export const Benefits: React.FC = () => {
  return (
    <section className="py-20 md:py-24 bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 max-w-6xl">
        <Reveal>
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">Pourquoi les créatifs modernes l'adoptent</h2>
                <p className="text-gray-500 text-lg font-light">
                    Plus qu'un outil de suivi, une expérience qui valorise votre professionnalisme.
                </p>
            </div>
        </Reveal>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            
            {/* Card 1: Large - Stop Relances */}
            <div className="md:col-span-2 row-span-1 bg-gray-50 rounded-3xl p-8 border border-gray-100 relative overflow-hidden group hover:border-gray-200 transition-all duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-900 mb-4">
                        <ShieldCheck size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Stop aux relances incessantes</h3>
                        <p className="text-gray-500 leading-relaxed max-w-md">Anticipez les questions "C'est prêt quand ?". Vos clients vérifient le lien au lieu de vous appeler.</p>
                    </div>
                </div>
            </div>

            {/* Card 2: Square - Workflow */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center mb-6">
                        <Sliders size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">100% Modulable</h3>
                        <p className="text-sm text-gray-500">Ajoutez ou supprimez chaque étape selon vos besoins.</p>
                    </div>
                </div>
            </div>

            {/* Card 3: Square - Teasing */}
            <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden group flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-6">
                        <Sparkles size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-2">Teasing Visuel</h3>
                        <p className="text-sm text-gray-400">Dévoilez quelques images pour faire patienter vos clients.</p>
                    </div>
                </div>
            </div>

            {/* Card 4: Large - Client Experience (VISUEL SUPPRIMÉ) */}
            <div className="md:col-span-2 bg-gray-50 rounded-3xl p-8 border border-gray-100 relative overflow-hidden group hover:border-gray-200 transition-all duration-500">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-200/50 rounded-full blur-3xl -ml-16 -mb-16"></div>
                
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-900 mb-6">
                        <Smartphone size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Une expérience client premium</h3>
                        <p className="text-gray-500 leading-relaxed max-w-md">Offrez une interface mobile dédiée et sécurisée. Ils se sentent privilégiés.</p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};
