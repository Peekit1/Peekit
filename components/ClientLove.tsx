
import React from 'react';
import { Reveal } from './Reveal';

export const Problem: React.FC = () => {
  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="space-y-32">
            
            {/* SOUS-HERO */}
            <Reveal>
                <div className="max-w-3xl">
                    <p className="text-2xl md:text-4xl font-medium text-gray-900 leading-tight tracking-tight">
                        Aujourd’hui, les créatifs les plus exigeants ne se contentent plus de livrer un résultat final. <br/><br/>
                        Ils soignent <span className="text-gray-400 italic">l’expérience</span> tout au long du projet.
                    </p>
                    <p className="mt-8 text-lg text-gray-500 font-light">
                        Peekit est conçu pour ça.
                    </p>
                </div>
            </Reveal>

            {/* LA PROMESSE */}
            <div className="grid lg:grid-cols-2 gap-16 items-start">
                <Reveal>
                    <div className="space-y-6">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">La Promesse</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tighter">Votre processus mérite d’être perçu.</h2>
                    </div>
                </Reveal>
                
                <Reveal delay={200}>
                    <div className="space-y-8 text-gray-500 text-lg font-light leading-relaxed">
                        <p>
                            Chaque projet créatif traverse plusieurs étapes. Certaines sont visibles. D’autres se construisent dans le temps.
                        </p>
                        <p>
                            Peekit permet de présenter ce chemin de manière claire, continue et maîtrisée — <span className="text-gray-900 font-normal">sans entrer dans les détails techniques, sans exposer vos méthodes.</span>
                        </p>
                    </div>
                </Reveal>
            </div>

        </div>
      </div>
    </section>
  );
};
