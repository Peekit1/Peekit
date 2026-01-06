
import React, { useState } from 'react';
import { Check, Zap, Sparkles, Building2 } from 'lucide-react';
import { Button } from './Button';
import { Reveal } from './Reveal';
import { PricingProps, SelectedPlan } from '../types';

interface PricingTier {
  name: string;
  price: { monthly: number; annual: number };
  description: string;
  features: string[];
  highlight?: boolean;
  comingSoon?: boolean;
  icon: React.ReactNode;
  buttonText?: string;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan, onAuthClick }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers: PricingTier[] = [
    {
      name: "Découverte",
      price: { monthly: 0, annual: 0 },
      description: "Pour tester et valider l'outil.",
      icon: <Zap />,
      buttonText: "Commencer gratuitement",
      features: [
          "1 Projet actif", 
          "Timeline standard", 
          "Teasing standard (Images)", 
      ]
    },
    {
      name: "Pro",
      highlight: true,
      price: { monthly: 19, annual: 15 }, // 15 * 12 = 180€/an
      description: "Pour les créatifs indépendants.",
      icon: <Sparkles />,
      features: [
          "Projets Illimités", 
          "Timeline 100% Personnalisable", 
          "Teasing Multimédia (Vidéo/Img)",
          "Email de notification", 
          "Notes détaillées",
          "Support Prioritaire",
      ]
    },
    {
      name: "Agency",
      comingSoon: true,
      price: { monthly: 59, annual: 49 },
      description: "Pour les agences et équipes.",
      icon: <Building2 />,
      features: [
          "Domaine Personnalisé (CNAME)", 
          "5 Utilisateurs (Team)", 
          "Multi-Marques (Identités)", 
          "API & Webhooks (Zapier)", 
          "Portail Client (Hub)"
      ]
    }
  ];

  const handleChoosePlan = (tier: PricingTier) => {
    if (tier.comingSoon) return;
    
    // Si c'est l'offre gratuite (Découverte), on redirige vers l'inscription
    if (tier.price.monthly === 0) {
        onAuthClick('signup');
        return;
    }

    const price = isAnnual 
        ? Math.round(tier.price.annual * 12) 
        : tier.price.monthly;

    const planData: SelectedPlan = {
        name: tier.name,
        price: price,
        interval: isAnnual ? 'annual' : 'monthly'
    };

    onSelectPlan(planData);
  };

  return (
    // MODIFICATION ICI : py-12 pour mobile, md:py-24 pour desktop (au lieu de py-32)
    <section id="pricing" className="py-12 md:py-24 bg-gray-50/50 border-b border-gray-200">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* MODIFICATION ICI : mb-10 pour mobile, md:mb-16 pour desktop */}
        <div className="text-center mb-10 md:mb-16">
            <Reveal>
                <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tighter">Simple. Flexible. Sans engagement.</h2>
                <p className="text-gray-500 max-w-xl mx-auto mb-8 font-light leading-relaxed">
                    Commencez gratuitement. Passez en pro lorsque Peekit devient une évidence dans votre manière de travailler.
                </p>
                
                <div className="inline-flex bg-gray-100 p-1 rounded-xl shadow-inner mb-12">
                    <button 
                        onClick={() => setIsAnnual(false)}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${!isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Mensuel
                    </button>
                    <button 
                        onClick={() => setIsAnnual(true)}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Annuel <span className="text-[9px] bg-gray-900 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">-20%</span>
                    </button>
                </div>
            </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
                <Reveal key={index} delay={index * 100} className="h-full">
                    <div className={`
                        p-8 rounded-3xl h-full flex flex-col transition-all duration-300 relative overflow-hidden group
                        ${tier.highlight 
                            ? 'bg-white border-2 border-gray-900 shadow-xl shadow-gray-200 z-10 scale-105' 
                            : 'bg-white border border-gray-200 shadow-sm hover:border-gray-300'}
                        ${tier.comingSoon ? 'opacity-80 bg-gray-50/50' : ''}
                    `}>
                        
                        <div className="mb-8">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 
                                ${tier.highlight ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
                                {React.cloneElement(tier.icon as React.ReactElement<any>, { size: 22, strokeWidth: 1.5 })}
                            </div>
                            <h3 className="font-bold text-xl text-gray-900 mb-2">{tier.name}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{tier.description}</p>
                        </div>

                        <div className="mb-8 flex items-baseline gap-1">
                            <span className="text-5xl font-bold text-gray-900 tracking-tight">
                                {isAnnual 
                                    ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(tier.price.annual) 
                                    : tier.price.monthly}€
                            </span>
                            <span className="text-gray-400 font-medium">/mois</span>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {tier.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${tier.highlight ? 'bg-gray-100 text-gray-900' : 'bg-gray-100 text-gray-900'}`}>
                                        <Check size={10} strokeWidth={3} />
                                    </div>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Button 
                            variant={tier.highlight ? 'black' : 'outline'} 
                            fullWidth
                            size="lg"
                            onClick={() => handleChoosePlan(tier)}
                            disabled={tier.comingSoon}
                            className={`rounded-xl ${tier.comingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {tier.comingSoon 
                                ? 'Bientôt disponible' 
                                : tier.buttonText || `Choisir ${tier.name}`}
                        </Button>
                    </div>
                </Reveal>
            ))}
        </div>
      </div>
    </section>
  );
};
