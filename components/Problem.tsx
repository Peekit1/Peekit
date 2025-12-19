import React from 'react';
import { Clock, Send, Bell, MessageSquare } from 'lucide-react';
import { Reveal } from './Reveal';

// On définit l'animation localement pour éviter les bugs liés au zoom/CDN
const animationStyle = {
  animation: 'slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
};

const ChatBubble = ({ text, isMe, time, delay }: { text: string, isMe?: boolean, time: string, delay: string }) => (
    <div 
        className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} opacity-0`}
        // On applique l'animation directement ici
        style={{ 
            ...animationStyle, 
            animationDelay: delay 
        }}
    >
        <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm relative ${
            isMe 
                ? 'bg-gray-900 text-white rounded-br-none' 
                : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none'
        }`}>
            {text}
            <span className={`text-[9px] absolute bottom-1 ${isMe ? 'right-2 text-gray-400' : 'left-2 text-gray-300'}`}>
                {time}
            </span>
        </div>
    </div>
);

export const Problem: React.FC = () => {
  return (
    <section id="problem" className="py-20 md:py-24 bg-gray-50 border-b border-gray-200 overflow-hidden">
      {/* Injection des Keyframes directement dans le composant pour garantir l'animation */}
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* LEFT: TEXT CONTENT */}
            <Reveal>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-[11px] font-bold text-gray-500 mb-6 shadow-sm">
                    <Clock size={12}/>
                    Le problème actuel
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                    La "Zone Grise" <br/> de la post-production.
                </h2>
                <p className="text-lg text-gray-500 mb-8 leading-relaxed font-light">
                    Le shooting est fini, le client est rentré. Pour lui, c'est terminé. Pour vous, le travail de l'ombre commence. 
                    <strong className="text-gray-900 font-medium block mt-2">C'est dans ce silence que naît l'inquiétude.</strong>
                </p>

                <div className="space-y-6 border-l-2 border-gray-200 pl-6">
                    <div className="group">
                        <h4 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-black transition-colors">Temps perdu à rassurer</h4>
                        <p className="text-sm text-gray-500">Répondre aux "C'est pour quand ?" coupe votre élan créatif.</p>
                    </div>
                    <div className="group">
                        <h4 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-black transition-colors">Travail invisible non valorisé</h4>
                        <p className="text-sm text-gray-500">Le client ne réalise pas les heures passées sur les retouches.</p>
                    </div>
                </div>
            </Reveal>

            {/* RIGHT: VISUALS */}
            <div className="mt-8 lg:mt-0 relative w-full">
                
                {/* MOBILE VISUAL: Compact Notifications Stack */}
                <div className="md:hidden w-full max-w-[280px] mx-auto relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-40 bg-red-500/10 blur-3xl rounded-full -z-10"></div>
                    
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100 flex gap-3 transform -rotate-2 opacity-0" style={{ ...animationStyle, animationDelay: '0.2s' }}>
                             <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0 border border-gray-100">
                                 <MessageSquare size={18} />
                             </div>
                             <div>
                                 <p className="text-xs font-bold text-gray-900 mb-0.5">Client Inquiet</p>
                                 <p className="text-xs text-gray-500 leading-snug">"Toujours pas de nouvelles des photos ?..."</p>
                             </div>
                             <span className="text-[10px] text-gray-300 font-mono ml-auto">10:02</span>
                        </div>

                        <div className="bg-white p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.1)] border border-gray-100 flex gap-3 transform rotate-2 translate-x-3 opacity-0" style={{ ...animationStyle, animationDelay: '0.4s' }}>
                             <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0 border border-red-100 animate-pulse">
                                 <Bell size={18} />
                             </div>
                             <div>
                                 <p className="text-xs font-bold text-gray-900 mb-0.5">3 Appels manqués</p>
                                 <p className="text-xs text-gray-500 leading-snug">Ça commence à urgerrr 😰</p>
                             </div>
                             <span className="text-[10px] text-red-300 font-bold font-mono ml-auto">10:15</span>
                        </div>
                    </div>
                </div>

                {/* DESKTOP VISUAL: Full Animated Chat */}
                <div className="hidden md:block relative mx-auto w-full max-w-sm">
                    <div className="absolute inset-0 bg-gray-200/50 rounded-[2rem] blur-3xl -z-10"></div>
                    
                    <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-2xl overflow-hidden h-[500px] flex flex-col">
                        {/* Header */}
                        <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex items-center gap-3 sticky top-0 z-10">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-500">CL</div>
                            <div className="flex-1">
                                <div className="text-xs font-bold text-gray-900">Client inquiet</div>
                                <div className="text-[10px] text-gray-400">En ligne il y a 5 min</div>
                            </div>
                        </div>

                        {/* Messages Container - Added min-h-0 to fix flex collapse with zoom */}
                        <div className="flex-1 p-4 space-y-6 overflow-y-auto bg-gray-50/50 scrollbar-hide pb-20 min-h-0">
                            <div className="text-center text-[10px] text-gray-400 font-medium my-4">Mardi 14:30</div>
                            
                            <ChatBubble delay="0s" time="14:30" text="Super shooting hier ! J'ai hâte de voir les photos 😍" />
                            <ChatBubble delay="1s" time="17:45" text="Merci ! Je commence le tri dès demain." isMe />
                            
                            <div className="text-center text-[10px] text-gray-400 font-medium my-4">Aujourd'hui</div>
                            
                            <ChatBubble delay="2s" time="09:15" text="Salut ! Tu penses avoir les premières retouches quand ?" />
                            <ChatBubble delay="3.5s" time="10:30" text="Est-ce que je pourrais voir un aperçu avant vendredi ? J'en ai besoin pour le CM..." />
                            
                            {/* Typing Indicator */}
                            <div className="flex opacity-0" style={{ ...animationStyle, animationDelay: '5s' }}>
                                 <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1 shadow-sm">
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                 </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-gray-100 z-10 relative">
                            <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 text-sm text-gray-400 border border-gray-100">
                                <span className="flex-1">Je suis en plein derush...</span>
                                <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-sm">
                                    <Send size={12} className="ml-0.5"/>
                                </div>
                            </div>
                        </div>

                        {/* Gradient Overlay bottom */}
                        <div className="absolute bottom-16 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent pointer-events-none"></div>
                    </div>
                </div>

            </div>

        </div>
      </div>
    </section>
  );
};
