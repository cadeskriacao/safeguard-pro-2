export enum RiskLevel {
  BAIXO = 'Baixo',
  MEDIO = 'Médio',
  CRITICO = 'Crítico',
  IMINENTE = 'Risco Iminente'
}

export enum APRStatus {
  DRAFT = 'Rascunho',
  PENDING_APPROVAL = 'Aguardando Aprovação',
  APPROVED = 'Aprovada',
  REJECTED = 'Rejeitada'
}

export interface Project {
  id: string;
  name: string;
  address: string;
  status: 'Ativo' | 'Finalizado' | 'Pausado';
  safetyScore: number;
  progress: number;
  manager: string;
}

export interface InspectionItem {
  id: string;
  question: string;
  status: 'C' | 'NC' | 'NA' | null; // Conforme, Não Conforme, Não Aplicável
  comment?: string;
  severity?: RiskLevel;
  photoUrl?: string; // Base64 or URL
}

export interface Inspection {
  id: string;
  location: string;
  date: string;
  items: InspectionItem[];
  inspectorName: string;
  hasImminentRisk: boolean;
  projectId: string;
  signatureUrl?: string; // Captura da assinatura manual
}

export interface RiskControl {
  risk: string;
  control: string; // EPC/Adm
  ppe: string[]; // EPIs
}

export interface Signature {
  role: string;
  name: string;
  date: string;
  signed: boolean;
}

export interface APR {
  id: string;
  taskName: string;
  location: string;
  description: string;
  date: string;
  status: APRStatus;
  risks: RiskControl[];
  teamSignatures: Signature[];
  approverSignature?: Signature;
  projectId?: string;
}

export interface User {
  name: string;
  role: 'TST' | 'Engenheiro' | 'Gestor' | 'Colaborador';
}

export interface Profile {
  id: string;
  email: string | null;
  subscription_status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'free';
  stripe_customer_id: string | null;
  price_id: string | null;
}