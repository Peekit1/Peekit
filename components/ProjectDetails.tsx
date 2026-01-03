import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Calendar, MapPin, Check, Loader2, Link as LinkIcon, Lock, 
  Upload, Trash2, Camera, Pencil, Plus, Clock,
  MoreHorizontal, FileImage, Film, LayoutGrid, Settings,
  AlertCircle, RefreshCcw, CheckCircle2, Circle, Eye, Mail,
  Copy, Globe, Flag, Sparkles, ShieldCheck, GitBranch, X, Send,
  Zap, MessageSquareText, AlertTriangle, StickyNote, GripVertical, ChevronRight as ChevronRightIcon, Image as ImageIcon
} from 'lucide-react';
import { ProjectDetailsProps, WorkflowStep, NotificationType, Project } from '../types';
import { Button } from './Button';
import emailjs from '@emailjs/browser';

// Interface étendue
interface ExtendedProjectDetailsProps extends ProjectDetailsProps {
    onUpdateProject?: (projectId: string, data: Partial<Project>) => Promise<void>;
}

export const ProjectDetails: React.FC<ExtendedProjectDetailsProps> = ({ 
  project, 
  stageConfig, 
  defaultConfig, 
  userPlan, 
  studioName,
  onBack, 
  onUpdateStage, 
  onUpdateStageConfig, 
  onViewClientVersion, 
  onUpdatePassword, 
  onUploadTeasers, 
  onDeleteTeaser, 
  onUpdateCoverImage, 
  onNotifyClient,
  onUpdateProject 
}) => {
  const [loadingStageId, setLoadingStageId] = useState<string | null>(null);
  const [isSavingWorkflow, setIsSavingWorkflow] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [password, setPassword] = useState(project.accessPassword || '');
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [localWorkflow, setLocalWorkflow] = useState<any[]>([]);

  // ÉTATS D'ÉDITION DES INFOS
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
      clientEmail: project.clientEmail,
      date: project.date,
      expectedDeliveryDate: project.expectedDeliveryDate,
      location: project.location
  });
  const [isSavingInfo, setIsSavingInfo] = useState(false);

  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [notifyStep, setNotifyStep] = useState<'choice' | 'generating' | 'preview' | 'success'>('choice');
  const [notificationEmail, setNotificationEmail] = useState<{subject: string, body: string} | null>(null);
  const [isSendingNotification, setIsSendingNotification] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialisation d'EmailJS
  useEffect(() => {
    // REMPLACEZ PAR VOTRE CLÉ PUBLIQUE ICI
    emailjs.init("3l-ZU5KwqK1qV2W1j"); 
  }, []);

  const defaultStepContent: Record<string, string> = {
    'secured': "Sauvegarde et organisation des fichiers\nPréparation de l’espace de travail\nVérification de l’intégrité des données\nCette phase garantit la sécurité et la fiabilité des fichiers avant toute modification",
    'culling': "Sélection des images\nAffinage de la série\nChoix des moments clés\nCette étape permet de construire une sélection cohérente avant le travail créatif.",
    'editing': "Harmonisation des couleurs\nAjustement des lumières\nAffinage des détails\nCohérence visuelle de la série\nCette phase demande précision et attention pour garantir un rendu homogène sur l’ensemble du projet.",
    'export': "Vérifications finales\nOptimisation des fichiers\nContrôle qualité\nCette étape assure que chaque fichier respecte les standards de qualité avant livraison.",
    'delivery': "Préparation des fichiers\nMise à disposition\nFinalisation du projet\nLes fichiers sont en cours de préparation pour une livraison complète et soignée."
  };

  useEffect(() => {
    const initializedWorkflow = stageConfig.map(step => ({
      ...step,
      content: (step as any).content || defaultStepContent[step.id] || ''
    }));
    setLocalWorkflow(JSON.parse(JSON.stringify(initializedWorkflow)));
  }, [stageConfig]);

  useEffect(() => {
      setEditedInfo({
          clientEmail: project.clientEmail,
          date: project.date,
          expectedDeliveryDate: project.expectedDeliveryDate,
          location: project.location
      });
  }, [project]);

  const currentStageIndex = stageConfig.findIndex(s => s.id === project.currentStage);
  
  const handleStageClick = async (id: string) => {
      if (editingStepId) return;
      setLoadingStageId(id);
      await onUpdateStage(id);
      setLoadingStageId(null);
  };

  const getProgress = () => {
    if (!stageConfig || stageConfig.length === 0) return 0;
    return Math.round(((currentStageIndex + 1) / stageConfig.length) * 100);
  };

  const saveWorkflow = async () => {
      setIsSavingWorkflow(true);
      try {
          await onUpdateStageConfig(localWorkflow);
          setEditingStepId(null);
      } finally {
          setIsSavingWorkflow(false);
      }
  };

  const cancelWorkflowEdit = () => {
      setLocalWorkflow(JSON.parse(JSON.stringify(stageConfig)));
      setEditingStepId(null);
  };

  const handleAddStep = async () => {
      const newStep = {
          id: `step_${Date.now()}`,
          label: 'Nouvelle étape',
          minDays: 1,
          maxDays: 2,
          message: 'En attente',
          description: '',
          content: 'Description de cette étape...'
      };
      setLocalWorkflow([...localWorkflow, newStep]);
      setEditingStepId(newStep.id);
  };

  const handleDeleteStep = async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (localWorkflow.length <= 1) return;
      const newWf = localWorkflow.filter(s => s.id !== id);
      setLocalWorkflow(newWf);
      await onUpdateStageConfig(newWf);
  };

  const handleUpdateStepField = (id: string, field: string, value: string | undefined) => {
      const newWf = localWorkflow.map(s => s.id === id ? { ...s, [field]: value } : s);
      setLocalWorkflow(newWf);
  };

  const handleSaveInfo = async () => {
      if (!onUpdateProject) return;
      setIsSavingInfo(true);
      try {
          await onUpdateProject(project.id, editedInfo);
          setIsEditingInfo(false);
      } catch (error) {
          console.error("Erreur sauvegarde info:", error);
      } finally {
          setIsSavingInfo(false);
      }
  };

  const getClientUrl = () => {
      try {
          const origin = window.location.origin && window.location.origin !== 'null' ? window.location.origin : '';
          const pathname = window.location.pathname || '/';
          return `${origin}${pathname}#/v/${project.id}`;
      } catch (e) { return `#/v/${project.id}`; }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setIsUploading(true);
          try {
              await onUploadTeasers(Array.from(e.target.files));
          } finally {
              setIsUploading(false);
              if (fileInputRef.current) fileInputRef.current.value = '';
          }
      }
  };

  const handleOpenNotify = () => {
      if (userPlan === 'discovery') {
          alert("La notification automatique est réservée aux membres Pro.");
          return;
      }
      setNotifyStep('choice');
      setNotificationEmail(null);
      setIsNotifyModalOpen(true);
  };

  const generateNotification = async (type: NotificationType) => {
      setNotifyStep('generating');
      try {
          const currentStage = stageConfig.find(s => s.id === project.currentStage) || stageConfig[0];
          const draft = await onNotifyClient(project, currentStage, type);
          setNotificationEmail(draft);
          setNotifyStep('preview');
      } catch (error) {
          console.error("Erreur génération:", error);
          setNotifyStep('choice');
      }
  };

  const handleUpdateEmail = (field: 'subject' | 'body', value: string) => {
      if (!notificationEmail) return;
      setNotificationEmail({ ...notificationEmail, [field]: value });
  };

  const sendNotification = async () => {
    if (!notificationEmail) {
        return;
    }
    
    setIsSendingNotification(true);

    const baseUrl = window.location.href.split('#')[0]; 
    const clientLink = `${baseUrl}#/v/${project.id}`;

    // REMPLACEZ PAR VOS VRAIES CLÉS
    const SERVICE_ID = "service_vlelgtd"; 
    const TEMPLATE_ID = "template_mjzqkyl"; 
    const PUBLIC_KEY = "3l-ZU5KwqK1qV2W1j"; 

    const templateParams = {
        to_email: project.clientEmail,
        client_name: project.clientName,
        subject: notificationEmail.subject,
        message: notificationEmail.body,
        link: clientLink,
        studio_name: studioName
    };

    try {
        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
        setNotifyStep('success');
        
        setTimeout(() => {
            setIsNotifyModalOpen(false);
            setNotifyStep('choice');
        }, 2500);

    } catch (error) {
        console.error('FAILED...', error);
        alert(`Échec de l'envoi : ${JSON.stringify(error)}`);
    } finally {
        setIsSendingNotification(false);
    }
  };

  const isPro = userPlan === 'pro' || userPlan === 'agency';

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 pb-20">
      <header className="bg-white border-b border-gray-200 h-16 sticky top-0 z-30 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
              <button onClick={onBack} className="h-8 flex items-center justify-center gap-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors bg-white px-3"><ArrowLeft size={16}/><span className="hidden md:inline text-xs font-bold text-gray-600">Retour</span></button>
              <div className="flex flex-col"><h1 className="text-sm font-bold text-gray-900 leading-tight">{project.clientName}</h1></div>
          </div>
          <div className="flex items-center gap-3">
               <span className="hidden md:flex items-center gap-2 text-xs font-medium text-gray-500 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100"><Clock size={12}/> MAJ: {project.lastUpdate}</span>
               
               <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>
               
               <button onClick={onViewClientVersion} className="inline-flex items-center justify-center gap-2 h-8 px-3 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-900 transition-colors"><Eye size={12}/> <span className="hidden sm:inline">Vue Client</span></button>
               
               <button onClick={handleOpenNotify} className={`group relative inline-flex items-center justify-center gap-2 h-8 px-3 text-xs font-bold rounded-lg transition-all ${isPro ? 'bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100' : 'bg-gray-50 border border-gray-200 text-gray-400'}`}>
                  <Mail size={12} /> <span className="hidden sm:inline">Notifier par mail</span>
                  {!isPro && <span className="ml-1 text-[8px] bg-gray-200 text-gray-500 px-1 rounded">PRO</span>}
               </button>
          </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-8">
                  {/* WORKFLOW SECTION */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                          <div>
                            <div className="flex items-center gap-2"><h3 className="font-bold text-gray-900 text-sm flex items-center gap-2"><GitBranch size={16} className="text-gray-400"/> Processus de Création</h3></div>
                            <p className="text-xs text-gray-500 mt-0.5">Cliquez sur une étape pour l'activer ou la modifier.</p>
                          </div>
                          <div className="flex items-center gap-2"><span className="text-xl font-bold text-gray-900 font-mono">{getProgress()}%</span></div>
                      </div>
                      <div className="w-full bg-gray-50 h-1"><div className="bg-gray-900 h-1 transition-all duration-500" style={{ width: `${getProgress()}%` }}></div></div>
                      <div className="divide-y divide-gray-50">
                          {localWorkflow.map((step, index) => {
                              const isCurrent = index === currentStageIndex;
                              const isDone = index < currentStageIndex;
                              const isEditing = editingStepId === step.id;
                              const isLoading = loadingStageId === step.id && project.currentStage !== step.id;
                              const isLastStep = index === localWorkflow.length - 1;
                              return (
                                  <div key={step.id} onClick={() => handleStageClick(step.id)} className={`group px-6 py-4 flex flex-col transition-all cursor-pointer select-none ${isEditing ? 'ring-2 ring-black bg-white z-10 shadow-lg' : ''} ${!isEditing && isCurrent && isLastStep ? 'bg-emerald-50/40' : isCurrent ? 'bg-blue-50/20' : 'hover:bg-gray-50 active:bg-gray-100'}`}>
                                      <div className="flex items-center gap-4 pointer-events-none">
                                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${isLoading ? 'border-gray-200 bg-white' : isCurrent && isLastStep ? 'bg-emerald-600 border-emerald-600 text-white' : isDone ? 'bg-emerald-500 border-emerald-500 text-white' : isCurrent ? 'border-blue-600 bg-white' : 'border-gray-300 bg-white'}`}>
                                              {isLoading ? <Loader2 size={12} className="animate-spin text-gray-400"/> : isCurrent && isLastStep ? <Check size={14} strokeWidth={3}/> : isDone ? <Check size={14} strokeWidth={3}/> : isCurrent ? <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></div> : <div className="w-1.5 h-1.5 bg-gray-200 rounded-full group-hover:bg-gray-400 transition-colors"></div>}
                                          </div>
                                          <div className="flex-1 min-w-0 pointer-events-auto">
                                              {isEditing ? (
                                                  <input autoFocus value={step.label} onChange={(e) => handleUpdateStepField(step.id, 'label', e.target.value)} className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none border-b border-gray-300 pb-1" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => { if (e.key === 'Enter') saveWorkflow(); if (e.key === 'Escape') cancelWorkflowEdit(); }}/>
                                              ) : (
                                                  <div className="flex items-center justify-between pointer-events-none">
                                                      <span className={`text-sm font-bold ${isCurrent && isLastStep ? 'text-emerald-900' : isCurrent || isDone ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</span>
                                                      {isCurrent && <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${isLastStep ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-blue-100 text-blue-700'}`}>{isLastStep ? "Projet Terminé" : "Étape active"}</span>}
                                                  </div>
                                              )}
                                          </div>
                                          {isPro && !isEditing && (
                                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                                                  <button onClick={(e) => { e.stopPropagation(); setEditingStepId(step.id); }} className="p-1.5 text-gray-400 hover:text-black hover:bg-white rounded border border-transparent hover:border-gray-200"><Pencil size={14}/></button>
                                                  <button onClick={(e) => handleDeleteStep(step.id, e)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-100"><Trash2 size={14}/></button>
                                              </div>
                                          )}
                                      </div>
                                      {(isCurrent || isEditing) && (
                                          <div className="mt-3 ml-10 space-y-3 animate-fade-in pointer-events-auto">
                                              {isEditing ? (
                                                  <>
                                                      <div className="space-y-1"><label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Message court</label><input value={step.message} onChange={(e) => handleUpdateStepField(step.id, 'message', e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded px-2 py-1.5 text-xs text-gray-900 outline-none" onClick={(e) => e.stopPropagation()} /></div>
                                                      
                                                      {typeof step.description === 'string' ? (
                                                          <div className="space-y-1 animate-fade-in">
                                                              <div className="flex items-center justify-between">
                                                                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Note détaillée (Message pour le client)</label>
                                                                  <button 
                                                                    onClick={() => handleUpdateStepField(step.id, 'description', undefined)}
                                                                    className="text-[9px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1 uppercase tracking-wider"
                                                                  >
                                                                      <Trash2 size={10} /> Supprimer
                                                                  </button>
                                                              </div>
                                                              <textarea 
                                                                value={step.description} 
                                                                onChange={(e) => handleUpdateStepField(step.id, 'description', e.target.value)} 
                                                                className="w-full bg-gray-50 border border-gray-100 rounded px-2 py-1.5 text-xs text-gray-900 outline-none min-h-[60px]" 
                                                                onClick={(e) => e.stopPropagation()} 
                                                                placeholder="Écrivez votre note ici..."
                                                              />
                                                          </div>
                                                      ) : (
                                                          <button 
                                                            onClick={() => handleUpdateStepField(step.id, 'description', "")}
                                                            className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 font-medium hover:border-gray-400 hover:text-gray-700 flex items-center justify-center gap-2 transition-colors mt-2"
                                                          >
                                                              <Plus size={12} /> Ajouter une note détaillée
                                                          </button>
                                                      )}

                                                      <div className="space-y-1 mt-3">
                                                          <div className="flex items-center justify-between"><label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">Informations complémentaires {!isPro && <span className="bg-gray-200 text-gray-500 px-1 rounded text-[8px]">PRO</span>}</label></div>
                                                          <textarea value={step.content} onChange={(e) => isPro && handleUpdateStepField(step.id, 'content', e.target.value)} className={`w-full bg-gray-50 border border-gray-100 rounded px-2 py-1.5 text-xs text-gray-600 outline-none min-h-[80px] ${!isPro ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={(e) => e.stopPropagation()} readOnly={!isPro}/>
                                                      </div>
                                                      <div className="flex justify-end gap-3 pt-3 border-t border-gray-50 mt-2">
                                                          <button onClick={(e) => { e.stopPropagation(); cancelWorkflowEdit(); }} className="px-4 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest hover:text-gray-900">Annuler</button>
                                                          <Button variant="black" size="sm" isLoading={isSavingWorkflow} onClick={(e) => { e.stopPropagation(); saveWorkflow(); }} className="!px-6 !rounded-lg !text-[11px] uppercase tracking-widest">Enregistrer</Button>
                                                      </div>
                                                  </>
                                              ) : (
                                                  <div className="flex flex-col gap-1.5"><p className={`text-xs italic font-medium ${isLastStep ? 'text-emerald-700' : 'text-gray-500'}`}>"{step.message}"</p>{step.description && <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm"><p className="text-xs text-gray-800 font-medium whitespace-pre-line leading-relaxed">{step.description}</p></div>}</div>
                                              )}
                                          </div>
                                      )}
                                  </div>
                              );
                          })}
                          {isPro && !editingStepId && (
                              <button onClick={handleAddStep} className="w-full px-6 py-4 flex items-center gap-4 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors border-t border-dashed border-gray-100 group">
                                  <div className="w-6 h-6 rounded-full border border-dashed border-gray-300 flex items-center justify-center group-hover:border-gray-900"><Plus size={14} /></div><span className="text-sm font-medium">Ajouter une étape au processus...</span>
                              </button>
                          )}
                      </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2"><FileImage size={16} className="text-gray-400"/>Fichiers & Teasers</h3>
                          <div className="flex items-center gap-3">
                              {isUploading && <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 animate-pulse"><Loader2 size={12} className="animate-spin"/> Upload en cours...</div>}
                              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">{(project.teasers || []).length} {userPlan === 'discovery' ? '/ 3' : ''}</span>
                          </div>
                      </div>
                      <div className="p-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                              {(project.teasers || []).length === 0 && (
                                  <div onClick={() => fileInputRef.current?.click()} className="col-span-full py-10 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-xl bg-gray-50/30 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all group">
                                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-2 text-gray-400"><FileImage size={18}/></div>
                                      <p className="text-xs font-medium text-gray-500">Aucun fichier pour le moment</p>
                                  </div>
                              )}
                              {(project.teasers || []).map(t => (
                                  <div key={t.id} className="group relative flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-sm transition-all">
                                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden text-gray-400">{t.type === 'video' ? <Film size={18}/> : <img src={t.url} className="w-full h-full object-cover" alt=""/>}</div>
                                      <div className="flex-1 min-w-0"><p className="text-xs font-bold text-gray-900 truncate">{t.title || 'Média'}</p><p className="text-[10px] text-gray-500 font-mono">{t.date}</p></div>
                                      <button onClick={() => onDeleteTeaser(t.id)} className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
                                  </div>
                              ))}
                          </div>
                          <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
                          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="w-full border-dashed border-gray-300 text-gray-500 hover:text-gray-900 hover:border-gray-400" disabled={isUploading}><Upload size={14}/> Ajouter des fichiers</Button>
                      </div>
                  </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="h-40 bg-gray-100 relative group flex items-center justify-center">
                        {/* --- MODIFICATION ICI : Ajout de la clé (key) pour forcer le refresh --- */}
                        {project.coverImage ? <img key={project.coverImage} src={project.coverImage} className="w-full h-full object-cover" alt="" /> : <ImageIcon size={48} className="text-gray-300" />}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => coverInputRef.current?.click()} className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"><Camera size={14}/> {project.coverImage ? 'Modifier' : 'Ajouter une image'}</button>
                        </div>
                      </div>
                      <input type="file" ref={coverInputRef} className="hidden" onChange={(e) => e.target.files && onUpdateCoverImage(e.target.files[0])} accept="image/*" />
                      
                      {/* ... (Reste du code inchangé) ... */}
                      <div className="p-6">
                          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Informations</h3>
                              {onUpdateProject && (
                                  <button onClick={() => setIsEditingInfo(!isEditingInfo)} className={`p-1.5 rounded transition-colors ${isEditingInfo ? 'bg-black text-white' : 'text-gray-400 hover:text-black hover:bg-gray-100'}`}><Pencil size={12}/></button>
                              )}
                          </div>
                          
                          <div className="space-y-4">
                              {isEditingInfo ? (
                                  <div className="space-y-3 animate-fade-in">
                                      <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Email Client</label><input type="email" value={editedInfo.clientEmail} onChange={(e) => setEditedInfo({...editedInfo, clientEmail: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-900 outline-none focus:border-gray-400" /></div>
                                      <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Date</label><input type="date" value={editedInfo.date} onChange={(e) => setEditedInfo({...editedInfo, date: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-900 outline-none focus:border-gray-400" /></div>
                                      <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Rendu Espéré</label><input type="date" value={editedInfo.expectedDeliveryDate || ''} onChange={(e) => setEditedInfo({...editedInfo, expectedDeliveryDate: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-900 outline-none focus:border-gray-400" /></div>
                                      <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Lieu</label><input type="text" value={editedInfo.location} onChange={(e) => setEditedInfo({...editedInfo, location: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-900 outline-none focus:border-gray-400" /></div>
                                      <div className="flex gap-2 pt-2">
                                          <Button variant="outline" size="sm" onClick={() => setIsEditingInfo(false)} fullWidth>Annuler</Button>
                                          <Button variant="black" size="sm" onClick={handleSaveInfo} isLoading={isSavingInfo} fullWidth>Enregistrer</Button>
                                      </div>
                                  </div>
                              ) : (
                                  <>
                                      <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-gray-500"><Mail size={14} /><span className="text-xs font-medium">Email Client</span></div><span className="text-xs font-bold text-gray-900 break-all text-right" title={project.clientEmail}>{project.clientEmail || '—'}</span></div>
                                      <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-gray-500"><Calendar size={14} /><span className="text-xs font-medium">Date</span></div><span className="text-xs font-bold text-gray-900">{project.date}</span></div>
                                      <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-gray-500"><Flag size={14} /><span className="text-xs font-medium">Rendu Espéré</span></div><span className="text-xs font-bold text-gray-900">{project.expectedDeliveryDate || '—'}</span></div>
                                      <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-gray-500"><MapPin size={14} /><span className="text-xs font-medium">Lieu</span></div><span className="text-xs font-bold text-gray-900">{project.location}</span></div>
                                  </>
                              )}
                          </div>
                      </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-6"><div className="flex items-center gap-2 mb-4 text-gray-900 border-b border-gray-100 pb-2"><Lock size={14} className="text-emerald-600"/><h3 className="font-bold text-xs uppercase tracking-wide">Accès Sécurisé</h3></div><div className="space-y-4"><div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-400 uppercase">Mot de passe</label><div className="relative"><input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-xs font-mono font-medium focus:bg-white focus:border-black outline-none transition-all" placeholder="Mot de passe"/><button onClick={() => onUpdatePassword(password)} className="absolute right-1 top-1 p-1.5 hover:bg-white rounded-md text-gray-400 hover:text-emerald-600 transition-colors"><Check size={14}/></button></div></div><div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-400 uppercase">Lien Client Unique</label><div className="flex gap-2"><div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[10px] text-gray-600 font-mono truncate select-all">{getClientUrl()}</div><button onClick={() => { navigator.clipboard.writeText(getClientUrl()); setShowCopyFeedback(true); setTimeout(() => setShowCopyFeedback(false), 2000); }} className={`px-3 rounded-lg border transition-all flex items-center justify-center ${showCopyFeedback ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900'}`}>{showCopyFeedback ? <Check size={14}/> : <Copy size={14}/>}</button></div></div></div></div>
                  </div>
              </div>
          </div>
      </div>

      {isNotifyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-slide-up relative flex flex-col max-h-[90vh]">
                  {/* ... (Modale notification inchangée) ... */}
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><Mail size={16} /></div>
                          <div><h3 className="font-bold text-gray-900 text-sm">Notifier le client</h3></div>
                      </div>
                      <button onClick={() => setIsNotifyModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-900 transition-colors"><X size={18} /></button>
                  </div>
                  <div className="p-6 overflow-y-auto flex-1">
                      {notifyStep === 'choice' && (
                          <div className="space-y-4 animate-fade-in">
                              <p className="text-sm text-gray-600 mb-6">Quel type de message souhaitez-vous envoyer ?</p>
                              <button onClick={() => generateNotification('status')} className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all flex items-center gap-4 text-left group"><div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><RefreshCcw size={18} /></div><div><h4 className="text-sm font-bold text-gray-900">Mise à jour d'étape</h4><p className="text-xs text-gray-500">Informer que le projet avance à l'étape suivante.</p></div></button>
                              <button onClick={() => generateNotification('delay')} className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-amber-500 hover:shadow-md transition-all flex items-center gap-4 text-left group"><div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors"><AlertTriangle size={18} /></div><div><h4 className="text-sm font-bold text-gray-900">Retard de production</h4><p className="text-xs text-gray-500">Expliquer un délai supplémentaire avec professionnalisme.</p></div></button>
                              <button onClick={() => generateNotification('note')} className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all flex items-center gap-4 text-left group"><div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><StickyNote size={18} /></div><div><h4 className="text-sm font-bold text-gray-900">Nouvelle note détaillée</h4><p className="text-xs text-gray-500">Inviter le client à lire vos précisions sur l'étape en cours.</p></div></button>
                          </div>
                      )}
                      {notifyStep === 'generating' && (
                          <div className="py-20 flex flex-col items-center justify-center text-center animate-fade-in"><div className="relative"><Sparkles size={40} className="text-indigo-600 animate-pulse" /><div className="absolute inset-0 bg-indigo-400 blur-2xl opacity-20"></div></div><h3 className="mt-6 text-lg font-bold text-gray-900 tracking-tight">Rédaction en cours...</h3><p className="text-sm text-gray-500 max-w-xs mx-auto mt-2 font-medium">L'IA prépare votre brouillon premium.</p></div>
                      )}
                      {notifyStep === 'preview' && notificationEmail && (
                          <div className="animate-fade-in space-y-6">
                              <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                  <div className="px-5 py-4 bg-white border-b border-gray-100 flex items-center gap-4"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest w-16">Destinataire</label><div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">{project.clientEmail}</div></div>
                                  <div className="px-5 py-4 bg-white border-b border-gray-100 flex items-center gap-4 group"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest w-16">Objet</label><input type="text" value={notificationEmail.subject} onChange={(e) => handleUpdateEmail('subject', e.target.value)} className="flex-1 bg-transparent text-xs font-bold text-gray-900 outline-none focus:text-indigo-600 transition-colors" /></div>
                                  <div className="p-5 bg-white min-h-[250px] flex flex-col"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">Message</label><textarea value={notificationEmail.body} onChange={(e) => handleUpdateEmail('body', e.target.value)} className="flex-1 w-full bg-transparent text-sm text-gray-700 leading-relaxed font-medium outline-none resize-none focus:text-gray-900 transition-colors" placeholder="Écrivez votre message ici..." /></div>
                              </div>
                              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3"><Sparkles size={16} className="text-indigo-600 shrink-0 mt-0.5" /><p className="text-[11px] text-indigo-700 leading-normal font-medium">Relisez et modifiez le message si besoin. Peekit ouvrira votre messagerie pour envoyer l'email vers <b>{project.clientEmail}</b>.</p></div>
                              <div className="flex gap-3"><Button variant="outline" fullWidth onClick={() => setNotifyStep('choice')}>Changer de type</Button><Button variant="black" fullWidth onClick={sendNotification} isLoading={isSendingNotification} className="gap-2">Confirmer et Envoyer <Send size={14}/></Button></div>
                          </div>
                      )}
                      {notifyStep === 'success' && (
                          <div className="py-20 flex flex-col items-center justify-center text-center animate-fade-in"><div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6"><Check size={32} strokeWidth={3}/></div><h3 className="text-xl font-bold text-gray-900 mb-2">Email prêt !</h3><p className="text-sm text-gray-500 font-medium">Le brouillon a été transmis à votre messagerie pour {project.clientEmail}.</p></div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
