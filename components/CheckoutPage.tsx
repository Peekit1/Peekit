
import React, { useState } from 'react';
import { ArrowLeft, Lock, ShieldCheck, CreditCard, Check, Sparkles, Building2, Zap, LayoutGrid } from 'lucide-react';
import { Button } from './Button';
import { CheckoutPageProps } from '../types';

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ plan, onBack, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
        setIsLoading(false);
        onSuccess();
    }, 2000);
  };

  const PlanIcon = () => {
    if (plan.name === 'Découverte') return <Zap size={18} className="text-gray-900"/>;
    if (plan.name === 'Pro') return <Sparkles size={18} className="text-gray-900"/>;
    return <Building2 size={18} className="text-gray-900"/>;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900">
      
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-6 max-w-4xl flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-wide">
                <ArrowLeft size={14}/> Retour
            </button>
            <div className="flex items-center gap-2">
                <Lock size={12} className="text-emerald-600"/>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Paiement SSL</span>
            </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8">
            
            {/* LEFT: FORM */}
            <div className="flex-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Facturation</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Prénom</label>
                                <input required type="text" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:border-black outline-none transition-colors" placeholder="Jean"/>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nom</label>
                                <input required type="text" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:border-black outline-none transition-colors" placeholder="Dupont"/>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email</label>
                            <input required type="email" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:border-black outline-none transition-colors" placeholder="jean@studio.com"/>
                        </div>

                        <div className="my-8 h-px bg-gray-100 w-full"></div>

                        <h2 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Paiement</h2>
                        
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Numéro de carte</label>
                                <div className="relative">
                                    <CreditCard size={16} className="absolute left-3 top-2.5 text-gray-400"/>
                                    <input required type="text" className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:border-black outline-none transition-colors font-mono" placeholder="0000 0000 0000 0000"/>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Expiration</label>
                                    <input required type="text" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:border-black outline-none transition-colors font-mono" placeholder="MM / AA"/>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">CVC</label>
                                    <div className="relative">
                                        <Lock size={12} className="absolute right-3 top-3 text-gray-400"/>
                                        <input required type="text" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:border-black outline-none transition-colors font-mono" placeholder="123"/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button variant="black" type="submit" fullWidth isLoading={isLoading} className="mt-4 text-sm py-3">
                            Payer {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(plan.price)}
                        </Button>
                        
                        <div className="flex justify-center items-center gap-2 text-[10px] text-gray-400 font-medium">
                            <ShieldCheck size={12}/> Paiement chiffré et sécurisé
                        </div>
                    </form>
                </div>
            </div>

            {/* RIGHT: SUMMARY */}
            <div className="w-full md:w-80 shrink-0">
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 sticky top-6">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Commande</h3>
                    
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                        <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-900 shrink-0">
                            <PlanIcon />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">Plan {plan.name}</h4>
                            <p className="text-xs text-gray-500">{plan.interval === 'annual' ? 'Annuel' : 'Mensuel'}</p>
                        </div>
                    </div>

                    <div className="space-y-2 text-xs font-medium">
                        <div className="flex justify-between text-gray-500">
                            <span>Sous-total</span>
                            <span className="font-mono">{plan.price},00 €</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Taxes</span>
                            <span className="font-mono">0,00 €</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                        <span className="font-bold text-gray-900 text-sm">Total</span>
                        <span className="font-bold text-xl text-gray-900 font-mono">{plan.price}€</span>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
