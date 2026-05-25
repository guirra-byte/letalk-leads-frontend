'use client';

import { useState } from 'react';
import { Building2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CNPJSearch, type LeadSearchResult } from './cnpj-search';
import { LeadDetailsModal } from './lead-details-modal';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchResult, setSearchResult] = useState<LeadSearchResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleResult = (result: LeadSearchResult) => {
    setSearchResult(result);
    setShowDetails(true);
  };

  const handleDetailsClose = (next: boolean) => {
    setShowDetails(next);
    if (!next) {
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
              Informe os dados comerciais e o CNPJ para enriquecer e adicionar ao pipeline.
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
          inputFields={searchResult.inputFields}
        />
      )}
    </>
  );
}
