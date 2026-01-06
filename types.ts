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
  userEmail?: string; // <--- NOUVELLE PROP AJOUTÉE
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
}
