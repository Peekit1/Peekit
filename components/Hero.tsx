import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { Button } from './Button';
import { AuthNavigationProps } from '../types';

export const Hero: React.FC<AuthNavigationProps> = ({ onAuthClick }) => {
  return (
    // MODIFICATION : Padding-top augmenté à 'pt-48' (mobile) et 'md:pt-80' (desktop)
    <section className="relative pt-48 md:pt-80 pb-20 md:pb-32 overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-gray-50 to-transparent rounded-full blur-3xl -z-10 opacity-60"></div>
      
      <div className="container mx-auto px-6 max-w-3xl text-center">
        <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full mb-8 transition-transform hover:scale-105 cursor-pointer mx-auto">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-900"></span>
                </span>
                <span className="text-xs font-bold text-gray-900 tracking-wide">Nouveau : Gérer l'attente client</span>
                <ChevronRight size={14} className="text-gray-400" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 tracking-tight leading-[1.1]">
              Ne laissez plus vos clients <br className="hidden md:block"/>
              <span className="relative inline-block">
                <span className="relative z-10">dans le flou.</span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-gray-100/50 -z-10 skew-x-6 rounded-sm"></span>
              </span>
            </h1>
            
            <p className="text-xl text-gray-500 mb-12 leading-relaxed max-w-2xl mx-auto font-light">
              La solution élégante pour gérer l'attente. Montrez l'avancée, <span className="font-bold text-gray-900">rassurez vos clients</span> et valorisez votre travail invisible.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="black" className="group shadow-xl shadow-gray-900/10" onClick={() => onAuthClick('signup')}>
                Commencer maintenant <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="hidden sm:flex" onClick={() => onAuthClick('login')}>
                Connexion
              </Button>
            </div>
        </Reveal>
      </div>
    </section>
  );
};
