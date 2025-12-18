
import React, { useEffect, useRef, useState } from 'react';
import { 
  LayoutGrid, CheckCircle2, Search, 
  MoreHorizontal, Activity, Calendar, MapPin 
} from 'lucide-react';

export const ProductShowcase: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger a bit earlier so the animation starts as it comes into view
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2, rootMargin: "0px" }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-white border-b border-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]">
                La tour de contrôle <br/> de vos projets.
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed font-light">
                Une interface claire pour vous, rassurante pour eux.
            </p>
        </div>

        {/* 3D PERSPECTIVE CONTAINER */}
        <div 
            ref={containerRef}
            className="perspective-[2000px] relative mx-auto max-w-6xl px-2 sm:px-0"
        >
            {/* ANIMATED DASHBOARD REPLICA */}
            <div 
                className={`
                    relative bg-[#F3F4F6] rounded-xl border border-gray-200 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] 
                    overflow-hidden flex h-[500px] md:h-[650px]
                    transition-all duration-1000 ease-out transform-gpu
                    ${isVisible 
                        ? 'rotate-x-0 translate-y-0 opacity-100 scale-100' 
                        : 'rotate-x-12 translate-y-24 opacity-0 scale-95'}
                `}
                style={{ transformStyle: 'preserve-3d' }}
            >
                
                {/* SIDEBAR */}
                <div className="hidden md:flex w-64 bg-white flex-col shrink-0 border-r border-gray-200 p-6">
                    {/* User Profile Widget */}
                    <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 mb-8 border border-gray-100">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white shrink-0">
                            <Activity size={18} strokeWidth={2.5}/>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900 text-sm">Studio Demo</div>
                            <div className="text-[10px] text-gray-500 font-medium">Plan Pro</div>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm">
                            <LayoutGrid size={18} /> Dashboard
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-colors">
                            <CheckCircle2 size={18} /> Tâches
                        </div>
                    </nav>
                </div>

                {/* MAIN CONTENT */}
                <div className="flex-1 flex flex-col min-w-0 bg-transparent">
                    
                    {/* HEADER */}
                    <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
                        <h2 className="text-lg font-bold text-gray-900">Vue d'ensemble</h2>
                        
                        <div className="flex items-center gap-4">
                            <div className="relative hidden lg:block">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                <div className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-64 text-gray-400 shadow-sm">
                                    Rechercher...
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-200">
                                JD
                            </div>
                        </div>
                    </div>

                    {/* DASHBOARD GRID */}
                    <div className="p-8 overflow-hidden bg-[#F3F4F6] flex-1">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            
                            {/* CARD 1: NIKE AIR MAX */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex gap-4">
                                        <img 
                                            src="https://images.unsplash.com/photo-1600185365926-3a810c9d0dd0?auto=format&fit=crop&q=80&w=200" 
                                            className="w-12 h-12 rounded-xl object-cover shadow-sm"
                                            alt="Nike"
                                        />
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-base">Nike Air Max</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Commercial</p>
                                        </div>
                                    </div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse"></div>
                                </div>
                                
                                <div className="space-y-3 mt-6">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-900">Montage</span>
                                        <span className="text-indigo-600">65%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 w-[65%] rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)]"></div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-[10px] font-mono text-gray-400">MAJ: 2h</span>
                                        <div className="flex gap-1">
                                            <div className="w-8 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                                                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CARD 2: VOGUE SEPT */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex gap-4">
                                        <img 
                                            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200" 
                                            className="w-12 h-12 rounded-xl object-cover shadow-sm"
                                            alt="Vogue"
                                        />
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-base">Vogue Sept.</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Editorial</p>
                                        </div>
                                    </div>
                                    <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                        Livré
                                    </span>
                                </div>
                                
                                <div className="space-y-3 mt-6">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-900">Terminé</span>
                                        <span className="text-emerald-500">100%</span>
                                    </div>
                                    <div className="h-2 w-full bg-emerald-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-[10px] font-mono text-gray-400">MAJ: Hier</span>
                                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <CheckCircle2 size={12} strokeWidth={3}/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CARD 3: SKELETON */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm opacity-60">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gray-100"></div>
                                        <div className="space-y-2 py-1">
                                            <div className="h-3 w-24 bg-gray-100 rounded"></div>
                                            <div className="h-2 w-16 bg-gray-100 rounded"></div>
                                        </div>
                                    </div>
                                    <MoreHorizontal size={20} className="text-gray-300"/>
                                </div>
                                
                                <div className="space-y-3 mt-6">
                                    <div className="h-2 w-full bg-gray-100 rounded-full"></div>
                                    <div className="h-2 w-1/2 bg-gray-100 rounded-full"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* GLOW EFFECT BEHIND */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[3rem] -z-10 blur-3xl opacity-0 md:opacity-40 transition-opacity duration-1000 delay-500"></div>
            </div>
        </div>
      </div>
    </section>
  );
};
