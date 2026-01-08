import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, LayoutGrid, CreditCard, LogOut, Settings,
  Trash2, Pencil, Calendar, X, Menu,
  ChevronLeft, ChevronRight, Bell, Check, Download, Zap,
  Receipt, ShieldCheck, User, Camera, AlertTriangle, Image as ImageIcon,
  Briefcase, Clock, CheckCircle2, GripVertical, Save, Mail, Lock
} from 'lucide-react';
import { DashboardProps, Project, StagesConfiguration } from '../types';
import { Button } from './Button';

export const Dashboard: React.FC<DashboardProps> = ({ 
  userPlan, 
  studioName, 
  userEmail, 
  onLogout, 
  onOpenProject, 
  projects, 
  hasNotifications, 
  onClearNotifications, 
  defaultConfig = [], 
  onCreateProject, 
  onDeleteProject, 
  onEditProject, 
  onUpgradeClick, 
  onDeleteAccount,
  onUpdateProfile,
  onResetStudioConfig,
  onUpdateProjects,
  onUpdateEmail,
  onUpdatePassword
}) => {
  const [currentView, setCurrentView] = useState<'projects' | 'subscription'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
   
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
   
  // Cache buster pour forcer le rechargement des images
  const [dashboardCacheBuster, setDashboardCacheBuster] = useState(Date.now());

  useEffect(() => {
      setDashboardCacheBuster(Date.now());
  }, [projects]);

  // MODALES
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
   
  // ÉTATS SETTINGS
  const [settingsTab, setSettingsTab] = useState<'general' | 'workflow' | 'account'>('general');
  const [localStudioName, setLocalStudioName] = useState(studioName);
  
  // Sécurisation de l'initialisation du workflow local
  const [localWorkflow, setLocalWorkflow] = useState<StagesConfiguration>(
    Array.isArray(defaultConfig) ? defaultConfig : []
  );
  
  const [isSavingSettings, setIsSavingSettings] = useState(false);
   
  // États pour modification Compte
  const [emailForm, setEmailForm] = useState(userEmail || '');
  const [passwordForm, setPasswordForm] = useState('');
  // ÉTAT DE CHARGEMENT POUR AUTH
  const [isAuthUpdating, setIsAuthUpdating] = useState(false);

  // ÉTATS PROJETS
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
      clientName: '', clientEmail: '', date: '', location: '', type: 'Mariage', expectedDeliveryDate: ''
  });
  const [coverFile, setCoverFile] = useState<File | undefined>(undefined);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [newProjectLoading, setNewProjectLoading] = useState(false);

  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
      if (isSettingsModalOpen) {
          setLocalStudioName(studioName);
          // Protection contre le crash JSON.parse si defaultConfig est undefined
          const safeConfig = Array.isArray(defaultConfig) ? defaultConfig : [];
          setLocalWorkflow(JSON.parse(JSON.stringify(safeConfig))); 
          setEmailForm(userEmail || '');
          setPasswordForm('');
      }
  }, [isSettingsModalOpen, studioName, defaultConfig, userEmail]);

  const handleSaveSettings = async () => {
      setIsSavingSettings(true);
      try {
          await onUpdateProfile({
              studioName: localStudioName,
              stagesConfig: localWorkflow
          });
          setIsSettingsModalOpen(false);
      } finally {
          setIsSavingSettings(false);
      }
  };

  const handleUpdateEmailClick = async () => {
    if (!emailForm || emailForm === userEmail) return;
    setIsAuthUpdating(true);
    try {
        await onUpdateEmail(emailForm);
        alert("Un email de confirmation a été envoyé à votre nouvelle adresse.");
    } catch (error) {
        console.error(error);
        alert("Erreur lors de la mise à jour de l'email.");
    } finally {
        setIsAuthUpdating(false);
    }
  };

  const handleUpdatePasswordClick = async () => {
    if (!passwordForm || passwordForm.length < 6) {
        alert("Le mot de passe doit contenir au moins 6 caractères.");
        return;
    }
    setIsAuthUpdating(true);
    try {
        await onUpdatePassword(passwordForm);
        alert("Mot de passe mis à jour avec succès.");
        setPasswordForm('');
    } catch (error) {
        console.error(error);
        alert("Erreur lors de la mise à jour du mot de passe.");
    } finally {
        setIsAuthUpdating(false);
    }
  };

  const isPro = userPlan === 'pro' || userPlan === 'agency';
  const projectCount = projects.length;
  const maxProjects = userPlan === 'discovery' ? 1 : 9999;
  const usagePercent = Math.min((projectCount / maxProjects) * 100, 100);

  // Fonction utilitaire pour récupérer la config active sans crash
  const getSafeConfig = (projectConfig?: StagesConfiguration) => {
    if (projectConfig && Array.isArray(projectConfig) && projectConfig.length > 0) return projectConfig;
    if (defaultConfig && Array.isArray(defaultConfig) && defaultConfig.length > 0) return defaultConfig;
    return [];
  };

  const activeProjectsCount = projects.filter(p => {
      const activeConfig = getSafeConfig(p.stagesConfig);
      const lastStepId = activeConfig.length > 0 ? activeConfig[activeConfig.length - 1].id : null;
      return lastStepId ? p.currentStage !== lastStepId : true; // Si pas de config, considéré actif
  }).length;
  const completedProjectsCount = projects.length - activeProjectsCount;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
        if (dateString.match(/[a-zA-Z]/)) return dateString;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
    } catch (e) {
        return dateString;
    }
  };

  const getProjectStageInfo = (project: Project) => {
      const activeConfig = getSafeConfig(project.stagesConfig);
      
      // Si la config est vide, on renvoie une valeur par défaut safe
      if (activeConfig.length === 0) return { label: 'Inconnu', progress: 0 };

      const index = activeConfig.findIndex(s => s.id === project.currentStage);
      
      if (index === -1) {
          // Utilisation de l'opérateur optionnel ?. pour éviter le crash reading '0'
          return { label: activeConfig[0]?.label || 'Non débuté', progress: 0 };
      }
      
      const progress = Math.round(((index + 1) / activeConfig.length) * 100);
      return { label: activeConfig[index].label, progress: progress };
  };

  const filteredProjects = projects.filter(project => {
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = (project.clientName || '').toLowerCase().includes(searchLower) || (project.clientEmail || '').toLowerCase().includes(searchLower);
      
      const activeConfig = getSafeConfig(project.stagesConfig);
      const lastStepId = activeConfig.length > 0 ? activeConfig[activeConfig.length - 1].id : null;
      
      const isCompleted = lastStepId ? project.currentStage === lastStepId : false;
      const matchStatus = statusFilter === 'all' ? true : statusFilter === 'completed' ? isCompleted : !isCompleted;
      const matchType = typeFilter === 'all' ? true : project.type === typeFilter;
      return matchSearch && matchStatus && matchType;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const paginatedProjects = filteredProjects.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleCreateSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setNewProjectLoading(true);
      try {
          // ✅ CORRECTION : On envoie les dates brutes ISO (YYYY-MM-DD) pour la validation Zod
          // Le formatage français se fait uniquement à l'affichage, pas au stockage
          const projectToSubmit = {
              ...newProject,
              // Les dates restent en format ISO
              date: newProject.date,
              expectedDeliveryDate: newProject.expectedDeliveryDate
          };

          if (editingProjectId) {
              await onEditProject(editingProjectId, projectToSubmit, coverFile);
          } else {
              await onCreateProject(projectToSubmit, coverFile);
          }

          setDashboardCacheBuster(Date.now());

          // On ferme la modale et reset uniquement si pas d'erreur
          setIsNewProjectModalOpen(false);
          setEditingProjectId(null);
          setNewProject({ clientName: '', clientEmail: '', date: '', location: '', type: 'Mariage', expectedDeliveryDate: '' });
          setCoverFile(undefined);
      } catch (error) {
          console.error("Erreur création/édition projet:", error);
          // L'erreur est normalement déjà affichée par App.tsx via alert
      } finally {
          setNewProjectLoading(false);
      }
  };

  const availableTypes = Array.from(new Set(projects.map(p => p.type).filter(Boolean))).sort();

  const getCoverUrl = (project: Project) => {
      if (!project.coverImage) return "";
      if (project.coverImage.startsWith('data:')) return project.coverImage;
       
      const separator = project.coverImage.includes('?') ? '&' : '?';
      return `${project.coverImage}${separator}t=${dashboardCacheBuster}`;
  };

  return (
    <div className="fixed inset-0 flex bg-[#F9FAFB] font-sans text-gray-900 overflow-hidden">
        {isMobileSidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity" onClick={() => setIsMobileSidebarOpen(false)} />}

        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static ${isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
            <div className="h-20 flex items-center px-6 justify-between lg:justify-start">
                <div className="flex items-center gap-3 cursor-pointer">
                     <span className="text-2xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'Gabarito, sans-serif' }}>Peekit</span>
                </div>
                <button onClick={() => setIsMobileSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-900"><X size={20} /></button>
            </div>
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-8">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">Menu</div>
                <button onClick={() => { setCurrentView('projects'); setIsMobileSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${currentView === 'projects' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                    <LayoutGrid size={18} strokeWidth={2} className={currentView === 'projects' ? "text-gray-900" : "text-gray-400"} /> Tableau de bord
                </button>
                <button onClick={() => { setCurrentView('subscription'); setIsMobileSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${currentView === 'subscription' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                    <CreditCard size={18} strokeWidth={2} className={currentView === 'subscription' ? "text-gray-900" : "text-gray-400"} /> Abonnement
                </button>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3 mt-8">Outils</div>
                <button onClick={() => { setIsSettingsModalOpen(true); setIsMobileSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    <Settings size={18} strokeWidth={2} className="text-gray-400"/> Paramètres
                </button>
                <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={18} strokeWidth={2} /> Se déconnecter
                </button>
            </nav>
            <div className="p-4 border-t border-gray-100">
                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 border border-gray-100">
                    <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-900 font-bold text-xs shrink-0 shadow-sm">{studioName.substring(0,2).toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-gray-900 truncate">{studioName}</div>
                        <div className="text-[10px] text-gray-500 truncate capitalize">Plan {userPlan === 'discovery' ? 'Découverte' : (userPlan.charAt(0).toUpperCase() + userPlan.slice(1))}</div>
                    </div>
                </div>
            </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-20">
                <div className="flex items-center gap-3 md:gap-4">
                    <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg"><Menu size={20} /></button>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight truncate" style={{ fontFamily: 'Gabarito, sans-serif' }}>
                        {currentView === 'projects' ? 'Tableau de bord' : 'Abonnement & Factures'}
                    </h2>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                    {currentView === 'projects' && (
                        <>
                            <div className="relative group hidden sm:block">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                <input type="text" placeholder="Rechercher un projet..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm w-48 lg:w-64 focus:w-60 lg:focus:w-80 transition-all outline-none focus:border-gray-400 focus:bg-white"/>
                            </div>
                            <button onClick={onClearNotifications} className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 bg-white relative hover:shadow-sm transition-all">
                                <Bell size={18} />{hasNotifications && <span className="absolute top-2.5 right-3 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>}
                            </button>
                            <Button variant="black" size="md" onClick={() => { setEditingProjectId(null); setIsNewProjectModalOpen(true); }} className="gap-2 px-4 !h-10 shadow-lg shadow-black/10 !rounded-full"><Plus size={16} /> <span className="hidden md:inline">Nouveau projet</span></Button>
                        </>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-auto p-4 md:p-8 pb-24">
                {currentView === 'projects' && (
                    <div className="max-w-7xl mx-auto space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm"><div className="flex items-center gap-3 text-gray-500 mb-2"><div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Briefcase size={14} /></div><span className="text-xs font-bold uppercase tracking-wide">Total</span></div><div className="text-2xl font-bold text-gray-900">{projects.length}</div></div>
                            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm"><div className="flex items-center gap-3 text-gray-500 mb-2"><div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><Clock size={14} /></div><span className="text-xs font-bold uppercase tracking-wide">En cours</span></div><div className="text-2xl font-bold text-gray-900">{activeProjectsCount}</div></div>
                            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm"><div className="flex items-center gap-3 text-gray-500 mb-2"><div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 size={14} /></div><span className="text-xs font-bold uppercase tracking-wide">Terminés</span></div><div className="text-2xl font-bold text-gray-900">{completedProjectsCount}</div></div>
                            <div className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200 flex flex-col justify-center items-center text-center"><span className="text-xs text-gray-400 font-medium">Capacité stockage</span><span className="text-sm font-bold text-gray-600 mt-1">{usagePercent.toFixed(0)}% utilisé</span></div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col min-h-[500px]">
                            <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="relative w-full lg:w-64 md:hidden">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Filtrer..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-black transition-all font-medium"/>
                                </div>
                                <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar ml-auto">
                                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="appearance-none bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer shadow-sm hover:bg-gray-50"><option value="all">Status: Tous</option><option value="active">En cours</option><option value="completed">Terminés</option></select>
                                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="appearance-none bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer shadow-sm hover:bg-gray-50"><option value="all">Type: Tous</option>{availableTypes.map(t => <option key={t} value={t}>{t}</option>)}</select>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="md:hidden space-y-4 p-4">
                                    {paginatedProjects.map(project => {
                                        const { label, progress } = getProjectStageInfo(project);
                                        return (
                                            <div key={project.id} onClick={() => onOpenProject(project)} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm active:scale-[0.98] transition-transform relative overflow-hidden">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                        {project.coverImage ? <img src={getCoverUrl(project)} className="w-full h-full object-cover" key={`cover-card-${project.id}-${dashboardCacheBuster}`} /> : <ImageIcon size={20} className="text-gray-300" />}
                                                    </div>
                                                    <div className="min-w-0"><div className="font-bold text-gray-900 text-sm truncate">{project.clientName}</div><div className="text-xs text-gray-500 truncate">{project.clientEmail}</div></div>
                                                </div>
                                                <div className="flex items-center gap-2 mb-4"><span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 uppercase">{project.type}</span><span className="text-[10px] text-gray-400 flex items-center gap-1"><Calendar size={10}/> {formatDate(project.date)}</span></div>
                                                <div className="mb-4"><div className="flex justify-between items-end mb-1.5"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span><span className="text-xs font-bold text-gray-900">{progress}%</span></div><div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-black rounded-full" style={{ width: `${progress}%` }}></div></div></div>
                                                <div className="flex justify-end gap-2 pt-3 border-t border-gray-50"><button onClick={(e) => { e.stopPropagation(); setEditingProjectId(project.id); setNewProject({ clientName: project.clientName, clientEmail: project.clientEmail, date: project.date, location: project.location, type: project.type, expectedDeliveryDate: project.expectedDeliveryDate || '' }); setIsNewProjectModalOpen(true); }} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"><Pencil size={14}/></button><button onClick={(e) => { e.stopPropagation(); setProjectToDelete(project.id); }} className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={14}/></button></div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead><tr className="border-b border-gray-100 bg-gray-50/40"><th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-8">Client</th><th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Détails</th><th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avancement</th><th className="py-4 px-6 w-24"></th></tr></thead>
                                        <tbody>
                                            {paginatedProjects.map(project => {
                                                const { label, progress } = getProjectStageInfo(project);
                                                return (
                                                    <tr key={project.id} onClick={() => onOpenProject(project)} className="group hover:bg-gray-50/60 cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                                                        <td className="py-4 px-6 pl-8"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">{project.coverImage ? <img src={getCoverUrl(project)} className="w-full h-full object-cover" key={`cover-table-${project.id}-${dashboardCacheBuster}`} /> : <ImageIcon size={18} className="text-gray-300" />}</div><div><div className="font-bold text-gray-900 text-sm">{project.clientName}</div><div className="text-xs text-gray-500">{project.clientEmail}</div></div></div></td>
                                                        <td className="py-4 px-6"><div className="space-y-1"><span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 uppercase border border-gray-200">{project.type}</span><div className="text-xs text-gray-500 flex items-center gap-1.5"><Calendar size={12}/> {formatDate(project.date)}</div></div></td>
                                                        <td className="py-4 px-6"><div className="w-full max-w-[200px]"><div className="flex justify-between items-end mb-1.5"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span><span className="text-xs font-bold text-gray-900">{progress}%</span></div><div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-black rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div></div></div></td>
                                                        <td className="py-4 px-6 text-right pr-8"><div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={(e) => { e.stopPropagation(); setEditingProjectId(project.id); setNewProject({ clientName: project.clientName, clientEmail: project.clientEmail, date: project.date, location: project.location, type: project.type, expectedDeliveryDate: project.expectedDeliveryDate || '' }); setIsNewProjectModalOpen(true); }} className="p-2 border border-gray-200 rounded-lg hover:bg-white bg-gray-50 text-gray-600"><Pencil size={14}/></button><button onClick={(e) => { e.stopPropagation(); setProjectToDelete(project.id); }} className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 bg-gray-50 text-red-600"><Trash2 size={14}/></button></div></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-2xl mt-auto">
                                <div className="text-xs text-gray-500 font-medium pl-2">Page {page} / {totalPages}</div>
                                <div className="flex gap-2"><button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={16} /></button><button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"><ChevronRight size={16} /></button></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* VUE ABONNEMENT */}
                {currentView === 'subscription' && (
                    <div className="max-w-5xl mx-auto space-y-10 pb-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm relative overflow-hidden flex flex-col">
                                <div className="absolute top-6 right-6 px-3 py-1 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-wider">Actif</div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Offre Actuelle</h3>
                                <h2 className="text-3xl font-bold text-gray-900 capitalize mb-2">Plan {userPlan === 'discovery' ? 'Découverte' : (userPlan.charAt(0).toUpperCase() + userPlan.slice(1))}</h2>
                                <p className="text-sm text-gray-500 mb-8">Vous gérez vos projets avec Peekit {userPlan === 'discovery' ? 'Découverte' : userPlan}.</p>
                                {isPro ? (
                                    <div className="mt-auto"><div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 w-fit"><Check size={14} strokeWidth={3}/><span className="text-xs font-bold uppercase tracking-wider">Projets Illimités</span></div></div>
                                ) : (
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mt-auto"><div className="flex justify-between items-center mb-3"><span className="text-xs font-bold text-gray-700">Utilisation projets</span><span className="text-xs font-bold text-gray-900">{projectCount} / {maxProjects}</span></div><div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-black rounded-full transition-all duration-1000" style={{ width: `${usagePercent}%` }}></div></div></div>
                                )}
                            </div>
                            {!isPro ? (
                                <div className="bg-gray-900 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-black/10">
                                    <div><Zap size={24} className="text-yellow-400 mb-4"/><h3 className="text-xl font-bold mb-2">Passez au niveau supérieur</h3><p className="text-gray-400 text-sm leading-relaxed mb-6">Débloquez les projets illimités, la personnalisation avancée et les notifications IA.</p></div>
                                    <Button variant="secondary" fullWidth onClick={onUpgradeClick} className="h-12 font-bold">Accéder au Plan Pro</Button>
                                </div>
                            ) : (
                                <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
                                    <div><div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 border border-emerald-100"><ShieldCheck size={24} /></div><h3 className="text-xl font-bold text-gray-900 mb-2">Support & Sécurité</h3><p className="text-gray-500 text-sm leading-relaxed">Votre compte bénéficie du support prioritaire et de la sauvegarde en temps réel de tous vos projets.</p></div>
                                    <div className="mt-6 pt-6 border-t border-gray-100"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Une question ?</p><a href="#" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Contacter le support dédié →</a></div>
                                </div>
                            )}
                        </div>
                        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between"><h3 className="font-bold text-gray-900 text-sm flex items-center gap-2"><Receipt size={16} className="text-gray-400"/> Historique de facturation</h3></div>
                            <div className="divide-y divide-gray-50">{[{ date: '01 Oct 2024', amount: '19.00€', status: 'Payé', ref: 'INV-003' }, { date: '01 Sept 2024', amount: '19.00€', status: 'Payé', ref: 'INV-002' }].map((inv, i) => (<div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"><div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400"><Receipt size={14}/></div><div><div className="text-sm font-bold text-gray-900">Facture #{inv.ref}</div><div className="text-xs text-gray-500">{inv.date}</div></div></div><div className="flex items-center gap-6"><div className="text-sm font-bold text-gray-900">{inv.amount}</div><div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase">{inv.status}</div><button className="text-gray-300 hover:text-black"><Download size={16}/></button></div></div>))}</div>
                        </div>
                        <div className="pt-8 flex justify-center"><Button onClick={() => setIsDeleteAccountModalOpen(true)} variant="danger" className="h-10 px-8 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all text-xs font-bold rounded-lg shadow-sm">Supprimer mon compte</Button></div>
                    </div>
                )}
            </div>
        </main>

        {/* ✅ SETTINGS MODAL FIX POUR MOBILE SCROLL & LAYOUT */}
        {isSettingsModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                {/* CORRECTION MOBILE : 
                   - h-[90dvh] pour s'adapter à la barre d'adresse mobile
                   - overflow-hidden global sur la modale
                */}
                <div className="bg-white w-full max-w-4xl h-[90dvh] md:h-[600px] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-slide-up relative">
                    
                    {/* SIDEBAR (Navigation) */}
                    <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col shrink-0">
                        <div className="p-4 md:p-6 border-b border-gray-200">
                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2"><Settings size={20}/> <span className="md:inline">Paramètres</span></h3>
                        </div>
                        <nav className="flex-1 p-2 md:p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
                            <button onClick={() => setSettingsTab('general')} className={`whitespace-nowrap flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${settingsTab === 'general' ? 'bg-white text-black shadow-sm border border-gray-200' : 'text-gray-500 hover:bg-gray-100'}`}><User size={16} /> <span className="hidden sm:inline">Général</span><span className="sm:hidden">Général</span></button>
                            <button onClick={() => setSettingsTab('workflow')} className={`whitespace-nowrap flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${settingsTab === 'workflow' ? 'bg-white text-black shadow-sm border border-gray-200' : 'text-gray-500 hover:bg-gray-100'}`}><Briefcase size={16} /> <span className="hidden sm:inline">Workflow par défaut</span><span className="sm:hidden">Workflow</span></button>
                            <button onClick={() => setSettingsTab('account')} className={`whitespace-nowrap flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${settingsTab === 'account' ? 'bg-white text-black shadow-sm border border-gray-200' : 'text-gray-500 hover:bg-gray-100'}`}><ShieldCheck size={16} /> <span className="hidden sm:inline">Compte</span><span className="sm:hidden">Compte</span></button>
                        </nav>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div className="flex-1 flex flex-col bg-white min-w-0 h-full overflow-hidden">
                        
                        {/* ZONE DE SCROLL 
                           - flex-1 pour prendre l'espace restant
                           - overflow-y-auto pour scroller
                           - pb-20 (padding bottom) pour éviter que le contenu soit caché derrière le footer
                        */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
                            {settingsTab === 'general' && (
                                <div className="space-y-6 max-w-lg">
                                    <div><h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Identité du Studio</h2><p className="text-gray-500 text-sm">Comment vos clients voient votre marque.</p></div>
                                    <div><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Nom du Studio</label><input type="text" value={localStudioName} onChange={(e) => setLocalStudioName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-bold text-gray-900 outline-none focus:border-black transition-colors"/></div>
                                    <div className="p-4 border border-dashed border-gray-200 rounded-lg bg-gray-50 text-center text-gray-400 text-sm">Upload de logo bientôt disponible</div>
                                </div>
                            )}
                            {settingsTab === 'workflow' && (
                                <div className="space-y-6">
                                    <div><h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Workflow par défaut</h2><p className="text-gray-500 text-sm">Ces étapes seront appliquées aux <strong>nouveaux</strong> projets.</p></div>
                                    <div className="space-y-3">
                                        {localWorkflow.map((stage, index) => (
                                            <div key={stage.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg group">
                                                <div className="hidden sm:block"><GripVertical size={16} className="text-gray-300 cursor-move" /></div>
                                                <div className="flex-1 grid grid-cols-12 gap-3 w-full">
                                                    <div className="col-span-12 sm:col-span-6"><label className="text-[9px] font-bold text-gray-400 uppercase sm:hidden mb-1 block">Nom</label><input type="text" value={stage.label} onChange={(e) => { const newWorkflow = [...localWorkflow]; newWorkflow[index].label = e.target.value; setLocalWorkflow(newWorkflow); }} className="w-full bg-white border border-gray-200 rounded px-2 py-2 sm:py-1 text-sm font-medium"/></div>
                                                    <div className="col-span-5 sm:col-span-3"><label className="text-[9px] font-bold text-gray-400 uppercase sm:hidden mb-1 block">Min Jours</label><input type="number" value={stage.minDays} onChange={(e) => { const newWorkflow = [...localWorkflow]; newWorkflow[index].minDays = parseInt(e.target.value) || 0; setLocalWorkflow(newWorkflow); }} className="w-full bg-white border border-gray-200 rounded px-2 py-2 sm:py-1 text-sm"/></div>
                                                    <div className="col-span-5 sm:col-span-3"><label className="text-[9px] font-bold text-gray-400 uppercase sm:hidden mb-1 block">Max Jours</label><input type="number" value={stage.maxDays} onChange={(e) => { const newWorkflow = [...localWorkflow]; newWorkflow[index].maxDays = parseInt(e.target.value) || 0; setLocalWorkflow(newWorkflow); }} className="w-full bg-white border border-gray-200 rounded px-2 py-2 sm:py-1 text-sm"/></div>
                                                    <div className="col-span-2 sm:hidden flex items-end justify-center pb-2"><button onClick={() => { const newWorkflow = localWorkflow.filter((_, i) => i !== index); setLocalWorkflow(newWorkflow); }} className="text-red-500"><Trash2 size={18}/></button></div>
                                                </div>
                                                <button onClick={() => { const newWorkflow = localWorkflow.filter((_, i) => i !== index); setLocalWorkflow(newWorkflow); }} className="hidden sm:block p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-md transition-colors"><Trash2 size={16}/></button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="secondary" onClick={() => { setLocalWorkflow([...localWorkflow, { id: `custom-${Date.now()}`, label: 'Nouvelle étape', minDays: 1, maxDays: 3, message: 'En cours' }]); }} size="sm" className="w-full border-dashed border-gray-300 text-gray-500 hover:text-black hover:border-gray-400">+ Ajouter une étape</Button>
                                </div>
                            )}
                            {settingsTab === 'account' && (
                                <div className="space-y-8 max-w-lg">
                                    <div><h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Sécurité & Connexion</h2><p className="text-gray-500 text-sm">Gérez vos identifiants.</p></div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide"><Mail size={16} /> Email</div>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <input type="email" value={emailForm} onChange={(e) => setEmailForm(e.target.value)} className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:border-black focus:bg-white transition-colors outline-none"/>
                                            <Button size="sm" variant="secondary" onClick={handleUpdateEmailClick} isLoading={isAuthUpdating && emailForm !== userEmail}>Modifier</Button>
                                        </div>
                                        <p className="text-xs text-gray-400 pl-1">Email actuel : <span className="font-medium text-gray-600">{userEmail}</span></p>
                                    </div>
                                    <div className="h-px bg-gray-100 w-full"></div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide"><Lock size={16} /> Mot de passe</div>
                                        <div className="space-y-3">
                                            <input type="password" placeholder="Nouveau mot de passe" value={passwordForm} onChange={(e) => setPasswordForm(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:border-black focus:bg-white transition-colors outline-none"/>
                                            <div className="flex justify-end">
                                                <Button size="sm" variant="secondary" onClick={handleUpdatePasswordClick} isLoading={isAuthUpdating && passwordForm.length > 0}>Mettre à jour</Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-px bg-gray-100 w-full"></div>
                                    <div className="pt-2"><h3 className="font-bold text-red-600 mb-2">Zone de danger</h3><Button variant="danger" size="sm" onClick={() => setIsDeleteAccountModalOpen(true)}>Supprimer mon compte</Button></div>
                                </div>
                            )}
                        </div>

                        {/* FOOTER (BOUTONS) 
                           - z-10 pour être au-dessus du scroll
                           - shrink-0 pour ne jamais disparaître
                        */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0 z-10 safe-area-bottom">
                            <Button variant="secondary" onClick={() => setIsSettingsModalOpen(false)}>Fermer</Button>
                            <Button variant="black" onClick={handleSaveSettings} isLoading={isSavingSettings} className="gap-2"><Save size={16}/> Enregistrer</Button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {isNewProjectModalOpen && (<div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm animate-fade-in"><div className="flex min-h-full items-center justify-center p-4"><div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-slide-up relative"><button onClick={() => setIsNewProjectModalOpen(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all z-10"><X size={20} /></button><form onSubmit={handleCreateSubmit} className="p-6 md:p-10"><div className="w-12 h-12 bg-white text-gray-900 border border-gray-200 rounded-lg flex items-center justify-center mb-6 shadow-sm">{editingProjectId ? <Pencil size={20} strokeWidth={1.5} /> : <User size={20} strokeWidth={1.5} />}</div><h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">{editingProjectId ? 'Modifier le projet' : 'Initialisons votre projet'}</h2><p className="text-gray-500 mb-8 text-sm leading-relaxed">{editingProjectId ? 'Mettez à jour les informations du client et les délais.' : 'Ajoutez un projet pour voir la magie opérer sur Peekit.'}</p><div className="space-y-4"><div><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Nom du Client</label><input autoFocus type="text" required value={newProject.clientName} onChange={(e) => setNewProject({...newProject, clientName: e.target.value})} placeholder="Ex: Sophie & Marc" className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"/></div><div><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Email de contact</label><input type="email" required value={newProject.clientEmail} onChange={(e) => setNewProject({...newProject, clientEmail: e.target.value})} placeholder="email@client.com" className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"/></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Date</label><input type="date" required value={newProject.date} onChange={(e) => setNewProject({...newProject, date: e.target.value})} className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"/></div><div><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Lieu</label><input type="text" value={newProject.location} onChange={(e) => setNewProject({...newProject, location: e.target.value})} placeholder="Ville" className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"/></div></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Type</label><select value={newProject.type} onChange={(e) => setNewProject({...newProject, type: e.target.value})} className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none appearance-none cursor-pointer"><option value="Mariage">Mariage</option><option value="Shooting Mode">Shooting Mode</option><option value="Vidéo Publicitaire">Vidéo Publicitaire</option><option value="Identité Visuelle">Identité Visuelle</option><option value="Corporate">Corporate</option></select></div><div><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Rendu Estimé</label><input type="date" value={newProject.expectedDeliveryDate} onChange={(e) => setNewProject({...newProject, expectedDeliveryDate: e.target.value})} className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"/></div></div><div className="pt-2"><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Image de couverture</label><div className="relative group/cover"><input type="file" id="cover-upload" className="hidden" onChange={(e) => setCoverFile(e.target.files ? e.target.files[0] : undefined)} accept="image/*"/><label htmlFor="cover-upload" className="flex items-center gap-3 w-full h-11 px-3 bg-gray-50 border border-gray-200 border-dashed rounded-md cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all"><Camera size={18} className="text-gray-400" /><span className="text-xs font-bold text-gray-500 truncate">{coverFile ? coverFile.name : 'Choisir une image...'}</span></label></div></div></div><div className="mt-10 flex gap-4"><Button type="button" variant="secondary" onClick={() => setIsNewProjectModalOpen(false)} fullWidth className="h-11">Annuler</Button><Button type="submit" variant="black" fullWidth isLoading={newProjectLoading} className="h-11 shadow-lg shadow-black/10">{editingProjectId ? 'Enregistrer' : 'Créer le projet'}</Button></div></form></div></div></div>)}
        {projectToDelete && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"><div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-8 text-center animate-slide-up"><div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 size={24} /></div><h3 className="font-bold text-gray-900 text-lg mb-2">Supprimer le projet ?</h3><p className="text-sm text-gray-500 mb-8 leading-relaxed">Toutes les données et fichiers associés seront définitivement supprimés.</p><div className="flex gap-4"><Button variant="secondary" onClick={() => setProjectToDelete(null)} fullWidth className="h-11">Annuler</Button><Button variant="danger" onClick={() => { if (projectToDelete) onDeleteProject(projectToDelete); setProjectToDelete(null); }} fullWidth className="h-11 border-red-100 text-red-600">Supprimer</Button></div></div></div>)}
        {isDeleteAccountModalOpen && (<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in"><div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 text-center animate-slide-up relative"><div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100 shadow-sm"><AlertTriangle size={32} /></div><h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Supprimer votre compte ?</h3><p className="text-sm text-gray-500 mb-8 leading-relaxed px-4">Cette action est <strong className="text-gray-900">irréversible</strong>. Tous vos projets, teasers et données de studio seront effacés définitivement.</p><div className="flex flex-col gap-3"><Button variant="danger" fullWidth className="h-12 !bg-red-600 !text-white !border-transparent hover:!bg-red-700 font-bold shadow-lg shadow-red-200" onClick={async () => { await onDeleteAccount(); setIsDeleteAccountModalOpen(false); }}>Oui, supprimer définitivement</Button><Button variant="secondary" fullWidth className="h-12 font-bold" onClick={() => setIsDeleteAccountModalOpen(false)}>Annuler</Button></div></div></div>)}
    </div>
  );
};
