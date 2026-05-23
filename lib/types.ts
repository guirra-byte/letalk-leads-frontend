export interface LeadAnalysis {
  company: {
    legalName: string;
    tradeName?: string;
    email?: string;
    foundedAt: string;
    capitalSocial: number;
    location: {
      zipCode: string;
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
    };
    primaryActivity: {
      code: string;
      description: string;
    };
    secondaryActivities: {
      code: string;
      description: string;
    }[];
    taxRegimes: {
      year: number;
      taxationType: string;
    }[];
    partners: {
      name: string;
      role: string;
      ageRange?: string;
      joinedAt: string;
    }[];
  };
  segment?: string;
  employeeRange?: string;
  contactRole?: string;
}

export type KanbanColumnId = 
  | 'PENDENTE'
  | 'EM_ANALISE'
  | 'PROSPECTAR'
  | 'CONTATADO'
  | 'QUALIFICADO'
  | 'REJEITADO';

export type Priority = 'baixa' | 'media' | 'alta';

export interface Lead {
  id: string;
  cnpj: string;
  data: LeadAnalysis;
  columnId: KanbanColumnId;
  priority: Priority;
  createdAt: string;
  notes?: string;
}

export interface KanbanColumn {
  id: KanbanColumnId;
  title: string;
  color: string;
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'PENDENTE', title: 'Pendente', color: '#F59E0B' },
  { id: 'EM_ANALISE', title: 'Em Análise', color: '#3B82F6' },
  { id: 'PROSPECTAR', title: 'Prospectar', color: '#8B5CF6' },
  { id: 'CONTATADO', title: 'Contatado', color: '#06B6D4' },
  { id: 'QUALIFICADO', title: 'Qualificado', color: '#22C55E' },
  { id: 'REJEITADO', title: 'Rejeitado', color: '#EF4444' },
];
