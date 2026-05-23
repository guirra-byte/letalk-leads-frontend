'use client';

import { useState, useRef } from 'react';
import { Search, Building2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CNPJSearch } from './cnpj-search';
import { LeadDetailsModal } from './lead-details-modal';
import type { LeadAnalysis } from '@/lib/types';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchResult, setSearchResult] = useState<{
    data: LeadAnalysis;
    cnpj: string;
  } | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleResult = (data: LeadAnalysis, cnpj: string) => {
    setSearchResult({ data, cnpj });
    setShowDetails(true);
  };

  const handleDetailsClose = (open: boolean) => {
    setShowDetails(open);
    if (!open) {
      setSearchResult(null);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open && !showDetails} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Consultar CNPJ
            </DialogTitle>
            <DialogDescription>
              Pesquise uma empresa pelo CNPJ para visualizar informações e adicionar ao pipeline.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <CNPJSearch onResult={handleResult} />
          </div>
        </DialogContent>
      </Dialog>

      {searchResult && (
        <LeadDetailsModal
          open={showDetails}
          onOpenChange={handleDetailsClose}
          data={searchResult.data}
          cnpj={searchResult.cnpj}
        />
      )}
    </>
  );
}
