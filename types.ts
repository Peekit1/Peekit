export type UserPlan = 'discovery' | 'pro' | 'agency';

export type WorkflowStep = {
  id: string;
  label: string;
  minDays: number;
  maxDays: number;
  message: string;
};

export type StagesConfiguration = WorkflowStep[];

export type Teaser = {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  date: string;
};

export type NotificationType = 'status' | 'delay' | 'note';

export interface Project {
  id: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  date: string;
  location: string;
  type: string;
  coverImage?: string;
  currentStage: string;
  lastUpdate: string;
  updatedAt?: string;
  clientLastViewedAt?: string;
  teasers?: Teaser[];
  accessPassword?: string;
  expectedDeliveryDate?: string;
  stagesConfig?: StagesConfiguration;
  isFinalized?: boolean; // ✅ Projet marqué comme terminé
  prestataireEmail?: string; // ✅ Email du prestataire pour contact client
  clientEmail2?: string; // ✅ Deuxième email client optionnel
  coverFocusX?: number; // ✅ Position X du focus de la cover (0-100)
  coverFocusY?: number; // ✅ Position Y du focus de la cover (0-100)
}

export interface SelectedPlan {
  name: string;
  price: number;
  interval: 'monthly' | 'annual';
}

export interface AuthNavigationProps {
  onAuthClick: (mode: 'login' | 'signup') => void;
}

export interface DashboardProps {
  userPlan: UserPlan;
  studioName: string;
  userEmail?: string;
  onLogout: () => void;
  onOpenProject: (project: Project) => void;
  projects: Project[];
  hasNotifications: boolean;
  onClearNotifications: () => void;
  onUpdateProjects: (projects: Project[]) => void;
  defaultConfig: StagesConfiguration;
  onCreateProject: (project: Partial<Project>, coverFile?: File, overrideStageConfig?: StagesConfiguration) => Promise<void>;
  onDeleteProject: (projectId: string) => void;
  onEditProject: (projectId: string, data: Partial<Project>, coverFile?: File) => Promise<void>;
  onUpgradeClick: () => void;
  onDeleteAccount: () => Promise<void>;
  onUpdateProfile: (updates: { studioName?: string; stagesConfig?: StagesConfiguration }) => Promise<void>;
  onResetStudioConfig: () => Promise<void>;
  
  // ✅ AJOUTS POUR LA GESTION DU COMPTE
  onUpdateEmail: (newEmail: string) => Promise<void>;
  onUpdatePassword: (newPassword: string) => Promise<void>;
}

export interface ClientTrackingPageProps {
  project: Project;
  stageConfig: StagesConfiguration;
  onBack?: () => void;
  showBackButton?: boolean; // ✅ Afficher le bouton retour (seulement depuis Vue client)
}

export interface ClientAccessGateProps {
  project: Project;
  onAccessGranted: () => void;
  onBack?: () => void;
  showBackButton?: boolean; // ✅ Afficher le bouton retour (seulement depuis Vue client)
}

export interface ProjectDetailsProps {
  project: Project;
  stageConfig: StagesConfiguration;
  defaultConfig: StagesConfiguration;
  userPlan: UserPlan;
  studioName: string;
  onBack: () => void;
  onUpdateStage: (stageId: string) => Promise<void>;
  onUpdateStageConfig: (config: StagesConfiguration) => Promise<void>;
  onViewClientVersion: () => void;
  onUpdatePassword: (password: string) => Promise<void>;
  onUploadTeasers: (files: File[]) => Promise<void>;
  onDeleteTeaser: (teaserId: string) => Promise<void>;
  onUpdateCoverImage: (file: File) => Promise<void>;
  onNotifyClient: (project: Project, stage: WorkflowStep, type: NotificationType) => Promise<{ subject: string; body: string }>;
  onFinalizeProject?: () => Promise<void>; // ✅ Marquer le projet comme terminé
}
