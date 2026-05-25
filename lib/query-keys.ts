import type { FetchLeadsFilters } from '@/lib/services/cnpj-service';

export const queryKeys = {
  leads: {
    all: ['leads'] as const,
    list: (filters: FetchLeadsFilters = {}) =>
      ['leads', 'list', filters] as const,
  },
  cnpjLookup: (cnpj: string) => ['cnpj', 'lookup', cnpj] as const,
};
