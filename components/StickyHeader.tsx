import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './Button';
import { AuthNavigationProps } from '../types';

export const StickyHeader: React.FC<AuthNavigationProps> = ({ onAuthClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Seuil légèrement augmenté pour éviter les clignotements au tout début
      setIsScrolled(window.scrollY > 50); 
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
        {/* Conteneur principal fixe qui gère le centrage */}
        <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${isScrolled ? 'pt-4' : 'pt-0'}`}>
            <header 
                className={`
                    flex items-center justify-between
                    transition-all duration-700 cubic-bezier(0.19, 1, 0.22, 1)
                    ${isScrolled 
                        ? 'w-[90%] max-w-3xl bg-white/80 backdrop-blur-xl border border-gray-200/60 shadow-lg shadow-gray-200/10 rounded-full py-3 px-6' 
                        : 'w-full max-w-7xl bg-transparent border-transparent py-6 px-6 md:px-8'
                    }
                `}
            >
                {/* --- LOGO PEEKIT --- */}
                <div 
                    className="cursor-pointer select-none" 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <span 
                        className="text-2xl font-bold text-gray-900 tracking-tight"
                        style={{ fontFamily: 'Gabarito, sans-serif' }}
                    >
                        Peekit
                    </span>
                </div>
                
                {/* --- ACTIONS DROITE --- */}
                <div className="flex items-center gap-2">
                    
                    {/* Liens de navigation (Desktop) */}
                    <nav className="hidden md:flex items-center mr-2">
                        <button 
                            onClick={(e) => scrollToSection(e, 'concept')} 
                            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Concept
                        </button>
                        <button 
                            onClick={(e) => scrollToSection(e, 'pricing')} 
                            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Tarifs
                        </button>
                    </nav>

                    {/* Séparateur (Desktop) */}
                    <div className="hidden md:block w-px h-4 bg-gray-200 mx-1"></div>

                    {/* Bouton Connexion */}
                    <button 
                        className="hidden md:block text-sm font-bold text-gray-900 hover:text-gray-600 px-4 py-2 transition-colors"
                        onClick={() => onAuthClick('login')}
                    >
                        Connexion
                    </button>
                    
                    {/* BOUTON COMMENCER : Apparition fluide au scroll */}
                    <div 
                        className={`
                            transition-all duration-500 ease-out transform
                            ${isScrolled 
                                ? 'translate-y-0 opacity-100 w-auto scale-100' 
                                : 'translate-y-2 opacity-0 w-0 scale-90 pointer-events-none'
                            }
                        `}
                    >
                        <Button 
                            variant="black" 
                            size="sm"
                            onClick={() => onAuthClick('signup')}
                            className="!rounded-full !px-5 whitespace-nowrap shadow-md"
                        >
                            Commencer
                        </Button>
                    </div>
                    
                    {/* Menu Mobile (Hamburger) */}
                    <button 
                        className="md:hidden p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </header>
        </div>

        {/* Menu Mobile Overlay */}
        {isMobileMenuOpen && (
            <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-32 px-6 md:hidden animate-fade-in flex flex-col items-center">
                <nav className="flex flex-col gap-8 text-center w-full max-w-xs">
                    <button onClick={(e) => scrollToSection(e, 'concept')} className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Gabarito, sans-serif' }}>Concept</button>
                    <button onClick={(e) => scrollToSection(e, 'pricing')} className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Gabarito, sans-serif' }}>Tarifs</button>
                    <div className="w-full h-px bg-gray-100 my-2"></div>
                    <button onClick={() => { setIsMobileMenuOpen(false); onAuthClick('login'); }} className="text-xl font-medium text-gray-500">Connexion</button>
                    <Button variant="black" size="lg" onClick={() => { setIsMobileMenuOpen(false); onAuthClick('signup'); }} className="w-full !rounded-full mt-4">
                        Commencer maintenant
                    </Button>
                </nav>
            </div>
        )}
    </>
  );
};
