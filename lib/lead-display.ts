import type { Lead, LeadPreview } from '@/lib/types';

type LeadLike = Pick<Lead | LeadPreview, 'leadName' | 'tradeName' | 'legalName'>;

export function getLeadDisplayTitle(lead: LeadLike): string {
  return lead.leadName?.trim() || 'Lead sem nome';
}

export function getLeadDisplayCompany(lead: LeadLike): string | null {
  return lead.tradeName || lead.legalName || null;
}
