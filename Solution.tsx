import React from 'react';
import { Smartphone, Zap, Activity } from 'lucide-react';
import { DemoPhone } from './DemoPhone';
import { Reveal } from './Reveal';

export const Solution: React.FC = () => {
  return (
    <section id="concept" className="py-16 md:py-24 bg-white overflow-hidden border-b border-gray-100">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            <div className="lg:w-1/2">
                <Reveal>
                    <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wide mb-6">
                        La solution Peekit
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">Transformez l'attente en excitation.</h2>
                    <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                        Ne dites plus "ça avance". Montrez-le. Peekit génère un lien de suivi client unique pour chaque projet. Vos clients voient l'avancement en temps réel, sans jamais vous déranger.
                    </p>
                </Reveal>
                
                <div className="space-y-8">
                    {[
                        { icon: Smartphone, title: "Visibilité Totale", text: "Un lien unique sécurisé accessible sans création de compte pour vos clients." },
                        { icon: Zap, title: "Effet Dopamine", text: "Chaque étape validée notifie le client. Il voit que ça bouge." },
                        { icon: Activity, title: "Teasing & Validation", text: "Partagez des aperçus (images/vidéos) pour maintenir l'excitation." }
                    ].map((item, idx) => (
                        <Reveal key={idx} delay={idx * 150}>
                            <div className="flex gap-5">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 text-gray-900">
                                    <item.icon size={20} strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>

            <div className="lg:w-1/2 flex justify-center lg:justify-end">
                <Reveal className="w-full flex justify-center" delay={300}>
                    {/* Rotation fluide au survol sans flottaison permanente */}
                    <div className="transition-transform duration-700 ease-out hover:rotate-3 transform origin-center cursor-default">
                        <DemoPhone />
                    </div>
                </Reveal>
            </div>

        </div>
      </div>
    </section>
  );
};