'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cnpjService } from '@/lib/services/cnpj-service';
import { queryKeys } from '@/lib/query-keys';
import type { Lead, PipelineStatus } from '@/lib/types';
import type { ApiError } from '@/lib/api/client';

interface SwitchVariables {
  leadId: string;
  pipelineStatus: PipelineStatus;
}

interface SwitchContext {
  previousLeadsLists: [readonly unknown[], Lead[] | undefined][];
}

export function useSwitchLeadPipelineStatus() {
  const queryClient = useQueryClient();

  return useMutation<Lead, ApiError, SwitchVariables, SwitchContext>({
    mutationFn: ({ leadId, pipelineStatus }) =>
      cnpjService.switchPipelineStatus(leadId, pipelineStatus),
    onMutate: async ({ leadId, pipelineStatus }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.leads.all });

      const previousLeadsLists = queryClient.getQueriesData<Lead[]>({
        queryKey: queryKeys.leads.all,
      });

      previousLeadsLists.forEach(([key, data]) => {
        if (!data) return;
        queryClient.setQueryData<Lead[]>(
          key,
          data.map((lead) =>
            lead.id === leadId ? { ...lead, pipelineStatus } : lead
          )
        );
      });

      return { previousLeadsLists };
    },
    onError: (_error, _vars, context) => {
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
