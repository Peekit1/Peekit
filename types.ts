
import React from 'react';

export interface Step {
  id: number;
  label: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
}

export interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface AuthNavigationProps {
  onAuthClick: (mode?: 'login' | 'signup') => void;
}

export interface WorkflowStep {
  id: string;
  label: string;
  minDays: number;
  maxDays: number;
  message: string;
}

// Configuration is now an array of steps
export type StagesConfiguration = WorkflowStep[];

export interface Teaser {
  id: string;
  type: 'image' | 'video';
  url: string;
  date: string;
  title?: string;
}

export interface Project {
  id: string;
  clientName: string;
  clientEmail: string; 
  date: string; // Start date
  estimatedDeliveryDate?: string; // New field
  location: string;
  type: string;
  coverImage: string;
  currentStage: string; // Dynamic stage ID
  lastUpdate: string;
  teasers?: Teaser[];
  accessPassword?: string;
}

export interface AuthPageProps {
  onBack: () => void;
  onLogin: () => void;
  initialView?: 'login' | 'signup';
}

export type UserPlan = 'freelance' | 'pro' | 'agency';

// --- DASHBOARD TYPES ---
export interface DashboardProps {
  userPlan: UserPlan; 
  studioName: string;
  onLogout: () => void;
  onOpenProject: (project: Project) => void;
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
  stageConfig: StagesConfiguration;
  // onUpdateStageConfig removed from Dashboard
  onUpgradeClick: () => void; 
  onCreateProject: (projectData: Partial<Project>, coverFile?: File) => Promise<void>;
  onDeleteProject: (projectId: string) => Promise<void>;
  onEditProject: (projectId: string, projectData: Partial<Project>, coverFile?: File) => Promise<void>;
}

// --- PROJECT DETAILS TYPES (ADMIN) ---
export interface ProjectDetailsProps {
  project: Project;
  stageConfig: StagesConfiguration;
  defaultConfig: StagesConfiguration; // New prop for reset
  userPlan: UserPlan;
  onBack: () => void;
  onUpdateStage: (stageId: string) => Promise<void>;
  onUpdateStageConfig: (config: StagesConfiguration) => Promise<void>; 
  onViewClientVersion: () => void;
  onUpdatePassword: (password: string) => Promise<void>;
  onUploadTeasers: (files: File[]) => Promise<void>;
  onDeleteTeaser: (teaserId: string) => Promise<void>;
  onUpdateCoverImage: (file: File) => Promise<void>;
}

// --- CHECKOUT TYPES ---

export interface SelectedPlan {
  name: string;
  price: number;
  interval: 'monthly' | 'annual';
}

export interface PricingProps extends AuthNavigationProps {
  onSelectPlan: (plan: SelectedPlan) => void;
}

export interface CheckoutPageProps {
  plan: SelectedPlan;
  onBack: () => void;
  onSuccess: () => void;
}

export interface ClientTrackingPageProps {
  project: Project;
  onBack: () => void;
  stageConfig: StagesConfiguration;
}

export interface ClientAccessGateProps {
  project: Project;
  onAccessGranted: () => void;
}

export interface OnboardingWizardProps {
  onComplete: (studioName: string, firstProject: Project) => void;
}
