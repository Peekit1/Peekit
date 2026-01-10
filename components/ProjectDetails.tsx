import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Calendar, MapPin, Check, Loader2, Link as LinkIcon, Lock, 
  Upload, Trash2, Camera, Pencil, Plus, Clock,
  MoreHorizontal, FileImage, Film, LayoutGrid, Settings,
  AlertCircle, RefreshCcw, CheckCircle2, Circle, Eye, Mail,
  Copy, Globe, Flag, Sparkles, ShieldCheck, GitBranch, X, Send,
  Zap, MessageSquareText, AlertTriangle, StickyNote, GripVertical, ChevronRight as ChevronRightIcon, Image as ImageIcon,
  Dice5 // ✅ Import de l'icône dé pour le mot de passe
} from 'lucide-react';
import { ProjectDetailsProps, WorkflowStep, NotificationType, Project } from '../types';
import { Button } from './Button';
import emailjs from '@emailjs/browser';

// ✅ SECURE CONFIGURATION: Environment Variables
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

// Check configuration
const isEmailJSConfigured = () => {
  const { serviceId, templateId, publicKey } = EMAILJS_CONFIG;
  if (!serviceId || !templateId || !publicKey) {
    console.error('❌ EmailJS Configuration missing.');
    return false;
  }
  return true;
};

