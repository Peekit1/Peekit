import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from './Reveal';

const faqs = [
  {
    question: "Puis-je changer de plan plus tard ?",
    answer: "Absolument. Vous pouvez passer au plan Pro ou revenir au plan Découverte à tout moment depuis vos paramètres. Les changements sont pris en compte immédiatement."
  },
  {
    question: "Comment fonctionne la période d'essai ?",
    answer: "Le plan Découverte est gratuit pour toujours pour votre premier projet. Vous n'avez pas besoin de carte bancaire pour commencer. Le plan Pro offre une garantie satisfait ou remboursé de 14 jours."
  },
  {
    question: "Mes clients doivent-ils créer un compte ?",
    answer: "Non, c'est toute la beauté de Peekit. Vos clients reçoivent un lien unique sécurisé. Ils cliquent et accèdent directement à leur tableau de bord, sans inscription ni mot de passe à retenir."
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Oui. Nous utilisons le chiffrement SSL pour tous les transferts de données et vos fichiers sont stockés sur des serveurs sécurisés en Europe. Les accès projets sont protégés par des liens uniques cryptés."
  },
  {
    question: "Puis-je personnaliser l'interface ?",
    answer: "Avec le plan Pro, vous pouvez supprimer la mention Peekit et bientôt ajouter votre propre logo pour offrir une expérience 100% marque blanche à vos clients."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    // MODIFICATION: py-12 pour mobile, md:py-24 pour desktop
    <section className="py-12 md:py-24 bg-white" id="faq">
      <div className="container mx-auto px-6 max-w-4xl">

        <Reveal>
            {/* MODIFICATION: mb-10 pour mobile, md:mb-20 pour desktop */}
            <div className="text-center mb-10 md:mb-20 space-y-4 md:space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tighter" style={{ fontFamily: 'Gabarito, sans-serif' }}>
                    Questions fréquentes
                </h2>
                <p className="text-gray-500 max-w-lg mx-auto leading-relaxed text-sm md:text-base">
                    Nous avons compilé les réponses aux questions les plus courantes pour vous aider à démarrer.
                </p>
            </div>
        </Reveal>

        <div className="border-t border-gray-100">
          {faqs.map((faq, index) => (
            <Reveal key={index} delay={index * 50}>
                <div className="border-b border-gray-100 group">
                    <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full flex items-center justify-between py-8 text-left transition-colors hover:bg-gray-50/50 px-2 cursor-pointer outline-none"
                    >
                        {/* La question */}
                        <span className="text-lg md:text-xl font-medium text-gray-900 pr-8 leading-snug">
                            {faq.question}
                        </span>
                        
                        {/* Le bouton rond avec la flèche */}
                        <div className={`shrink-0 w-10 h-10 rounded-full bg-black flex items-center justify-center text-white transition-transform duration-500 ease-out ${openIndex === index ? 'rotate-90' : 'rotate-0'}`}>
                            <ArrowUpRight size={20} strokeWidth={2} />
                        </div>
                    </button>
                    
                    {/* La réponse qui se déroule */}
                    <div 
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100 pb-8' : 'max-h-0 opacity-0'}`}
                    >
                        <p className="text-gray-500 leading-relaxed pr-16 pl-2 text-base">
                            {faq.answer}
                        </p>
                    </div>
                </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={600}>
            {/* MODIFICATION: mt-10 pour mobile, md:mt-20 pour desktop */}
            <div className="mt-10 md:mt-20 text-center">
                <p className="text-sm text-gray-400">
                    Vous avez une autre question ? <a href="mailto:support@peekit.io" className="text-gray-900 font-bold underline underline-offset-4 hover:text-black transition-colors">Écrivez-nous</a>
                </p>
            </div>
        </Reveal>

      </div>
    </section>
  );
};
