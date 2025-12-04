import React from 'react';
import { Reveal } from './Reveal';
import { 
  Activity, LayoutGrid, Settings, LogOut, 
  Search, Bell, Pencil, Trash2,
  Clock, Check, Package, FolderOpen,
  ChevronRight, Lock
} from 'lucide-react';

export const ProductShowcase: React.FC = () => {
  // Données fictives pour remplir le dashboard
  const projects = [
    {
      id: 1,
      client: "Nike Air Max Launch",
      type: "VIDÉO PUBLICITAIRE",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
      update: "À l'instant",
      progress: 60, // Stage 3/5
      completed: false
    },
    {
      id: 2,
      client: "Sophie & Thomas",
      type: "MARIAGE",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800", // Nouvelle image valide (Mariage)
      update: "Il y a 2h",
      progress: 100, // Stage 5/5
      completed: true
    },
    {
      id: 3,
      client: "Bloom Coffee",
      type: "IDENTITÉ VISUELLE",
      image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800",
      update: "Il y a 5h",
      progress: 20, // Stage 1/5
      completed: false
    },
    {
      id: 4,
      client: "Paris Fashion Week",
      type: "SHOOTING MODE",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800",
      update: "Hier",
      progress: 40, // Stage 2/5
      completed: false
    },
    {
        id: 5,
        client: "Tesla Model Y",
        type: "VIDÉO",
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800",
        update: "Il y a 1j",
        progress: 80, // Stage 4/5
        completed: false
      },
      {
        id: 6,
        client: "Restaurant ONA",
        type: "CULINAIRE",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
        update: "Il y a 2j",
        progress: 100,
        completed: true
      }
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-b border-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
            <Reveal>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-50 border border-lime-200 text-[10px] font-bold text-lime-800 mb-6 uppercase tracking-wider">
                    Interface Admin
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]">
                    La tour de contrôle <br/> de vos projets.
                </h2>
                <p className="text-base md:text-lg text-gray-500 leading-relaxed font-light px-4">
                    Gérez tous vos dossiers en un coup d'œil. Vos clients sont informés, vous restez concentré.
                </p>
            </Reveal>
        </div>

        <Reveal delay={200}>
            {/* REALISTIC DASHBOARD REPLICA */}
            <div className="relative mx-auto max-w-6xl">
                
                {/* WINDOW FRAME */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col md:flex-row h-[400px] sm:h-[550px] md:h-[700px] text-left">
                    
                    {/* SIDEBAR REPLICA */}
                    <div className="hidden md:flex w-60 border-r border-gray-100 bg-white flex-col shrink-0">
                        <div className="p-6 flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
                                <Activity size={16} strokeWidth={1.5}/>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm tracking-tight text-gray-900 leading-tight uppercase">STUDIO LUMIÈRE</span>
                                <span className="text-[9px] font-bold uppercase tracking-wider mt-1 px-1.5 py-0.5 rounded w-fit bg-indigo-50 text-indigo-600">
                                    Plan Pro
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 px-3 space-y-0.5">
                            <div className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 text-gray-900 font-semibold cursor-default">
                                <LayoutGrid size={16} strokeWidth={1.5} />
                                <span className="text-[13px]">Projets actifs</span>
                            </div>
                            <div className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-default">
                                <Settings size={16} strokeWidth={1.5} />
                                <span className="text-[13px]">Paramètres</span>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100/50">
                            <div className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400">
                                <LogOut size={16} strokeWidth={1.5} />
                                <span className="text-[13px]">Déconnexion</span>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT REPLICA */}
                    <div className="flex-1 flex flex-col bg-white min-w-0">
                        
                        {/* HEADER REPLICA */}
                        <div className="h-14 md:h-16 border-b border-gray-100 flex items-center justify-between px-4 md:px-8 bg-white/80 shrink-0 sticky top-0 z-10 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <h1 className="text-xs md:text-sm font-semibold text-gray-900">Dashboard</h1>
                            </div>
                            
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="relative hidden lg:block group">
                                    <Search size={14} className="absolute left-3 top-2.5 text-gray-400 group-hover:text-gray-600"/>
                                    <div className="pl-9 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg text-[13px] w-56 text-gray-400">Rechercher...</div>
                                </div>
                                <div className="relative text-gray-400">
                                    <Bell size={18} strokeWidth={1.5} />
                                    <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
                                </div>
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold border border-gray-200 uppercase tracking-widest cursor-default">
                                    SL
                                </div>
                            </div>
                        </div>

                        {/* LIST VIEW REPLICA */}
                        <div className="flex-1 overflow-hidden p-4 md:p-8 bg-white relative">
                            {/* Scroll fade overlay */}
                            <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-t from-white to-transparent z-10"></div>
                            
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-base md:text-lg font-bold text-gray-900 tracking-tight">Projets actifs</h2>
                                        <p className="text-[10px] md:text-xs text-gray-500 mt-1">Gérez vos suivis post-production.</p>
                                    </div>
                                    <div className="bg-black text-white text-[10px] md:text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-gray-200">
                                        <div className="w-3.5 h-3.5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg></div>
                                        <span className="hidden sm:inline">Nouveau Projet</span>
                                        <span className="sm:hidden">Nouveau</span>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 pb-20">
                                    {projects.map((project) => (
                                        <div 
                                            key={project.id} 
                                            className="group bg-white rounded-xl border border-gray-100 p-4 md:p-5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-all cursor-default relative"
                                        >
                                            <div className="flex items-start justify-between mb-4 md:mb-6">
                                                <div className="flex items-center gap-3 md:gap-4">
                                                    <img src={project.image} className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-gray-100 shadow-sm" alt={project.client}/>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-xs md:text-sm group-hover:text-indigo-600 transition-colors tracking-tight line-clamp-1">{project.client}</h3>
                                                        <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{project.type}</p>
                                                    </div>
                                                </div>
                                                <div className={`
                                                    px-2 py-1 rounded-md text-[9px] md:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border
                                                    ${project.completed 
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                        : 'bg-gray-50 text-gray-600 border-gray-100'}
                                                `}>
                                                    {project.completed ? (
                                                        <>
                                                            <Check size={10} strokeWidth={2} /> Terminé
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Activity size={10} strokeWidth={2} /> En cours
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Fake Buttons on Hover */}
                                            <div className="absolute top-4 right-4 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-gray-100 shadow-sm">
                                                <div className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                                                    <Pencil size={12} strokeWidth={1.5}/>
                                                </div>
                                                <div className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                                                    <Trash2 size={12} strokeWidth={1.5}/>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${project.completed ? 'bg-emerald-500' : 'bg-gray-900'}`}
                                                        style={{ width: `${project.progress}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-[9px] md:text-[10px] text-gray-400 font-medium tracking-wide">
                                                    <span className="flex items-center gap-1"><Clock size={10} strokeWidth={1.5}/> {project.update}</span>
                                                    <span>{project.progress}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Blur */}
                <div className="absolute -inset-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-[2rem] -z-10 blur-2xl opacity-40"></div>
            </div>
        </Reveal>
      </div>
    </section>
  );
};