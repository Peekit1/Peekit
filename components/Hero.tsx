import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { Reveal } from './Reveal';
import { AuthNavigationProps } from '../types';

export const Hero: React.FC<AuthNavigationProps> = ({ onAuthClick }) => {
  return (
    <section className="relative pt-52 pb-12 md:pt-72 md:pb-24 overflow-hidden bg-white">
      {/* MODIFICATIONS DES ESPACEMENTS (PADDING) :
         - pt-52 / md:pt-72 : Augmenté (avant 44/56) -> Plus d'espace avec la navbar.
         - pb-12 / md:pb-24 : Réduit (avant 32/48) -> Moins d'espace avec la section suivante.
      */}
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          <Reveal delay={0}>
            {/*
              Utilisation de 'text-balance' (si supporté par Tailwind) ou style inline 'textWrap: balance'
              pour équilibrer le texte sur 2 lignes sans sauts de ligne manuels.
              Ajustement de la taille de police mobile pour éviter 3 lignes sur petits écrans.
            */}
            <h1 
              className="text-3xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tighter mb-10 leading-[1.2] sm:leading-[1.1]"
              style={{ textWrap: 'balance' }} 
            >
              Offrez une expérience aussi soignée que votre travail.
            </h1>
          </Reveal>
          
          <Reveal delay={200}>
            <p className="text-lg sm:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Peekit transforme le suivi d’un projet créatif en une expérience fluide, élégante et professionnelle <span className="text-gray-900">sans changer votre manière de créer.</span>
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
