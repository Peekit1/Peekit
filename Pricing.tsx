import React, { useState } from 'react';
import { Check, Zap, Sparkles, Building2 } from 'lucide-react';
import { Button } from './Button';
import { Reveal } from './Reveal';
import { PricingProps, SelectedPlan } from './types';

interface PricingTier {
  name: string;
  price: { monthly: number; annual: number };
  description: string;
  features: string[];
  highlight?: boolean;
  comingSoon?: boolean;
  icon: React.ReactNode;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers: PricingTier[] = [
    {
      name: "Freelance",
      price: { monthly: 9, annual: 7.5 }, // 90€ / 12
      description: "Pour débuter ou side-project.",
      icon: <Zap />,
      features: [
          "5 Projets actifs", 
          "Timeline standard", 
          "Teasing (2 Images max)", 
          "Emails de notification",
          "Support standard"
      ]
    },
    {
      name: "Pro",
      highlight: true,
      price: { monthly: 19, annual: 15.8 }, // 190€ / 12
      description: "Pour les créatifs à temps plein.",
      icon: <Sparkles />,
      features: [
          "Projets Illimités", 
          "Timeline 100% Personnalisable", 
          "Teasing Multimédia (Vidéo/Img)", 
          "Logo Personnalisé (Branding)", 
          "Support Prioritaire"
      ]
    },
    {
      name: "Agency",
      comingSoon: true,
      price: { monthly: 49, annual: 40.8 }, // 490€ / 12
      description: "L'écosystème complet.",
      icon: <Building2 />,
      features: [
          "Domaine Personnalisé (CNAME)", 
          "3 Utilisateurs (Team)", 
          "Multi-Marques (2 identités)", 
          "API & Webhooks (Zapier)", 
          "Portail Client (Hub)"
      ]
    }
  ];

  const handleChoosePlan = (tier: PricingTier) => {
    if (tier.comingSoon) return;
    
    // Calculate actual price based on selection
    const price = isAnnual 
        ? Math.round(tier.price.annual * 12) // Total Annual Price
        : tier.price.monthly;

    const planData: SelectedPlan = {
        name: tier.name,
        price: price,
        interval: isAnnual ? 'annual' : 'monthly'
    };

    onSelectPlan(planData);
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
            <Reveal>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Tarification simple</h2>
                <p className="text-gray-500 max-w-xl mx-auto mb-8">Des outils professionnels, accessibles à tous.</p>
                
                <div className="inline-flex bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
                    <button 
                        onClick={() => setIsAnnual(false)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!isAnnual ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Mensuel
                    </button>
                    <button 
                        onClick={() => setIsAnnual(true)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${isAnnual ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Annuel
                    </button>
                </div>
            </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier, index) => (
                <Reveal key={index} delay={index * 100} className="h-full">
                    <div className={`p-8 rounded-2xl h-full flex flex-col border transition-all duration-300 relative overflow-hidden
                        ${tier.highlight 
                            ? 'bg-white border-gray-200 shadow-xl ring-1 ring-gray-900/5 z-10' 
                            : 'bg-white border-gray-200 shadow-sm hover:shadow-md'}
                        ${tier.comingSoon ? 'opacity-90 bg-gray-50/50' : ''}
                        `}>
                        
                        {tier.highlight && (
                            <div className="absolute top-0 right-0 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl z-20">
                                Best-Seller
                            </div>
                        )}

                        {tier.comingSoon && (
                            <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 border-l border-b border-amber-200 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl z-20">
                                Prochainement
                            </div>
                        )}

                        <div className="mb-6">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${tier.highlight ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
                                {React.cloneElement(tier.icon as React.ReactElement<any>, { size: 20 })}
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">{tier.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{tier.description}</p>
                        </div>

                        <div className="mb-6 flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-gray-900">
                                {isAnnual 
                                    ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(tier.price.annual) 
                                    : tier.price.monthly}€
                            </span>
                            <span className="text-gray-400 text-sm">/mois</span>
                        </div>
                        
                        {isAnnual && (
                             <p className="text-xs text-green-600 font-medium mb-6 bg-green-50 inline-block px-2 py-1 rounded">
                                Facturé {Math.round(tier.price.annual * 12)}€ par an
                             </p>
                        )}

                        <ul className="space-y-3 mb-8 flex-1">
                            {tier.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                    <Check size={16} className="text-gray-900 mt-0.5 shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Button 
                            variant={tier.highlight ? 'primary' : 'outline'} 
                            fullWidth
                            onClick={() => handleChoosePlan(tier)}
                            disabled={tier.comingSoon}
                            className={tier.comingSoon ? 'opacity-50 cursor-not-allowed hover:!transform-none hover:!shadow-none' : ''}
                        >
                            {tier.comingSoon ? 'Bientôt disponible' : `Choisir ${tier.name}`}
                        </Button>
                    </div>
                </Reveal>
            ))}
        </div>
      </div>
    </section>
  );
};
