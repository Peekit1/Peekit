
import React, { useState } from 'react';
import { 
  Plus, LogOut, Search, 
  LayoutGrid, Activity, 
  Clock, CheckCircle2, Package, Trash2, X, Pencil, 
  Calendar, MapPin,
  CreditCard, Sparkles, Building2, Zap, Check,
  Camera, Video, Aperture, Heart, Menu, ArrowRight
} from 'lucide-react';
import { DashboardProps, Project } from '../types';
import { Button } from './Button';

export const Dashboard: React.FC<DashboardProps> = ({ 
  userPlan,
  studioName,
  onLogout, 
  onOpenProject, 
  projects, 
  stageConfig,
  onCreateProject,
  onDeleteProject,
  onEditProject,
  onUpgradeClick
}) => {
  const [currentView, setCurrentView] = useState<'projects' | 'subscription'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // MODALS
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectLoading, setNewProjectLoading] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
      clientName: '', clientEmail: '', date: '', location: '', type: 'Mariage'
  });
  const [coverFile, setCoverFile] = useState<File | undefined>(undefined);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const getStageInfo = (stageId: string) => {
      if (!stageConfig || stageConfig.length === 0) return { label: 'Inconnu', progress: 0 };
      const index = stageConfig.findIndex(s => s.id === stageId);
      if (index === -1) return { label: stageConfig[0]?.label || 'Start', progress: 0 };
      return { label: stageConfig[index].label, progress: Math.round(((index + 1) / stageConfig.length) * 100) };
  };

  const filteredProjects = projects.filter(project => {
      const matchSearch = project.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      const lastStepId = stageConfig[stageConfig.length - 1]?.id;
      const isCompleted = project.currentStage === lastStepId;
      const matchStatus = statusFilter === 'all' ? true : statusFilter === 'completed' ? isCompleted : !isCompleted;
      return matchSearch && matchStatus;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setNewProjectLoading(true);
      try {
          if (editingProjectId) await onEditProject(editingProjectId, newProject, coverFile);
          else await onCreateProject(newProject, coverFile);
          setIsNewProjectModalOpen(false);
          setEditingProjectId(null);
          setNewProject({ clientName: '', clientEmail: '', date: '', location: '', type: 'Mariage' });
      } finally { setNewProjectLoading(false); }
  };

  const openEdit = (p: Project, e: React.MouseEvent) => {
      e.stopPropagation();
      setEditingProjectId(p.id);
      setNewProject({ ...p, type: p.type || 'Mariage' });
      setIsNewProjectModalOpen(true);
  };

  const openDelete = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setProjectToDelete(id);
  };

  // Helper for Project Type Styles (Sober Colors)
  const getProjectStyle = (type: string) => {
      const normalized = type.toLowerCase();
      if (normalized.includes('mariage')) return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', icon: <Heart size={12}/> };
      if (normalized.includes('mode')) return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', icon: <Aperture size={12}/> };
      if (normalized.includes('vidéo')) return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100', icon: <Video size={12}/> };
      if (normalized.includes('corporate')) return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-100', icon: <Building2 size={12}/> };
      return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100', icon: <Package size={12}/> };
  };

  // Plan Details Helper
  const getPlanDetails = () => {
      switch(userPlan) {
          case 'pro': return { name: 'Pro', price: '19€/mois', icon: <Sparkles size={18}/>, features: ['Projets illimités', 'Vidéo Teasers', 'Logo personnalisé'] };
          case 'agency': return { name: 'Agency', price: '49€/mois', icon: <Building2 size={18}/>, features: ['Multi-comptes', 'API Access', 'Domaine perso'] };
          default: return { name: 'Freelance', price: 'Gratuit', icon: <Zap size={18}/>, features: ['5 Projets actifs', 'Images Teasers', 'Email support'] };
      }
  };
  const currentPlan = getPlanDetails();

  // Calculate global stats
  const activeProjectsCount = projects.filter(p => p.currentStage !== stageConfig[stageConfig.length - 1]?.id).length;
  const completedProjectsCount = projects.length - activeProjectsCount;

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans text-gray-900 overflow-hidden">
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
      )}

      {/* SIDEBAR - Responsive Drawer */}
      <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white flex flex-col shrink-0 border-r border-gray-200 py-6 px-4
          transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-2 mb-10 text-gray-900">
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
                    <Activity size={16} strokeWidth={2.5}/>
                </div>
                <span className="font-bold text-xl tracking-tight">Peekit</span>
            </div>
            {/* Close button for mobile */}
            <button className="md:hidden text-gray-400 hover:text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={20} />
            </button>
        </div>

        {/* Menu */}
        <nav className="space-y-1 flex-1">
            <button 
                onClick={() => { setCurrentView('projects'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    currentView === 'projects' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
                <LayoutGrid size={18} strokeWidth={2} className={`transition-colors ${currentView === 'projects' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`}/> 
                <span>Projets</span>
            </button>
            
            <button 
                onClick={() => { setCurrentView('subscription'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    currentView === 'subscription' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
                <CreditCard size={18} strokeWidth={2} className={`transition-colors ${currentView === 'subscription' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`}/> 
                <span>Mon abonnement</span>
            </button>
        </nav>
        
        <button onClick={onLogout} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-auto">
            <LogOut size={18}/> <span>Déconnexion</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 h-16 shrink-0 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between shadow-sm">
             <div className="flex items-center gap-3">
                <button 
                    className="md:hidden p-2 text-gray-500 hover:text-gray-900 bg-white rounded-lg border border-gray-200"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu size={20} />
                </button>
                <h1 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight hidden sm:block">
                    {currentView === 'projects' ? 'Dashboard' : 'Abonnement'}
                </h1>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-gray-900 font-bold text-[10px] border border-gray-200 uppercase tracking-wider shadow-sm">
                        {studioName.substring(0, 2)}
                    </div>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wide truncate max-w-[100px]">{studioName}</span>
                </div>
            </div>
        </header>

        {/* SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            
            {currentView === 'projects' && (
                <div className="max-w-7xl mx-auto space-y-6">
                    
                    {/* TOP STATS & ACTIONS ROW */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Stats Card */}
                        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-center relative overflow-hidden h-full">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Projets Actifs</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                <span className="text-2xl font-bold text-gray-900">{activeProjectsCount}</span>
                            </div>
                            <div className="mt-1 text-[10px] text-gray-500 font-medium">
                                {completedProjectsCount} projets terminés
                            </div>
                        </div>

                        {/* Create Button Card */}
                        <button 
                            onClick={() => { setEditingProjectId(null); setIsNewProjectModalOpen(true); }}
                            className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-center items-start hover:border-indigo-200 hover:shadow-md transition-all group text-left h-full"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <Plus size={18} />
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Nouveau Projet</h3>
                        </button>
                    </div>

                    {/* FILTERS & SEARCH */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                         <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm w-full sm:w-auto">
                            <button 
                                onClick={() => setStatusFilter('all')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${statusFilter === 'all' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                Tous
                            </button>
                            <button 
                                onClick={() => setStatusFilter('active')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${statusFilter === 'active' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                En cours
                            </button>
                            <button 
                                onClick={() => setStatusFilter('completed')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${statusFilter === 'completed' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                Terminés
                            </button>
                        </div>

                        <div className="relative group w-full sm:w-64">
                            <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"/>
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Rechercher..." 
                                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* PROJECTS GRID (Card Style) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => {
                            const { label, progress } = getStageInfo(project.currentStage);
                            const isCompleted = progress === 100;
                            const typeStyle = getProjectStyle(project.type);
                            
                            return (
                                <div 
                                    key={project.id} 
                                    onClick={() => onOpenProject(project)}
                                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-indigo-100 transition-all cursor-pointer group relative flex flex-col justify-between h-full"
                                >
                                    {/* Top Section */}
                                    <div>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                                                    <img src={project.coverImage} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">{project.clientName}</h3>
                                                    <span className={`inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
                                                        {typeStyle.icon} {project.type}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* Action Menu on Hover */}
                                            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                                                <button onClick={(e) => openEdit(project, e)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"><Pencil size={12}/></button>
                                                <button onClick={(e) => openDelete(project.id, e)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={12}/></button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Date</p>
                                                <p className="text-xs font-bold text-gray-900 flex items-center gap-1"><Calendar size={10} className="text-gray-400"/> {project.date}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Lieu</p>
                                                <p className="text-xs font-bold text-gray-900 flex items-center gap-1"><MapPin size={10} className="text-gray-400"/> {project.location}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Section: Progress */}
                                    <div className="pt-4 border-t border-gray-50">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className={`
                                                inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide truncate max-w-[150px]
                                                ${isCompleted 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                    : 'bg-indigo-50 text-indigo-700 border-indigo-100'}
                                            `}>
                                                {isCompleted ? 'Livré' : label}
                                            </span>
                                            <span className="text-xs font-bold text-gray-900">{progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-gray-900 to-indigo-600'}`}
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {/* Empty State Card */}
                        {filteredProjects.length === 0 && (
                            <div className="col-span-full py-16 text-center bg-white rounded-xl border border-gray-200 border-dashed">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                                    <Package size={20}/>
                                </div>
                                <h3 className="text-gray-900 font-bold text-sm">Aucun projet trouvé</h3>
                                <p className="text-xs text-gray-500 mt-1 mb-4">Créez votre premier dossier pour commencer.</p>
                                <Button size="sm" variant="black" onClick={() => { setEditingProjectId(null); setIsNewProjectModalOpen(true); }}>
                                    Nouveau Projet
                                </Button>
                            </div>
                        )}
                    </div>

                </div>
            )}

            {currentView === 'subscription' && (
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8 shadow-sm">
                        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row items-start justify-between gap-6">
                             <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600">
                                        {currentPlan.icon}
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Plan {currentPlan.name}</h2>
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded border border-emerald-100">Actif</span>
                                </div>
                                <p className="text-gray-500 text-sm">Votre abonnement est actif et se renouvellera automatiquement.</p>
                             </div>
                             <div className="text-left md:text-right">
                                 <div className="text-3xl font-bold text-gray-900 font-mono tracking-tight">{currentPlan.price}</div>
                                 <div className="text-xs text-gray-400 font-medium mt-1">Facturation mensuelle</div>
                             </div>
                        </div>
                        
                        <div className="p-6 md:p-8 bg-gray-50/50">
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Fonctionnalités incluses</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                {currentPlan.features.map((feat, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                            <Check size={12} strokeWidth={3}/>
                                        </div>
                                        {feat}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button variant="black" onClick={onUpgradeClick}>Changer d'offre</Button>
                                <Button variant="outline">Gérer la facturation</Button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-center text-xs text-gray-400">
                        Besoin d'aide avec votre abonnement ? <a href="#" className="underline hover:text-gray-900">Contacter le support</a>
                    </div>
                </div>
            )}

        </div>
      </main>

      {/* CREATE/EDIT MODAL */}
      {isNewProjectModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/20 backdrop-blur-sm p-4 animate-fade-in">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 animate-slide-up relative overflow-hidden flex flex-col max-h-full">
                  <div className="flex justify-between items-center mb-6 relative z-10 shrink-0">
                      <div>
                          <h2 className="text-xl font-bold tracking-tight text-gray-900">{editingProjectId ? 'Modifier' : 'Nouveau Projet'}</h2>
                          <p className="text-sm text-gray-500 mt-1">Saisissez les détails du dossier.</p>
                      </div>
                      <button onClick={() => setIsNewProjectModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-md transition-colors"><X size={20} className="text-gray-500"/></button>
                  </div>
                  
                  <form onSubmit={handleCreateSubmit} className="space-y-4 relative z-10 overflow-y-auto pr-2">
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Client</label>
                          <input required autoFocus className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-300 font-medium" placeholder="Nom du client" value={newProject.clientName} onChange={e => setNewProject({...newProject, clientName: e.target.value})} />
                       </div>
                       
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email</label>
                          <input type="email" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-300 font-medium" placeholder="contact@client.com" value={newProject.clientEmail} onChange={e => setNewProject({...newProject, clientEmail: e.target.value})} />
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Date</label>
                                <input type="date" required className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-gray-900 font-medium" value={newProject.date} onChange={e => setNewProject({...newProject, date: e.target.value})} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Type</label>
                                <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none appearance-none font-medium cursor-pointer" value={newProject.type} onChange={e => setNewProject({...newProject, type: e.target.value})}>
                                    {['Mariage', 'Corporate', 'Mode', 'Autre'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                       </div>
                       
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Lieu</label>
                          <div className="relative">
                              <MapPin size={16} className="absolute left-3 top-2.5 text-gray-400"/>
                              <input type="text" className="w-full pl-9 bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-300 font-medium" placeholder="Ville, Pays" value={newProject.location} onChange={e => setNewProject({...newProject, location: e.target.value})} />
                          </div>
                       </div>
                       
                        {/* Cover Image Upload in Modal */}
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Couverture (Optionnel)</label>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => e.target.files && setCoverFile(e.target.files[0])}
                            className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                          />
                       </div>

                      <div className="pt-4 flex gap-3 shrink-0">
                          <button type="button" onClick={() => setIsNewProjectModalOpen(false)} className="flex-1 py-3 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-50 transition-colors">Annuler</button>
                          <Button type="submit" isLoading={newProjectLoading} variant="black" className="flex-1">
                                {editingProjectId ? 'Enregistrer' : 'Créer le projet'}
                          </Button>
                      </div>
                  </form>
              </div>
          </div>
      )}
      
      {/* DELETE CONFIRM */}
      {projectToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/20 backdrop-blur-sm p-4">
               <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-xl border border-gray-100 text-center animate-slide-up">
                   <h3 className="font-bold text-gray-900 mb-2">Supprimer le projet ?</h3>
                   <p className="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
                   <div className="flex gap-2">
                       <Button variant="outline" size="sm" fullWidth onClick={() => setProjectToDelete(null)} className="rounded-lg border-gray-200 bg-white">Non</Button>
                       <Button variant="danger" size="sm" fullWidth onClick={async () => { await onDeleteProject(projectToDelete); setProjectToDelete(null); }} className="rounded-lg">Supprimer</Button>
                   </div>
               </div>
          </div>
      )}

    </div>
  );
};
