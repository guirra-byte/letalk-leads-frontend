'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  cnpjService,
  type CreateLeadInput,
} from '@/lib/services/cnpj-service';
import { queryKeys } from '@/lib/query-keys';
import type { Lead } from '@/lib/types';
import type { ApiError } from '@/lib/api/client';

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation<Lead, ApiError, CreateLeadInput>({
    mutationFn: (input) => cnpjService.createLeadFromLookup(input),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
    },
  });
}
