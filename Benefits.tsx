import React from 'react';
import { ShieldCheck, Diamond, Sparkles } from 'lucide-react';
import { BenefitProps } from '../types';
import { Reveal } from './Reveal';

const BenefitCard: React.FC<BenefitProps> = ({ icon, title, description }) => (
  <div className="p-8 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-colors h-full">
    <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-gray-900 mb-6">
        {React.cloneElement(icon as React.ReactElement<any>, { size: 24, strokeWidth: 2 })}
    </div>
    <h3 className="font-bold text-lg text-gray-900 mb-3">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
  </div>
);

export const Benefits: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-6 max-w-6xl">
        <Reveal>
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">Pourquoi passer sur Peekit ?</h2>
                <p className="text-gray-500">Ce n'est pas juste un outil d'organisation. C'est un outil de vente.</p>
            </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
            <Reveal delay={100} className="h-full">
                <BenefitCard 
                    icon={<ShieldCheck />}
                    title="Tranquillité d'esprit"
                    description="Fini le harcèlement par SMS. Vos clients ont l'info, vous avez la paix pour créer."
                />
            </Reveal>
            <Reveal delay={200} className="h-full">
                <BenefitCard 
                    icon={<Diamond />}
                    title="Valeur Perçue"
                    description="Justifiez des tarifs plus élevés en offrant une expérience digitale digne d'une agence de luxe."
                />
            </Reveal>
            <Reveal delay={300} className="h-full">
                <BenefitCard 
                    icon={<Sparkles />}
                    title="Fidélisation"
                    description="Une livraison dont on se souvient. Vos clients reviendront pour la qualité du service, pas juste pour le résultat."
                />
            </Reveal>
        </div>
      </div>
    </section>
  );
};