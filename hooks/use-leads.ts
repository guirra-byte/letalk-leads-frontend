'use client';

import { useQuery } from '@tanstack/react-query';
import {
  cnpjService,
  type FetchLeadsFilters,
} from '@/lib/services/cnpj-service';
import { queryKeys } from '@/lib/query-keys';

export function useLeads(filters: FetchLeadsFilters = {}) {
  return useQuery({
    queryKey: queryKeys.leads.list(filters),
    queryFn: () => cnpjService.listLeads(filters),
  });
}
