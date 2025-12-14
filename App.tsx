
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { Benefits } from './components/Benefits';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { StickyHeader } from './components/StickyHeader';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { ProductShowcase } from './components/ProductShowcase';
import { CheckoutPage } from './components/CheckoutPage';
import { ClientTrackingPage } from './components/ClientTrackingPage';
import { ClientAccessGate } from './components/ClientAccessGate';
import { OnboardingWizard } from './components/OnboardingWizard';
import { ProjectDetails } from './components/ProjectDetails';
import { SelectedPlan, Project, StagesConfiguration, UserPlan, Teaser } from './types';
import { supabase } from './supabaseClient';

export const INITIAL_STAGES_CONFIG: StagesConfiguration = [
  { id: 'secured', label: "Sécurisation des fichiers", minDays: 0, maxDays: 1, message: "Projet commencé" },
  { id: 'culling', label: "Tri", minDays: 2, maxDays: 5, message: "Création en cours" },
  { id: 'editing', label: "Retouche", minDays: 7, maxDays: 21, message: "C'est Ici que la magie opère" },
  { id: 'export', label: "Export", minDays: 1, maxDays: 2, message: "Préparation des livrables" },
  { id: 'delivery', label: "Livraison", minDays: 0, maxDays: 1, message: "Fichiers prêts à être envoyés" }
];

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'auth' | 'onboarding' | 'dashboard' | 'checkout' | 'client-view' | 'project-details' | 'loading'>('loading');
  
  const currentPageRef = useRef(currentPage);
  useEffect(() => { currentPageRef.current = currentPage; }, [currentPage]);

  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  const [clientViewProject, setClientViewProject] = useState<Project | null>(null);
  
  const [userPlan, setUserPlan] = useState<UserPlan>('freelance');
  const [stageConfig, setStageConfig] = useState<StagesConfiguration>(INITIAL_STAGES_CONFIG);
  const [studioName, setStudioName] = useState('Peekit');
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [session, setSession] = useState<any>(null);

  // --- DATA FETCHING ---

  const fetchUserProfile = async (userId: string) => {
      try {
          const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();
          
          if (data) {
              setStudioName(data.studio_name || 'Mon Studio');
              setUserPlan((data.plan as UserPlan) || 'freelance');
              if (data.stages_config && Array.isArray(data.stages_config) && data.stages_config.length > 0) {
                  setStageConfig(data.stages_config);
              } else {
                  setStageConfig(INITIAL_STAGES_CONFIG);
              }
          }
      } catch (error) {
          console.error('Error fetching profile:', error);
      }
  };

  const fetchProjects = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
          
      if (data) {
        // Map database fields to frontend type if necessary
        const mappedProjects: Project[] = data.map((p: any) => ({
             id: p.id,
             clientName: p.client_name,
             clientEmail: p.client_email,
             date: p.date,
             estimatedDeliveryDate: p.estimated_delivery,
             location: p.location,
             type: p.type,
             coverImage: p.cover_image,
             currentStage: p.current_stage,
             lastUpdate: p.last_update || "Récemment",
             teasers: p.teasers || [],
             accessPassword: p.access_password
        }));
        setProjects(mappedProjects);
      }
  };

  const fetchClientProject = async (projectId: string) => {
    // Public fetch for client view (using RLS policies on Supabase side)
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

    if (data) {
         const p: Project = {
             id: data.id,
             clientName: data.client_name,
             clientEmail: data.client_email,
             date: data.date,
             estimatedDeliveryDate: data.estimated_delivery,
             location: data.location,
             type: data.type,
             coverImage: data.cover_image,
             currentStage: data.current_stage,
             lastUpdate: data.last_update || "Récemment",
             teasers: data.teasers || [],
             accessPassword: data.access_password
         };
         setClientViewProject(p);
         
         // Fetch corresponding profile config if needed
         if (data.user_id) {
             const { data: profileData } = await supabase.from('profiles').select('stages_config').eq('id', data.user_id).single();
             if (profileData?.stages_config) {
                 setStageConfig(profileData.stages_config);
             } else {
                 setStageConfig(INITIAL_STAGES_CONFIG);
             }
         }
         setCurrentPage('client-view');
    } else {
        console.error("Project not found", error);
        setCurrentPage('home');
    }
  };

  // --- INIT SESSION ---
  useEffect(() => {
      const handleRouting = async () => {
          // 1. Check for URL Hash (Client View)
          const hash = window.location.hash;
          if (hash.startsWith('#/v/')) {
              const projectId = hash.split('#/v/')[1];
              if (projectId) {
                  await fetchClientProject(projectId);
                  return;
              }
          }

          // 2. Check Auth Session
          const { data: { session } } = await supabase.auth.getSession();
          setSession(session);
          
          if (session) {
              await fetchUserProfile(session.user.id);
              await fetchProjects();
              setCurrentPage('dashboard');
          } else {
              if (currentPageRef.current === 'loading') {
                  setCurrentPage('home');
              }
          }
      };

      handleRouting();

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          if (session) {
              fetchUserProfile(session.user.id);
              fetchProjects();
              if (currentPageRef.current !== 'dashboard' && currentPageRef.current !== 'client-view') {
                 setCurrentPage('dashboard');
              }
          } else {
              // Only redirect to home if we are in a protected route
              if (currentPageRef.current === 'dashboard' || currentPageRef.current === 'project-details') {
                  setCurrentPage('home');
              }
          }
      });

      return () => subscription.unsubscribe();
  }, []);

  // --- ACTIONS ---

  const handleCreateProject = async (projectData: Partial<Project>, coverFile?: File) => {
      if (!session) return;
      
      let coverUrl = projectData.coverImage || "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800";

      // Upload logic would go here if bucket is configured
      // For now we use the Unsplash URL or provided string

      const newProject = {
          user_id: session.user.id,
          client_name: projectData.clientName,
          client_email: projectData.clientEmail,
          date: projectData.date,
          estimated_delivery: projectData.estimatedDeliveryDate,
          location: projectData.location,
          type: projectData.type,
          cover_image: coverUrl,
          current_stage: INITIAL_STAGES_CONFIG[0].id,
          last_update: "À l'instant",
          access_password: Math.random().toString(36).slice(-6) // Generate random password
      };

      const { error } = await supabase.from('projects').insert([newProject]);
      if (error) {
          console.error("Error creating project:", error);
          alert("Erreur lors de la création du projet.");
      } else {
          await fetchProjects();
      }
  };

  const handleUpdateStage = async (stageId: string) => {
      if (!session || !clientViewProject) return; // In admin mode, clientViewProject acts as 'currentProject'
      
      const { error } = await supabase
          .from('projects')
          .update({ 
              current_stage: stageId,
              last_update: "À l'instant"
          })
          .eq('id', clientViewProject.id);

      if (error) {
          console.error("Error updating stage:", error);
      } else {
          // Update local state
          setClientViewProject({ ...clientViewProject, currentStage: stageId, lastUpdate: "À l'instant" });
          await fetchProjects();
      }
  };

  const handleDeleteProject = async (projectId: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', projectId);
      if (error) console.error("Error deleting:", error);
      else await fetchProjects();
  };

  const handleEditProject = async (projectId: string, data: Partial<Project>) => {
       const updateData = {
           client_name: data.clientName,
           client_email: data.clientEmail,
           date: data.date,
           estimated_delivery: data.estimatedDeliveryDate,
           location: data.location,
           type: data.type
       };
       
       const { error } = await supabase.from('projects').update(updateData).eq('id', projectId);
       if (!error) await fetchProjects();
  };

  const handleUpdateStageConfig = async (newConfig: StagesConfiguration) => {
      if (!session) return;
      const { error } = await supabase
          .from('profiles')
          .update({ stages_config: newConfig })
          .eq('id', session.user.id);
      
      if (!error) {
          setStageConfig(newConfig);
      }
  };
  
  const handleUpdatePassword = async (password: string) => {
      if (!clientViewProject) return;
      const { error } = await supabase
        .from('projects')
        .update({ access_password: password })
        .eq('id', clientViewProject.id);
        
      if (!error) {
          setClientViewProject({...clientViewProject, accessPassword: password});
      }
  };

  const handleUploadTeasers = async (files: File[]) => {
       // Placeholder for file upload logic
       // Would require Supabase Storage setup
       alert("L'upload de fichiers nécessite la configuration du Bucket Supabase.");
  };

  // --- NAVIGATION ---

  const handleAuthClick = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setCurrentPage('auth');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setCurrentPage('home');
  };

  const handleSelectPlan = (plan: SelectedPlan) => {
    setSelectedPlan(plan);
    if (!session) {
        handleAuthClick('signup');
    } else {
        setCurrentPage('checkout');
    }
  };

  // --- RENDER ---

  if (currentPage === 'loading') {
      return (
          <div className="min-h-screen flex items-center justify-center bg-white">
              <Loader2 className="animate-spin text-gray-900" size={32}/>
          </div>
      );
  }

  // CLIENT VIEW ROUTE
  if (currentPage === 'client-view' && clientViewProject) {
      if (clientViewProject.accessPassword && !isAccessGranted) {
          return <ClientAccessGate project={clientViewProject} onAccessGranted={() => setIsAccessGranted(true)} />;
      }
      return (
        <ClientTrackingPage 
            project={clientViewProject} 
            onBack={() => setCurrentPage('home')}
            stageConfig={stageConfig}
        />
      );
  }

  // ADMIN PROJECT DETAILS
  if (currentPage === 'project-details' && clientViewProject) {
      return (
          <ProjectDetails 
              project={clientViewProject}
              stageConfig={stageConfig}
              defaultConfig={INITIAL_STAGES_CONFIG}
              userPlan={userPlan}
              onBack={() => { setClientViewProject(null); setCurrentPage('dashboard'); }}
              onUpdateStage={handleUpdateStage}
              onUpdateStageConfig={handleUpdateStageConfig}
              onViewClientVersion={() => window.open(`${window.location.origin}/#/v/${clientViewProject.id}`, '_blank')}
              onUpdatePassword={handleUpdatePassword}
              onUploadTeasers={handleUploadTeasers}
              onDeleteTeaser={async () => {}}
              onUpdateCoverImage={async () => {}}
          />
      );
  }

  // CHECKOUT
  if (currentPage === 'checkout' && selectedPlan) {
      return <CheckoutPage plan={selectedPlan} onBack={() => setCurrentPage('dashboard')} onSuccess={() => {
          // Simulate upgrade
          setUserPlan(selectedPlan.name === 'Agency' ? 'agency' : 'pro');
          setCurrentPage('dashboard');
      }} />;
  }

  // DASHBOARD
  if (currentPage === 'dashboard') {
      return (
          <Dashboard 
              userPlan={userPlan}
              studioName={studioName}
              projects={projects}
              stageConfig={stageConfig}
              onLogout={handleLogout}
              onOpenProject={(p) => { setClientViewProject(p); setCurrentPage('project-details'); }}
              onCreateProject={handleCreateProject}
              onDeleteProject={handleDeleteProject}
              onEditProject={handleEditProject}
              onUpdateProjects={setProjects}
              onUpgradeClick={() => { setCurrentPage('checkout'); setSelectedPlan({name: 'Pro', price: 19, interval: 'monthly'}); }}
          />
      );
  }

  // AUTH
  if (currentPage === 'auth') {
      return (
          <AuthPage 
              initialView={authMode} 
              onBack={() => setCurrentPage('home')}
              onLogin={() => {}} // Supabase auth listener handles redirect
          />
      );
  }

  // ONBOARDING
  if (currentPage === 'onboarding') {
      return (
          <OnboardingWizard onComplete={(name, firstProject) => {
              setStudioName(name);
              // Create profile and first project in DB
              if (session) {
                  supabase.from('profiles').update({ studio_name: name }).eq('id', session.user.id).then(() => {
                      handleCreateProject(firstProject);
                  });
              }
              setCurrentPage('dashboard');
          }} />
      );
  }

  // LANDING PAGE
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-gray-900 selection:text-white">
      <StickyHeader onAuthClick={handleAuthClick} />
      <Hero onAuthClick={handleAuthClick} />
      <ProductShowcase />
      <Problem />
      <Solution />
      <Benefits />
      <Pricing onSelectPlan={handleSelectPlan} onAuthClick={handleAuthClick} />
      <Footer onAuthClick={handleAuthClick} />
    </div>
  );
}

export default App;
