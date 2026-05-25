'use client';

import { Loader2, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { useDeleteLead } from '@/hooks/use-delete-lead';
import { formatCNPJ } from '@/lib/cnpj';
import { getLeadDisplayTitle } from '@/lib/lead-display';
import { cn } from '@/lib/utils';
import type { Lead } from '@/lib/types';

type LeadSummary = Pick<Lead, 'id' | 'tradeName' | 'legalName' | 'cnpj' | 'leadName' | 'companyName'>;

interface DeleteLeadConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: LeadSummary | null;
  onDeleted?: () => void;
}

export function DeleteLeadConfirmDialog({
  open,
  onOpenChange,
  lead,
  onDeleted,
}: DeleteLeadConfirmDialogProps) {
  const deleteLead = useDeleteLead();

  if (!lead) return null;

  const displayName = getLeadDisplayTitle(lead);

  const handleConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    deleteLead.mutate(lead.id, {
      onSuccess: () => {
        onOpenChange(false);
        onDeleted?.();
      },
    });
  };

  const handleOpenChange = (next: boolean) => {
    if (deleteLead.isPending) return;
    onOpenChange(next);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <AlertDialogTitle>Remover lead?</AlertDialogTitle>
              <AlertDialogDescription className="mt-2">
                Você está prestes a remover{' '}
                <span className="font-semibold text-foreground">
                  {displayName}
                </span>{' '}
                <span className="font-mono text-xs">
                  ({formatCNPJ(lead.cnpj)})
                </span>{' '}
                do pipeline. Esta ação é irreversível.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteLead.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteLead.isPending}
            className={cn(buttonVariants({ variant: 'destructive' }), 'gap-2')}
          >
            {deleteLead.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
