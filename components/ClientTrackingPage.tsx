import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Activity, Clock, Package, Loader2, Video, 
  ArrowDownToLine, CheckCircle2, MapPin, Calendar, LayoutGrid, Check, FileText, Download,
  Info, X, MessageSquare, ArrowRight, BookOpen, ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { ClientTrackingPageProps } from '../types';
import { Button } from './Button';

export const ClientTrackingPage: React.FC<ClientTrackingPageProps> = ({ project, onBack, stageConfig }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [hasReadNote, setHasReadNote] = useState(false);
  
  // NOUVEAU : État pour le pop-up de bienvenue
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

  const currentStageIndex = stageConfig.findIndex(s => s.id === project.currentStage);
  const currentStageConfig = stageConfig.find(s => s.id === project.currentStage) || stageConfig[0];
  const isCompleted = currentStageIndex === stageConfig.length - 1 && project.currentStage === stageConfig[stageConfig.length -1].id;

  const totalFiles = project.teasers?.length || 0;
  const selectedCount = selectedFileIds.length;
  const isAllSelected = totalFiles > 0 && selectedCount === totalFiles;

  const defaultStepContent: Record<string, string> = {
    'secured': "Sauvegarde et organisation des fichiers\nPréparation de l’espace de travail\nVérification de l’intégrité des données\nCette phase garantit la sécurité et la fiabilité des fichiers avant toute modification",
    'culling': "Sélection des images\nAffinage de la série\nChoix des moments clés\nCette étape permet de construire une sélection cohérente avant le travail créatif.",
    'editing': "Harmonisation des couleurs\nAjustement des lumières\nAffinage des détails\nCohérence visuelle de la série\nCette phase demande précision et attention pour garantir un rendu homogène sur l’ensemble du projet.",
    'export': "Vérifications finales\nOptimisation des fichiers\nContrôle qualité\nCette étape assure que chaque fichier respecte les standards de qualité avant livraison.",
    'delivery': "Préparation des fichiers\nMise à disposition\nFinalisation du projet\nLes fichiers sont en cours de préparation pour une livraison complète et soignée."
  };

  useEffect(() => {
    // 1. Vérification note lue
    const noteKey = `peekit_note_read_${project.id}_${project.currentStage}`;
    const isRead = localStorage.getItem(noteKey) === 'true';
    setHasReadNote(isRead);

    // 2. Vérification première visite (Welcome Modal)
    const welcomeKey = `peekit_welcome_seen_${project.id}`;
    const hasSeenWelcome = localStorage.getItem(welcomeKey);
    
    if (!hasSeenWelcome) {
        // Petit délai pour l'animation
        setTimeout(() => setIsWelcomeModalOpen(true), 500);
        // On marque comme vu pour ne plus l'afficher
        localStorage.setItem(welcomeKey, 'true');
    }
  }, [project.id, project.currentStage]);

  const handleOpenInfo = () => {
    setIsInfoModalOpen(true);
    if (!hasReadNote) {
        setHasReadNote(true);
        const key = `peekit_note_read_${project.id}_${project.currentStage}`;
        localStorage.setItem(key, 'true');
    }
  };

  const calculateDeliveryRange = () => {
    if (!project.date || !project.expectedDeliveryDate) return "plusieurs";
    const start = new Date(project.date);
    const end = new Date(project.expectedDeliveryDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    const minWeeks = Math.max(1, diffWeeks - 2);
    const maxWeeks = diffWeeks + 1;
    return `${minWeeks} et ${maxWeeks}`;
  };
  
  const deliveryRange = calculateDeliveryRange();

  const toggleStepDetails = (stepId: string) => {
    if (expandedStepId === stepId) {
      setExpandedStepId(null);
    } else {
      setExpandedStepId(stepId);
    }
  };

  const toggleFileSelection = (id: string) => {
    setSelectedFileIds(prev => 
      prev.includes(id) 
        ? prev.filter(fid => fid !== id) 
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(project.teasers?.map(t => t.id) || []);
    }
  };

  const handleDownload = async (url: string, id: string, filename?: string) => {
    if (!isDownloadingAll) setDownloadingId(id);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erreur de récupération du fichier");
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || `peekit-file-${id}`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed, falling back to open:", error);
      window.open(url, '_blank');
    } finally {
      if (!isDownloadingAll) setDownloadingId(null);
    }
  };

  const handleBulkDownload = async () => {
    const files = project.teasers || [];
    if (files.length === 0) return;

    const filesToDownload = selectedCount > 0 
      ? files.filter(f => selectedFileIds.includes(f.id))
      : files;

    setIsDownloadingAll(true);
    
    for (const teaser of filesToDownload) {
        await handleDownload(teaser.url, teaser.id, teaser.title);
        await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setIsDownloadingAll(false);
    setSelectedFileIds([]);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 pb-20 relative">
      
      <header className="bg-white border-b border-gray-200 h-16 sticky top-0 z-30 px-6 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
              <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors bg-white">
                  <ArrowLeft size={16}/>
              </button>
              <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center text-white">
                      <Activity size={12} strokeWidth={2.5}/>
                  </div>
                  <span className="font-bold text-sm tracking-tight text-gray-900">Peekit</span>
              </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Espace Sécurisé</span>
          </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 md:p-8 animate-fade-in">
          
          {/* 1. PROJECT OVERVIEW CARD */}
          <div className={`rounded-xl p-6 md:p-8 mb-8 shadow-sm relative overflow-hidden transition-all ${project.coverImage ? 'text-white' : 'bg-white border border-gray-200 text-gray-900'}`}>
              
              {project.coverImage && (
                  <>
                      <img src={project.coverImage} className="absolute inset-0 w-full h-full object-cover z-0" alt="Cover" />
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-0"></div>
                  </>
              )}

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                  <div>
                      <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${project.coverImage ? 'bg-white/20 text-white backdrop-blur-md' : 'bg-gray-100 text-gray-600'}`}>
                              {project.type}
                          </span>
                          <span className={project.coverImage ? 'text-white/40' : 'text-gray-300'}>|</span>
                          <span className={`text-xs font-medium flex items-center gap-1 ${project.coverImage ? 'text-gray-200' : 'text-gray-500'}`}>
                              <Calendar size={12}/> {project.date}
                          </span>
                      </div>
                      <h1 className={`text-3xl font-bold tracking-tight mb-2 ${project.coverImage ? 'text-white shadow-sm' : 'text-gray-900'}`}>{project.clientName}</h1>
                      <div className={`flex items-center gap-2 text-sm ${project.coverImage ? 'text-gray-200' : 'text-gray-500'}`}>
                          <MapPin size={14} className={project.coverImage ? 'text-gray-300' : 'text-gray-400'}/> {project.location}
                      </div>
                  </div>
                  
                  {/* Status Box */}
                  <div className={`rounded-xl p-5 border w-full md:w-auto min-w-[280px] relative group transition-all hover:shadow-sm ${project.coverImage ? 'bg-white/95 backdrop-blur-md border-white/20 text-gray-900' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex justify-between items-start mb-2">
                          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Statut Actuel</h3>
                      </div>
                      <div className="flex items-center gap-3 mb-1">
                          {isCompleted ? <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div> : <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></div>}
                          <span className="text-lg font-bold text-gray-900">{currentStageConfig.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-snug">{currentStageConfig.message}</p>
                      
                      {currentStageConfig.description && (
                          <div className="mt-4">
                              {!hasReadNote ? (
                                  <button onClick={handleOpenInfo} className="w-full flex items-center gap-3 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg shadow-indigo-200 transition-all group relative overflow-hidden active:scale-[0.98]">
                                      <div className="absolute -top-10 -right-10 w-20 h-20 bg-white opacity-10 rounded-full blur-xl"></div>
                                      <div className="relative shrink-0"><div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"><MessageSquare size={16} fill="currentColor" className="text-white"/></div></div>
                                      <div className="text-left flex-1 min-w-0"><div className="text-[10px] font-bold opacity-80 uppercase tracking-wide mb-0.5 flex items-center gap-2">Message<span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span></div><div className="text-xs font-bold leading-none truncate">Lire la note détaillée</div></div>
                                      <ArrowRight size={14} className="opacity-70 group-hover:translate-x-1 transition-transform"/>
                                  </button>
                              ) : (
                                  <button onClick={handleOpenInfo} className="w-full flex items-center justify-center gap-2 p-2.5 bg-white border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors active:scale-[0.98]">
                                      <BookOpen size={14} />
                                      <span className="text-xs font-bold">Relire la note</span>
                                  </button>
                              )}
                          </div>
                      )}
                  </div>
              </div>
          </div>

          {/* 2. CADRE DE LIVRAISON (CORRIGÉ) */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm flex items-start gap-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                  <Clock size={20} />
              </div>
              <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-gray-900">Cadre de livraison</h3> {/* "s" enlevé */}
                  
                  {/* Phrase statique ajoutée ici */}
                  <p className="text-xs text-gray-500 leading-relaxed italic">
                      Certaines étapes créatives demandent du temps et de la précision. Cette page vous permet de suivre l’avancement du projet de manière claire et continue.
                  </p>
                  
                  <p className="text-sm text-gray-700 leading-relaxed pt-1">
                      La livraison intervient généralement entre <span className="font-bold text-gray-900">{deliveryRange} semaines</span>, selon la nature du projet et les étapes créatives nécessaires.
                  </p>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* HISTORIQUE */}
              <div className="lg:col-span-7">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                          <h3 className="font-bold text-gray-900 text-sm">Historique du projet</h3>
                      </div>
                      
                      <div className="p-6">
                          <div className="relative pl-2 space-y-8">
                              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-100"></div>

                              {stageConfig.map((step, index) => {
                                  const isDone = index < currentStageIndex;
                                  const isCurrent = index === currentStageIndex;
                                  const description = step.content || defaultStepContent[step.id];
                                  const isExpanded = expandedStepId === step.id;

                                  return (
                                      <div key={step.id} className="relative z-10">
                                          <div className="flex items-start gap-4">
                                              
                                              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 relative z-20 ${isDone ? 'bg-gray-900 border-gray-900 text-white' : isCurrent ? 'bg-white border-blue-600 text-blue-600 ring-4 ring-blue-50' : 'bg-white border-gray-200 text-gray-300'}`}>
                                                  {isDone && <Check size={12} strokeWidth={3}/>}
                                                  {isCurrent && <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"/>}
                                              </div>
                                              
                                              <div className={`flex-1 pt-0.5 ${isCurrent ? 'opacity-100' : isDone ? 'opacity-70' : 'opacity-40'}`}>
                                                  
                                                  <div className="flex justify-between items-center mb-1">
                                                      <h4 className="text-sm font-bold text-gray-900">{step.label}</h4>
                                                      
                                                      {isDone && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-500">Terminé</span>}
                                                      {isCurrent && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-600 border border-blue-100">En cours</span>}
                                                  </div>

                                                  <p className="text-xs text-gray-500 leading-relaxed font-medium mb-2">{step.message}</p>

                                                  {description && (
                                                      <button onClick={() => toggleStepDetails(step.id)} className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-gray-700 transition-colors uppercase tracking-wide group">
                                                          Comprendre cette étape
                                                          <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'group-hover:translate-y-0.5'}`}>
                                                              <ChevronDown size={12} />
                                                          </div>
                                                      </button>
                                                  )}
                                              </div>
                                          </div>
                                          
                                          {isExpanded && description && (
                                              <div className="ml-11 mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-slide-down">
                                                  <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">{description}</p>
                                              </div>
                                          )}
                                      </div>
                                  );
                              })}
                          </div>
                      </div>
                  </div>
              </div>

              {/* TÉLÉCHARGEMENT */}
              <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
                          
                          {/* TITRE À GAUCHE */}
                          <h3 className="font-bold text-gray-900 text-sm shrink-0">
                              {totalFiles > 1 ? 'Fichiers disponibles' : 'Fichier disponible'} <span className="ml-1 text-gray-400 font-normal">({totalFiles})</span>
                          </h3>
                          
                          {/* ACTIONS À DROITE */}
                          {(project.teasers || []).length > 0 && (
                              <div className="flex items-center gap-4">
                                  
                                  {/* Select All */}
                                  <div className="flex items-center gap-2 cursor-pointer group select-none" onClick={toggleSelectAll} title="Tout sélectionner">
                                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shadow-sm ${isAllSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}>
                                          {isAllSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                                      </div>
                                      <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-800 uppercase tracking-wide whitespace-nowrap">Tout sélectionner</span>
                                  </div>

                                  <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>

                                  {/* Download Button */}
                                  <button onClick={handleBulkDownload} disabled={isDownloadingAll} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shadow-sm ${selectedCount > 0 || isAllSelected ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 scale-105' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                                      {isDownloadingAll ? <Loader2 size={12} className="animate-spin"/> : <ArrowDownToLine size={12}/>}
                                      {isDownloadingAll ? '...' : selectedCount > 0 ? `Télécharger (${selectedCount})` : 'Tout télécharger'}
                                  </button>
                              </div>
                          )}
                      </div>

                      <div className="p-4">
                          {(!project.teasers || project.teasers.length === 0) ? (
                              <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-gray-200 rounded-lg">
                                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-3 text-gray-400"><FileText size={18}/></div>
                                  <p className="text-xs font-bold text-gray-900">Aucun document</p>
                                  <p className="text-[10px] text-gray-500 mt-1">L'espace est vide pour le moment.</p>
                              </div>
                          ) : (
                              <div className="space-y-3">
                                  {project.teasers.map(t => (
                                      <div key={t.id} onClick={() => toggleFileSelection(t.id)} className={`group p-3 bg-white border rounded-xl transition-all flex items-center gap-3 cursor-pointer ${selectedFileIds.includes(t.id) ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/10' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>
                                          <div className="shrink-0 flex items-center justify-center w-8 h-8" onClick={(e) => e.stopPropagation()}>
                                              <input type="checkbox" checked={selectedFileIds.includes(t.id)} onChange={() => toggleFileSelection(t.id)} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"/>
                                          </div>
                                          <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 overflow-hidden shrink-0">
                                              {t.type === 'video' ? <Video size={16}/> : <img src={t.url} className="w-full h-full object-cover"/>}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                              <h4 className="text-xs font-bold text-gray-900 truncate">{t.title || 'Fichier Média'}</h4>
                                              <p className="text-[10px] text-gray-400 font-mono mt-0.5">{t.date}</p>
                                          </div>
                                          <button onClick={(e) => { e.stopPropagation(); handleDownload(t.url, t.id, t.title); }} disabled={downloadingId === t.id || isDownloadingAll} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-black hover:text-white text-gray-500 transition-colors" title="Télécharger">
                                              {downloadingId === t.id ? <Loader2 size={14} className="animate-spin"/> : <Download size={14}/>}
                                          </button>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-5 text-center shadow-sm">
                      <h3 className="text-xs font-bold text-gray-900 mb-1">Une question ?</h3>
                      <p className="text-[10px] text-gray-500 mb-3">Contactez votre prestataire directement.</p>
                      <Button variant="outline" size="sm" fullWidth className="text-xs">Envoyer un email</Button>
                  </div>
              </div>
          </div>
      </div>

      {/* --- POP-UP DE BIENVENUE (PREMIÈRE VISITE) --- */}
      {isWelcomeModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center animate-scale-up relative">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Bienvenue sur votre espace</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                      Certaines étapes créatives demandent du temps et de la précision. Cette page vous permet de suivre l’avancement du projet de manière claire et continue.
                  </p>
                  <Button variant="black" fullWidth onClick={() => setIsWelcomeModalOpen(false)}>
                      Accéder à mon espace
                  </Button>
              </div>
          </div>
      )}

      {/* MODAL INFO (Note détaillée) */}
      {isInfoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up relative" onClick={(e) => e.stopPropagation()}>
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                      <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><Info size={16} /></div>
                           <div><h3 className="font-bold text-gray-900 text-sm">Note sur l'avancement</h3><p className="text-[10px] text-gray-500 font-medium">{currentStageConfig.label}</p></div>
                      </div>
                      <button onClick={() => setIsInfoModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-900 transition-colors"><X size={18} /></button>
                  </div>
                  <div className="p-6">
                      <div className="prose prose-sm text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                          {currentStageConfig.description}
                      </div>
                  </div>
                  <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                      <Button variant="black" size="sm" onClick={() => setIsInfoModalOpen(false)}>J'ai compris</Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
