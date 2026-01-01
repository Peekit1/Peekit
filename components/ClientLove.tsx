
import React from 'react';
import { Calendar, Clock, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { Reveal } from './Reveal';

export const ClientLove: React.FC = () => {
  return (
    <section className="bg-gray-900 py-32 text-white overflow-hidden relative">
      <div className="container mx-auto px-6 max-w-5xl">
          <div className="space-y-32">
              
              {/* L'AVANCEMENT, BIEN PRÉSENTÉ */}
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <Reveal>
                      <div className="space-y-8">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Le Design</span>
                          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Une progression visible, sans pression.</h2>
                          <p className="text-lg text-gray-400 font-light leading-relaxed">
                              Peekit montre l’état d’avancement à travers des étapes claires et une progression compréhensible en un coup d’œil.
                          </p>
                          <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4">
                              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={12}/> Pas de dates imposées</div>
                              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={12}/> Pas de compte à rebours</div>
                          </div>
                      </div>
                  </Reveal>
                  
                  <Reveal delay={200}>
                      <div className="relative">
                          <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full"></div>
                          <div className="relative bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                              <div className="space-y-6">
                                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                      <div className="h-full bg-white w-2/3 rounded-full"></div>
                                  </div>
                                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                      <span>Étape 3 : Retouches</span>
                                      <span className="text-white">65%</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </Reveal>
              </div>

              {/* LE TEMPS LONG, ASSUMÉ */}
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <Reveal className="lg:order-2">
                      <div className="space-y-8">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Le Rythme</span>
                          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Le temps long, assumé.</h2>
                          <p className="text-lg text-gray-400 font-light leading-relaxed">
                              Certains projets s’inscrivent sur plusieurs semaines. Peekit permet d’en poser le cadre naturellement, sans transformer ce temps en contrainte visible.
                          </p>
                          <p className="text-sm text-gray-500 font-medium italic border-l border-white/20 pl-4">
                              "Votre rythme reste libre. Votre image reste professionnelle."
                          </p>
                      </div>
                  </Reveal>

                  <Reveal delay={200} className="lg:order-1">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                              <Calendar size={24} className="mx-auto mb-4 text-gray-500"/>
                              <div className="text-xs font-bold uppercase tracking-widest">Cadre posé</div>
                          </div>
                          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                              <Clock size={24} className="mx-auto mb-4 text-gray-500"/>
                              <div className="text-xs font-bold uppercase tracking-widest">Post-production</div>
                          </div>
                      </div>
                  </Reveal>
              </div>

          </div>
      </div>
    </section>
  );
};
