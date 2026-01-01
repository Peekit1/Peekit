import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { Reveal } from './Reveal';
import { AuthNavigationProps } from '../types';

export const Hero: React.FC<AuthNavigationProps> = ({ onAuthClick }) => {
  return (
    <section className="relative pt-44 pb-32 md:pt-56 md:pb-48 overflow-hidden bg-white">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                
                <Reveal delay={0}>
                    {/* MODIFICATIONS :
                        1. text-3xl sur mobile (au lieu de 5xl) pour que les mots rentrent sur la ligne.
                        2. Sauts de ligne stratégiques (<br>) pour forcer la découpe harmonieuse.
                    */}
                    <h1 className="text-3xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tighter mb-10 leading-[1.2] sm:leading-[1.1]">
                        Offrez une expérience <br />
                        aussi soignée <br className="sm:hidden" />
                        que votre travail.
                    </h1>
                </Reveal>
                
                <Reveal delay={200}>
                    <p className="text-lg sm:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                        Peekit transforme le suivi d’un projet créatif en une expérience fluide, élégante et professionnelle — <span className="text-gray-900">sans changer votre manière de créer.</span>
                    </p>
                </Reveal>
                
                <Reveal delay={300}>
                    <div className="flex flex-col items-center gap-8">
                        <Button 
                            variant="black" 
                            size="lg" 
                            onClick={() => onAuthClick('signup')} 
                            className="!rounded-full px-10 h-14 text-base shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Commencer gratuitement <ArrowRight size={18} />
                        </Button>
                        
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">La nouvelle manière de partager l’avancement</span>
                            <div className="w-px h-12 bg-gray-100"></div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </div>
    </section>
  );
};
