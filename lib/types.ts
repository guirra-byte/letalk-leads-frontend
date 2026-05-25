export type PipelineStatus =
  | 'PENDING'
  | 'IN_REVIEW'
  | 'QUALIFIED'
  | 'REJECTED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export type CnaeType = 'PRIMARY' | 'SECONDARY';

export interface PartnerDTO {
  id: string;
  name: string;
  role: string;
  cnpjOrCpf: string;
  ageRange: string | null;
  joinedAt: string;
  companyProfileId: string;
}

export interface CnaeDTO {
  id: string;
  code: string;
  description: string;
  type: CnaeType;
  companyProfileId: string;
}

export interface TaxRegimeDTO {
  id: string;
  year: number;
  taxationType: string;
  companyProfileId: string;
}

export interface LeadInputFields {
  leadName?: string | null;
  leadEmail?: string | null;
  leadPhoneNumber?: string | null;
  companyName?: string | null;
}

export interface Lead extends LeadInputFields {
  id: string;
  cnpj: string;
  pipelineStatus: PipelineStatus;
  priority: Priority;

  legalName: string;
  tradeName: string | null;
  email: string | null;

  capitalSocial: number;
  foundedAt: string;
  primaryActivity: string;

  zipCode: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;

  partners: PartnerDTO[];
  cnaes: CnaeDTO[];
  taxRegimes: TaxRegimeDTO[];

  createdAt: string;
  updatedAt: string;
}

export interface CnaePreview {
  code: string;
  description: string;
}

export interface PartnerPreview {
  name: string;
  role: string;
  cnpjOrCpf: string;
  ageRange?: string;
  joinedAt: string;
}

export interface TaxRegimePreview {
  year: number;
  taxationType: string;
}

export interface LeadPreview extends LeadInputFields {
  cnpj: string;
  legalName?: string;
  tradeName?: string;
  email?: string;
  capitalSocial?: number;
  foundedAt?: string;
  location?: {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  primaryActivity?: CnaePreview;
  secondaryActivities?: CnaePreview[];
  partners?: PartnerPreview[];
  taxRegimes?: TaxRegimePreview[];
}

export interface KanbanColumnConfig {
  id: PipelineStatus;
  title: string;
  color: string;
}

export const KANBAN_COLUMNS: KanbanColumnConfig[] = [
  { id: 'PENDING', title: 'Pendente', color: '#F59E0B' },
  { id: 'IN_REVIEW', title: 'Em Análise', color: '#3B82F6' },
  { id: 'QUALIFIED', title: 'Qualificado', color: '#22C55E' },
  { id: 'REJECTED', title: 'Rejeitado', color: '#EF4444' },
];

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
};

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'LOW', label: 'Baixa' },
  { value: 'MEDIUM', label: 'Média' },
  { value: 'HIGH', label: 'Alta' },
];

export interface PresignedUploadUrlResponse {
  uploadPresignedUrl: string;
  batchImportId: string;
}

export interface RequestPresignedUploadUrlInput {
  fileName: string;
  mimetype: string;
}

export interface TriggerBatchImportResponse {
  message: string;
}

export type BatchImportWorkflowStatus =
  | 'idle'
  | 'selected'
  | 'uploading'
  | 'uploaded'
  | 'triggering'
  | 'aborting'
  | 'done'
  | 'error';
