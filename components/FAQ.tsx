import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
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

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        
        <Reveal>
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Questions fréquentes</h2>
                <p className="text-gray-500">Tout ce que vous devez savoir pour commencer sereinement.</p>
            </div>
        </Reveal>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Reveal key={index} delay={index * 100}>
                <div className="border border-gray-100 rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:border-gray-200 hover:shadow-sm">
                <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                >
                    <span className="font-bold text-gray-900">{faq.question}</span>
                    <span className={`ml-6 p-2 rounded-full bg-gray-50 text-gray-900 transition-transform duration-300 ${openIndex === index ? 'rotate-180 bg-gray-100' : ''}`}>
                        {openIndex === index ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                </button>
                <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <p className="px-6 pb-6 text-gray-500 text-sm leading-relaxed">
                    {faq.answer}
                    </p>
                </div>
                </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={600}>
            <div className="mt-12 text-center">
                <p className="text-sm text-gray-400">
                    Vous avez une autre question ? <a href="mailto:support@peekit.io" className="text-gray-900 font-bold underline underline-offset-4 hover:text-black transition-colors">Écrivez-nous</a>
                </p>
            </div>
        </Reveal>

      </div>
    </section>
  );
};
