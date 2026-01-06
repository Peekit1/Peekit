import React from 'react';
import { ArrowRight, Calendar, ImageIcon, Pencil, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { Reveal } from './Reveal';
import { AuthNavigationProps, Project, StagesConfiguration } from '../types';

// --- DONNÉES MOCK POUR LE VISUEL HERO ---

// Configuration d'étapes par défaut pour l'affichage
const MOCK_STAGES_CONFIG: StagesConfiguration = [
  { id: 'secured', label: "Sécurisation", minDays: 0, maxDays: 1, message: "" },
  { id: 'culling', label: "Tri", minDays: 1, maxDays: 2, message: "" },
  { id: 'editing', label: "Retouche", minDays: 3, maxDays: 7, message: "" },
  { id: 'export', label: "Export", minDays: 1, maxDays: 2, message: "" },
  { id: 'delivery', label: "Livraison", minDays: 0, maxDays: 1, message: "" }
];

// Fonction utilitaire pour calculer la progression (copiée du Dashboard)
const getProjectStageInfo = (project: Project) => {
    const activeConfig = project.stagesConfig || MOCK_STAGES_CONFIG;
    const index = activeConfig.findIndex(s => s.id === project.currentStage);
    if (index === -1) return { label: activeConfig[0]?.label || 'Non débuté', progress: 0 };
    const progress = Math.round(((index + 1) / activeConfig.length) * 100);
    return { label: activeConfig[index].label, progress: progress };
};

// Liste de faux projets pour remplir le tableau
const MOCK_PROJECTS: Partial<Project>[] = [
    { id: '1', clientName: 'Sophie & Marc', clientEmail: 'mariage.sm@email.com', type: 'Mariage', date: '2024-10-12', currentStage: 'editing', stagesConfig: MOCK_STAGES_CONFIG },
    { id: '2', clientName: 'Studio Sartori', clientEmail: 'contact@sartori.com', type: 'Shooting Mode', date: '2024-10-15', currentStage: 'culling', stagesConfig: MOCK_STAGES_CONFIG },
    { id: '3', clientName: 'TechSolutions Inc.', clientEmail: 'compta@techsol.io', type: 'Corporate', date: '2024-10-18', currentStage: 'secured', stagesConfig: MOCK_STAGES_CONFIG },
    { id: '4', clientName: 'Julie Dubois', clientEmail: 'julie.d@outlook.fr', type: 'Identité Visuelle', date: '2024-10-20', currentStage: 'delivery', stagesConfig: MOCK_STAGES_CONFIG },
    { id: '5', clientName: 'Restaurant L’Olivier', clientEmail: 'chef@lolivier.fr', type: 'Vidéo Publicitaire', date: '2024-10-22', currentStage: 'export', stagesConfig: MOCK_STAGES_CONFIG },
    { id: '6', clientName: 'Emma & Lucas', clientEmail: 'el.wedding@gmail.com', type: 'Mariage', date: '2024-10-25', currentStage: 'editing', stagesConfig: MOCK_STAGES_CONFIG },
    { id: '7', clientName: 'Alpine Sport', clientEmail: 'marketing@alpine.com', type: 'Shooting Mode', date: '2024-10-28', currentStage: 'culling', stagesConfig: MOCK_STAGES_CONFIG },
    { id: '8', clientName: 'Cabinet Moreau', clientEmail: 'avocats@moreau.fr', type: 'Corporate', date: '2024-10-30', currentStage: 'secured', stagesConfig: MOCK_STAGES_CONFIG },
];

// --- FIN DONNÉES MOCK ---


export const Hero: React.FC<AuthNavigationProps> = ({ onAuthClick }) => {
  return (
    // MODIFICATION : Ajout du fond dégradé (bg-gradient-to-b ...)
    // Ajustement du padding bottom (pb-0) pour coller le visuel au bas de la section
    <section className="relative pt-52 pb-0 md:pt-72 md:pb-0 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* PARTIE TEXTE ET BOUTONS */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20 md:mb-32">
          
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

        {/* --- NOUVELLE SECTION : RÉPLIQUE DU DASHBOARD --- */}
        <Reveal delay={500} className="relative z-10 -mb-20 md:-mb-32 perspective-1000">
            {/* Effet de lumière derrière le dashboard */}
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl transform scale-y-110 scale-x-125 -z-10 rounded-[100px]"></div>
            
            <div className="max-w-6xl mx-auto transform transition-all hover:-translate-y-2 duration-500">
                {/* Conteneur style "fenêtre" avec grosses ombres */}
                <div className="bg-white border border-gray-200/80 rounded-3xl shadow-2xl shadow-blue-900/5 overflow-hidden backdrop-blur-sm relative">
                    
                    {/* Fausse barre de titre de navigateur */}
                    <div className="h-12 bg-gray-50/80 border-b border-gray-100 flex items-center px-6 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-300/60 border border-red-400/30"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-300/60 border border-amber-400/30"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-300/60 border border-emerald-400/30"></div>
                    </div>

                    {/* Réplique du tableau du Dashboard (Version Desktop) */}
                    <div className="overflow-x-auto bg-white/70 backdrop-blur-md relative pointer-events-none select-none p-2">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/40">
                                    <th className="py-3 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client</th>
                                    <th className="py-3 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden md:table-cell">Détails</th>
                                    <th className="py-3 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avancement</th>
                                    <th className="py-3 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-24 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_PROJECTS.map((project, index) => {
                                    // Cast en 'Project' car nos données mock sont partielles mais suffisantes ici
                                    const { label, progress } = getProjectStageInfo(project as Project);
                                    // Opacité progressive pour les derniers éléments pour un effet de fondu vers le bas
                                    const opacityClass = index > 5 ? (index === 6 ? 'opacity-70' : 'opacity-40') : 'opacity-100';

                                    return (
                                        <tr key={project.id} className={`border-b border-gray-50 last:border-0 transition-opacity ${opacityClass}`}>
                                            <td className="py-4 px-6">
                                              <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                    <ImageIcon size={18} className="text-gray-300" />
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
                                                <div className="flex items-center justify-end gap-2 opacity-50">
                                                    <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-400"><Pencil size={14}/></button>
                                                    <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-400"><Trash2 size={14}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {/* Dégradé blanc en bas pour fondre le tableau */}
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </Reveal>
      </div>
    </section>
  );
};
