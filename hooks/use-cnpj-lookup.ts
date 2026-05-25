'use client';

import { useMutation } from '@tanstack/react-query';
import {
  cnpjService,
  type CnpjLookupInput,
} from '@/lib/services/cnpj-service';
import type { LeadPreview } from '@/lib/types';
import type { ApiError } from '@/lib/api/client';

export function useCnpjLookup() {
  return useMutation<LeadPreview, ApiError, CnpjLookupInput>({
    mutationFn: (input) => cnpjService.lookup(input),
  });
}
