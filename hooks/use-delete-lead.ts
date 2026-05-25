'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cnpjService } from '@/lib/services/cnpj-service';
import { queryKeys } from '@/lib/query-keys';
import type { Lead } from '@/lib/types';
import type { ApiError } from '@/lib/api/client';

interface DeleteLeadContext {
  previousLeadsLists: [readonly unknown[], Lead[] | undefined][];
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string, DeleteLeadContext>({
    mutationFn: (leadId) => cnpjService.deleteLead(leadId),
    onMutate: async (leadId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.leads.all });

      const previousLeadsLists = queryClient.getQueriesData<Lead[]>({
        queryKey: queryKeys.leads.all,
      });

      previousLeadsLists.forEach(([key, data]) => {
        if (!data) return;
        queryClient.setQueryData<Lead[]>(
          key,
          data.filter((lead) => lead.id !== leadId)
        );
      });

      return { previousLeadsLists };
    },
    onError: (_error, _leadId, context) => {
      context?.previousLeadsLists.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: queryKeys.leads.all,
        refetchType: 'none',
      });
    },
  });
}
