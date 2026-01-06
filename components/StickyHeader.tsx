import React, { useState, useEffect } from 'react';
import { Activity, Menu, X } from 'lucide-react';
import { Button } from './Button';
import { AuthNavigationProps } from '../types';

export const StickyHeader: React.FC<AuthNavigationProps> = ({ onAuthClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Déclenchement un peu plus bas pour être sûr de quitter le haut du hero
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
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none p-4 md:p-6">
            <header 
                className={`
                    pointer-events-auto transition-all duration-500 ease-in-out
                    flex items-center justify-between px-2 pr-2 md:px-6
                    ${isScrolled 
                        ? 'w-full max-w-2xl bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-lg shadow-gray-200/20 rounded-full py-2.5' 
                        : 'w-full max-w-7xl bg-transparent border-transparent py-6'
                    }
                `}
            >
                {/* Logo */}
                <div 
                    className="flex items-center gap-2 cursor-pointer pl-2 md:pl-0" 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <div className={`transition-all duration-500 ${isScrolled ? 'w-8 h-8' : 'w-10 h-10'} bg-black rounded-xl flex items-center justify-center text-white shadow-sm`}>
                        <Activity size={isScrolled ? 16 : 20} strokeWidth={2.5} />
                    </div>
                    <span className={`font-brand font-bold text-gray-900 hidden sm:block transition-all duration-500 ${isScrolled ? 'text-sm opacity-0 w-0 overflow-hidden' : 'text-xl opacity-100'}`}>
                        Peekit
                    </span>
                </div>
                
                {/* Right Actions */}
                <div className="flex items-center gap-1">
                    
                    {/* Liens de navigation (Masqués si scrollé sur mobile pour gagner de la place) */}
                    <div className={`hidden md:flex items-center mr-2 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-100'}`}>
                        <button 
                            onClick={(e) => scrollToSection(e, 'concept')} 
                            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Concept
                        </button>
                        <button 
                            onClick={(e) => scrollToSection(e, 'pricing')} 
                            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Tarifs
                        </button>
                    </div>

                    <div className="hidden md:block w-px h-4 bg-gray-200 mx-2"></div>

                    <button 
                        className="hidden md:block text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 transition-colors"
                        onClick={() => onAuthClick('login')}
                    >
                        Connexion
                    </button>
                    
                    {/* BOUTON COMMENCER : Visible uniquement au scroll */}
                    <div className={`transition-all duration-500 transform ${isScrolled ? 'translate-x-0 opacity-100 w-auto' : 'translate-x-4 opacity-0 w-0 overflow-hidden'}`}>
                        <Button 
                            variant="black" 
                            size="sm"
                            onClick={() => onAuthClick('signup')}
                            className="!rounded-full !px-5 whitespace-nowrap shadow-md shadow-gray-900/10"
                        >
                            Commencer
                        </Button>
                    </div>
                    
                    {/* Menu Mobile */}
                    <button 
                        className="md:hidden p-2 text-gray-500 hover:text-black ml-1 bg-white/50 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </header>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
            <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-32 px-6 md:hidden animate-fade-in flex flex-col items-center">
                <nav className="flex flex-col gap-8 text-center w-full max-w-xs">
                    <button onClick={(e) => scrollToSection(e, 'concept')} className="text-2xl font-bold text-gray-900">Concept</button>
                    <button onClick={(e) => scrollToSection(e, 'pricing')} className="text-2xl font-bold text-gray-900">Tarifs</button>
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
