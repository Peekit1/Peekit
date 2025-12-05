
import React from 'react';
import { ArrowRight, ChevronRight, Activity, Search, Bell, LayoutGrid, CheckCircle2, MoreHorizontal, Star, Smartphone, Lock } from 'lucide-react';
import { Button } from './Button';
import { Reveal } from './Reveal';
import { AuthNavigationProps } from '../types';

export const Hero: React.FC<AuthNavigationProps> = ({ onAuthClick }) => {
  return (
    <section className="relative pt-24 pb-16 md:pt-40 md:pb-32 overflow-hidden bg-white border-b border-gray-100">
        
        {/* Technical Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                
                {/* LEFT COLUMN: COPYWRITING */}
                <div className="max-w-2xl relative z-20 mx-auto lg:mx-0 text-center lg:text-left">
                    <Reveal delay={0}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-[10px] sm:text-[11px] font-bold text-gray-900 mb-6 md:mb-8 hover:border-gray-300 transition-colors cursor-default">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Nouveau : Portail Client v2.0
                            <ChevronRight size={12} className="text-gray-400"/>
                        </div>
                    </Reveal>
                    
                    <Reveal delay={100}>
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tighter mb-4 md:mb-6 leading-[1.05] md:leading-[0.95]">
                            L'expérience client qui <br className="hidden md:block"/>
                            <span className="text-gray-400">justifie vos tarifs.</span>
                        </h1>
                    </Reveal>
                    
                    <Reveal delay={200}>
                        <p className="text-base sm:text-lg text-gray-500 mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
                            Fini les emails de relance. Offrez à vos clients un lien de suivi premium en temps réel. <span className="text-gray-900 font-medium"></span>
                        </p>
                    </Reveal>
                    
                    <Reveal delay={300}>
                        <div className="flex flex-col sm:flex-row gap-4 mb-8 md:mb-10 justify-center lg:justify-start">
                            <Button variant="black" size="lg" onClick={() => onAuthClick('signup')} className="rounded-full px-8 h-12 md:h-14 text-sm md:text-base shadow-xl shadow-gray-200 hover:shadow-gray-300 hover:-translate-y-0.5 transition-all duration-300 justify-center w-full sm:w-auto">
                                Commencer maintenant <ArrowRight size={16} />
                            </Button>
                        </div>
                    </Reveal>

                    <Reveal delay={400}>
                        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium justify-center lg:justify-start">
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover"/>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col text-left">
                                <div className="flex items-center gap-1">
                                    <Star size={12} className="fill-gray-900 text-gray-900"/>
                                    <Star size={12} className="fill-gray-900 text-gray-900"/>
                                    <Star size={12} className="fill-gray-900 text-gray-900"/>
                                    <Star size={12} className="fill-gray-900 text-gray-900"/>
                                    <Star size={12} className="fill-gray-900 text-gray-900"/>
                                </div>
                                <span className="text-xs text-gray-400">Utilisé par +500 studios</span>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* RIGHT COLUMN: LAYERED VISUAL (Hidden on Mobile/Tablet) */}
                <div className="hidden lg:flex relative h-[600px] items-center justify-end mt-0 max-w-[calc(100vw-2rem)] mx-auto lg:mx-0">
                    
                    {/* Background Blur Blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-gray-100/50 via-white to-indigo-50/30 rounded-full blur-3xl -z-10"></div>

                    {/* MAIN LAYER: DESKTOP DASHBOARD */}
                    <div className="relative w-full max-w-lg bg-white rounded-xl border border-gray-200 shadow-2xl shadow-gray-200/50 overflow-hidden z-10 animate-slide-up scale-100 origin-top-right">
                        {/* Fake Window Header */}
                        <div className="h-8 bg-white border-b border-gray-100 flex items-center px-3 gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                        </div>
                        {/* Fake Content */}
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <div className="text-lg font-bold text-gray-900 tracking-tight">Projets Actifs</div>
                                    <div className="text-xs text-gray-400">Vue d'ensemble du studio</div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">SL</div>
                            </div>
                            
                            <div className="space-y-3">
                                {/* Project Item 1 */}
                                <div className="p-3 rounded-lg border border-gray-100 bg-white flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover"/>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">Nike Campaign</div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded w-fit mt-0.5">Vidéo</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-gray-900">65%</div>
                                        <div className="text-[10px] text-gray-400">En cours</div>
                                    </div>
                                </div>
                                {/* Project Item 2 */}
                                <div className="p-3 rounded-lg border border-gray-100 bg-white flex items-center justify-between shadow-sm opacity-60">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover"/>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">Mariage Julia</div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded w-fit mt-0.5">Photo</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-gray-900">100%</div>
                                        <div className="text-[10px] text-emerald-600">Livré</div>
                                    </div>
                                </div>
                                {/* Project Item 3 */}
                                <div className="p-3 rounded-lg border border-gray-100 bg-gray-50/50 flex items-center justify-between shadow-sm border-dashed">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-300">
                                            <LayoutGrid size={16}/>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-400">Nouveau projet</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FLOATING LAYER 1: MOBILE VIEW (Right) */}
                    <div className="absolute -right-4 bottom-8 w-48 bg-gray-900 rounded-[2rem] p-2 shadow-2xl z-30 transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
                         <div className="bg-gray-50 rounded-[1.5rem] overflow-hidden h-80 relative">
                             {/* Mobile Header */}
                             <div className="bg-white p-3 border-b border-gray-100 flex items-center justify-between">
                                 <div className="font-bold text-[10px]">Nike...</div>
                                 <Lock size={10} className="text-emerald-500"/>
                             </div>
                             {/* Mobile Content */}
                             <div className="p-3 space-y-3">
                                 <div className="aspect-square rounded-lg bg-gray-200 overflow-hidden relative">
                                    <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover"/>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                                            <Activity size={14} className="text-indigo-600"/>
                                        </div>
                                    </div>
                                 </div>
                                 <div className="space-y-1.5">
                                     <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                         <div className="h-full w-[65%] bg-indigo-600"></div>
                                     </div>
                                     <div className="flex justify-between text-[8px] font-bold text-gray-500">
                                         <span>Montage</span>
                                         <span>65%</span>
                                     </div>
                                 </div>
                             </div>
                             {/* Floating Pill */}
                             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white rounded-full shadow-lg border border-gray-100 text-[8px] font-bold whitespace-nowrap">
                                 Vue Client Mobile
                             </div>
                         </div>
                    </div>

                </div>

            </div>
        </div>
    </section>
  );
};
