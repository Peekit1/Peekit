
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Hero } from './Hero';
import { Problem } from './Problem';
import { Solution } from './Solution';
import { Benefits } from './Benefits';
import { Pricing } from './Pricing';
import { Footer } from './Footer';
import { StickyHeader } from './StickyHeader';
import { AuthPage } from './AuthPage';
import { Dashboard } from './Dashboard';
import { ProductShowcase } from './ProductShowcase';
import { CheckoutPage } from './CheckoutPage';
import { ClientTrackingPage } from './ClientTrackingPage';
import { ClientAccessGate } from './ClientAccessGate';
import { OnboardingWizard } from './OnboardingWizard';
import { ProjectDetails } from './ProjectDetails';
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
  
  // Use a ref to track currentPage inside event listeners (avoids stale closures)
  const currentPageRef = useRef(currentPage);
  useEffect(() => { currentPageRef.current = currentPage; }, [currentPage]);

  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  
  // Auth view mode (Login vs Signup)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Two separate states for the project being viewed publicly vs edited by admin
  const [clientViewProject, setClientViewProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

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
              // FIX: Check if array is not empty, otherwise fallback to default
              if (data.stages_config && Array.isArray(data.stages_config) && data.stages_config.length > 0) {
                  setStageConfig(data.stages_config);
              } else {
                  setStageConfig(INITIAL_STAGES_CONFIG);
              }
              return data;
          }
      } catch (e) {
          console.error("Profile fetch error", e);
      }
      return null;
  };

  const fetchPublicProject = async (projectId: string) => {
      // 1. Fetch Project Publicly (via new public Policy)
      const { data: projectData, error } = await supabase
          .from('projects')
          .select(`*, teasers (*)`)
          .eq('id', projectId)
          .single();

      if (projectData) {
          // 2. Fetch the owner's workflow config
          // NOTE: This requires 'profiles' to be publicly readable too, otherwise we fallback to default
          const { data: profileData } = await supabase
            .from('profiles')
            .select('stages_config')
            .eq('id', projectData.user_id)
            .single();

          if (profileData && profileData.stages_config) {
              setStageConfig(profileData.stages_config);
          } else {
              setStageConfig(INITIAL_STAGES_CONFIG);
          }

          const mapped = mapProjectsFromDB([projectData])[0];
          setClientViewProject(mapped);
          setCurrentPage('client-view');
      } else {
          // Only alert if we are definitely not on a valid route
          console.warn("Projet introuvable ou lien expiré.");
          // REDIRECTION DE SÉCURITÉ : Si le projet n'existe pas, retour à l'accueil
          setCurrentPage('home');
      }
  };

  const fetchProjects = async (userId?: string) => {
    // SECURITY: Ensure we only fetch projects for the specified user (or current session)
    const targetUser = userId || session?.user?.id;
    if (!targetUser) return [];

    try {
        const { data, error } = await supabase
            .from('projects')
            .select(`*, teasers (*)`)
            .eq('user_id', targetUser) // Secure filtering
            .order('created_at', { ascending: false });

        if (error) {
             console.warn("Erreur relation teasers, chargement simple...", error);
             // Fallback: fetch projects without teasers if relation is broken
             const retry = await supabase
                .from('projects')
                .select(`*`)
                .eq('user_id', targetUser) // Secure filtering
                .order('created_at', { ascending: false });
             
             if (retry.data) {
                 return mapProjectsFromDB(retry.data);
             }
             return [];
        }
        
        return mapProjectsFromDB(data || []);
    } catch (e) {
        console.error("Projects fetch error", e);
        return [];
    }
  };

  const mapProjectsFromDB = (data: any[]): Project[] => {
      return data.map(p => ({
          id: p.id,
          clientName: p.client_name || 'Client Inconnu',
          clientEmail: p.client_email || '',
          date: p.date || '',
          location: p.location || '',
          type: p.type || 'Autre',
          coverImage: p.cover_image || '',
          currentStage: p.current_stage || 'secured',
          lastUpdate: p.last_update || '',
          accessPassword: p.access_password,
          teasers: p.teasers ? p.teasers.map((t: any) => ({
              id: t.id,
              type: t.type,
              url: t.url,
              date: new Date(t.created_at).toLocaleDateString(),
              title: t.title || 'Média'
          })) : []
      }));
  };

  // --- AUTH & INIT ---

  const initApp = async (currentSession: any) => {
      // 1. Check for Public Link Hash FIRST (Works for everyone)
      const hash = window.location.hash;
      if (hash.startsWith('#/v/')) {
          const projectId = hash.split('#/v/')[1];
          if (projectId) {
              await fetchPublicProject(projectId);
              return;
          }
      }

      if (!currentSession) {
          setCurrentPage('home');
          return;
      }
      
      setSession(currentSession);
      
      // Load Data
      const profile = await fetchUserProfile(currentSession.user.id);
      const userProjects = await fetchProjects(currentSession.user.id); // Pass the user ID explicitly
      setProjects(userProjects);
      
      // Navigation Logic
      if (profile && profile.onboarding_completed) {
          setCurrentPage('dashboard');
      } else if (profile && !profile.onboarding_completed) {
          setCurrentPage('onboarding');
      } else {
          // If no profile, assume dashboard for safety or onboarding
          setCurrentPage('dashboard');
      }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      initApp(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === 'SIGNED_OUT') {
          setSession(null);
          // CRITICAL FIX: Do NOT redirect to home if we are on a public view url
          if (!window.location.hash.startsWith('#/v/')) {
            setCurrentPage('home');
          }
      } else if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED') {
          // Only re-init if we are not already in a logged-in state to avoid reloading loops
          if (currentPageRef.current === 'home' || currentPageRef.current === 'auth' || currentPageRef.current === 'loading') {
               initApp(session);
          }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- HASH LISTENER FOR CLIENT LINKS ---
  useEffect(() => {
    const handleHashChange = () => {
        const hash = window.location.hash;
        if (hash.startsWith('#/v/')) {
            const projectId = hash.split('#/v/')[1];
            if (projectId) fetchPublicProject(projectId);
        } else {
            // If hash is removed or invalid and user not logged in, go home
            if (!session) setCurrentPage('home');
        }
    };
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [session]); // Add session as dependency

  // --- NAVIGATION HANDLER ---
  const handleAuthNavigation = (mode: 'login' | 'signup' = 'login') => {
      setAuthMode(mode);
      setCurrentPage('auth');
  };

  // --- ACTIONS ---

  const handleCreateProject = async (projectData: Partial<Project>, coverFile?: File) => {
    if (!session) return;
    
    // 1. Upload Cover if exists
    let coverUrl = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800';
    if (coverFile) {
        coverUrl = await compressAndUploadImage(coverFile);
    } else if (projectData.coverImage) {
        coverUrl = projectData.coverImage;
    }

    // 2. Prepare Payload
    // Use dynamic first stage ID from config, but prioritize provided currentStage
    const initialStageId = projectData.currentStage || (stageConfig.length > 0 ? stageConfig[0].id : 'secured');
    
    const newProject = {
        user_id: session.user.id,
        client_name: projectData.clientName,
        client_email: projectData.clientEmail,
        date: projectData.date,
        location: projectData.location,
        type: projectData.type,
        cover_image: coverUrl,
        current_stage: initialStageId,
        last_update: "À l'instant",
        created_at: new Date().toISOString()
    };

    // 3. Insert in DB
    const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select()
        .single();

    if (error) {
        console.error("Create project error:", error);
        if (error.code === '42501') {
            alert("Erreur de permission (RLS). Impossible de créer le projet. Vérifiez vos policies Supabase.");
        }
        return;
    }

    // 4. Update Local State
    if (data) {
        const mappedProject = mapProjectsFromDB([data])[0];
        setProjects([mappedProject, ...projects]);
    }
  };

  const handleUpdateProjectStage = async (stageId: string) => {
    if (!editingProject || !session) return;
    
    const previousStage = editingProject.currentStage;
    
    // 1. Optimistic Update (UI)
    const optimisticProject = { ...editingProject, currentStage: stageId, lastUpdate: "À l'instant" };
    setEditingProject(optimisticProject);
    setProjects(projects.map(p => p.id === editingProject.id ? optimisticProject : p));

    try {
        const now = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit' });
        
        // 2. DB Update
        const { data, error } = await supabase
            .from('projects')
            .update({ 
                current_stage: stageId, 
                last_update: now 
            })
            .eq('id', editingProject.id)
            .select(); // Ask for returned data to verify update

        // 3. Check for silent RLS failure (0 rows updated)
        if (!error && (!data || data.length === 0)) {
            throw new Error("RLS_BLOCKING");
        }

        if (error) throw error;

        // 4. Update with REAL data from DB to prevent corruption/mismatch
        if (data && data.length > 0) {
            // Convert snake_case response to camelCase Project object
            const freshProject = mapProjectsFromDB(data)[0];
            
            // Update local state with the clean object
            setEditingProject(freshProject);
            setProjects(prev => prev.map(p => p.id === freshProject.id ? freshProject : p));
        }

    } catch (err: any) {
        console.error("Stage update failed:", err);
        
        // Rollback
        setEditingProject({ ...editingProject, currentStage: previousStage });
        setProjects(projects.map(p => p.id === editingProject.id ? { ...editingProject, currentStage: previousStage } : p));
        
        // Error Message
        if (err.message === "RLS_BLOCKING" || err.code === '42501') {
             const sqlFix = `-- 1. Nettoyage complet
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON public.projects;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.projects;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.projects;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.projects;

DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON public.teasers;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.teasers;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.teasers;

-- 2. Création des règles UNIVERSELLES (Conversion Text <-> Text)
-- Cela contourne l'erreur "operator does not exist: uuid = text"

-- TABLE PROJETS
CREATE POLICY "Enable read access for users based on user_id" ON public.projects 
FOR SELECT USING ((select auth.uid()::text) = user_id::text);

CREATE POLICY "Enable insert for users based on user_id" ON public.projects 
FOR INSERT WITH CHECK ((select auth.uid()::text) = user_id::text);

CREATE POLICY "Enable update for users based on user_id" ON public.projects 
FOR UPDATE USING ((select auth.uid()::text) = user_id::text) WITH CHECK ((select auth.uid()::text) = user_id::text);

CREATE POLICY "Enable delete for users based on user_id" ON public.projects 
FOR DELETE USING ((select auth.uid()::text) = user_id::text);

-- TABLE TEASERS
CREATE POLICY "Enable read access for users based on user_id" ON public.teasers 
FOR SELECT USING ((select auth.uid()::text) = user_id::text);

CREATE POLICY "Enable insert for users based on user_id" ON public.teasers 
FOR INSERT WITH CHECK ((select auth.uid()::text) = user_id::text);

CREATE POLICY "Enable delete for users based on user_id" ON public.teasers 
FOR DELETE USING ((select auth.uid()::text) = user_id::text);`;
             
             window.prompt("ERREUR PERMISSION (RLS). Copiez et exécutez ce SQL dans Supabase pour réparer :", sqlFix);
        } else {
             alert("Erreur lors de la mise à jour : " + err.message);
        }
    }
  };

  const handleUploadTeasers = async (files: File[]) => {
      if (!editingProject) return;

      const newTeasers: Teaser[] = [];

      for (const file of files) {
          try {
              // 1. Compress Image
              const base64 = await compressImage(file);
              
              // 2. Prepare Payload
              // Try standard approach first (with user_id)
              const payload: any = {
                  project_id: editingProject.id,
                  type: file.type.startsWith('video') ? 'video' : 'image',
                  url: base64,
                  user_id: session.user.id // Explicit user_id
              };

              // 3. Insert
              let { data, error } = await supabase.from('teasers').insert([payload]).select();

              // 4. Fallback Strategy (if column missing or RLS error)
              if (error) {
                   console.warn("Upload attempt 1 failed:", error);
                   // Retry without user_id if needed
                   const retryPayload = { ...payload };
                   delete retryPayload.user_id;
                   
                   const retry = await supabase.from('teasers').insert([retryPayload]).select();
                   if (!retry.error) {
                       data = retry.data;
                       error = null;
                   } else {
                       // If both failed, use the error from the first attempt usually, or the second
                       console.warn("Upload attempt 2 failed:", retry.error);
                   }
              }

              if (error) throw error;

              if (data) {
                  const t = data[0];
                  newTeasers.push({
                      id: t.id,
                      type: t.type,
                      url: t.url,
                      date: new Date().toLocaleDateString(),
                      title: 'Média'
                  });
              }

          } catch (err: any) {
              console.error("Upload failed", err);
              if (err.code === '42501' || err.message === 'RLS_BLOCKING') {
                   const sqlFix = `-- Voir SQL précédent pour le fix RLS Universel`;
                   window.prompt("ERREUR RLS TEASERS. Exécutez le script SQL universel :", sqlFix);
              } else {
                   alert("Erreur upload: " + err.message);
              }
          }
      }

      // Update local state
      if (newTeasers.length > 0) {
          const updatedProject = {
              ...editingProject,
              teasers: [...(editingProject.teasers || []), ...newTeasers]
          };
          setEditingProject(updatedProject);
          setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));
      }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const MAX_WIDTH = 1024; // Reduced slightly for safety
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.6)); // 60% quality
            };
        };
        reader.onerror = (error) => reject(error);
    });
  };

  const compressAndUploadImage = async (file: File): Promise<string> => {
      // Re-use the compression logic for cover images, but just return base64 for now
      // Ideally this should upload to Storage, but we are using base64 in DB as per existing logic
      return compressImage(file);
  };

  const handleUpdatePassword = async (newPassword: string) => {
      if (!editingProject) return;
      
      const { error } = await supabase
          .from('projects')
          .update({ access_password: newPassword })
          .eq('id', editingProject.id);

      if (!error) {
          const updated = { ...editingProject, accessPassword: newPassword };
          setEditingProject(updated);
          setProjects(projects.map(p => p.id === editingProject.id ? updated : p));
      }
  };

  const handleDeleteTeaser = async (teaserId: string) => {
      if (!editingProject) return;
      
      const { error } = await supabase.from('teasers').delete().eq('id', teaserId);
      
      if (!error) {
          const updatedTeasers = (editingProject.teasers || []).filter(t => t.id !== teaserId);
          const updatedProject = { ...editingProject, teasers: updatedTeasers };
          setEditingProject(updatedProject);
          setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));
      }
  };

  const handleUpdateCoverImage = async (file: File) => {
      if (!editingProject) return;
      const base64 = await compressImage(file);
      
      const { error } = await supabase
          .from('projects')
          .update({ cover_image: base64 })
          .eq('id', editingProject.id);

      if (!error) {
          const updated = { ...editingProject, coverImage: base64 };
          setEditingProject(updated);
          setProjects(projects.map(p => p.id === editingProject.id ? updated : p));
      }
  };
  
  const handleDeleteProject = async (projectId: string) => {
      if (!session) {
          const { data } = await supabase.auth.getUser();
          if (!data.user) {
              alert("Session expirée. Veuillez recharger la page.");
              return;
          }
      }

      try {
          // 1. Delete teasers first (FK constraint)
          await supabase.from('teasers').delete().eq('project_id', projectId);
          
          // 2. Delete project
          const { error } = await supabase.from('projects').delete().eq('id', projectId);
          
          if (error) throw error;
          
          // 3. Update local state
          setProjects(prev => prev.filter(p => p.id !== projectId));
      } catch (err: any) {
          console.error("Delete failed:", err);
          alert("Erreur suppression: " + err.message);
      }
  };

  const handleEditProject = async (projectId: string, projectData: Partial<Project>, coverFile?: File) => {
      let coverUrl = projectData.coverImage;
      if (coverFile) {
          coverUrl = await compressImage(coverFile);
      }

      const updates: any = {
          client_name: projectData.clientName,
          client_email: projectData.clientEmail,
          date: projectData.date,
          location: projectData.location,
          type: projectData.type,
      };
      if (coverUrl) updates.cover_image = coverUrl;

      const { data, error } = await supabase
          .from('projects')
          .update(updates)
          .eq('id', projectId)
          .select()
          .single();

      if (!error && data) {
          const updated = mapProjectsFromDB([data])[0];
          setProjects(projects.map(p => p.id === projectId ? updated : p));
      } else {
          console.error("Edit failed", error);
      }
  };

  const handleUpdateStageConfig = async (newConfig: StagesConfiguration) => {
      setStageConfig(newConfig);
      if (session) {
          await supabase
            .from('profiles')
            .update({ stages_config: newConfig })
            .eq('id', session.user.id);
      }
  };

  const handleOnboardingComplete = async (name: string, firstProject: Project) => {
      setStudioName(name);
      
      // Ensure we have a valid config to save (use defaults if state is empty)
      const configToSave = (stageConfig && stageConfig.length > 0) ? stageConfig : INITIAL_STAGES_CONFIG;
      
      // Save profile
      if (session) {
          await supabase.from('profiles').upsert({
              id: session.user.id,
              studio_name: name,
              onboarding_completed: true,
              plan: 'freelance',
              stages_config: configToSave
          });
          
          // Ensure local state is consistent
          setStageConfig(configToSave);
          
          // Create first project using the correct initial stage ID
          const initialStageId = configToSave[0].id;
          await handleCreateProject({
              ...firstProject,
              currentStage: initialStageId
          });
      }

      setCurrentPage('dashboard');
  };

  // --- RENDER ---

  if (currentPage === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center flex-col gap-4">
        <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-white animate-pulse">
            <Loader2 size={32} className="animate-spin" />
        </div>
        <p className="text-gray-500 font-medium animate-pulse">Chargement de votre studio...</p>
      </div>
    );
  }

  if (currentPage === 'auth') {
    return <AuthPage onBack={() => setCurrentPage('home')} onLogin={() => {}} initialView={authMode} />;
  }

  if (currentPage === 'onboarding') {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  if (currentPage === 'checkout' && selectedPlan) {
    return (
      <CheckoutPage 
        plan={selectedPlan} 
        onBack={() => setCurrentPage('home')} 
        onSuccess={() => {
            alert('Paiement réussi (Simulation) ! Bienvenue chez Peekit.');
            setCurrentPage('dashboard');
        }} 
      />
    );
  }

  if (currentPage === 'project-details' && editingProject) {
      return (
          <ProjectDetails 
              project={editingProject}
              stageConfig={stageConfig}
              defaultConfig={INITIAL_STAGES_CONFIG}
              userPlan={userPlan}
              onBack={() => {
                  setEditingProject(null);
                  setCurrentPage('dashboard');
              }}
              onUpdateStage={handleUpdateProjectStage}
              onUpdateStageConfig={handleUpdateStageConfig}
              onViewClientVersion={() => {
                  setClientViewProject(editingProject);
                  setCurrentPage('client-view');
              }}
              onUpdatePassword={handleUpdatePassword}
              onUploadTeasers={handleUploadTeasers}
              onDeleteTeaser={handleDeleteTeaser}
              onUpdateCoverImage={handleUpdateCoverImage}
          />
      );
  }

  if (currentPage === 'client-view' && clientViewProject) {
      // If project has password and access not granted
      if (clientViewProject.accessPassword && !isAccessGranted) {
          return (
              <ClientAccessGate 
                  project={clientViewProject} 
                  onAccessGranted={() => setIsAccessGranted(true)} 
              />
          );
      }
      return (
          <ClientTrackingPage 
              project={clientViewProject} 
              onBack={() => {
                  setIsAccessGranted(false);
                  setClientViewProject(null);
                  setCurrentPage('project-details');
              }}
              stageConfig={stageConfig}
          />
      );
  }

  if (currentPage === 'dashboard') {
    return (
      <Dashboard 
        userPlan={userPlan}
        studioName={studioName}
        onLogout={async () => {
            await supabase.auth.signOut();
            setCurrentPage('home');
        }}
        onOpenProject={(project) => {
            setEditingProject(project);
            setCurrentPage('project-details');
        }}
        projects={projects}
        onUpdateProjects={setProjects}
        stageConfig={stageConfig}
        // onUpdateStageConfig removed from Dashboard
        onUpgradeClick={() => {
            const proPlan = { name: "Pro", price: 190, interval: 'annual' as const };
            setSelectedPlan(proPlan);
            setCurrentPage('checkout');
        }}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        onEditProject={handleEditProject}
      />
    );
  }

  // Default: Landing Page
  return (
    <div className="min-h-screen bg-white selection:bg-lime-200 selection:text-black font-sans">
      <StickyHeader onAuthClick={handleAuthNavigation} />
      <main>
        <Hero onAuthClick={handleAuthNavigation} />
        <Problem />
        <Solution />
        <Benefits />
        <ProductShowcase />
        <Pricing onSelectPlan={(plan) => {
            setSelectedPlan(plan);
            setCurrentPage('checkout');
        }} onAuthClick={handleAuthNavigation} />
      </main>
      <Footer onAuthClick={handleAuthNavigation} />
    </div>
  );
}

export default App;
