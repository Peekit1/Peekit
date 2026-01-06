import React from 'react';
import { Reveal } from './Reveal';

export const Solution: React.FC = () => {
  return (
    // MODIFICATION ICI : 
    // py-12 pour mobile (48px)
    // md:py-24 pour desktop (96px, conservation de l'espace d'origine)
    <section className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* MODIFICATION ICI :
            gap-10 (40px) sur mobile pour éviter un grand vide entre le texte et la carte
            lg:gap-20 (80px) sur desktop pour l'aération
        */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            
            <Reveal>
                <div className="space-y-8">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tighter">
                        Partager une progression, pas une charge mentale.
                    </h2>
                    <p className="text-lg text-gray-500 font-light leading-relaxed">
                        Plutôt que multiplier les messages ou les points ponctuels, Peekit installe une lecture permanente du projet.
                    </p>
                </div>
            </Reveal>

            <Reveal delay={200}>
                {/* Comme le fond est blanc, on donne du relief à cette carte 
                    avec une ombre douce (shadow-xl) et une bordure très légère (border-gray-100).
                */}
                <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-900"></div>
                            <p className="text-sm font-medium text-gray-900">Vos clients consultent l’avancement à tout moment</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-900"></div>
                            <p className="text-sm font-medium text-gray-900">Une interface pensée pour être simple, lisible et élégante</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-900"></div>
                            <p className="text-sm font-medium text-gray-900">Vous gardez votre rythme. L’expérience reste fluide.</p>
                        </div>
                    </div>
                </div>
            </Reveal>
            
        </div>
      </div>
    </section>
  );
};
