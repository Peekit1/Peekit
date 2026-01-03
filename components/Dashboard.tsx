import React, { useState } from 'react';
import { 
  Search, Plus, LayoutGrid, CreditCard, LogOut, Settings,
  Trash2, Pencil, Calendar, X, Menu,
  ChevronLeft, ChevronRight, Bell, Check, Download, Zap,
  Receipt, ShieldCheck, User, Camera, AlertTriangle, Image as ImageIcon
} from 'lucide-react';
import { DashboardProps, Project } from '../types';
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
  onDeleteAccount 
}) => {
  const [currentView, setCurrentView] = useState<'projects' | 'subscription'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // CACHE BUSTER GLOBAL
  const [dashboardCacheBuster, setDashboardCacheBuster] = useState(Date.now());

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
      clientName: '', clientEmail: '', date: '', location: '', type: 'Mariage', expectedDeliveryDate: ''
  });
  const [coverFile, setCoverFile] = useState<File | undefined>(undefined);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [newProjectLoading, setNewProjectLoading] = useState(false);

  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const isPro = userPlan === 'pro' || userPlan === 'agency';
  const projectCount = projects.length;
  const maxProjects = userPlan === 'discovery' ? 1 : 9999;
  const usagePercent = Math.min((projectCount / maxProjects) * 100, 100);

  const getProjectStageInfo = (project: Project) => {
      const activeConfig = project.stagesConfig || defaultConfig;
      const index = activeConfig.findIndex(s => s.id === project.currentStage);
      if (index === -1) return { label: activeConfig[0]?.label || 'Non débuté', progress: 0 };
      const progress = Math.round(((index + 1) / activeConfig.length) * 100);
      return { label: activeConfig[index].label, progress: progress };
  };

  const filteredProjects = projects.filter(project => {
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = (project.clientName || '').toLowerCase().includes(searchLower) ||
                          (project.clientEmail || '').toLowerCase().includes(searchLower);
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
          
          // FORCER LE RAFRAICHISSEMENT DES IMAGES APRES L'UPLOAD
          setDashboardCacheBuster(Date.now());

          setIsNewProjectModalOpen(false);
          setEditingProjectId(null);
          setNewProject({ clientName: '', clientEmail: '', date: '', location: '', type: 'Mariage', expectedDeliveryDate: '' });
          setCoverFile(undefined);
      } finally { setNewProjectLoading(false); }
  };

  const availableTypes = Array.from(new Set(projects.map(p => p.type).filter(Boolean))).sort();

  // Helper pour l'URL avec cache buster local
  const getCoverUrl = (project: Project) => {
      if (!project.coverImage) return "";
      const separator = project.coverImage.includes('?') ? '&' : '?';
      return `${project.coverImage}${separator}t=${dashboardCacheBuster}`;
  };

  return (
    <div className="fixed inset-0 flex bg-[#F9FAFB] font-sans text-gray-900 overflow-hidden">
        
        {/* Overlay Mobile Sidebar */}
        {isMobileSidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity" onClick={() => setIsMobileSidebarOpen(false)} />}

        {/* SIDEBAR */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static ${isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
            <div className="h-20 flex items-center px-6 justify-between lg:justify-start">
                <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white shadow-sm"><span className="font-bold text-xs">P</span></div>
                     <span className="font-brand text-2xl tracking-tight text-gray-900">Peekit</span>
                </div>
                <button onClick={() => setIsMobileSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-900"><X size={20} /></button>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">Menu</div>
                <button onClick={() => { setCurrentView('projects'); setIsMobileSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentView === 'projects' ? 'bg-gray-50 text-gray-900 border border-gray-100 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                    <LayoutGrid size={18} strokeWidth={1.5} className={currentView === 'projects' ? "text-gray-900" : "text-gray-400"} /> Tableau de bord
                </button>
                <button onClick={() => { setCurrentView('subscription'); setIsMobileSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentView === 'subscription' ? 'bg-gray-50 text-gray-900 border border-gray-100 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                    <CreditCard size={18} strokeWidth={1.5} className={currentView === 'subscription' ? "text-gray-900" : "text-gray-400"} /> Abonnement
                </button>
                
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3 mt-8">Outils</div>
                <button onClick={() => { setIsSettingsModalOpen(true); setIsMobileSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    <Settings size={18} strokeWidth={1.5} className="text-gray-400"/> Paramètres
                </button>
                
                <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={18} strokeWidth={1.5} /> Se déconnecter
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

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            <header className="h-16 md:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-20">
                <div className="flex items-center gap-3 md:gap-4">
                    <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg"><Menu size={20} /></button>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight truncate">{currentView === 'projects' ? 'Projets' : 'Abonnement & Factures'}</h2>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    {currentView === 'projects' && (
                        <>
                            <div className="relative group hidden sm:block">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-48 lg:w-64 focus:w-60 lg:focus:w-80 transition-all outline-none focus:border-gray-300"/>
                            </div>
                            <div className="h-6 w-px bg-gray-200 mx-1 hidden md:block"></div>
                            <button onClick={onClearNotifications} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 bg-white relative">
                                <Bell size={18} />{hasNotifications && <span className="absolute top-2.5 right-3 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>}
                            </button>
                            <Button variant="black" size="md" onClick={() => { setEditingProjectId(null); setIsNewProjectModalOpen(true); }} className="gap-2 px-3 md:px-4 !h-9 md:!h-10 shadow-lg shadow-black/5"><Plus size={16} /> <span className="hidden md:inline">Créer un projet</span></Button>
                        </>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-auto p-4 md:p-8 pb-24">
                {currentView === 'projects' && (
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col min-h-[600px]">
                        
                        {/* FILTERS BAR */}
                        <div className="md:p-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gray-50/30 p-4">
                            <div className="relative w-full lg:w-80">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Filtrer..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition-all font-medium"/>
                            </div>
                            <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0">
                                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="appearance-none bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg px-3 py-2.5 outline-none focus:border-black cursor-pointer shadow-sm"><option value="all">Status: Tous</option><option value="active">En cours</option><option value="completed">Terminés</option></select>
                                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="appearance-none bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg px-3 py-2.5 outline-none focus:border-black cursor-pointer shadow-sm"><option value="all">Type: Tous</option>{availableTypes.map(t => <option key={t} value={t}>{t}</option>)}</select>
                            </div>
                        </div>

                        <div className="flex-1">
                            
                            {/* --- MOBILE VIEW: CARDS --- */}
                            <div className="md:hidden space-y-4 p-6">
                                {paginatedProjects.map(project => {
                                    const { label, progress } = getProjectStageInfo(project);
                                    return (
                                        <div 
                                            key={project.id} 
                                            onClick={() => onOpenProject(project)} 
                                            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm active:scale-[0.98] transition-transform relative overflow-hidden"
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                    {project.coverImage ? <img src={getCoverUrl(project)} className="w-full h-full object-cover" key={`cover-card-${project.id}-${dashboardCacheBuster}`} /> : <ImageIcon size={20} className="text-gray-300" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-gray-900 text-sm truncate">{project.clientName}</div>
                                                    <div className="text-xs text-gray-500 truncate">{project.clientEmail}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 uppercase">{project.type}</span>
                                                <span className="text-[10px] text-gray-400 flex items-center gap-1"><Calendar size={10}/> {project.date}</span>
                                            </div>

                                            <div className="mb-4">
                                                <div className="flex justify-between items-end mb-1.5">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
                                                    <span className="text-xs font-bold text-gray-900">{progress}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-black rounded-full" style={{ width: `${progress}%` }}></div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-2 pt-3 border-t border-gray-50">
                                                <button onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    setEditingProjectId(project.id); 
                                                    setNewProject({
                                                        clientName: project.clientName,
                                                        clientEmail: project.clientEmail,
                                                        date: project.date,
                                                        location: project.location,
                                                        type: project.type,
                                                        expectedDeliveryDate: project.expectedDeliveryDate || ''
                                                    }); 
                                                    setIsNewProjectModalOpen(true); 
                                                }} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"><Pencil size={14}/></button>
                                                <button onClick={(e) => { e.stopPropagation(); setProjectToDelete(project.id); }} className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 text-red-600 transition-colors"><Trash2 size={14}/></button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* --- DESKTOP VIEW: TABLE --- */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="py-3 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client</th><th className="py-3 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Détails</th><th className="py-3 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avancement</th><th className="py-3 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-24"></th></tr></thead>
                                    <tbody>
                                        {paginatedProjects.map(project => {
                                            const { label, progress } = getProjectStageInfo(project);
                                            return (
                                                <tr key={project.id} onClick={() => onOpenProject(project)} className="group hover:bg-gray-50/50 cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                                                    <td className="py-4 px-6">
                                                      <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                          {project.coverImage ? (
                                                            <img 
                                                                src={getCoverUrl(project)} 
                                                                className="w-full h-full object-cover" 
                                                                key={`cover-table-${project.id}-${dashboardCacheBuster}`}
                                                            />
                                                          ) : (
                                                            <ImageIcon size={18} className="text-gray-300" />
                                                          )}
                                                        </div>
                                                        <div>
                                                          <div className="font-bold text-gray-900 text-sm">{project.clientName}</div>
                                                          <div className="text-xs text-gray-500">{project.clientEmail}</div>
                                                        </div>
                                                      </div>
                                                    </td>
                                                    <td className="py-4 px-6"><div className="space-y-1"><span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 uppercase">{project.type}</span><div className="text-xs text-gray-500 flex items-center gap-1.5"><Calendar size={12}/> {project.date}</div></div></td>
                                                    <td className="py-4 px-6"><div className="w-full max-w-[180px]"><div className="flex justify-between items-end mb-1.5"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span><span className="text-xs font-bold text-gray-900">{progress}%</span></div><div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-black rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div></div></div></td>
                                                    <td className="py-4 px-6 text-right"><div className="flex items-center justify-end gap-2">
                                                        <button onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            setEditingProjectId(project.id); 
                                                            setNewProject({
                                                                clientName: project.clientName,
                                                                clientEmail: project.clientEmail,
                                                                date: project.date,
                                                                location: project.location,
                                                                type: project.type,
                                                                expectedDeliveryDate: project.expectedDeliveryDate || ''
                                                            }); 
                                                            setIsNewProjectModalOpen(true); 
                                                        }} className="p-2 border border-gray-200 rounded-lg hover:bg-white transition-colors"><Pencil size={14}/></button>
                                                        <button onClick={(e) => { e.stopPropagation(); setProjectToDelete(project.id); }} className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 text-red-600 transition-colors"><Trash2 size={14}/></button>
                                                    </div></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ... (Reste de la pagination et modales inchangé) ... */}
                        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-2xl mt-auto">
                            <div className="text-xs text-gray-500 font-medium">Page {page} / {totalPages}</div>
                            <div className="flex gap-2">
                                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={16} /></button>
                                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"><ChevronRight size={16} /></button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ... (Modales inchangées : NewProject, DeleteProject, Settings, DeleteAccount) ... */}
                {isNewProjectModalOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm animate-fade-in">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-slide-up relative">
                                <button onClick={() => setIsNewProjectModalOpen(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all z-10"><X size={20} /></button>
                                
                                <form onSubmit={handleCreateSubmit} className="p-6 md:p-10">
                                    <div className="w-12 h-12 bg-white text-gray-900 border border-gray-200 rounded-lg flex items-center justify-center mb-6 shadow-sm">
                                        {editingProjectId ? <Pencil size={20} strokeWidth={1.5} /> : <User size={20} strokeWidth={1.5} />}
                                    </div>
                                    
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                                        {editingProjectId ? 'Modifier le projet' : 'Initialisons votre projet'}
                                    </h2>
                                    <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                                        {editingProjectId ? 'Mettez à jour les informations du client et les délais.' : 'Ajoutez un projet pour voir la magie opérer sur Peekit.'}
                                    </p>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Nom du Client</label>
                                            <input 
                                                autoFocus
                                                type="text" 
                                                required 
                                                value={newProject.clientName} 
                                                onChange={(e) => setNewProject({...newProject, clientName: e.target.value})} 
                                                placeholder="Ex: Sophie & Marc"
                                                className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Email de contact</label>
                                            <input 
                                                type="email" 
                                                required 
                                                value={newProject.clientEmail} 
                                                onChange={(e) => setNewProject({...newProject, clientEmail: e.target.value})} 
                                                placeholder="email@client.com"
                                                className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"
                                            />
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Date</label>
                                                <input 
                                                    type="date" 
                                                    required 
                                                    value={newProject.date} 
                                                    onChange={(e) => setNewProject({...newProject, date: e.target.value})} 
                                                    className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Lieu</label>
                                                <input 
                                                    type="text" 
                                                    value={newProject.location} 
                                                    onChange={(e) => setNewProject({...newProject, location: e.target.value})} 
                                                    placeholder="Ville"
                                                    className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Type</label>
                                                <select 
                                                    value={newProject.type} 
                                                    onChange={(e) => setNewProject({...newProject, type: e.target.value})} 
                                                    className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none appearance-none cursor-pointer"
                                                >
                                                    <option value="Mariage">Mariage</option>
                                                    <option value="Shooting Mode">Shooting Mode</option>
                                                    <option value="Vidéo Publicitaire">Vidéo Publicitaire</option>
                                                    <option value="Identité Visuelle">Identité Visuelle</option>
                                                    <option value="Corporate">Corporate</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Rendu Estimé</label>
                                                <input 
                                                    type="date" 
                                                    value={newProject.expectedDeliveryDate} 
                                                    onChange={(e) => setNewProject({...newProject, expectedDeliveryDate: e.target.value})} 
                                                    className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Image de couverture</label>
                                            <div className="relative group/cover">
                                                <input 
                                                    type="file" 
                                                    id="cover-upload"
                                                    className="hidden" 
                                                    onChange={(e) => setCoverFile(e.target.files ? e.target.files[0] : undefined)} 
                                                    accept="image/*"
                                                />
                                                <label 
                                                    htmlFor="cover-upload" 
                                                    className="flex items-center gap-3 w-full h-11 px-3 bg-gray-50 border border-gray-200 border-dashed rounded-md cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all"
                                                >
                                                    <Camera size={18} className="text-gray-400" />
                                                    <span className="text-xs font-bold text-gray-500 truncate">
                                                        {coverFile ? coverFile.name : 'Choisir une image...'}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-10 flex gap-4">
                                        <Button 
                                            type="button" 
                                            variant="secondary" 
                                            onClick={() => setIsNewProjectModalOpen(false)} 
                                            fullWidth
                                            className="h-11"
                                        >
                                            Annuler
                                        </Button>
                                        <Button 
                                            type="submit" 
                                            variant="black" 
                                            fullWidth 
                                            isLoading={newProjectLoading}
                                            className="h-11 shadow-lg shadow-black/10"
                                        >
                                            {editingProjectId ? 'Enregistrer' : 'Créer le projet'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Les autres modales (DeleteProject, Settings, DeleteAccount) sont ici... */}
                {projectToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-8 text-center animate-slide-up">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg mb-2">Supprimer le projet ?</h3>
                            <p className="text-sm text-gray-500 mb-8 leading-relaxed">Toutes les données et fichiers associés seront définitivement supprimés.</p>
                            <div className="flex gap-4">
                                <Button variant="secondary" onClick={() => setProjectToDelete(null)} fullWidth className="h-11">Annuler</Button>
                                <Button variant="danger" onClick={() => { if (projectToDelete) onDeleteProject(projectToDelete); setProjectToDelete(null); }} fullWidth className="h-11 border-red-100 text-red-600">Supprimer</Button>
                            </div>
                        </div>
                    </div>
                )}

                {isSettingsModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-8 animate-slide-up relative">
                            <button onClick={() => setIsSettingsModalOpen(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"><X size={20} /></button>
                            <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-6 shadow-md">
                                <Settings size={20} strokeWidth={1.5}/>
                            </div>
                            <h3 className="font-bold text-gray-900 text-2xl mb-2">Paramètres Studio</h3>
                            <p className="text-sm text-gray-500 mb-8 leading-relaxed">Gérez l'identité de votre espace de travail.</p>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Nom du Studio</label>
                                    <input type="text" value={studioName} readOnly className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-bold text-gray-600 outline-none"/>
                                </div>
                                <Button variant="outline" fullWidth onClick={() => setIsSettingsModalOpen(false)} className="h-11">
                                    Fermer
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {isDeleteAccountModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in">
                        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 text-center animate-slide-up relative">
                            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100 shadow-sm">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Supprimer votre compte ?</h3>
                            <p className="text-sm text-gray-500 mb-8 leading-relaxed px-4">
                                Cette action est <strong className="text-gray-900">irréversible</strong>. Tous vos projets, teasers et données de studio seront effacés définitivement.
                            </p>
                            <div className="flex flex-col gap-3">
                                <Button 
                                    variant="danger" 
                                    fullWidth 
                                    className="h-12 !bg-red-600 !text-white !border-transparent hover:!bg-red-700 font-bold shadow-lg shadow-red-200"
                                    onClick={async () => {
                                        await onDeleteAccount();
                                        setIsDeleteAccountModalOpen(false);
                                    }}
                                >
                                    Oui, supprimer définitivement
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    fullWidth 
                                    className="h-12 font-bold"
                                    onClick={() => setIsDeleteAccountModalOpen(false)}
                                >
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
    </div>
  );
};
