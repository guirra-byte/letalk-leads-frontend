import type { AxiosInstance } from 'axios';
import { apiClient, ApiError } from '@/lib/api/client';
import type {
  Lead,
  LeadInputFields,
  LeadPreview,
  PipelineStatus,
  PresignedUploadUrlResponse,
  Priority,
  RequestPresignedUploadUrlInput,
  TriggerBatchImportResponse,
} from '@/lib/types';

export interface FetchLeadsFilters {
  pipelineStatus?: PipelineStatus;
  priority?: Priority;
  search?: string;
}

export interface CnpjLookupInput extends LeadInputFields {
  cnpj: string;
}

export interface CreateLeadInput extends LeadInputFields {
  cnpj: string;
  pipelineStatus: PipelineStatus;
  priority: Priority;
}

export class CnpjService {
  constructor(private readonly http: AxiosInstance = apiClient) {}

  async lookup(input: CnpjLookupInput): Promise<LeadPreview> {
    const { data } = await this.http.post<LeadPreview>('/cnpj/lookup', input);
    return data;
  }

  async listLeads(filters: FetchLeadsFilters = {}): Promise<Lead[]> {
    const params: Record<string, string> = {};
    if (filters.pipelineStatus) params.pipelineStatus = filters.pipelineStatus;
    if (filters.priority) params.priority = filters.priority;
    if (filters.search) params.search = filters.search;

    const { data } = await this.http.get<Lead[]>('/cnpj/leads', { params });
    return data;
  }

  async createLeadFromLookup(input: CreateLeadInput): Promise<Lead> {
    const { data } = await this.http.post<Lead>('/cnpj/leads', input);
    return data;
  }

  async deleteLead(leadId: string): Promise<void> {
    await this.http.delete<void>(`/cnpj/leads/${leadId}`);
  }

  async switchPipelineStatus(
    leadId: string,
    pipelineStatus: PipelineStatus
  ): Promise<Lead> {
    const { data } = await this.http.patch<Lead>(
      `/cnpj/leads/${leadId}/pipeline-status`,
      { pipelineStatus }
    );

    return data;
  }

  async requestPresignedUploadUrl(
    input: RequestPresignedUploadUrlInput
  ): Promise<PresignedUploadUrlResponse> {
    const { data } = await this.http.post<PresignedUploadUrlResponse>(
      '/cnpj/batch-imports/presigned-upload-url',
      input
    );

    return data;
  }

  async triggerBatchImport(
    batchImportId: string
  ): Promise<TriggerBatchImportResponse> {
    const { data } = await this.http.post<TriggerBatchImportResponse>(
      '/cnpj/trigger-batch-import',
      { batchImportId }
    );

    return data;
  }

  async abortBatchImport(batchImportId: string): Promise<void> {
    try {
      await this.http.delete<void>(`/cnpj/batch-imports/${batchImportId}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return;
      }
      throw error;
    }
  }
}

export const cnpjService = new CnpjService();
