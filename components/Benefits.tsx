
import React from 'react';
import { User, Eye, Smartphone, Settings } from 'lucide-react';
import { Reveal } from './Reveal';

export const Benefits: React.FC = () => {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <Reveal>
            <div className="text-center mb-24">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tighter">Deux espaces, une seule fluidité.</h2>
            </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12">
            
            {/* Côté Créatif */}
            <Reveal>
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center">
                            <Settings size={22} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Vous structurez.</h3>
                    </div>
                    
                    <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 space-y-6">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Côté créatif</p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-600 text-sm">
                                <span className="text-gray-900 mt-1">•</span>
                                <span>Définissez les étapes de votre processus</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-600 text-sm">
                                <span className="text-gray-900 mt-1">•</span>
                                <span>Faites-les évoluer à votre rythme</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-600 text-sm">
                                <span className="text-gray-900 mt-1">•</span>
                                <span>Choisissez ce qui est visible ou non</span>
                            </li>
                        </ul>
                        <p className="text-xs text-gray-500 pt-4 font-medium italic">
                            Peekit s’adapte à votre façon de travailler, pas l’inverse.
                        </p>
                    </div>
                </div>
            </Reveal>

            {/* Côté Client */}
            <Reveal delay={200}>
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 text-gray-900 flex items-center justify-center shadow-sm">
                            <Eye size={22} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Ils consultent.</h3>
                    </div>
                    
                    <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-6">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Côté client</p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-600 text-sm">
                                <span className="text-gray-900 mt-1">•</span>
                                <span>Une page dédiée, accessible via un lien sécurisé</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-600 text-sm">
                                <span className="text-gray-900 mt-1">•</span>
                                <span>Une vision claire de l’avancement</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-600 text-sm">
                                <span className="text-gray-900 mt-1">•</span>
                                <span>Une expérience moderne et intuitive</span>
                            </li>
                        </ul>
                        <div className="flex gap-4 pt-4">
                            <span className="text-[10px] font-bold text-gray-400 uppercase border border-gray-100 px-2 py-1 rounded">Sans compte</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase border border-gray-100 px-2 py-1 rounded">Sans friction</span>
                        </div>
                    </div>
                </div>
            </Reveal>

        </div>
      </div>
    </section>
  );
};
