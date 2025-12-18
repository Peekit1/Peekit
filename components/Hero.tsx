
import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { Reveal } from './Reveal';
import { AuthNavigationProps } from '../types';

export const Hero: React.FC<AuthNavigationProps> = ({ onAuthClick }) => {
  return (
    <section className="relative pt-44 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
        
        {/* Background Ambient Glows - Monochrome */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gray-100/50 rounded-[100%] blur-3xl -z-10 pointer-events-none"></div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-10">
                
                <Reveal delay={0}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-subtle text-[11px] font-medium text-gray-600 mb-8 hover:border-gray-300 hover:text-gray-900 transition-all cursor-default group">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-900"></span>
                        </span>
                        Le suivi de post-production réinventé
                        <ChevronRight size={12} className="text-gray-400 group-hover:text-gray-900 transition-colors group-hover:translate-x-0.5 transform duration-300"/>
                    </div>
                </Reveal>
                
                <Reveal delay={100}>
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-gray-900 tracking-tighter mb-8 leading-[0.95] drop-shadow-sm">
                        Ne laissez plus vos clients <br/>
                        dans le <span className="inline-block transition-all duration-700 ease-out cursor-default select-none hover:blur-[8px] hover:opacity-50 hover:scale-110 hover:text-gray-400">flou.</span>
                    </h1>
                </Reveal>
                
                <Reveal delay={200}>
                    <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                        La solution élégante pour gérer l'attente.
                        Montrez l'avancée, <span className="text-gray-900 font-medium">rassurez vos clients</span> et valorisez votre travail invisible.
                    </p>
                </Reveal>
                
                <Reveal delay={300}>
                    <div className="flex justify-center items-center w-full">
                        <Button 
                            variant="black" 
                            size="lg" 
                            onClick={() => onAuthClick('signup')} 
                            className="!rounded-full px-8 h-12 text-sm shadow-lg shadow-gray-900/20 hover:shadow-gray-900/30 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Commencer maintenant <ArrowRight size={16} />
                        </Button>
                    </div>
                </Reveal>
            </div>
        </div>
    </section>
  );
};
