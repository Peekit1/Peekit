import React from 'react';
import { Activity, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Reveal } from './Reveal';
import { AuthNavigationProps } from './types';

export const Footer: React.FC<AuthNavigationProps> = ({ onAuthClick }) => {
  return (
    <footer className="bg-white border-t border-gray-200 py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            
            <div className="flex items-center gap-2">
                <div className="bg-gray-900 text-white p-1.5 rounded-lg">
                    <Activity size={18} strokeWidth={2.5} />
                </div>
                <span className="font-bold text-lg tracking-tight text-gray-900">
                    Peekit
                </span>
            </div>
            
            <div className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Peekit. Fait avec passion à Paris.
            </div>

            <div className="flex gap-6">
                <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><Instagram size={20}/></a>
                <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><Twitter size={20}/></a>
                <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><Linkedin size={20}/></a>
            </div>

        </div>
      </div>
    </footer>
  );
};