interface ExtendedProjectDetailsProps extends ProjectDetailsProps {
    onUpdateProject?: (projectId: string, data: Partial<Project>) => Promise<void>;
    onDeleteAllTeasers?: () => Promise<void>;
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
  onDeleteAllTeasers,
  onUpdateCoverImage,
  onNotifyClient,
  onUpdateProject,
  onFinalizeProject // ✅ Handler pour marquer le projet comme terminé
}) => {
  const [loadingStageId, setLoadingStageId] = useState<string | null>(null);
  const [isSavingWorkflow, setIsSavingWorkflow] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [password, setPassword] = useState(project.accessPassword || '');
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  
  // ✅ Nouvel état pour la modale de suppression
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

  // ✅ État pour marquer le projet comme terminé (dernière étape validée manuellement)
  const [isProjectFinalized, setIsProjectFinalized] = useState(project.isFinalized || false); 
   
  // STATE FOR INSTANT LOCAL PREVIEW
  const [localCoverPreview, setLocalCoverPreview] = useState<string | null>(null);

  // ✅ STATE POUR AJUSTEMENT DU FOCUS DE L'IMAGE
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [localFocusX, setLocalFocusX] = useState(project.coverFocusX ?? 50);
  const [localFocusY, setLocalFocusY] = useState(project.coverFocusY ?? 50);

  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [localWorkflow, setLocalWorkflow] = useState<any[]>([]);
   
  // ✅ NOUVEL ÉTAT POUR LE MENU MOBILE
  const [openMenuStepId, setOpenMenuStepId] = useState<string | null>(null);

  // INFO EDITING STATES
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
      clientEmail: project.clientEmail,
      clientEmail2: project.clientEmail2 || '',
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

  // Reset preview if project changes (navigation)
  useEffect(() => {
    setLocalCoverPreview(null);
  }, [project.id]);

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
          clientEmail2: project.clientEmail2 || '',
          date: project.date,
          expectedDeliveryDate: project.expectedDeliveryDate,
          location: project.location
      });
  }, [project]);

  const currentStageIndex = stageConfig.findIndex(s => s.id === project.currentStage);
   
  // ✅ FIX: Logique améliorée pour la gestion des étapes
  // - Cliquer sur l'avant-dernière étape passe à la dernière en "en cours"
  // - La dernière étape nécessite une action explicite pour terminer le projet
  const isOnLastStage = currentStageIndex === stageConfig.length - 1;

  const handleStageClick = async (clickedStepId: string) => {
      if (editingStepId) return;

      const clickedIndex = stageConfig.findIndex(s => s.id === clickedStepId);
      if (clickedIndex === -1) return;

      // Retour en arrière : toujours autorisé + reset finalization
      if (clickedIndex < currentStageIndex) {
          setIsProjectFinalized(false);
          setLoadingStageId(clickedStepId);
          await onUpdateStage(clickedStepId);
          setLoadingStageId(null);
          return;
      }

      // Clic sur l'étape actuelle pour passer à la suivante
      if (clickedStepId === project.currentStage) {
          // Si on n'est PAS sur la dernière étape, on avance
          if (clickedIndex < stageConfig.length - 1) {
              const nextStep = stageConfig[clickedIndex + 1];
              setLoadingStageId(nextStep.id);
              await onUpdateStage(nextStep.id);
              setLoadingStageId(null);
          }
          // Si on est sur la dernière étape, ne rien faire (utiliser le bouton "Terminer")
          return;
      }
  };

  // ✅ Handler pour marquer le projet comme terminé
  const handleFinalizeProject = async () => {
      setIsProjectFinalized(true);
      // Persister en base de données si le handler est fourni
      if (onFinalizeProject) {
          await onFinalizeProject();
      }
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

  // ✅ 1. Clic sur le bouton "Tout supprimer" : Ouvre la modale
  const handleDeleteAllMediaClick = () => {
      if (!project.teasers || project.teasers.length === 0) return;
      setIsDeleteAllModalOpen(true);
  };

  // ✅ 2. Confirmation dans la modale : Supprime vraiment
  const confirmDeleteAll = async () => {
      setIsDeleteAllModalOpen(false);
      
      if (onDeleteAllTeasers) {
          await onDeleteAllTeasers();
      } else {
         // Fallback si pas de prop globale
         for (const teaser of project.teasers) {
             await onDeleteTeaser(teaser.id);
         }
      }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const objectUrl = URL.createObjectURL(file);
          setLocalCoverPreview(objectUrl);
          try {
              await onUpdateCoverImage(file);
          } catch (error) {
              console.error("Erreur upload cover:", error);
              setLocalCoverPreview(null);
          }
      }
  };

  // ✅ HANDLER POUR CLIC SUR L'IMAGE (DÉFINIR LE POINT FOCAL)
  const handleFocusClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
      setLocalFocusX(x);
      setLocalFocusY(y);
  };

  // ✅ SAUVEGARDER LE FOCUS
  const handleSaveFocus = async () => {
      if (onUpdateProject) {
          await onUpdateProject(project.id, {
              coverFocusX: localFocusX,
              coverFocusY: localFocusY
          });
      }
      setIsFocusModalOpen(false);
  };

  // ✅ LOGIQUE GÉNÉRATEUR DE MOT DE PASSE
  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
    const length = 12;
    let newPassword = "";
    for (let i = 0, n = chars.length; i < length; ++i) {
        newPassword += chars.charAt(Math.floor(Math.random() * n));
    }
    setPassword(newPassword);
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
    if (!notificationEmail) return;

    if (!isEmailJSConfigured()) {
        alert('⚠️ Configuration email manquante.');
        return;
    }

    setIsSendingNotification(true);

    try {
        const baseUrl = window.location.href.split('#')[0];
        const clientLink = `${baseUrl}#/v/${project.id}`;
        
        // ✅ Envoyer aux deux emails si clientEmail2 existe
        const recipientEmails = project.clientEmail2
            ? `${project.clientEmail}, ${project.clientEmail2}`
            : project.clientEmail;

        const templateParams = {
            to_email: recipientEmails,
            client_name: project.clientName,
            subject: notificationEmail.subject,
            message: notificationEmail.body,
            link: clientLink,
            studio_name: studioName
        };

        await emailjs.send(
            EMAILJS_CONFIG.serviceId!,
            EMAILJS_CONFIG.templateId!,
            templateParams,
            EMAILJS_CONFIG.publicKey!
        );
        
        setNotifyStep('success');
        setTimeout(() => {
            setIsNotifyModalOpen(false);
            setNotifyStep('choice');
        }, 2500);

    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi:', error);
        alert('Erreur lors de l\'envoi de l\'email');
    } finally {
        setIsSendingNotification(false);
    }
  };

  const isPro = userPlan === 'pro' || userPlan === 'agency';
  const displayImage = localCoverPreview || project.coverImage;

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 pb-20">
      {/* OVERLAY FERMETURE MENU MOBILE */}
      {openMenuStepId && <div className="fixed inset-0 z-40" onClick={() => setOpenMenuStepId(null)} />}

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
                            <p className="text-xs text-gray-500 mt-0.5">Cliquez sur une étape pour naviguer.</p>
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
                              const isNavigable = !isEditing && (isDone || isCurrent);

                              // ✅ FIX: La dernière étape n'est "terminée" visuellement que si isProjectFinalized est true
                              const isLastStepFinalized = isLastStep && isCurrent && isProjectFinalized;
                              const isLastStepInProgress = isLastStep && isCurrent && !isProjectFinalized;

                              return (
                                  <div
                                    key={step.id}
                                    className={`group flex flex-col transition-all select-none relative
                                        ${isEditing ? 'ring-2 ring-black bg-white z-10 shadow-lg' : ''}
                                        ${!isEditing && isLastStepFinalized ? 'bg-emerald-50/40' : isCurrent ? 'bg-blue-50/20' : ''}
                                    `}
                                  >
                                      {/* ZONE CLICABLE PRINCIPALE (NAVIGATION) */}
                                      <div
                                        onClick={() => isNavigable && !isLastStepInProgress && handleStageClick(step.id)}
                                        className={`px-6 py-4 flex items-center gap-4 ${isNavigable && !isLastStepInProgress ? 'cursor-pointer hover:bg-gray-50 active:bg-gray-100' : 'cursor-default'}`}
                                      >
                                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${isLoading ? 'border-gray-200 bg-white' : isLastStepFinalized ? 'bg-emerald-600 border-emerald-600 text-white' : isDone ? 'bg-emerald-500 border-emerald-500 text-white' : isCurrent ? 'border-blue-600 bg-white' : 'border-gray-300 bg-white'}`}>
                                              {isLoading ? <Loader2 size={12} className="animate-spin text-gray-400"/> : isLastStepFinalized ? <Check size={14} strokeWidth={3}/> : isDone ? <Check size={14} strokeWidth={3}/> : isCurrent ? <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></div> : <div className="w-1.5 h-1.5 bg-gray-200 rounded-full transition-colors"></div>}
                                          </div>

                                          {/* ✅ FIX OVERLAP: AJOUT DE min-w-0 et FLEX */}
                                          <div className="flex-1 min-w-0">
                                              {isEditing ? (
                                                  <input autoFocus value={step.label} onChange={(e) => handleUpdateStepField(step.id, 'label', e.target.value)} className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none border-b border-gray-300 pb-1" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => { if (e.key === 'Enter') saveWorkflow(); if (e.key === 'Escape') cancelWorkflowEdit(); }}/>
                                              ) : (
                                                  // ✅ FIX OVERLAP: AJOUT DE md:pr-24 pour que le texte s'arrête avant les boutons absolus
                                                  <div className="flex items-center justify-between pr-8 md:pr-24">
                                                      <span className={`text-sm font-bold truncate ${isLastStepFinalized ? 'text-emerald-900' : isCurrent || isDone ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</span>

                                                      {/* ✅ FIX: Affichage conditionnel pour la dernière étape */}
                                                      {isCurrent && isLastStepFinalized && <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shrink-0 ml-2 bg-emerald-100 text-emerald-700 border border-emerald-200">Projet Terminé</span>}
                                                      {isCurrent && isLastStepFinalized && <span className="md:hidden px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shrink-0 ml-2 bg-emerald-100 text-emerald-700 border border-emerald-200">Terminé</span>}
                                                      {isCurrent && !isLastStep && <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shrink-0 ml-2 bg-blue-100 text-blue-700">En cours</span>}
                                                      {isCurrent && !isLastStep && <span className="md:hidden px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shrink-0 ml-2 bg-blue-100 text-blue-700">En cours</span>}
                                                      {isCurrent && isLastStepInProgress && <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shrink-0 ml-2 bg-amber-100 text-amber-700 border border-amber-200">Livraison en cours</span>}
                                                      {isCurrent && isLastStepInProgress && <span className="md:hidden px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shrink-0 ml-2 bg-amber-100 text-amber-700 border border-amber-200">En cours</span>}
                                                  </div>
                                              )}
                                          </div>
                                      </div>

                                      {/* BOUTONS D'ÉDITION SÉPARÉS */}
                                      {isPro && !isEditing && (
                                          <>
                                              {/* VERSION BUREAU : AU SURVOL (Position Absolute conservée mais gérée par le padding du texte) */}
                                              <div className="hidden md:flex absolute right-4 top-3 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm p-1 rounded-lg">
                                                  <button onClick={(e) => { e.stopPropagation(); setEditingStepId(step.id); }} className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg border border-transparent hover:border-gray-200 hover:shadow-sm"><Pencil size={14}/></button>
                                                  <button onClick={(e) => handleDeleteStep(step.id, e)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100"><Trash2 size={14}/></button>
                                              </div>

                                              {/* VERSION MOBILE : MENU "..." */}
                                              <div className="md:hidden absolute right-2 top-3">
                                                  <button 
                                                    onClick={(e) => { e.stopPropagation(); setOpenMenuStepId(openMenuStepId === step.id ? null : step.id); }} 
                                                    className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg active:bg-gray-100"
                                                  >
                                                      <MoreHorizontal size={18} />
                                                  </button>
                                                  
                                                  {/* MENU DÉROULANT MOBILE */}
                                                  {openMenuStepId === step.id && (
                                                      <div className="absolute right-0 top-8 w-32 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fade-in origin-top-right">
                                                          <button 
                                                            onClick={(e) => { e.stopPropagation(); setEditingStepId(step.id); setOpenMenuStepId(null); }} 
                                                            className="w-full text-left px-4 py-3 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                          >
                                                              <Pencil size={12} /> Modifier
                                                          </button>
                                                          <button 
                                                            onClick={(e) => { handleDeleteStep(step.id, e); setOpenMenuStepId(null); }} 
                                                            className="w-full text-left px-4 py-3 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50"
                                                          >
                                                              <Trash2 size={12} /> Supprimer
                                                          </button>
                                                      </div>
                                                  )}
                                              </div>
                                          </>
                                      )}

                                      {/* ZONE D'ÉDITION (Message, Description....) */}
                                      {(isCurrent || isEditing) && (
                                          <div className="px-6 pb-4 ml-10 space-y-3 animate-fade-in">
                                              {isEditing ? (
                                                  <>
                                                      <div className="space-y-1"><label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Message court</label><input value={step.message} onChange={(e) => handleUpdateStepField(step.id, 'message', e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded px-2 py-1.5 text-xs text-gray-900 outline-none" onClick={(e) => e.stopPropagation()} /></div>
                                                      
                                                      {typeof step.description === 'string' ? (
                                                          <div className="space-y-1 animate-fade-in">
                                                              <div className="flex items-center justify-between">
                                                                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Note détaillée</label>
                                                                  <button onClick={() => handleUpdateStepField(step.id, 'description', undefined)} className="text-[9px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1 uppercase tracking-wider"><Trash2 size={10} /> Supprimer</button>
                                                              </div>
                                                              <textarea value={step.description} onChange={(e) => handleUpdateStepField(step.id, 'description', e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded px-2 py-1.5 text-xs text-gray-900 outline-none min-h-[60px]" onClick={(e) => e.stopPropagation()} placeholder="Écrivez votre note ici..."/>
                                                          </div>
                                                      ) : (
                                                          <button onClick={() => handleUpdateStepField(step.id, 'description', "")} className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 font-medium hover:border-gray-400 hover:text-gray-700 flex items-center justify-center gap-2 transition-colors mt-2"><Plus size={12} /> Ajouter une note détaillée</button>
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

                      {/* ✅ BOUTON TERMINER LE PROJET - Affiché quand on est sur la dernière étape non finalisée */}
                      {isOnLastStage && !isProjectFinalized && (
                          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200">
                              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                  <div className="text-center sm:text-left">
                                      <p className="text-sm font-bold text-amber-900">Prêt à finaliser le projet ?</p>
                                      <p className="text-xs text-amber-700">Cette action marquera le projet comme terminé.</p>
                                  </div>
                                  <Button variant="black" size="sm" onClick={handleFinalizeProject} className="!bg-emerald-600 hover:!bg-emerald-700 !rounded-full !px-6 gap-2 shrink-0">
                                      <Check size={14} /> Terminer le projet
                                  </Button>
                              </div>
                          </div>
                      )}

                      {/* ✅ MESSAGE DE CONFIRMATION - Affiché quand le projet est terminé */}
                      {isOnLastStage && isProjectFinalized && (
                          <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-t border-emerald-200">
                              <div className="flex items-center justify-center gap-2 text-emerald-700">
                                  <Check size={16} strokeWidth={3} />
                                  <p className="text-sm font-bold">Projet terminé avec succès !</p>
                              </div>
                          </div>
                      )}
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2"><FileImage size={16} className="text-gray-400"/>Fichiers & Teasers</h3>
                          <div className="flex items-center gap-3">
                              {/* ✅ BOUTON TOUT SUPPRIMER */}
                              {(project.teasers || []).length > 0 && (
                                <button onClick={handleDeleteAllMediaClick} className="text-[10px] font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors flex items-center gap-1">
                                    <Trash2 size={10} /> Tout supprimer
                                </button>
                              )}

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
                        {displayImage ? (
                            <img
                                key={`cover-${displayImage}`}
                                src={displayImage}
                                className="w-full h-full object-cover"
                                style={{ objectPosition: `${project.coverFocusX ?? 50}% ${project.coverFocusY ?? 50}%` }}
                                alt=""
                            />
                        ) : (
                            <ImageIcon size={48} className="text-gray-300" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button onClick={() => coverInputRef.current?.click()} className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"><Camera size={14}/> {project.coverImage ? 'Modifier' : 'Ajouter'}</button>
                          {project.coverImage && (
                            <button onClick={() => { setLocalFocusX(project.coverFocusX ?? 50); setLocalFocusY(project.coverFocusY ?? 50); setIsFocusModalOpen(true); }} className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"><Settings size={14}/> Recadrer</button>
                          )}
                        </div>
                      </div>
                      <input type="file" ref={coverInputRef} className="hidden" onChange={handleCoverUpload} accept="image/*" />
                      
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
                                      <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Email secondaire <span className="text-gray-300 font-normal">(optionnel)</span></label><input type="email" value={editedInfo.clientEmail2 || ''} onChange={(e) => setEditedInfo({...editedInfo, clientEmail2: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-900 outline-none focus:border-gray-400" placeholder="autre@email.com" /></div>
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
                                      <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-gray-500"><Camera size={14} /><span className="text-xs font-medium">Client</span></div><span className="text-xs font-bold text-gray-900">{project.clientName}</span></div>
                                      <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-gray-500"><Mail size={14} /><span className="text-xs font-medium">Email Client</span></div><span className="text-xs font-bold text-gray-900 break-all text-right" title={project.clientEmail}>{project.clientEmail || '—'}</span></div>
                                      {project.clientEmail2 && <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-gray-500"><Mail size={14} /><span className="text-xs font-medium">Email 2</span></div><span className="text-xs font-bold text-gray-900 break-all text-right" title={project.clientEmail2}>{project.clientEmail2}</span></div>}
                                      <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-gray-500"><Calendar size={14} /><span className="text-xs font-medium">Date</span></div><span className="text-xs font-bold text-gray-900">{project.date}</span></div>
                                      <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-gray-500"><Flag size={14} /><span className="text-xs font-medium">Rendu Espéré</span></div><span className="text-xs font-bold text-gray-900">{project.expectedDeliveryDate || '—'}</span></div>
                                      <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-gray-500"><MapPin size={14} /><span className="text-xs font-medium">Lieu</span></div><span className="text-xs font-bold text-gray-900">{project.location}</span></div>
                                  </>
                              )}
                          </div>
                      </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-4 text-gray-900 border-b border-gray-100 pb-2">
                            <Lock size={14} className="text-emerald-600"/>
                            <h3 className="font-bold text-xs uppercase tracking-wide">Accès Sécurisé</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Mot de passe</label>
                                <div className="relative flex gap-2">
                                    <div className="relative flex-1">
                                        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-xs font-mono font-medium focus:bg-white focus:border-black outline-none transition-all" placeholder="Mot de passe"/>
                                        <button onClick={() => onUpdatePassword(password)} className="absolute right-1 top-1 p-1.5 hover:bg-white rounded-md text-gray-400 hover:text-emerald-600 transition-colors"><Check size={14}/></button>
                                    </div>
                                    {/* ✅ BOUTON GÉNÉRATEUR MOT DE PASSE */}
                                    <button onClick={generateRandomPassword} className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all" title="Générer un code aléatoire">
                                        <Dice5 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Lien Client Unique</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[10px] text-gray-600 font-mono truncate select-all">{getClientUrl()}</div>
                                    <button onClick={() => { navigator.clipboard.writeText(getClientUrl()); setShowCopyFeedback(true); setTimeout(() => setShowCopyFeedback(false), 2000); }} className={`px-3 rounded-lg border transition-all flex items-center justify-center ${showCopyFeedback ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900'}`}>{showCopyFeedback ? <Check size={14}/> : <Copy size={14}/>}</button>
                                </div>
                            </div>
                        </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {isNotifyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-slide-up relative flex flex-col max-h-[90vh]">
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
                                  <div className="px-5 py-4 bg-white border-b border-gray-100 flex items-center gap-4 flex-wrap">
                                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest w-16 shrink-0">Destinataire</label>
                                      <div className="flex flex-wrap gap-2">
                                          <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">{project.clientEmail}</div>
                                          {project.clientEmail2 && <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">{project.clientEmail2}</div>}
                                      </div>
                                  </div>
                                  <div className="px-5 py-4 bg-white border-b border-gray-100 flex items-center gap-4 group"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest w-16">Objet</label><input type="text" value={notificationEmail.subject} onChange={(e) => handleUpdateEmail('subject', e.target.value)} className="flex-1 bg-transparent text-xs font-bold text-gray-900 outline-none focus:text-indigo-600 transition-colors" /></div>
                                  <div className="p-5 bg-white min-h-[250px] flex flex-col"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">Message</label><textarea value={notificationEmail.body} onChange={(e) => handleUpdateEmail('body', e.target.value)} className="flex-1 w-full bg-transparent text-sm text-gray-700 leading-relaxed font-medium outline-none resize-none focus:text-gray-900 transition-colors" placeholder="Écrivez votre message ici..." /></div>
                              </div>
                              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3"><Sparkles size={16} className="text-indigo-600 shrink-0 mt-0.5" /><p className="text-[11px] text-indigo-700 leading-normal font-medium">Relisez et modifiez le message si besoin. L'email sera envoyé à <b>{project.clientEmail}{project.clientEmail2 ? ` et ${project.clientEmail2}` : ''}</b>.</p></div>
                              <div className="flex gap-3"><Button variant="outline" fullWidth onClick={() => setNotifyStep('choice')}>Changer de type</Button><Button variant="black" fullWidth onClick={sendNotification} isLoading={isSendingNotification} className="gap-2">Confirmer et Envoyer <Send size={14}/></Button></div>
                          </div>
                      )}
                      {notifyStep === 'success' && (
                          <div className="py-20 flex flex-col items-center justify-center text-center animate-fade-in"><div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6"><Check size={32} strokeWidth={3}/></div><h3 className="text-xl font-bold text-gray-900 mb-2">Email envoyé !</h3><p className="text-sm text-gray-500 font-medium">La notification a été envoyée à {project.clientEmail}{project.clientEmail2 ? ` et ${project.clientEmail2}` : ''}.</p></div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* ✅ MODALE DE CONFIRMATION DE SUPPRESSION (Nouvelle intégration) */}
      {isDeleteAllModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-slide-up p-6">
                  <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
                          <AlertTriangle size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Tout supprimer ?</h3>
                      <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed">
                          Cette action est irréversible. Toutes les images et vidéos de ce projet seront définitivement effacées.
                      </p>
                      <div className="flex gap-3 w-full">
                          <button
                              onClick={() => setIsDeleteAllModalOpen(false)}
                              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                              Annuler
                          </button>
                          <button
                              onClick={confirmDeleteAll}
                              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 shadow-sm transition-colors flex items-center justify-center gap-2"
                          >
                              <Trash2 size={16} /> Supprimer
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* ✅ MODALE D'AJUSTEMENT DU FOCUS DE L'IMAGE */}
      {isFocusModalOpen && displayImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><Settings size={16} /></div>
                          <div><h3 className="font-bold text-gray-900 text-sm">Ajuster le cadrage</h3><p className="text-[10px] text-gray-500">Cliquez pour définir le point focal</p></div>
                      </div>
                      <button onClick={() => setIsFocusModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-900 transition-colors"><X size={18} /></button>
                  </div>
                  <div className="p-6">
                      <div
                        className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden cursor-crosshair border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors"
                        onClick={handleFocusClick}
                      >
                          <img
                            src={displayImage}
                            className="w-full h-full object-cover transition-all"
                            style={{ objectPosition: `${localFocusX}% ${localFocusY}%` }}
                            alt="Preview"
                          />
                          {/* Point focal indicator */}
                          <div
                            className="absolute w-6 h-6 -ml-3 -mt-3 pointer-events-none"
                            style={{ left: `${localFocusX}%`, top: `${localFocusY}%` }}
                          >
                              <div className="w-full h-full rounded-full border-2 border-white shadow-lg bg-indigo-500/50 animate-pulse"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-white shadow"></div>
                              </div>
                          </div>
                      </div>
                      <p className="text-xs text-gray-500 text-center mt-3">
                          Position actuelle : <span className="font-mono font-bold text-gray-900">{localFocusX}% / {localFocusY}%</span>
                      </p>
                  </div>
                  <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                      <Button variant="outline" fullWidth onClick={() => setIsFocusModalOpen(false)}>Annuler</Button>
                      <Button variant="black" fullWidth onClick={handleSaveFocus}>Enregistrer</Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
