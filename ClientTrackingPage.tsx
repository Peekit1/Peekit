
import React, { useState } from 'react';
import { 
  ArrowLeft, Activity, Clock, Package, Loader2, Video, 
  ArrowDownToLine, CheckCircle2, MapPin, Calendar, LayoutGrid, Check
} from 'lucide-react';
import { ClientTrackingPageProps } from './types';

export const ClientTrackingPage: React.FC<ClientTrackingPageProps> = ({ project, onBack, stageConfig }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const currentStageIndex = stageConfig.findIndex(s => s.id === project.currentStage);
  const currentStageConfig = stageConfig.find(s => s.id === project.currentStage) || stageConfig[0];
  const isCompleted = currentStageIndex === stageConfig.length - 1 && project.currentStage === stageConfig[stageConfig.length -1].id;

  const handleDownload = async (url: string, id: string, filename: string) => {
    setDownloadingId(id);
    
    try {
      // 1. Fetch the file as a blob
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network error');
      const blob = await response.blob();
      
      // 2. Create an object URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // 3. Determine safe filename with extension if missing
      let finalFilename = filename || 'download';
      const mimeType = blob.type;
      
      // Simple extension detection
      if (!finalFilename.includes('.')) {
          if (mimeType.includes('jpeg') || mimeType.includes('jpg')) finalFilename += '.jpg';
          else if (mimeType.includes('png')) finalFilename += '.png';
          else if (mimeType.includes('pdf')) finalFilename += '.pdf';
          else if (mimeType.includes('mp4')) finalFilename += '.mp4';
      }

      // 4. Create hidden link and click it
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', finalFilename);
      document.body.appendChild(link);
      link.click();
      
      // 5. Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed", error);
      // Fallback: Try opening in new tab if fetch fails (e.g. CORS)
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
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-gray-900 pb-20">
      
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 h-16 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 md:gap-4">
              <button 
                onClick={onBack} 
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              >
                  <ArrowLeft size={18}/>
              </button>
              <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                      <Activity size={12} strokeWidth={2.5}/>
                  </div>
                  <span className="font-bold text-gray-900 tracking-tight hidden sm:inline">Peekit</span>
              </div>
          </div>

          <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] md:text-xs font-bold text-emerald-700 uppercase tracking-wide">Espace Client</span>
              </div>
          </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-8 animate-fade-in">
          
          {/* TOP HERO SECTION (UNIFIED) */}
          <div className="mb-8">
              <div className="w-full bg-gray-900 rounded-xl p-6 md:p-8 text-white shadow-xl shadow-gray-200 relative overflow-hidden group">
                  
                  {/* Top Content: Project Info */}
                  <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                          <span className="px-2 py-1 rounded bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                              {project.type}
                          </span>
                      </div>
                      <h1 className="text-2xl md:text-4xl font-bold mb-2 tracking-tight">{project.clientName}</h1>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 font-medium">
                          <span className="flex items-center gap-1.5"><Calendar size={14} className="text-indigo-400"/> {project.date}</span>
                          <span className="flex items-center gap-1.5"><MapPin size={14} className="text-rose-400"/> {project.location}</span>
                      </div>
                  </div>

                  {/* Bottom Footer: Status & Progress (Merged) */}
                  <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
                      <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-3">
                          <div className="flex items-start gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'} shadow-lg`}>
                                  {isCompleted ? <Check size={20} /> : <Activity size={20} />}
                              </div>
                              <div>
                                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Statut Actuel</div>
                                  <div className="font-bold text-lg text-white">{currentStageConfig.label}</div>
                                  <div className="text-xs text-gray-400 font-medium">{currentStageConfig.message}</div>
                              </div>
                          </div>
                          
                          <div className="text-right">
                              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Avancement Global</div>
                              <div className="text-2xl font-bold text-white tracking-tight">{getProgress()}%</div>
                          </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} 
                            style={{ width: `${getProgress()}%` }}
                          ></div>
                      </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-indigo-500/20 transition-colors duration-700"></div>
                  <div className="absolute bottom-0 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-700"></div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LEFT: TIMELINE (List Style) */}
              <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                          <h3 className="font-bold text-gray-900 text-sm">Parcours du projet</h3>
                          <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-bold">{stageConfig.length} étapes</span>
                      </div>
                      
                      <div className="p-4 md:p-6">
                          <div className="relative pl-4 space-y-6">
                              {/* Ligne verticale continue */}
                              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gray-100"></div>

                              {stageConfig.map((step, index) => {
                                  const isDone = index < currentStageIndex;
                                  const isCurrent = index === currentStageIndex;
                                  
                                  return (
                                      <div key={step.id} className="relative z-10 flex items-start gap-4 group">
                                          
                                          {/* Icon Node */}
                                          <div className={`
                                              w-10 h-10 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm
                                              ${isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 
                                                isCurrent ? 'bg-white border-indigo-500 text-indigo-600 ring-4 ring-indigo-50' : 
                                                'bg-white border-gray-100 text-gray-300'}
                                          `}>
                                              {isDone ? <Check size={16} strokeWidth={3}/> : <div className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-indigo-600' : 'bg-gray-200'}`}/>}
                                          </div>
                                          
                                          {/* Card Content */}
                                          <div className={`
                                              flex-1 p-4 rounded-xl border transition-all duration-300
                                              ${isCurrent 
                                                  ? 'bg-indigo-50/30 border-indigo-100 shadow-sm' 
                                                  : 'bg-white border-transparent hover:bg-gray-50/50'}
                                          `}>
                                              <div className="flex justify-between items-center mb-1">
                                                  <h4 className={`text-sm font-bold ${isCurrent ? 'text-indigo-900' : isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                                                      {step.label}
                                                  </h4>
                                                  {isCurrent && (
                                                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-bold uppercase tracking-wider rounded border border-indigo-200">
                                                          En cours
                                                      </span>
                                                  )}
                                                  {isDone && (
                                                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Terminé</span>
                                                  )}
                                              </div>
                                              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                                  {step.message}
                                              </p>
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>
                  </div>
              </div>

              {/* RIGHT: FILES & LIVRABLES */}
              <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                          <h3 className="font-bold text-gray-900 text-sm">Fichiers & Livrables</h3>
                          <Package size={16} className="text-gray-400"/>
                      </div>

                      <div className="p-4">
                          {(!project.teasers || project.teasers.length === 0) ? (
                              <div className="py-12 flex flex-col items-center justify-center text-center">
                                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                      <Package size={20} className="text-gray-300"/>
                                  </div>
                                  <p className="text-xs font-bold text-gray-900">Aucun fichier</p>
                                  <p className="text-[10px] text-gray-500 mt-1">Les éléments apparaîtront ici.</p>
                              </div>
                          ) : (
                              <div className="space-y-3">
                                  {project.teasers.map(t => (
                                      <div key={t.id} className="group p-3 bg-white border border-gray-100 rounded-xl hover:border-indigo-100 hover:shadow-sm transition-all">
                                          <div className="flex items-center gap-3 mb-3">
                                              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 overflow-hidden shrink-0">
                                                  {t.type === 'video' ? <Video size={16} className="text-indigo-500"/> : <img src={t.url} className="w-full h-full object-cover"/>}
                                              </div>
                                              <div className="min-w-0">
                                                  <h4 className="text-xs font-bold text-gray-900 truncate">{t.title || 'Fichier Média'}</h4>
                                                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">{t.date}</p>
                                              </div>
                                          </div>
                                          
                                          <button 
                                              onClick={() => handleDownload(t.url, t.id, t.title || 'fichier-peekit')}
                                              disabled={downloadingId === t.id}
                                              className="w-full py-2 bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
                                          >
                                              {downloadingId === t.id ? <Loader2 size={12} className="animate-spin"/> : <ArrowDownToLine size={12}/>}
                                              Télécharger
                                          </button>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  </div>
                  
                  {/* Contact Widget */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center hover:border-gray-300 transition-colors">
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-900 border border-gray-100">
                          <Activity size={18}/>
                      </div>
                      <h3 className="text-xs font-bold text-gray-900 mb-1">Besoin d'aide ?</h3>
                      <p className="text-[10px] text-gray-500 mb-4">Contactez le studio directement.</p>
                      <button className="text-xs font-bold text-indigo-600 border-b border-indigo-200 hover:border-indigo-600 transition-colors pb-0.5">
                          Envoyer un message
                      </button>
                  </div>
              </div>

          </div>

      </div>
    </div>
  );
};
