import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, LayoutGrid, CreditCard, LogOut, Settings,
  Trash2, Pencil, Calendar, X, Menu,
  ChevronLeft, ChevronRight, Bell, Check, Download, Zap,
  Receipt, ShieldCheck, User, Camera, AlertTriangle, Image as ImageIcon,
  Briefcase, Clock, CheckCircle2, GripVertical, Save
} from 'lucide-react';
import { DashboardProps, Project, StagesConfiguration } from '../types';
import { Button } from './Button';

export const Dashboard: React.FC<DashboardProps> = ({ 
  userPlan, 
  studioName, 
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
  onUpdateProfile // Nouvelle prop
}) => {
  const [currentView, setCurrentView] = useState<'projects' | 'subscription'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [dashboardCacheBuster, setDashboardCacheBuster] = useState(Date.now());

  // MODALES
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  
  // ÉTATS SETTINGS
  const [settingsTab, setSettingsTab] = useState<'general' | 'workflow' | 'account'>('general');
  const [localStudioName, setLocalStudioName] = useState(studioName);
  const [localWorkflow, setLocalWorkflow] = useState<StagesConfiguration>(defaultConfig);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

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

  // QUAND ON OUVRE LES SETTINGS, ON CHARGE LES DONNÉES ACTUELLES
  useEffect(() => {
      if (isSettingsModalOpen) {
          setLocalStudioName(studioName);
          setLocalWorkflow(JSON.parse(JSON.stringify(defaultConfig))); // Deep copy pour éviter les mutations directes
      }
  }, [isSettingsModalOpen, studioName, defaultConfig]);

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

  // --- LOGIQUE DASHBOARD ---
  const isPro = userPlan === 'pro' || userPlan === 'agency';
  const projectCount = projects.length;
  const maxProjects = userPlan === 'discovery' ? 1 : 9999;
  const usagePercent = Math.min((projectCount / maxProjects) * 100, 100);

  const activeProjectsCount = projects.filter(p => {
      const activeConfig = p.stagesConfig || defaultConfig;
      const lastStepId = activeConfig.length > 0 ? activeConfig[activeConfig.length - 1].id : null;
      return p.currentStage !== lastStepId;
  }).length;
  const completedProjectsCount = projects.length - activeProjectsCount;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    if (dateString.match(/[a-zA-Z]/)) return dateString;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
  };

  const getProjectStageInfo = (project: Project) => {
      const activeConfig = project.stagesConfig || defaultConfig;
      const index = activeConfig.findIndex(s => s.id === project.currentStage);
      if (index === -1) return { label: activeConfig[0]?.label || 'Non débuté', progress: 0 };
      const progress = Math.round(((index + 1) / activeConfig.length) * 100);
      return { label: activeConfig[index].label, progress: progress };
  };

  const filteredProjects = projects.filter(project => {
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = (project.clientName || '').toLowerCase().includes(searchLower) || (project.clientEmail || '').toLowerCase().includes(searchLower);
      const activeConfig = project.stagesConfig || defaultConfig;
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
          if (editingProjectId) await onEditProject(editingProjectId, newProject, coverFile);
          else await onCreateProject(newProject, coverFile);
          setDashboardCacheBuster(Date.now()); 
          setIsNewProjectModalOpen(false);
          setEditingProjectId(null);
          setNewProject({ clientName: '', clientEmail: '', date: '', location: '', type: 'Mariage', expectedDeliveryDate: '' });
          setCoverFile(undefined);
      } finally { setNewProjectLoading(false); }
  };

  const availableTypes = Array.from(new Set(projects.map(p => p.type).filter(Boolean))).sort();
  const getCoverUrl = (project: Project) => {
      if (!project.coverImage) return "";
      const separator = project.coverImage.includes('?') ? '&' : '?';
      return `${project.coverImage}${separator}t=${dashboardCacheBuster}`;
  };

  return (
    <div className="fixed inset-0 flex bg-[#F9FAFB] font-sans text-gray-900 overflow-hidden">
        {isMobileSidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity" onClick={() => setIsMobileSidebarOpen(false)} />}

        {/* SIDEBAR */}
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

        {/* MAIN */}
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
                                <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm w-48 lg:w-64 focus:w-60 lg:focus:w-80 transition-all outline-none focus:border-gray-400 focus:bg-white"/>
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
                                                        {project.coverImage ? <img src={getCoverUrl(project)} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-300" />}
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
                                                        <td className="py-
