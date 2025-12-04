
import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Calendar, MapPin, ExternalLink, 
  Check, Loader2, Link as LinkIcon, Lock, 
  Upload, Trash2, Camera, Pencil, Plus, Clock,
  MoreHorizontal, FileImage, Film, LayoutGrid, Settings,
  AlertCircle, RefreshCcw
} from 'lucide-react';
import { ProjectDetailsProps, WorkflowStep } from '../types';
import { Button } from './Button';

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ 
  project, 
  stageConfig,
  defaultConfig,
  userPlan,
  onBack, 
  onUpdateStage,
  onUpdateStageConfig,
  onViewClientVersion,
  onUpdatePassword,
  onUploadTeasers,
  onDeleteTeaser,
  onUpdateCoverImage
}) => {
  const [loadingStageId, setLoadingStageId] = useState<string | null>(null);
  const [password, setPassword] = useState(project.accessPassword || '');
  const [isEditingWorkflow, setIsEditingWorkflow] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  // Initialize with a deep copy to avoid reference issues
  const [localWorkflow, setLocalWorkflow] = useState<WorkflowStep[]>(stageConfig.map(s => ({ ...s })));
  const coverInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync when props change, but break reference
  useEffect(() => { 
      setLocalWorkflow(stageConfig.map(s => ({ ...s }))); 
  }, [stageConfig]);

  const currentStageIndex = stageConfig.findIndex(s => s.id === project.currentStage);
  
  const handleStageClick = async (id: string) => {
      setLoadingStageId(id);
      await onUpdateStage(id);
      setLoadingStageId(null);
  };

  const getProgress = () => {
    if (stageConfig.length === 0) return 0;
    return Math.round(((currentStageIndex + 1) / stageConfig.length) * 100);
  };

  const handleResetToDefault = async () => {
      if (confirm("Attention : cela va remplacer votre workflow actuel par le modèle par défaut et sauvegarder immédiatement. Continuer ?")) {
          // IMPORTANT: Deep copy of default config
          const freshConfig = defaultConfig.map(s => ({ ...s }));
          // 1. Mise à jour visuelle
          setLocalWorkflow(freshConfig); 
          // 2. Sauvegarde immédiate en BDD
          await onUpdateStageConfig(freshConfig); 
          // 3. Fermeture de l'éditeur pour voir le résultat
          setIsEditingWorkflow(false); 
      }
  };

  const handleCopyLink = () => {
      // Use window.location.origin to get the base URL
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/#/v/${project.id}`;
      navigator.clipboard.writeText(link);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  const handleOpenLink = () => {
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/#/v/${project.id}`;
      window.open(link, '_blank');
  };

  // --- WORKFLOW EDITOR HANDLERS ---
  const handleStepChange = (index: number, field: keyof WorkflowStep, value: string | number) => {
      const updated = [...localWorkflow];
      updated[index] = { ...updated[index], [field]: value };
      setLocalWorkflow(updated);
  };

  const handleAddStep = () => {
      const newStep: WorkflowStep = {
          id: `step_${Date.now()}`,
          label: 'Nouvelle étape',
          message: 'Description...',
          minDays: 0,
          maxDays: 1
      };
      setLocalWorkflow([...localWorkflow, newStep]);
  };

  const handleRemoveStep = (index: number) => {
      if (localWorkflow.length <= 1) return;
      const updated = localWorkflow.filter((_, i) => i !== index);
      setLocalWorkflow(updated);
  };

  const saveWorkflow = async () => {
      await onUpdateStageConfig(localWorkflow);
      setIsEditingWorkflow(false);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-gray-900 pb-20">
      
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 min-h-16 sticky top-0 z-30 px-4 md:px-8 py-3 md:py-0 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm gap-3 md:gap-0">
          <div className="flex items-center gap-4 w-full md:w-auto">
              <button 
                onClick={onBack} 
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors shrink-0"
              >
                  <ArrowLeft size={18}/>
              </button>
              <h1 className="text-base font-bold text-gray-900 leading-tight truncate">{project.clientName}</h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
               <span className="flex items-center gap-2 text-xs font-medium text-gray-500 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100 whitespace-nowrap">
                    <Clock size={12}/> <span className="hidden sm:inline">Dernière MAJ:</span> {project.lastUpdate}
               </span>
               <Button variant="black" size="sm" onClick={onViewClientVersion} className="gap-2 text-xs hover:shadow-lg hover:shadow-indigo-500/20 transition-all shrink-0">
                   <span className="hidden sm:inline">Vue Client</span> <span className="sm:hidden">Client</span> <ExternalLink size={12}/>
               </Button>
          </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
          
          {/* MASTER BENTO GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* TILE 1: INFO CARD (Top Left, Spans 2) */}
              <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col justify-center h-full min-h-[140px]">
                  <div className="flex flex-wrap items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                              <LayoutGrid size={24} strokeWidth={1.5}/>
                          </div>
                          <div>
                              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Projet</div>
                              <div className="font-bold text-gray-900 text-sm md:text-base">{project.type}</div>
                          </div>
                      </div>
                      <div className="w-px h-8 bg-gray-100 hidden sm:block"></div>
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-50 border border-purple-100 rounded-lg flex items-center justify-center text-purple-600 shrink-0">
                              <Calendar size={24} strokeWidth={1.5}/>
                          </div>
                          <div>
                              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</div>
                              <div className="font-bold text-gray-900 text-sm md:text-base">{project.date}</div>
                          </div>
                      </div>
                      <div className="w-px h-8 bg-gray-100 hidden sm:block"></div>
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-pink-50 border border-pink-100 rounded-lg flex items-center justify-center text-pink-600 shrink-0">
                              <MapPin size={24} strokeWidth={1.5}/>
                          </div>
                          <div>
                              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Lieu</div>
                              <div className="font-bold text-gray-900 text-sm md:text-base truncate max-w-[120px]">{project.location}</div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* TILE 2: PROGRESS CARD (Top Right, Spans 1) */}
              <div className="lg:col-span-1 bg-gray-900 rounded-xl p-6 border border-gray-900 shadow-sm text-white flex flex-col justify-center relative overflow-hidden group h-full min-h-[140px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-indigo-500/30 transition-colors"></div>
                  
                  <div className="relative z-10">
                      <div className="flex justify-between items-end mb-3">
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avancement</div>
                          <div className="text-3xl font-bold tracking-tight">{getProgress()}%</div>
                      </div>
                      <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000" 
                            style={{ width: `${getProgress()}%` }}
                          ></div>
                      </div>
                  </div>
              </div>

              {/* TILE 3: TIMELINE (Main Left, Spans 2) */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 text-sm">Parcours du projet</h3>
                      {!isEditingWorkflow ? (
                          <button 
                            onClick={() => setIsEditingWorkflow(true)} 
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-indigo-50"
                          >
                              <Pencil size={12}/> Modifier les étapes
                          </button>
                      ) : (
                          <div className="flex gap-2">
                              <button onClick={handleResetToDefault} className="text-gray-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors" title="Réinitialiser par défaut">
                                  <RefreshCcw size={14}/>
                              </button>
                              <Button size="sm" variant="ghost" onClick={() => setIsEditingWorkflow(false)}>Annuler</Button>
                              <Button size="sm" variant="black" onClick={saveWorkflow}>Enregistrer</Button>
                          </div>
                      )}
                  </div>
                  
                  <div className="p-4 md:p-6">
                      
                      {/* WORKFLOW EDIT MODE */}
                      {isEditingWorkflow ? (
                          <div className="space-y-4 animate-fade-in">
                              {userPlan === 'freelance' && (
                                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-center gap-3 mb-4">
                                      <Settings className="text-indigo-600" size={18} />
                                      <p className="text-xs text-indigo-800">
                                          <span className="font-bold">Mode Édition :</span> Personnalisez les étapes pour tous vos futurs projets.
                                      </p>
                                  </div>
                              )}
                              
                              {localWorkflow.map((step, index) => (
                                  <div key={step.id} className="flex gap-3 items-start p-3 bg-gray-50 rounded-xl border border-gray-200 group">
                                      <div className="w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center shrink-0 mt-2 text-xs font-bold text-gray-500">
                                          {index + 1}
                                      </div>
                                      <div className="flex-1 space-y-2">
                                          <input 
                                              value={step.label} 
                                              onChange={(e) => handleStepChange(index, 'label', e.target.value)}
                                              className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-sm font-bold focus:border-indigo-500 outline-none"
                                              placeholder="Nom de l'étape"
                                          />
                                          <input 
                                              value={step.message} 
                                              onChange={(e) => handleStepChange(index, 'message', e.target.value)}
                                              className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-600 focus:border-indigo-500 outline-none"
                                              placeholder="Description client"
                                          />
                                      </div>
                                      <button 
                                          onClick={() => handleRemoveStep(index)}
                                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"
                                      >
                                          <Trash2 size={16}/>
                                      </button>
                                  </div>
                              ))}
                              
                              <button 
                                  onClick={handleAddStep}
                                  className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                              >
                                  <Plus size={16}/> Ajouter une étape
                              </button>
                          </div>
                      ) : (
                          /* WORKFLOW READ MODE */
                          <div className="relative pl-4 space-y-4">
                              {/* Vertical Line aligned with icons */}
                              <div className="absolute left-[35px] top-4 bottom-4 w-px bg-gray-100"></div>

                              {stageConfig.map((step, index) => {
                                  const isCompleted = index < currentStageIndex;
                                  const isCurrent = index === currentStageIndex;
                                  const isLoading = loadingStageId === step.id && project.currentStage !== step.id;

                                  return (
                                      <div 
                                          key={step.id} 
                                          onClick={() => handleStageClick(step.id)}
                                          className={`relative z-10 flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group
                                              ${isCurrent 
                                                  ? 'bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600/10' // Active
                                                  : 'bg-transparent border-transparent hover:bg-gray-50' // Inactive
                                              }
                                          `}
                                      >
                                          {/* Icon */}
                                          <div className={`
                                              w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border-2
                                              ${isCompleted ? 'bg-emerald-500 text-white border-emerald-500' : 
                                                isCurrent ? 'bg-white border-indigo-600 text-indigo-600' : 
                                                'bg-white border-gray-200 text-gray-300'}
                                          `}>
                                              {isLoading ? (
                                                  <Loader2 size={14} className="animate-spin text-indigo-600" />
                                              ) : isCompleted ? (
                                                  <Check size={14} strokeWidth={4} />
                                              ) : isCurrent ? (
                                                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                                              ) : (
                                                  <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                                              )}
                                          </div>
                                          
                                          {/* Content */}
                                          <div className="flex-1 flex justify-between items-center">
                                              <div>
                                                  <h4 className={`text-sm font-bold transition-colors ${isCurrent ? 'text-indigo-900' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                                      {step.label}
                                                  </h4>
                                                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                                                      {step.message}
                                                  </p>
                                              </div>

                                              {/* Badges Right Aligned */}
                                              <div className="ml-auto flex items-center">
                                                  {isCurrent && (
                                                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded border border-indigo-200">
                                                          En cours
                                                      </span>
                                                  )}
                                                  {isCompleted && (
                                                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded border border-emerald-100">
                                                          Terminé
                                                      </span>
                                                  )}
                                              </div>
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                      )}
                  </div>
              </div>

              {/* TILE 4: ADMIN TOOLS (Right Column, Spans 1, Vertical Stack) */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                  
                  {/* COVER IMAGE WIDGET */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group relative flex-1 min-h-[160px]">
                      <img src={project.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button onClick={() => coverInputRef.current?.click()} className="bg-white/90 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-all">
                              <Camera size={14}/> Changer
                          </button>
                          <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files && onUpdateCoverImage(e.target.files[0])} />
                      </div>
                  </div>

                  {/* CLIENT ACCESS WIDGET */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                      <h3 className="font-bold text-gray-900 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Lock size={12} className="text-gray-400"/> Accès Client
                      </h3>
                      
                      <div className="space-y-4">
                          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                              <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Lien unique</div>
                              <div className="flex gap-2">
                                  <div className="flex-1 bg-white border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-600 truncate font-mono select-all">
                                      {`${window.location.origin}/#/v/${project.id}`}
                                  </div>
                                  <button onClick={handleCopyLink} className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors relative" title="Copier">
                                      {showCopyFeedback ? <Check size={14} className="text-emerald-500"/> : <LinkIcon size={14}/>}
                                  </button>
                                  <button onClick={handleOpenLink} className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors" title="Ouvrir">
                                      <ExternalLink size={14}/>
                                  </button>
                              </div>
                          </div>

                          <div>
                              <div className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">Mot de passe</div>
                              <div className="flex gap-2">
                                  <input 
                                      type="text" 
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}
                                      className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:border-indigo-500 outline-none transition-colors"
                                      placeholder="Définir un mot de passe"
                                  />
                                  <Button 
                                      size="sm" 
                                      variant="black" 
                                      onClick={() => onUpdatePassword(password)}
                                      disabled={password === project.accessPassword}
                                  >
                                      OK
                                  </Button>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* TEASERS / FILES WIDGET */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex-1">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-gray-900 text-xs uppercase tracking-widest flex items-center gap-2">
                              <Film size={12} className="text-gray-400"/> Galerie ({project.teasers?.length || 0})
                          </h3>
                          <button 
                              onClick={() => fileInputRef.current?.click()}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors flex items-center gap-1"
                          >
                              <Plus size={12}/> Ajouter
                          </button>
                          <input 
                              type="file" 
                              multiple 
                              ref={fileInputRef} 
                              className="hidden" 
                              accept="image/*,video/*"
                              onChange={(e) => e.target.files && onUploadTeasers(Array.from(e.target.files))}
                          />
                      </div>

                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                          {project.teasers && project.teasers.map(t => (
                              <div key={t.id} className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-100 rounded-lg group hover:bg-white hover:shadow-sm transition-all">
                                  <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                                      {t.type === 'video' ? <Film size={16} className="text-gray-500"/> : <img src={t.url} className="w-full h-full object-cover"/>}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <div className="text-xs font-bold text-gray-900 truncate">{t.title || 'Média'}</div>
                                      <div className="text-[10px] text-gray-400 font-mono">{t.date}</div>
                                  </div>
                                  <button 
                                      onClick={() => onDeleteTeaser(t.id)}
                                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                                  >
                                      <Trash2 size={14}/>
                                  </button>
                              </div>
                          ))}
                          {(!project.teasers || project.teasers.length === 0) && (
                              <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg">
                                  <p className="text-xs text-gray-400 font-medium">Aucun fichier partagé</p>
                              </div>
                          )}
                      </div>
                  </div>

              </div>

          </div>

      </div>
    </div>
  );
};
