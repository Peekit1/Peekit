
import React from 'react';
import { Sliders, Eye, Heart, ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';

export const Solution: React.FC = () => {
  return (
    <section id="concept" className="py-20 md:py-24 bg-white border-b border-gray-100">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* HEADER */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
            <Reveal>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-[11px] font-bold text-gray-900 uppercase tracking-widest mb-6">
                    La Philosophie
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                    Faites de l'attente <br/> le meilleur moment.
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed font-light">
                    Entre le shooting et la livraison, il ne doit pas y avoir de silence. 
                    Peekit crée un pont invisible mais rassurant entre votre travail de l'ombre et l'impatience de votre client.
                </p>
            </Reveal>
        </div>

        {/* 3 PILLARS GRID */}
        <div className="grid md:grid-cols-3 gap-8">
            
            {/* CARD 1: THE STUDIO */}
            <Reveal delay={100} className="h-full">
                <div className="group h-full p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all duration-300 flex flex-col relative overflow-hidden">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-900 mb-6 border border-gray-200 shadow-sm group-hover:scale-110 transition-transform duration-500">
                        <Sliders size={22} strokeWidth={1.5}/>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Vous pilotez.</h3>
                    <p className="text-gray-500 leading-relaxed text-sm flex-1">
                        Un dashboard simple pour gérer vos workflows. Ajoutez des étapes, supprimez-en, uploadez des teasers. C'est votre espace de contrôle, invisible pour le client.
                    </p>
                    <div className="mt-8 pt-6 border-t border-gray-200/50 flex items-center text-xs font-bold text-gray-900 uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">
                        Côté Admin <ArrowRight size={12} className="ml-2"/>
                    </div>
                </div>
            </Reveal>

            {/* CARD 2: THE CLIENT */}
            <Reveal delay={200} className="h-full">
                <div className="group h-full p-8 rounded-3xl bg-gray-900 text-white shadow-xl shadow-gray-200 transition-all duration-300 flex flex-col relative overflow-hidden transform md:-translate-y-4">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-colors"></div>
                    
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6 border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
                            <Eye size={22} strokeWidth={1.5}/>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Ils suivent.</h3>
                        <p className="text-gray-400 leading-relaxed text-sm flex-1">
                            Une vue simplifiée, accessible via un lien unique sécurisé. Pas de compte à créer, pas de jargon technique. Juste une barre de progression et vos médias.
                        </p>
                        <div className="mt-8 pt-6 border-t border-white/10 flex items-center text-xs font-bold text-white uppercase tracking-widest">
                            Vue Client <ArrowRight size={12} className="ml-2"/>
                        </div>
                    </div>
                </div>
            </Reveal>

            {/* CARD 3: THE FEELING */}
            <Reveal delay={300} className="h-full">
                <div className="group h-full p-8 rounded-3xl bg-white border border-gray-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/50 transition-all duration-300 flex flex-col relative overflow-hidden">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 border border-indigo-100 group-hover:scale-110 transition-transform duration-500">
                        <Heart size={22} strokeWidth={1.5}/>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">La magie opère.</h3>
                    <p className="text-gray-500 leading-relaxed text-sm flex-1">
                        L'inquiétude disparaît. Le client se sent impliqué et valorisé. Vous transformez un temps mort ("J'attends mes photos") en un moment fort ("Regarde ce teasing !").
                    </p>
                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center text-xs font-bold text-indigo-600 uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">
                        Résultat <ArrowRight size={12} className="ml-2"/>
                    </div>
                </div>
            </Reveal>

        </div>
      </div>
    </section>
  );
};
