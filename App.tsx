import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import * as DOMPurify from 'dompurify';
import { z } from 'zod';

import { Hero } from './components/Hero';
import { Solution } from './components/Solution';
import { Benefits } from './components/Benefits';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { StickyHeader } from './components/StickyHeader';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { CheckoutPage } from './components/CheckoutPage';
import { ClientTrackingPage } from './components/ClientTrackingPage';
import { ClientAccessGate } from './components/ClientAccessGate';
import { OnboardingWizard } from './components/OnboardingWizard';
import { ProjectDetails } from './components/ProjectDetails';
import { SectionDivider } from './components/SectionDivider';
import { SelectedPlan, Project, StagesConfiguration, UserPlan, Teaser, WorkflowStep, NotificationType } from './types';
import { supabase } from './supabaseClient';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// ==========================================
// 1. UTILITAIRES & SANITIZATION
// ==========================================

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function sanitizeString(input: string): string {
  if (typeof window !== 'undefined' && DOMPurify && DOMPurify.sanitize) {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  }
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().replace(/[^\w.@+-]/g, '');
}

// ==========================================
// 2. PROTECTION CSRF (Client Side)
// ==========================================

export function generateCSRFToken(): string {
  return generateUUID();
}

export function setCSRFToken(token: string): void {
  sessionStorage.setItem('csrf_token', token);
}

export function getCSRFToken(): string | null {
  return sessionStorage.getItem('csrf_token');
}

export function useCSRFToken() {
  useEffect(() => {
    if (!getCSRFToken()) {
      const token = generateCSRFToken();
      setCSRFToken(token);
    }
  }, []);
  return getCSRFToken();
}

export async function secureSupabaseRequest<T>(
  requestFn: () => Promise<{ data: T | null; error: any }>,
  csrfToken: string | null
): Promise<{ data: T | null; error: any }> {
  if (!csrfToken) {
    return {
      data: null,
      error: new Error('Token CSRF manquant ou invalide. Veuillez rafraîchir la page.')
    };
  }
  return await requestFn();
}

// ==========================================
// 3. GESTION SÉCURISÉE DES FICHIERS
// ==========================================

export const ALLOWED_FILE_TYPES = {
  images: {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'image/gif': ['.gif']
  },
  videos: {
    'video/mp4': ['.mp4'],
    'video/quicktime': ['.mov'],
    'video/x-msvideo': ['.avi']
  }
} as const;

export const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024, // 10 MB
  video: 100 * 1024 * 1024, // 100 MB
  cover: 5 * 1024 * 1024    // 5 MB
} as const;

export async function verifyFileMimeType(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const arr = new Uint8Array(reader.result as ArrayBuffer).subarray(0, 4);
      let header = '';
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }
      
      const magicNumbers: Record<string, string> = {
        '89504e47': 'image/png',
        'ffd8ffe0': 'image/jpeg',
        'ffd8ffe1': 'image/jpeg',
        'ffd8ffe2': 'image/jpeg',
        '47494638': 'image/gif',
        '52494646': 'video/avi',
        '00000018': 'video/mp4',
        '00000020': 'video/mp4',
        '66747970': 'video/mp4',
      };
      
      const detectedType = magicNumbers[header.toLowerCase()];
      if (detectedType) {
        resolve(detectedType);
      } else {
        resolve(file.type); 
      }
    };
    reader.onerror = () => reject(new Error('Erreur lecture fichier'));
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
}

