
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { Benefits } from './components/Benefits';
import { ClientLove } from './components/ClientLove';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { StickyHeader } from './components/StickyHeader';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { CheckoutPage } from './components/CheckoutPage';
import { ClientTrackingPage } from './components/ClientTrackingPage';
import { ClientAccessGate } from './components/ClientAccessGate';
import { OnboardingWizard } from './components/OnboardingWizard';
import { ProjectDetails } from './components/ProjectDetails';
import { SelectedPlan, Project, StagesConfiguration, UserPlan, Teaser, WorkflowStep, NotificationType } from './types';
import { supabase } from './supabaseClient';
import { GoogleGenAI, Type } from "@google/genai";

export const INITIAL_STAGES_CONFIG: StagesConfiguration = [
  { id: 'secured', label: "Sécurisation des fichiers", minDays: 0, maxDays: 1, message: "Projet commencé" },
  { id: 'culling', label: "Tri", minDays: 2, maxDays: 5, message: "Création en cours" },
  { id: 'editing', label: "Retouche", minDays: 7, maxDays: 21, message: "C'est Ici que la magie opère" },
  { id: 'export', label: "Export & Vérification", minDays: 1, maxDays: 3, message: "Finitions" },
  { id: 'delivery', label: "Livraison", minDays: 0, maxDays: 1, message: "Prêt à être livré" }
];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [session, setSession] = useState<any>(null);
  const [userPlan, setUserPlan] = useState<UserPlan>('discovery');
  const [studioName, setStudioName] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [stageConfig, setStageConfig] = useState<StagesConfiguration>(JSON.parse(JSON.stringify(INITIAL_STAGES_CONFIG)));
  const [clientViewProject, setClientViewProject] = useState<Project | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [clientAccessGranted, setClientAccessGranted] = useState(false);

  const getErrorMessage = (err: any): string => {
    if (!err) return "Erreur inconnue";
    if (typeof err === 'string') return err;
    if (err.message && typeof err.message === 'string') return err.message;
    if (err.error?.message) return err.error.message;
    if (err.error_description) return err.error_description;
    try { return JSON.stringify(err); } catch (e) { return "Détails de l'erreur indisponibles"; }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/v/')) {
        const projectId = hash.split('/v/')[1];
        if (projectId) fetchPublicProject(projectId);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      if (initialSession) {
        fetchProfile(initialSession.user.id);
        fetchProjects(initialSession.user.id);
      }
      if (!window.location.hash.startsWith('#/v/')) setIsAuthChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        fetchProjects(session.user.id);
      } else {
        setProjects([]);
        setStudioName('');
        if (!window.location.hash.startsWith('#/v/')) setCurrentPage('home');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const calculateNotifications = (projs: Project[]) => {
    if (userPlan === 'discovery') {
      setHasNotifications(false);
      return;
    }
    const hasAny = projs.some(p => {
      if (!p.clientLastViewedAt || !p.updatedAt) return false;
      return new Date(p.clientLastViewedAt) > new Date(p.updatedAt);
    });
    setHasNotifications(hasAny);
  };

  const mapProjectsFromDB = (data: any[]): Project[] => {
    return data.map(p => {
        let effectiveConfig = INITIAL_STAGES_CONFIG;
        if (p.stages_config && Array.isArray(p.stages_config) && p.stages_config.length > 0) {
            effectiveConfig = p.stages_config;
        }
        return {
          id: p.id,
          userId: p.user_id,
          clientName: p.client_name,
          clientEmail: p.client_email,
          date: p.date,
          location: p.location,
          type: p.type,
          coverImage: p.cover_image,
          currentStage: p.current_stage || 'secured',
          lastUpdate: p.last_update || '',
          updatedAt: p.updated_at,
          clientLastViewedAt: p.client_last_viewed_at,
          teasers: p.teasers ? p.teasers.map((t: any) => ({
            id: t.id,
            type: t.type,
            url: t.url,
            date: new Date(t.created_at).toLocaleDateString('fr-FR'),
            title: t.title 
          })) : [],
          accessPassword: p.access_password,
          expectedDeliveryDate: p.expected_delivery_date,
          stagesConfig: JSON.parse(JSON.stringify(effectiveConfig))
        };
    });
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        const plan = data.plan === 'freelance' ? 'discovery' : data.plan;
        setUserPlan(plan as UserPlan);
        setStudioName(data.studio_name || '');
        if (data.stages_config) setStageConfig(data.stages_config);
        if (window.location.hash.startsWith('#/v/')) return;
        if (!data.onboarding_completed) setCurrentPage('onboarding');
        else if (currentPage === 'home' || currentPage === 'auth') setCurrentPage('dashboard');
      } else if (!window.location.hash.startsWith('#/v/')) {
        setCurrentPage('onboarding');
      }
    } catch (error) { console.error('Error fetching profile:', error); }
  };

  const fetchProjects = async (userId?: string) => {
    const targetUser = userId || session?.user?.id;
    if (!targetUser) return;
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', targetUser).single();
      const studio = data?.studio_name || '';
      
      const { data: projData, error: projError } = await supabase.from('projects').select('*, teasers ( id, type, url, created_at, title )').eq('user_id', targetUser).order('created_at', { ascending: false });
      if (projError) throw projError;
      if (projData) {
        const mapped = mapProjectsFromDB(projData);
        setProjects(mapped);
        calculateNotifications(mapped);
      }
    } catch (error) { console.error('Error fetching projects:', error); } finally { setLoading(false); }
  };

  const fetchPublicProject = async (projectId: string) => {
    setIsAuthChecking(true); 
    try {
      const { data: projectData, error } = await supabase.from('projects').select('*, teasers ( id, type, url, created_at, title )').eq('id', projectId).single();
      if (error) throw error;
      if (projectData) {
        let activeConfig = INITIAL_STAGES_CONFIG;
        if (projectData.stages_config && Array.isArray(projectData.stages_config) && projectData.stages_config.length > 0) {
             activeConfig = projectData.stages_config;
        } else {
            const { data: profileData } = await supabase.from('profiles').select('stages_config').eq('id', projectData.user_id).single();
            if (profileData?.stages_config) activeConfig = profileData.stages_config;
        }
        setStageConfig(activeConfig);
        const mapped = mapProjectsFromDB([projectData])[0];
        mapped.stagesConfig = JSON.parse(JSON.stringify(activeConfig));
        
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession || currentSession.user.id !== projectData.user_id) {
           await supabase.from('projects').update({ 
             client_last_viewed_at: new Date().toISOString() 
           }).eq('id', projectId);
        }

        setClientViewProject(mapped);
        setClientAccessGranted(mapped.accessPassword ? false : (currentSession && currentSession.user.id === projectData.user_id));
        setCurrentPage('client-view');
      }
    } catch (error) {
      console.error("Erreur chargement projet public:", error);
      setCurrentPage('home');
    } finally { setIsAuthChecking(false); }
  };

  const handleNotifyClient = async (project: Project, stage: WorkflowStep, type: NotificationType) => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let contextInstruction = "";
        if (type === 'status') {
            contextInstruction = `Le projet avance. Nous avons atteint l'étape : "${stage.label}". 
            Écris un message qui valorise cette progression sans être trop technique. Ton : Premium, rassurant, expert.`;
        } else if (type === 'delay') {
            contextInstruction = `Petit contretemps sur l'étape "${stage.label}".
            Écris un message élégant qui explique que pour garantir un résultat d'exception, nous avons besoin de 48h supplémentaires. Transforme ce retard en une preuve d'exigence qualité.`;
        } else if (type === 'note') {
            contextInstruction = `Une précision importante a été ajoutée concernant l'étape "${stage.label}".
            Contenu de la note : "${stage.description || 'Veuillez consulter votre espace.'}".
            Invite le client à consulter son espace pour en savoir plus.`;
        }

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Agis en tant qu'expert en Copywriting B2B pour créatifs (photographes, précisémment les créateurs d'images). 
            Rédige un email pour le client "${project.clientName}" au sujet du projet "${project.type}".
            Le studio s'appelle "${studioName}".
            
            CONTEXTE : ${contextInstruction}
            
            L'email doit inviter le client à utiliser son lien Peekit personnel sécurisé pour voir les détails.
            L'email ne doit pas contenir de placeholders comme [Lien] ou [Signature], il sera complété par l'application.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        subject: { type: Type.STRING, description: "Objet de l'email accrocheur" },
                        body: { type: Type.STRING, description: "Corps de l'email formaté (sans signature)" }
                    },
                    required: ["subject", "body"]
                }
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Erreur IA Notification:", error);
        return {
            subject: `Mise à jour : ${project.type}`,
            body: `Bonjour ${project.clientName},\n\nVotre projet avance. Nous sommes actuellement à l'étape : ${stage.label}.\n\nVous pouvez suivre l'avancée en temps réel sur votre espace Peekit.\n\nÀ très vite.`
        };
    }
  };

  const handleCreateProject = async (projectData: Partial<Project>, coverFile?: File, overrideStageConfig?: StagesConfiguration) => {
    if (!session) return;
    try {
      let coverUrl = null;
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop();
        const filePath = `covers/${session.user.id}/${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('project-files').upload(filePath, coverFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('project-files').getPublicUrl(filePath);
        coverUrl = publicUrl;
      }
      const configToSave = overrideStageConfig || stageConfig;
      const isolatedConfig = JSON.parse(JSON.stringify(configToSave));
      const newProject: any = { 
        user_id: session.user.id, 
        client_name: projectData.clientName, 
        client_email: projectData.clientEmail, 
        date: projectData.date, 
        location: projectData.location, 
        type: projectData.type, 
        cover_image: coverUrl, 
        current_stage: isolatedConfig[0]?.id || 'secured', 
        last_update: "À l'instant", 
        expected_delivery_date: projectData.expectedDeliveryDate, 
        created_at: new Date().toISOString(), 
        stages_config: isolatedConfig
      };
      
      const { data, error } = await supabase.from('projects').insert([newProject]).select();
      if (error) throw error;
      if (data) {
        const newProjMapped = mapProjectsFromDB([data[0]])[0];
        setProjects(prev => [newProjMapped, ...prev]);
        if (currentPage === 'onboarding') setCurrentPage('dashboard');
      }
    } catch (error: any) { alert('Erreur creation: ' + getErrorMessage(error)); }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', projectId);
      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== projectId));
      if (editingProject?.id === projectId) { setEditingProject(null); setCurrentPage('dashboard'); }
    } catch (error) { console.error('Error deleting project:', error); }
  };

  const handleEditProject = async (projectId: string, projectData: Partial<Project>, coverFile?: File) => {
      try {
          let updates: any = { ...projectData };
          if (coverFile && session) {
              const fileExt = coverFile.name.split('.').pop();
              const filePath = `covers/${session.user.id}/${Math.random()}.${fileExt}`;
              const { error: uploadError } = await supabase.storage.from('project-files').upload(filePath, coverFile);
              if (uploadError) throw uploadError;
              const { data: { publicUrl } } = supabase.storage.from('project-files').getPublicUrl(filePath);
              updates.cover_image = publicUrl;
          }
          const dbUpdates: any = {};
          if (updates.clientName) dbUpdates.client_name = updates.clientName;
          if (updates.clientEmail) dbUpdates.client_email = updates.clientEmail;
          if (updates.date) dbUpdates.date = updates.date;
          if (updates.location) dbUpdates.location = updates.location;
          if (updates.type) dbUpdates.type = updates.type;
          if (updates.cover_image) dbUpdates.cover_image = updates.cover_image;
          if (updates.expectedDeliveryDate) dbUpdates.expected_delivery_date = updates.expectedDeliveryDate;
          
          const { error } = await supabase.from('projects').update(dbUpdates).eq('id', projectId);
          if (error) throw error;
          setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
          if (editingProject?.id === projectId) setEditingProject(prev => prev ? { ...prev, ...updates } : null);
      } catch (error: any) { alert('Erreur edition: ' + getErrorMessage(error)); }
  };

  const handleUpdateStageConfig = async (newConfig: StagesConfiguration) => {
    if (editingProject) {
        const isolatedConfig = JSON.parse(JSON.stringify(newConfig));
        const updatedProject = { ...editingProject, stagesConfig: isolatedConfig };
        setEditingProject(updatedProject);
        setProjects(prev => prev.map(p => p.id === editingProject.id ? updatedProject : p));
        await supabase.from('projects').update({ stages_config: isolatedConfig }).eq('id', editingProject.id);
    } else if (session) {
        setStageConfig(newConfig);
        await supabase.from('profiles').update({ stages_config: newConfig }).eq('id', session.user.id);
    }
  };

  const handleUpdateStage = async (stageId: string) => {
    if (!editingProject) return;
    try {
      const labelNow = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
      await supabase.from('projects').update({ current_stage: stageId, last_update: labelNow }).eq('id', editingProject.id);
      setEditingProject(prev => prev ? ({ ...prev, currentStage: stageId, lastUpdate: labelNow }) : null);
      setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, currentStage: stageId, lastUpdate: labelNow } : p));
    } catch (error) { console.error('Error updating stage:', error); }
  };

  const handleUploadTeasers = async (files: File[]) => {
      if (!editingProject || !session) return;
      const currentCount = (editingProject.teasers || []).length;
      if (userPlan === 'discovery' && (currentCount + files.length) > 3) { alert("Plan Découverte limité à 3 fichiers. Passez Pro !"); return; }
      try {
          const newTeasers: Teaser[] = [];
          for (const file of files) {
              const fileExt = file.name.split('.').pop();
              const fileName = `${Math.random()}.${fileExt}`;
              const filePath = `teasers/${session.user.id}/${editingProject.id}/${fileName}`;
              const { error: uploadError } = await supabase.storage.from('project-files').upload(filePath, file);
              if (uploadError) throw uploadError;
              const { data: { publicUrl } } = supabase.storage.from('project-files').getPublicUrl(filePath);
              const type = file.type.startsWith('video') ? 'video' : 'image';
              const { data, error: dbError } = await supabase.from('teasers').insert([{ project_id: editingProject.id, user_id: session.user.id, url: publicUrl, type: type, title: file.name }]).select();
              if (dbError) throw dbError;
              if (data) newTeasers.push({ id: data[0].id, url: data[0].url, type: data[0].type, title: data[0].title, date: new Date().toLocaleDateString('fr-FR') });
          }
          const updatedTeasers = [...(editingProject.teasers || []), ...newTeasers];
          const updatedProject = { ...editingProject, teasers: updatedTeasers };
          setEditingProject(updatedProject);
          setProjects(prev => prev.map(p => p.id === editingProject.id ? updatedProject : p));
      } catch (error: any) { alert("Erreur lors de l'upload : " + getErrorMessage(error)); }
  };

  const handleDeleteTeaser = async (teaserId: string) => {
      if (!editingProject) return;
      try {
          const { error } = await supabase.from('teasers').delete().eq('id', teaserId);
          if (error) throw error;
          const updatedTeasers = (editingProject.teasers || []).filter(t => t.id !== teaserId);
          const updatedProject = { ...editingProject, teasers: updatedTeasers };
          setEditingProject(updatedProject);
          setProjects(prev => prev.map(p => p.id === editingProject.id ? updatedProject : p));
      } catch (error) { console.error("Delete failed:", error); }
  };

  const handleOnboardingComplete = async (name: string, firstProject: Project) => {
    if (!session) return;
    setStudioName(name);
    await supabase.from('profiles').upsert({ id: session.user.id, studio_name: name, onboarding_completed: true, plan: 'discovery', created_at: new Date().toISOString(), stages_config: INITIAL_STAGES_CONFIG });
    await fetchProfile(session.user.id);
    await handleCreateProject(firstProject);
    setCurrentPage('dashboard');
  };

  const handleDeleteAccount = async () => {
    if (!session) return;
    const userId = session.user.id;
    try {
        setLoading(true);
        await supabase.from('teasers').delete().eq('user_id', userId);
        await supabase.from('projects').delete().eq('user_id', userId);
        await supabase.from('profiles').delete().eq('id', userId);
        await supabase.auth.signOut();
        setCurrentPage('home');
        setSession(null);
    } catch (error) {
        console.error("Erreur lors de la suppression du compte:", error);
        alert("Une erreur est survenue lors de la suppression de vos données.");
    } finally {
        setLoading(false);
    }
  };

  const handleClientBack = async () => {
    if (window.location.hash.startsWith('#/v/')) try { window.history.pushState("", document.title, window.location.pathname); } catch (e) {}
    if (session) {
        await fetchProfile(session.user.id);
        if (editingProject && editingProject.id === clientViewProject?.id) setCurrentPage('project-details');
        else setCurrentPage('dashboard');
    } else setCurrentPage('home');
    setClientViewProject(null);
    setClientAccessGranted(false);
  };

  const handleAuthNavigation = (mode?: 'login' | 'signup') => {
    if (mode) setAuthMode(mode);
    setCurrentPage('auth');
  };

  if (isAuthChecking) return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-900" /></div>;

  if (currentPage === 'client-view' && clientViewProject) {
    if (clientViewProject.accessPassword && !clientAccessGranted) {
      return (
        <ClientAccessGate 
          project={clientViewProject} 
          onAccessGranted={() => setClientAccessGranted(true)} 
          onBack={handleClientBack}
        />
      );
    }
    return (
      <ClientTrackingPage 
        project={clientViewProject} 
        stageConfig={stageConfig} 
        onBack={handleClientBack} 
      />
    );
  }

  if (currentPage === 'auth') return <AuthPage onBack={() => setCurrentPage('home')} onLogin={() => setCurrentPage('dashboard')} initialView={authMode} />;
  if (currentPage === 'onboarding') return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  if (currentPage === 'checkout' && selectedPlan) return <CheckoutPage plan={selectedPlan} onBack={() => setCurrentPage(session ? 'dashboard' : 'home')} onSuccess={async () => { if(session) await fetchProfile(session.user.id); setCurrentPage('dashboard'); }} />;

  if (currentPage === 'project-details' && editingProject) {
    return <ProjectDetails 
        project={editingProject} 
        stageConfig={editingProject.stagesConfig || stageConfig} 
        defaultConfig={INITIAL_STAGES_CONFIG} 
        userPlan={userPlan} 
        studioName={studioName}
        onBack={() => { setEditingProject(null); setCurrentPage('dashboard'); if(session) fetchProfile(session.user.id); }} 
        onUpdateStage={handleUpdateStage} 
        onUpdateStageConfig={handleUpdateStageConfig} 
        onViewClientVersion={() => {
             const viewProject = JSON.parse(JSON.stringify(editingProject));
             if (viewProject.stagesConfig) setStageConfig(viewProject.stagesConfig);
             setClientViewProject(viewProject);
             setClientAccessGranted(viewProject.accessPassword ? false : true);
             try { window.history.pushState({}, '', `#/v/${editingProject.id}`); } catch (e) {}
             setCurrentPage('client-view');
        }}
        onUpdatePassword={async (pass) => {
             await supabase.from('projects').update({ access_password: pass }).eq('id', editingProject.id);
             setEditingProject(prev => prev ? ({...prev, accessPassword: pass}) : null);
        }}
        onUploadTeasers={handleUploadTeasers}
        onDeleteTeaser={handleDeleteTeaser}
        onUpdateCoverImage={async (file) => await handleEditProject(editingProject.id, {}, file)}
        onNotifyClient={handleNotifyClient}
      />;
  }

  if (session && currentPage === 'dashboard') {
    return <Dashboard 
        userPlan={userPlan} studioName={studioName} onLogout={async () => { await supabase.auth.signOut(); setCurrentPage('home'); }} 
        onOpenProject={(project) => { setEditingProject(project); setCurrentPage('project-details'); }} 
        projects={projects} 
        hasNotifications={hasNotifications}
        onClearNotifications={() => setHasNotifications(false)}
        onUpdateProjects={setProjects} defaultConfig={INITIAL_STAGES_CONFIG}
        onUpgradeClick={() => { setSelectedPlan({ name: "Pro", price: 190, interval: 'annual' }); setCurrentPage('checkout'); }}
        onCreateProject={handleCreateProject} onDeleteProject={handleDeleteProject} onEditProject={handleEditProject}
        onResetStudioConfig={async () => { if(session) { await supabase.from('profiles').update({ stages_config: INITIAL_STAGES_CONFIG }).eq('id', session.user.id); setStageConfig(JSON.parse(JSON.stringify(INITIAL_STAGES_CONFIG))); } }}
        onDeleteAccount={handleDeleteAccount}
      />;
  }

  return (
    <div className="min-h-screen bg-white selection:bg-gray-900 selection:text-white font-sans">
      <StickyHeader onAuthClick={handleAuthNavigation} />
      <main><Hero onAuthClick={handleAuthNavigation} /><ClientLove /><Problem /><Solution /><Benefits /><Pricing onSelectPlan={(plan) => { setSelectedPlan(plan); setCurrentPage('checkout'); }} onAuthClick={handleAuthNavigation} /></main>
      <Footer onAuthClick={handleAuthNavigation} />
    </div>
  );
}

export default App;
