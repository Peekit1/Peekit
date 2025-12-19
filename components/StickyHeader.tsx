import React, { useState, useEffect } from 'react';
import { Activity, Menu, X } from 'lucide-react';
import { Button } from './Button';
import { AuthNavigationProps } from '../types';

export const StickyHeader: React.FC<AuthNavigationProps> = ({ onAuthClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
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
                    pointer-events-auto transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)
                    flex items-center justify-between px-2 pr-2 md:px-6
                    ${isScrolled 
                        ? 'w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-float rounded-full py-2' 
                        : 'w-full max-w-6xl bg-transparent border-transparent py-4'
                    }
                `}
            >
                {/* Logo */}
                <div 
                    className="flex items-center gap-2 cursor-pointer pl-2 md:pl-0" 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white">
                        <Activity size={16} strokeWidth={2.5} />
                    </div>
                    {/* MODIFICATION ICI : Police Agbalumo (font-brand) et taille augmentée */}
                    <span className={`font-brand text-2xl text-gray-900 hidden sm:block ${isScrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'} transition-all`}>
                        Peekit.
                    </span>
                </div>
                
                {/* Right Actions */}
                <div className="flex items-center gap-1">
                    
                    <div className="hidden md:flex items-center mr-2">
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
                    
                    <Button 
                        variant="black" 
                        size="sm"
                        onClick={() => onAuthClick('signup')}
                        className="!rounded-full !px-5"
                    >
                        Commencer
                    </Button>
                    
                    <button 
                        className="md:hidden p-2 text-gray-500 hover:text-black ml-1"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </header>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="fixed inset-0 z-40 bg-white pt-32 px-6 md:hidden animate-fade-in">
                <nav className="flex flex-col gap-6 text-center">
                    <button onClick={(e) => scrollToSection(e, 'concept')} className="text-xl font-medium text-gray-900">Concept</button>
                    <button onClick={(e) => scrollToSection(e, 'pricing')} className="text-xl font-medium text-gray-900">Tarifs</button>
                    <div className="w-full h-px bg-gray-100 my-4"></div>
                    <button onClick={() => onAuthClick('login')} className="text-lg text-gray-500">Connexion</button>
                </nav>
            </div>
        )}
    </>
  );
};