export async function validateFile(
  file: File, 
  category: 'image' | 'video' | 'cover'
): Promise<{ valid: boolean; error?: string }> {
  
  const maxSize = MAX_FILE_SIZES[category];
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Fichier trop volumineux (max ${Math.round(maxSize / 1024 / 1024)}MB)`
    };
  }

  if (file.size === 0) {
    return { valid: false, error: 'Fichier vide' };
  }

  const declaredType = file.type;
  const allowedTypes = category === 'cover' 
    ? Object.keys(ALLOWED_FILE_TYPES.images)
    : [...Object.keys(ALLOWED_FILE_TYPES.images), ...Object.keys(ALLOWED_FILE_TYPES.videos)];

  if (!allowedTypes.includes(declaredType)) {
    return { 
      valid: false, 
      error: `Type de fichier non autorisé: ${declaredType}` 
    };
  }

  try {
    const realType = await verifyFileMimeType(file);
    if (!realType.startsWith(category === 'video' ? 'video/' : 'image/')) {
       return { valid: false, error: 'Le contenu du fichier ne correspond pas à son extension' };
    }
  } catch (error) {
    return { valid: false, error: 'Impossible de vérifier le type de fichier' };
  }

  return { valid: true };
}

export function generateSecureFileName(originalName: string): string {
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9._-]/g, '');
  const lastDot = sanitizedName.lastIndexOf('.');
  const ext = lastDot !== -1 ? sanitizedName.substring(lastDot) : '';
  return `${generateUUID()}${ext}`;
}

export async function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) { reject(new Error('Canvas non supporté')); return; }

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Erreur compression image'));
      }, 'image/jpeg', 0.85);
    };

    img.onerror = () => reject(new Error('Erreur chargement image'));
    img.src = URL.createObjectURL(file);
  });
}

// ==========================================
// 4. SCHÉMAS DE VALIDATION (ZOD)
// ==========================================

export const ProjectCreateSchema = z.object({
  clientName: z.string().min(2).max(100).regex(/^[a-zA-ZÀ-ÿ0-9\s'-]+$/).transform(str => str.trim()),
  clientEmail: z.string().email().toLowerCase().transform(str => str.trim()),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: z.string().min(2).max(200).transform(str => str.trim()),
  type: z.enum(['Mariage', 'Entreprise', 'Portrait', 'Événement', 'Autre']),
  expectedDeliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')), 
  accessPassword: z.string().min(6).max(50).optional().or(z.literal(''))
});

export const INITIAL_STAGES_CONFIG: StagesConfiguration = [
  { id: 'secured', label: "Sécurisation des fichiers", minDays: 0, maxDays: 1, message: "Projet commencé" },
  { id: 'culling', label: "Tri", minDays: 2, maxDays: 5, message: "Création en cours" },
  { id: 'editing', label: "Retouche", minDays: 7, maxDays: 21, message: "C'est Ici que la magie opère" },
  { id: 'export', label: "Export & Vérification", minDays: 1, maxDays: 3, message: "Finitions" },
  { id: 'delivery', label: "Livraison", minDays: 0, maxDays: 1, message: "Prêt à être livré" }
];

// ==========================================
// APP COMPONENT
// ==========================================

function App() {
  const csrfToken = useCSRFToken();

  const [currentPage, setCurrentPage] = useState('home');
  const currentPageRef = useRef(currentPage);

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

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  const getErrorMessage = (err: any): string => {
    if (!err) return "Erreur inconnue";
    if (typeof err === 'string') return err;
    if (err.message && typeof err.message === 'string') return err.message;
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
        
        if (!data.onboarding_completed) {
            setCurrentPage('onboarding');
        } else {
            const current = currentPageRef.current;
            if (current === 'home' || current === 'auth') {
                setCurrentPage('dashboard');
            }
        }
      } else if (!window.location.hash.startsWith('#/v/')) {
        setCurrentPage('onboarding');
      }
    } catch (error) { console.error('Error fetching profile:', error); }
  };

  const fetchProjects = async (userId?: string) => {
    const targetUser = userId || session?.user?.id;
    if (!targetUser) return;
    try {
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
    
    if (!SUPABASE_URL) {
      console.error("VITE_SUPABASE_URL manquante");
      alert("Erreur de configuration serveur");
      setCurrentPage('home');
      setIsAuthChecking(false);
      return;
    }

    try {
      const storedToken = localStorage.getItem(`project_token_${projectId}`);
      let isAuthorized = false;
      
      if (storedToken) {
        try {
          const decoded = JSON.parse(atob(storedToken));
          if (decoded.exp > Date.now()) {
            isAuthorized = true;
          }
        } catch (e) {
          localStorage.removeItem(`project_token_${projectId}`);
        }
      }
      
      if (!isAuthorized) {
        const password = prompt('Ce projet est protégé. Veuillez entrer le mot de passe :');
        if (password === null) {
            setCurrentPage('home');
            return;
        }

        const response = await fetch(
          `${SUPABASE_URL}/functions/v1/verify-project-access`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectId,
              password,
              clientIp: 'browser' 
            })
          }
        );
        
        const result = await response.json();
        
        if (!response.ok) {
          alert(result.error || 'Accès refusé');
          setCurrentPage('home');
          return;
        }
        
        localStorage.setItem(`project_token_${projectId}`, result.accessToken);
      }
      
      const { data: projectData, error } = await supabase
        .from('projects')
        .select('*, teasers ( id, type, url, created_at, title )')
        .eq('id', projectId)
        .single();
      
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
        setClientAccessGranted(true); 
        setCurrentPage('client-view');
      }
      
    } catch (error) {
      console.error('Erreur chargement projet:', error);
      alert("Impossible de charger le projet ou accès refusé.");
      setCurrentPage('home');
    } finally {
      setIsAuthChecking(false);
    }
  };

  const handleNotifyClient = async (project: Project, stage: WorkflowStep, type: NotificationType) => {
    let subject = "";
    let body = "";
    if (type === 'status') {
        subject = `Avancement de votre projet ${project.type}`;
        body = `Bonjour ${project.clientName},\n\nBonne nouvelle ! Le projet avance bien.\nNous venons de passer officiellement à l'étape : "${stage.label}".`;
    } 
    else if (type === 'delay') {
        subject = `Information concernant votre projet ${project.type}`;
        body = `Bonjour ${project.clientName},\n\nJe tenais à vous informer d'un léger contretemps sur l'étape "${stage.label}".`;
    } 
    else if (type === 'note') {
        subject = `Note importante - Projet ${project.type}`;
        body = `Bonjour ${project.clientName},\n\nJ'ai ajouté une précision importante concernant l'étape en cours ("${stage.label}").`;
    }
    return { subject, body };
  };

  // ✅ CREATE PROJECT AVEC VALIDATION (CORRECTION DU CRASH)
  const handleCreateProject = async (projectData: Partial<Project>, coverFile?: File, overrideStageConfig?: StagesConfiguration) => {
    if (!session || !csrfToken) {
      if (!csrfToken) alert("Session invalide (CSRF). Veuillez recharger la page.");
      return;
    }

    try {
      const validatedData = ProjectCreateSchema.parse({
        clientName: projectData.clientName,
        clientEmail: projectData.clientEmail,
        date: projectData.date,
        location: projectData.location,
        type: projectData.type,
        expectedDeliveryDate: projectData.expectedDeliveryDate,
        accessPassword: projectData.accessPassword
      });

      let coverUrl = null;
      if (coverFile) {
        const validation = await validateFile(coverFile, 'cover');
        if (!validation.valid) throw new Error(validation.error);

        let fileToUpload: File | Blob = coverFile;
        try { fileToUpload = await resizeImage(coverFile, 1200, 630); } catch(e) {}

        const secureName = generateSecureFileName(coverFile.name);
        const filePath = `covers/${session.user.id}/${secureName}`;
        
        const { error: uploadError } = await supabase.storage.from('project-files').upload(filePath, fileToUpload, {
             cacheControl: '3600',
             upsert: false
        });
        
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('project-files').getPublicUrl(filePath);
        coverUrl = publicUrl;
      }
      
      const configToSave = overrideStageConfig || stageConfig;
      const isolatedConfig = JSON.parse(JSON.stringify(configToSave));
      
      const sanitizedProject: any = { 
        user_id: session.user.id, 
        client_name: sanitizeString(validatedData.clientName), 
        client_email: sanitizeEmail(validatedData.clientEmail), 
        date: validatedData.date, 
        location: sanitizeString(validatedData.location), 
        type: validatedData.type, 
        cover_image: coverUrl, 
        current_stage: isolatedConfig[0]?.id || 'secured', 
        last_update: "À l'instant", 
        expected_delivery_date: validatedData.expectedDeliveryDate || null, 
        access_password: validatedData.accessPassword || null,
        created_at: new Date().toISOString(), 
        stages_config: isolatedConfig
      };
      
      const { data, error } = await secureSupabaseRequest(
        () => supabase.from('projects').insert([sanitizedProject]).select(),
        csrfToken
      );

      if (error) throw error;
      
      // ✅ CORRECTION DU CRASH : Vérification stricte que 'data' existe et n'est pas vide
      if (data && data.length > 0) {
        const newProjMapped = mapProjectsFromDB(data)[0];
        setProjects(prev => [newProjMapped, ...prev]);
        if (currentPage === 'onboarding') setCurrentPage('dashboard');
      }

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        alert(`Erreur de validation : ${firstError.message}`);
      } else {
        alert('Erreur création: ' + getErrorMessage(error));
      }
    }
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
          let newCoverUrl = null;

          if (coverFile && session) {
              const validation = await validateFile(coverFile, 'cover');
              if (!validation.valid) throw new Error(validation.error);

              const secureName = generateSecureFileName(coverFile.name);
              const filePath = `covers/${session.user.id}/${secureName}`;
              
              let fileToUpload: File | Blob = coverFile;
              try { fileToUpload = await resizeImage(coverFile, 1200, 630); } catch(e) {}

              const { error: uploadError } = await supabase.storage.from('project-files').upload(filePath, fileToUpload);
              if (uploadError) throw uploadError;
              const { data: { publicUrl } } = supabase.storage.from('project-files').getPublicUrl(filePath);
              newCoverUrl = publicUrl;
              updates.cover_image = newCoverUrl;
          }
          const dbUpdates: any = {};
          
          if (updates.clientName) dbUpdates.client_name = sanitizeString(updates.clientName);
          if (updates.clientEmail) dbUpdates.client_email = sanitizeEmail(updates.clientEmail);
          if (updates.date) dbUpdates.date = updates.date;
          if (updates.location) dbUpdates.location = sanitizeString(updates.location);
          if (updates.type) dbUpdates.type = updates.type;
          
          if (updates.cover_image) {
              dbUpdates.cover_image = updates.cover_image;
          }
          
          dbUpdates.last_update = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
          if (updates.expectedDeliveryDate) dbUpdates.expected_delivery_date = updates.expectedDeliveryDate;
          
          const { error } = await supabase.from('projects').update(dbUpdates).eq('id', projectId);
          if (error) throw error;
          
          const timestamp = Date.now();

          setProjects(prev => prev.map(p => {
              if (p.id === projectId) {
                  return { 
                      ...p, 
                      ...updates, 
                      coverImage: newCoverUrl ? `${newCoverUrl}?t=${timestamp}` : p.coverImage,
                      lastUpdate: dbUpdates.last_update 
                  };
              }
              return p;
          }));

          if (editingProject?.id === projectId) {
              setEditingProject(prev => prev ? { 
                  ...prev, 
                  ...updates, 
                  coverImage: newCoverUrl ? `${newCoverUrl}?t=${timestamp}` : prev.coverImage,
                  lastUpdate: dbUpdates.last_update 
              } : null);
          }
          
      } catch (error: any) { alert('Erreur edition: ' + getErrorMessage(error)); }
  };

  const handleUpdateProfile = async (updates: { studioName?: string; stagesConfig?: StagesConfiguration }) => {
    if (!session) return;
    try {
        const dbUpdates: any = {};
        if (updates.studioName) dbUpdates.studio_name = sanitizeString(updates.studioName);
        if (updates.stagesConfig) dbUpdates.stages_config = updates.stagesConfig;

        const { error } = await supabase.from('profiles').update(dbUpdates).eq('id', session.user.id);
        if (error) throw error;

        if (updates.studioName) setStudioName(updates.studioName);
        if (updates.stagesConfig) setStageConfig(updates.stagesConfig);
        
    } catch (error: any) {
        alert("Erreur de sauvegarde : " + getErrorMessage(error));
    }
  };

  // ✅ FONCTIONS POUR MODIFIER EMAIL ET MOT DE PASSE
  const handleUpdateEmail = async (newEmail: string) => {
    try {
        const { error } = await supabase.auth.updateUser({ email: newEmail });
        if (error) throw error;
    } catch (error: any) {
        alert("Erreur mise à jour email: " + getErrorMessage(error));
        throw error;
    }
  };

  const handleUpdatePassword = async (newPassword: string) => {
    try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
    } catch (error: any) {
        alert("Erreur mise à jour mot de passe: " + getErrorMessage(error));
        throw error;
    }
  };

  const handleUpdateStageConfig = async (newConfig: StagesConfiguration) => {
    if (editingProject) {
        const isolatedConfig = JSON.parse(JSON.stringify(newConfig));
        const updatedProject = { ...editingProject, stagesConfig: isolatedConfig };
        setEditingProject(updatedProject);
        setProjects(prev => prev.map(p => p.id === editingProject.id ? updatedProject : p));
        await supabase.from('projects').update({ stages_config: isolatedConfig }).eq('id', editingProject.id);
    } else if (session) {
        handleUpdateProfile({ stagesConfig: newConfig });
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
      if (userPlan === 'discovery' && (currentCount + files.length) > 3) { alert("Plan Découverte limité à 3 fichiers."); return; }
      
      try {
          const newTeasers: Teaser[] = [];
          for (const file of files) {
              const category = file.type.startsWith('video') ? 'video' : 'image';
              const validation = await validateFile(file, category);
              if (!validation.valid) {
                 alert(`Fichier ${file.name} ignoré: ${validation.error}`);
                 continue;
              }

              let fileToUpload: File | Blob = file;
              if (category === 'image') {
                  try { fileToUpload = await resizeImage(file, 1920, 1080); } 
                  catch(e) { console.warn("Redimensionnement échoué, upload de l'original"); }
              }

              const secureName = generateSecureFileName(file.name);
              const filePath = `teasers/${session.user.id}/${editingProject.id}/${secureName}`;
              
              const { error: uploadError } = await supabase.storage.from('project-files').upload(filePath, fileToUpload, {
                 contentType: file.type
              });

              if (uploadError) throw uploadError;
              const { data: { publicUrl } } = supabase.storage.from('project-files').getPublicUrl(filePath);
              
              const { data, error: dbError } = await supabase.from('teasers').insert([{ 
                  project_id: editingProject.id, 
                  user_id: session.user.id, 
                  url: publicUrl, 
                  type: category, 
                  title: file.name
              }]).select();

              if (dbError) throw dbError;
              if (data) newTeasers.push({ id: data[0].id, url: data[0].url, type: data[0].type, title: data[0].title, date: new Date().toLocaleDateString('fr-FR') });
          }
          const updatedTeasers = [...(editingProject.teasers || []), ...newTeasers];
          const updatedProject = { ...editingProject, teasers: updatedTeasers };
          setEditingProject(updatedProject);
          setProjects(prev => prev.map(p => p.id === editingProject.id ? updatedProject : p));
      } catch (error: any) { alert("Erreur upload : " + getErrorMessage(error)); }
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
    try {
        setLoading(true);
        await supabase.from('teasers').delete().eq('user_id', session.user.id);
        await supabase.from('projects').delete().eq('user_id', session.user.id);
        await supabase.from('profiles').delete().eq('id', session.user.id);
        await supabase.auth.signOut();
        setCurrentPage('home');
        setSession(null);
    } catch (error) { console.error("Erreur suppression:", error); } finally { setLoading(false); }
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
      return <ClientAccessGate project={clientViewProject} onAccessGranted={() => setClientAccessGranted(true)} onBack={handleClientBack} />;
    }
    return <ClientTrackingPage project={clientViewProject} stageConfig={stageConfig} onBack={handleClientBack} />;
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
        onDeleteAllTeasers={async () => {
             if(editingProject.teasers) {
                 for(const t of editingProject.teasers) {
                     await handleDeleteTeaser(t.id);
                 }
             }
        }}
        onUpdateCoverImage={async (file) => await handleEditProject(editingProject.id, {}, file)}
        onNotifyClient={handleNotifyClient}
        onUpdateProject={async (id, data) => await handleEditProject(id, data)}
      />;
  }

  if (session && currentPage === 'dashboard') {
    return <Dashboard 
        userPlan={userPlan} 
        studioName={studioName} 
        userEmail={session.user.email} 
        onLogout={async () => { await supabase.auth.signOut(); setCurrentPage('home'); }} 
        onOpenProject={(project) => { setEditingProject(project); setCurrentPage('project-details'); }} 
        projects={projects} 
        hasNotifications={hasNotifications}
        onClearNotifications={() => setHasNotifications(false)}
        onUpdateProjects={setProjects} 
        defaultConfig={stageConfig} 
        onUpgradeClick={() => { setSelectedPlan({ name: "Pro", price: 190, interval: 'annual' }); setCurrentPage('checkout'); }}
        onCreateProject={handleCreateProject} 
        onDeleteProject={handleDeleteProject} 
        onEditProject={handleEditProject}
        onResetStudioConfig={async () => { if(session) { await supabase.from('profiles').update({ stages_config: INITIAL_STAGES_CONFIG }).eq('id', session.user.id); setStageConfig(JSON.parse(JSON.stringify(INITIAL_STAGES_CONFIG))); } }}
        onDeleteAccount={handleDeleteAccount}
        onUpdateProfile={handleUpdateProfile} 
        
        onUpdateEmail={handleUpdateEmail}
        onUpdatePassword={handleUpdatePassword}
      />;
  }

  return (
    <div className="min-h-screen bg-white selection:bg-gray-900 selection:text-white font-sans">
      <StickyHeader onAuthClick={handleAuthNavigation} />
      <main>
        <Hero onAuthClick={handleAuthNavigation} />
        <SectionDivider />
        <Solution />
        <SectionDivider />
        <Benefits />
        <SectionDivider />
        <Pricing onSelectPlan={(plan) => { setSelectedPlan(plan); setCurrentPage('checkout'); }} onAuthClick={handleAuthNavigation} />
        <SectionDivider />
        <FAQ />
      </main>
      <Footer onAuthClick={handleAuthNavigation} />
    </div>
  );
}

export default App;
