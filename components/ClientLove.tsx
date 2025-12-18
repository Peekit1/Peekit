
import React from 'react';
import { Star, MessageCircle, Heart, Quote } from 'lucide-react';
import { Reveal } from './Reveal';

// Base components without hardcoded positioning for flexibility
const ReviewCard = ({ name, text, delay, className = "" }: { name: string, text: string, delay: string, className?: string }) => (
    <div 
        className={`bg-white border border-gray-100 p-5 md:p-6 rounded-2xl text-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${className}`}
        style={{ animationDelay: delay }}
    >
        <div className="flex items-center gap-2 mb-2 md:mb-3">
            <div className="flex gap-0.5 text-gray-900">
                <Star className="w-2.5 h-2.5 md:w-3 md:h-3" fill="currentColor" />
                <Star className="w-2.5 h-2.5 md:w-3 md:h-3" fill="currentColor" />
                <Star className="w-2.5 h-2.5 md:w-3 md:h-3" fill="currentColor" />
                <Star className="w-2.5 h-2.5 md:w-3 md:h-3" fill="currentColor" />
                <Star className="w-2.5 h-2.5 md:w-3 md:h-3" fill="currentColor" />
            </div>
            <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-wider">{name}</span>
        </div>
        <p className="text-xs md:text-sm font-medium leading-relaxed text-gray-700">"{text}"</p>
    </div>
);

const NotificationCard = ({ text, time, delay, className = "" }: { text: string, time: string, delay: string, className?: string }) => (
    <div 
        className={`bg-white border border-gray-100 text-gray-900 p-3 md:p-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] flex items-start gap-3 max-w-[260px] md:max-w-[280px] ${className}`}
        style={{ animationDelay: delay }}
    >
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 shrink-0 border border-gray-100">
            <MessageCircle size={16} fill="currentColor" className="opacity-20"/>
            <MessageCircle size={16} className="absolute" />
        </div>
        <div>
            <div className="flex justify-between items-baseline mb-1 w-full">
                <span className="font-bold text-xs text-gray-900">Julie (Mariée)</span>
                <span className="text-[9px] text-gray-400">{time}</span>
            </div>
            <p className="text-xs text-gray-600 leading-snug">{text}</p>
        </div>
    </div>
);

export const ClientLove: React.FC = () => {
  return (
    <section className="bg-white py-20 md:py-24 overflow-hidden relative border-b border-gray-100">
      
      {/* Background - Clean White */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-30">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gray-50 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gray-100 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              
              {/* LEFT: CONTENT */}
              <div className="flex-1 text-center lg:text-left">
                  <Reveal>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-[11px] font-bold text-gray-900 mb-8 uppercase tracking-wider">
                          <Heart size={12} className="text-gray-900" fill="currentColor"/> L'Effet Peekit
                      </div>
                      <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tighter leading-[1.1]">
                          Transformez l'attente <br/> en <span className="text-gray-900">recommandation.</span>
                      </h2>
                      <p className="text-gray-500 text-lg mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
                          Quand un client sait où vous en êtes, il ne stresse pas. Il apprécie. 
                          Passez du statut de "prestataire en retard" à celui de "pro transparent".
                      </p>
                  </Reveal>
              </div>

              {/* RIGHT: VISUALS */}
              <div className="flex-1 w-full relative">
                  
                  {/* MOBILE VIEW (Stack Layout) - Clean & Readable */}
                  <div className="lg:hidden flex flex-col gap-6 items-center w-full max-w-md mx-auto relative mt-4">
                      {/* Decorative background for mobile */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-gray-50 to-transparent opacity-60 blur-3xl -z-10"></div>

                      <ReviewCard 
                          name="Thomas, CEO Startup" 
                          text="C'est la première fois qu'un créatif me tient au courant sans que j'aie à demander. Top."
                          delay="0s"
                          className="w-full transform -rotate-1 shadow-sm border-gray-200"
                      />

                      <NotificationCard 
                          time="10:42" 
                          text="Whaou ! Je viens de voir l'avancée 'Retouche' passer à 80%. Trop hâte 😍"
                          delay="0s"
                          className="self-end mr-2 shadow-md rotate-2 border-gray-200"
                      />

                      <ReviewCard 
                          name="Sarah & Paul" 
                          text="Le petit lien de suivi a fait toute la différence. On s'est sentis VIP."
                          delay="0s"
                          className="w-full transform rotate-1 shadow-sm border-gray-200"
                      />
                  </div>

                  {/* DESKTOP VIEW (3D Scattered Layout) - Floating & Interactive */}
                  <div className="hidden lg:block relative w-full h-[500px] perspective-[1000px]">
                      <div className="relative w-full h-full transform rotate-y-[-10deg] rotate-x-[5deg] transition-transform duration-500 hover:rotate-0">
                            
                            {/* Centerpiece Circle (Subtle) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gray-50 rounded-full blur-[60px] animate-pulse"></div>

                            {/* Cards - Desktop Absolute Positioning */}
                            <ReviewCard 
                                name="Thomas, CEO Startup" 
                                text="C'est la première fois qu'un créatif me tient au courant sans que j'aie à demander. Top."
                                delay="0s"
                                className="absolute top-10 left-0 z-10 max-w-xs rotate-[-3deg] animate-float"
                            />

                            <NotificationCard 
                                time="10:42" 
                                text="Whaou ! Je viens de voir l'avancée 'Retouche' passer à 80%. Trop hâte 😍"
                                delay="2s"
                                className="absolute top-1/2 right-[-20px] z-30 max-w-[280px] animate-float"
                            />

                            <ReviewCard 
                                name="Sarah & Paul" 
                                text="Le petit lien de suivi a fait toute la différence. On s'est sentis VIP."
                                delay="1.5s"
                                className="absolute bottom-10 left-10 z-20 max-w-xs rotate-[2deg] animate-float"
                            />
                            
                            {/* Decorative Icon */}
                            <div className="absolute top-20 right-10 text-gray-50 rotate-12 -z-10">
                                <Quote size={120} />
                            </div>

                      </div>
                  </div>

              </div>

          </div>
      </div>
    </section>
  );
};
