
import React from 'react';
import { MessageSquare, Clock, AlertCircle, TrendingDown, Bell, Mail } from 'lucide-react';
import { Reveal } from './Reveal';

export const Problem: React.FC = () => {
  return (
    <section id="problem" className="py-20 md:py-32 bg-white border-b border-gray-100 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <Reveal>
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-[10px] font-bold text-red-600 mb-6 uppercase tracking-wider">
                    <AlertCircle size={12} /> Le problème
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                    Le "Silence Radio" <br className="hidden md:block" /> tue la confiance client.
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                    Entre la signature du devis et la livraison finale, c'est souvent le flou total. <br className="hidden md:block"/>
                    Vos clients s'imaginent le pire, et vous perdez votre temps à les rassurer.
                </p>
            </div>
        </Reveal>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            
            {/* BOX 1: THE NOTIFICATION FLOOD (Large Left) */}
            <Reveal delay={100} className="md:col-span-4 h-full">
                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 h-full relative overflow-hidden group flex flex-col md:block">
                    <div className="relative z-10 mb-8 md:mb-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Harcèlement constant</h3>
                        <p className="text-gray-500 text-sm max-w-xs">WhatsApp, Emails, SMS... La pression monte quand le client n'a pas de visibilité.</p>
                    </div>

                    {/* Visual: Notification Stack */}
                    <div className="relative md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 w-full md:w-[300px] space-y-3 opacity-90">
                        {/* Notif 1 */}
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-start gap-3 transform md:group-hover:-translate-x-2 transition-transform duration-500">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0 text-white">
                                <MessageSquare size={14} fill="currentColor"/>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-gray-900">Client (WhatsApp)</div>
                                <div className="text-[10px] text-gray-500">Hello ! On peut avoir un export ?</div>
                            </div>
                            <span className="text-[9px] text-gray-400 ml-auto">10:42</span>
                        </div>
                        {/* Notif 2 */}
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-start gap-3 transform md:translate-x-4 md:group-hover:translate-x-2 transition-transform duration-500 delay-75">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shrink-0 text-white">
                                <Mail size={14}/>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-gray-900">Agence (Email)</div>
                                <div className="text-[10px] text-gray-500">URGENT: Besoin des fichiers pour...</div>
                            </div>
                            <span className="text-[9px] text-gray-400 ml-auto">10:45</span>
                        </div>
                        {/* Notif 3 */}
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-start gap-3 transform md:translate-x-8 md:group-hover:translate-x-6 transition-transform duration-500 delay-150">
                            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center shrink-0 text-white">
                                <Bell size={14}/>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-gray-900">Message vocal</div>
                                <div className="text-[10px] text-gray-500">Rappelle-moi dès que possible stp.</div>
                            </div>
                            <span className="text-[9px] text-gray-400 ml-auto">11:02</span>
                        </div>
                    </div>
                </div>
            </Reveal>

            {/* BOX 2: TRUST GRAPH (Top Right) */}
            <Reveal delay={200} className="md:col-span-2">
                <div className="bg-white rounded-3xl p-8 border border-gray-200 h-full relative overflow-hidden min-h-[250px]">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Anxiété Client</h3>
                            <p className="text-xs text-gray-400 mt-1">Niveau de confiance</p>
                        </div>
                        <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                            <TrendingDown size={20}/>
                        </div>
                    </div>
                    
                    {/* Abstract Graph */}
                    <div className="flex items-end justify-between h-24 gap-2 px-2">
                        <div className="w-full bg-gray-100 rounded-t-sm h-[80%]"></div>
                        <div className="w-full bg-gray-100 rounded-t-sm h-[60%]"></div>
                        <div className="w-full bg-gray-100 rounded-t-sm h-[40%]"></div>
                        <div className="w-full bg-red-100 rounded-t-sm h-[20%] relative group cursor-pointer">
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Panique
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                        <span>J-1</span>
                        <span>J-15</span>
                        <span>J-30</span>
                    </div>
                </div>
            </Reveal>

        </div>
      </div>
    </section>
  );
};
