import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Activity, Clock, Package, Loader2, Video, 
  ArrowDownToLine, CheckCircle2, MapPin, Calendar, LayoutGrid, Check, FileText, Download,
  Info, X, MessageSquare, ArrowRight, BookOpen
} from 'lucide-react';
import { ClientTrackingPageProps } from '../types';
import { Button } from './Button';

export const ClientTrackingPage: React.FC<ClientTrackingPageProps> = ({ project, onBack, stageConfig }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [hasReadNote, setHasReadNote] = useState(false);

  const currentStageIndex = stageConfig.findIndex(s => s.id === project.currentStage);
  const currentStageConfig = stageConfig.find(s => s.id === project.currentStage) || stageConfig[0];
  const isCompleted = currentStageIndex === stageConfig.length - 1 && project.currentStage === stageConfig[stageConfig.length -1].id;

  // Check LocalStorage on mount or stage change
  useEffect(() => {
    const key = `peekit_note_read_${project.id}_${project.currentStage}`;
    const isRead = localStorage.getItem(key) === 'true';
    setHasReadNote(isRead);
  }, [project.id, project.currentStage]);

  const handleOpenInfo = () => {
    setIsInfoModalOpen(true);
    // Mark as read immediately
    if (!hasReadNote) {
        setHasReadNote(true);
        const key = `peekit_note_read_${project.id}_${project.currentStage}`;
        localStorage.setItem(key, 'true');
    }
  };

  const handleDownload = async (url: string, id: string, filename?: string) => {
    setDownloadingId(id);
    try {
      // On récupère le fichier via fetch pour le transformer en Blob
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erreur de récupération du fichier");
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      // On crée un lien temporaire pour déclencher le téléchargement
      const link = document.createElement('a');
      link.href = blobUrl;
      // On utilise le titre du teaser s'il existe, sinon un nom générique
      link.download = filename || `peekit-file-${id}`;
      document.body.appendChild(link);
      link.click();
      
      // Nettoyage
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed, falling back to open:", error);
      // En cas d'échec (CORS par ex), on ouvre simplement dans un nouvel onglet
      window.open(url, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  const getProgress = () => {
    if (stageConfig.length === 0) return 0;
    return Math.round(((currentStageIndex + 1) / stageConfig.length) * 100);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 pb-20 relative">
      
      {/* MINIMAL HEADER */}
      <header className="bg-white border-b border-gray-200 h-16 sticky top-0 z-30 px-6 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
              <button 
                onClick={onBack} 
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors bg-white"
              >
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
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-8 shadow-sm relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                  <div>
                      <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold uppercase tracking-wider text-gray-600">
                              {project.type}
                          </span>
                          <span className="text-gray-300">|</span>
                          <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                              <Calendar size={12}/> {project.date}
                          </span>
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">{project.clientName}</h1>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin size={14} className="text-gray-400"/> {project.location}
                      </div>
                  </div>
                  
                  {/* Status Box */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 w-full md:w-auto min-w-[280px] relative group transition-all hover:border-gray-200 hover:shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Statut Actuel</h3>
                          {/* Info Button Trigger - Small Icon Top Right */}
                          {currentStageConfig.description && (
                              <button 
                                  onClick={handleOpenInfo}
                                  className={`relative p-1.5 rounded-full transition-colors ${hasReadNote ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' : 'text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100'}`}
                                  title="Lire le message du créatif"
                              >
                                  {!hasReadNote && (
                                    <span className="absolute top-0 right-0 flex h-2.5 w-2.5 -mt-0.5 -mr-0.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                                    </span>
                                  )}
                                  <Info size={14} />
                              </button>
                          )}
                      </div>
                      <div className="flex items-center gap-3 mb-1">
                          {isCompleted ? (
                              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                          ) : (
                              <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></div>
                          )}
                          <span className="text-lg font-bold text-gray-900">{currentStageConfig.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-snug">{currentStageConfig.message}</p>
                      
                      {currentStageConfig.description && (
                          <div className="mt-4">
                              {!hasReadNote ? (
                                  // --- BOUTON VOYANT (NON LU) ---
                                  <button 
                                    onClick={handleOpenInfo}
                                    className="w-full flex items-center gap-3 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg shadow-indigo-200 transition-all group relative overflow-hidden active:scale-[0.98]"
                                  >
                                      {/* Decorative glow */}
                                      <div className="absolute -top-10 -right-10 w-20 h-20 bg-white opacity-10 rounded-full blur-xl"></div>

                                      <div className="relative shrink-0">
                                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                              <MessageSquare size={16} fill="currentColor" className="text-white"/>
                                          </div>
                                      </div>
                                      
                                      <div className="text-left flex-1 min-w-0">
                                          <div className="text-[10px] font-bold opacity-80 uppercase tracking-wide mb-0.5 flex items-center gap-2">
                                            Message
                                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span>
                                          </div>
                                          <div className="text-xs font-bold leading-none truncate">Lire la note détaillée</div>
                                      </div>
                                      
                                      <ArrowRight size={14} className="opacity-70 group-hover:translate-x-1 transition-transform"/>
                                  </button>
                              ) : (
                                  // --- BOUTON DISCRET (LU) ---
                                  <button 
                                    onClick={handleOpenInfo}
                                    className="w-full flex items-center justify-center gap-2 p-2.5 bg-white border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors active:scale-[0.98]"
                                  >
                                      <BookOpen size={14} />
                                      <span className="text-xs font-bold">Relire la note</span>
                                  </button>
                              )}
                          </div>
                      )}
                  </div>
              </div>

              {/* Big Progress Bar */}
              <div className="mt-8 relative z-10">
                  <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-gray-900">Progression globale</span>
                      <span className="text-xs font-bold text-gray-900">{getProgress()}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gray-900 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${getProgress()}%` }}
                      ></div>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LEFT: TIMELINE HISTORY */}
              <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                          <h3 className="font-bold text-gray-900 text-sm">Historique du projet</h3>
                      </div>
                      
                      <div className="p-6">
                          <div className="relative pl-2 space-y-8">
                              {/* Vertical Line */}
                              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-100"></div>

                              {stageConfig.map((step, index) => {
                                  const isDone = index < currentStageIndex;
                                  const isCurrent = index === currentStageIndex;
                                  
                                  // DÉTECTION : Est-ce la toute dernière étape ?
                                  const isLastStep = index === stageConfig.length - 1;
                                  
                                  // Est-ce que le projet est FINI (dernière étape active) ?
                                  const isProjectFinished = isCurrent && isLastStep;

                                  return (
                                      <div key={step.id} className="relative z-10 flex items-start gap-4">
                                          
                                          {/* ICONE RONDE */}
                                          <div className={`
                                              w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-500
                                              ${isDone 
                                                  ? 'bg-gray-900 border-gray-900 text-white' // Étapes passées (Noir)
                                                  : isProjectFinished 
                                                      ? 'bg-emerald-600 border-emerald-600 text-white ring-4 ring-emerald-50' // FINI (Vert)
                                                      : isCurrent 
                                                          ? 'bg-white border-blue-600 text-blue-600 ring-4 ring-blue-50' // En cours (Bleu)
                                                          : 'bg-white border-gray-200 text-gray-300' // Futur (Gris)
                                              }
                                          `}>
                                              {isDone ? (
                                                  <Check size={12} strokeWidth={3}/>
                                              ) : isProjectFinished ? (
                                                  <Check size={14} strokeWidth={3}/> // Coche pour la fin
                                              ) : isCurrent ? (
                                                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"/>
                                              ) : null}
                                          </div>
                                          
                                          {/* TEXTE ET DESCRIPTION */}
                                          <div className={`flex-1 pt-0.5 transition-opacity duration-500 ${isCurrent ? 'opacity-100' : isDone ? 'opacity-70' : 'opacity-40'}`}>
                                              <div className="flex justify-between items-center mb-1">
                                                  <h4 className={`text-sm font-bold ${isProjectFinished ? 'text-emerald-900' : 'text-gray-900'}`}>
                                                      {step.label}
                                                  </h4>
                                                  
                                                  {/* Badge "Terminé" à droite */}
                                                  {(isDone || isProjectFinished) && (
                                                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isProjectFinished ? 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded' : 'text-gray-400'}`}>
                                                          {isProjectFinished ? "Projet Livré" : "Terminé"}
                                                      </span>
                                                  )}
                                              </div>
                                              
                                              <p className={`text-xs leading-relaxed font-medium ${isProjectFinished ? 'text-emerald-700' : 'text-gray-500'}`}>
                                                  {step.message}
                                              </p>
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>

                          {/* BANNIÈRE FINALE (Visible uniquement si le projet est terminé) */}
                          {isCompleted && (
                              <div className="mt-8 p-6 bg-emerald-50 border border-emerald-100 rounded-xl text-center animate-fade-in">
                                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-3 shadow-sm text-2xl">
                                      🎉
                                  </div>
                                  <h3 className="text-emerald-900 font-bold text-lg mb-1">Tout est prêt !</h3>
                                  <p className="text-emerald-700 text-sm">Votre projet a été intégralement livré. Merci de votre confiance.</p>
                              </div>
                          )}
                      </div>
                  </div>
              </div>

              {/* RIGHT: FILES & DOWNLOADS */}
              <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                          <h3 className="font-bold text-gray-900 text-sm">Fichiers disponibles</h3>
                          <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-[10px] font-bold text-gray-500">
                             {(project.teasers || []).length}
                          </span>
                      </div>

                      <div className="p-4">
                          {(!project.teasers || project.teasers.length === 0) ? (
                              <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-gray-200 rounded-lg">
                                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-3 text-gray-400">
                                      <FileText size={18}/>
                                  </div>
                                  <p className="text-xs font-bold text-gray-900">Aucun document</p>
                                  <p className="text-[10px] text-gray-500 mt-1">L'espace est vide pour le moment.</p>
                              </div>
                          ) : (
                              <div className="space-y-3">
                                  {project.teasers.map(t => (
                                      <div key={t.id} className="group p-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 overflow-hidden shrink-0">
                                              {t.type === 'video' ? <Video size={16}/> : <img src={t.url} className="w-full h-full object-cover"/>}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                              <h4 className="text-xs font-bold text-gray-900 truncate">{t.title || 'Fichier Média'}</h4>
                                              <p className="text-[10px] text-gray-400 font-mono mt-0.5">{t.date}</p>
                                          </div>
                                          
                                          <button 
                                              onClick={() => handleDownload(t.url, t.id, t.title)}
                                              disabled={downloadingId === t.id}
                                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-black hover:text-white text-gray-500 transition-colors"
                                              title="Télécharger"
                                          >
                                              {downloadingId === t.id ? <Loader2 size={14} className="animate-spin"/> : <Download size={14}/>}
                                          </button>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  </div>
                  
                  {/* Help Card */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 text-center shadow-sm">
                      <h3 className="text-xs font-bold text-gray-900 mb-1">Une question ?</h3>
                      <p className="text-[10px] text-gray-500 mb-3">Contactez votre prestataire directement.</p>
                      <Button variant="outline" size="sm" fullWidth className="text-xs">
                          Envoyer un email
                      </Button>
                  </div>
              </div>

          </div>

      </div>

      {/* INFO MODAL */}
      {isInfoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
              <div 
                  className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up relative"
                  onClick={(e) => e.stopPropagation()}
              >
                  {/* Modal Header */}
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                      <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                               <Info size={16} />
                           </div>
                           <div>
                               <h3 className="font-bold text-gray-900 text-sm">Note sur l'avancement</h3>
                               <p className="text-[10px] text-gray-500 font-medium">{currentStageConfig.label}</p>
                           </div>
                      </div>
                      <button 
                          onClick={() => setIsInfoModalOpen(false)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-900 transition-colors"
                      >
                          <X size={18} />
                      </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6">
                      <div className="prose prose-sm text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                          {currentStageConfig.description || "Aucune information supplémentaire pour cette étape."}
                      </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                      <Button variant="black" size="sm" onClick={() => setIsInfoModalOpen(false)}>
                          J'ai compris
                      </Button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};
