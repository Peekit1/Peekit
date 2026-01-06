import React from 'react';
import { ArrowRight, Calendar, ImageIcon, Pencil, Trash2, Search, Filter } from 'lucide-react';
import { Button } from './Button';
import { Reveal } from './Reveal';
import { AuthNavigationProps, Project, StagesConfiguration } from '../types';

// --- DONNÉES MOCK (FICTIVES) POUR LE VISUEL ---

const MOCK_STAGES_CONFIG: StagesConfiguration = [
  { id: 'secured', label: "Sécurisation", minDays: 0, maxDays: 1, message: "" },
  { id: 'culling', label: "Tri", minDays: 1, maxDays: 2, message: "" },
  { id: 'editing', label: "Retouche", minDays: 3, maxDays: 7, message: "" },
  { id: 'export', label: "Export", minDays: 1, maxDays: 2, message: "" },
  { id: 'delivery', label: "Livraison", minDays: 0, maxDays: 1, message: "" }
];

// Fonction pour simuler la progression
const getProjectStageInfo = (project: Partial<Project>) => {
    const activeConfig = MOCK_STAGES_CONFIG;
    const stages = ['secured', 'culling', 'editing', 'export', 'delivery'];
    const stageIndex = parseInt(project.id || '0') % stages.length; 
    const currentStageId = stages[stageIndex];
    
    const index = activeConfig.findIndex(s => s.id === currentStageId);
    const progress = Math.round(((index + 1) / activeConfig.length) * 100);
    return { label: activeConfig[index].label, progress: progress };
};

const MOCK_PROJECTS: Partial<Project>[] = [
    { 
        id: '1', clientName: 'Sophie & Marc', clientEmail: 'mariage.sm@email.com', type: 'Mariage', 
        date: '14 juin 2025', 
        coverImage: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=100&h=100' 
    },
    { 
        id: '2', clientName: 'Studio Sartori', clientEmail: 'contact@sartori.com', type: 'Shooting Mode', 
        date: '28 mai 2025', 
        coverImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=100&h=100' 
    },
    { 
        id: '3', clientName: 'TechSolutions Inc.', clientEmail: 'compta@techsol.io', type: 'Corporate', 
        date: '15 mai 2025', 
        coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=100&h=100' 
    },
    { 
        id: '4', clientName: 'Julie Dubois', clientEmail: 'julie.d@outlook.fr', type: 'Identité Visuelle', 
        date: '02 mai 2025', 
        coverImage: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=100&h=100' 
    },
    { 
        id: '5', clientName: 'Restaurant L’Olivier', clientEmail: 'chef@lolivier.fr', type: 'Vidéo Publicitaire', 
        date: '20 avril 2025', 
        coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=100&h=100' 
    },
    { 
        id: '6', clientName: 'Emma & Lucas', clientEmail: 'el.wedding@gmail.com', type: 'Mariage', 
        date: '10 avril 2025', 
        coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=100&h=100' 
    },
    { 
        id: '7', clientName: 'Alpine Sport', clientEmail: 'marketing@alpine.com', type: 'Shooting Mode', 
        date: '05 avril 2025', 
        coverImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=100&h=100' 
    },
];

export const Hero: React.FC<AuthNavigationProps> = ({ onAuthClick }) => {
  return (
    'md:pb-24' au lieu de 'md:pb-40' pour remonter le bas
    <section className="relative pt-40 pb-16 md:pt-60 md:pb-24 overflow-hidden bg-gradient-to-b from-white via-white to-blue-50/60">
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* TITRE ET APPEL À L'ACTION */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12 md:mb-24">
          
          <Reveal delay={0}>
            <h1 
              className="text-3xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tighter mb-10 leading-[1.2] sm:leading-[1.1]"
              style={{ textWrap: 'balance' }} 
            >
              Offrez une expérience aussi soignée que votre travail.
            </h1>
          </Reveal>
          
          <Reveal delay={200}>
            <p className="text-lg sm:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Peekit transforme le suivi d’un projet créatif en une expérience fluide, élégante et professionnelle <span className="text-gray-900">sans changer votre manière de créer.</span>
            </p>
          </Reveal>
          
          <Reveal delay={300}>
            <div className="flex flex-col items-center gap-8">
              <Button 
                variant="black" 
                size="lg" 
                onClick={() => onAuthClick('signup')} 
                className="!rounded-full px-10 h-14 text-base shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                Commencer gratuitement <ArrowRight size={18} />
              </Button>
              
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">La nouvelle manière de partager l’avancement</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* --- RÉPLIQUE DU DASHBOARD (Masquée sur mobile) --- */}
        <Reveal delay={400} className="hidden md:block relative z-10 perspective-1000">
            {/* Halo lumineux arrière */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-blue-400/10 blur-[100px] -z-10 rounded-full"></div>
            
            <div className="max-w-7xl mx-auto transform transition-all hover:-translate-y-2 duration-700 ease-out">
                {/* Cadre de la fenêtre */}
                <div className="bg-white border border-gray-200/80 rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden ring-1 ring-black/5">
                    
                    {/* Barre de titre / Navigation Dashboard */}
                    <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6">
                        {/* Fake Traffic Lights */}
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
                        </div>

                        {/* Fake Search Bar & Actions */}
                        <div className="hidden sm:flex items-center gap-4">
                           <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100 text-gray-400 text-xs w-48">
                                <Search size={14}/>
                                <span>Rechercher...</span>
                           </div>
                           <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <Filter size={14}/>
                           </div>
                           <div className="h-8 w-24 bg-black rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md shadow-gray-900/10">
                                + Projet
                           </div>
                        </div>
                    </div>

                    {/* Contenu du tableau */}
                    <div className="overflow-x-auto bg-white min-h-[400px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/30">
                                    <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client</th>
                                    <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden md:table-cell">Détails</th>
                                    <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avancement</th>
                                    <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-24 text-right"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_PROJECTS.map((project, index) => {
                                    const { label, progress } = getProjectStageInfo(project);
                                    
                                    return (
                                        <tr key={project.id} className="border-b border-gray-50 last:border-0 group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-6">
                                              <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                    {project.coverImage ? (
                                                        <img src={project.coverImage} className="w-full h-full object-cover" alt="cover"/>
                                                    ) : (
                                                        <ImageIcon size={18} className="text-gray-300" />
                                                    )}
                                                </div>
                                                <div>
                                                  <div className="font-bold text-gray-900 text-sm">{project.clientName}</div>
                                                  <div className="text-xs text-gray-500 hidden sm:block">{project.clientEmail}</div>
                                                </div>
                                              </div>
                                            </td>
                                            <td className="py-4 px-6 hidden md:table-cell">
                                                <div className="space-y-1">
                                                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 uppercase">{project.type}</span>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1.5"><Calendar size={12}/> {project.date}</div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="w-full max-w-[180px]">
                                                    <div className="flex justify-between items-end mb-1.5">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate mr-2">{label}</span>
                                                        <span className="text-xs font-bold text-gray-900">{progress}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-black rounded-full" style={{ width: `${progress}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-400 hover:text-black hover:border-gray-300"><Pencil size={14}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        
                        {/* Pagination factice pour finir la fenêtre */}
                        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                            <div className="text-xs text-gray-400 font-medium">Page 1 / 1</div>
                            <div className="flex gap-2">
                                <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                                <div className="h-2 w-2 rounded-full bg-gray-200"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Reveal>
      </div>

      {/* --- TRANSITION DOUCE (FONDU) VERS LA SECTION SUIVANTE --- */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none z-20"></div>

    </section>
  );
};
