'use client';

import { useEffect, useMemo } from 'react';
import {
  FileSpreadsheet,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Upload,
  Play,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CsvFormatGuide } from '@/components/csv-format-guide';
import {
  CsvFileUpload,
  type UploadVisualState,
} from '@/components/csv-file-upload';
import { useBatchImportWorkflow } from '@/hooks/use-batch-import-workflow';
import type { BatchImportWorkflowStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface BatchImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = [
  { id: 1, label: 'Selecionar' },
  { id: 2, label: 'Enviar' },
  { id: 3, label: 'Importar' },
] as const;

function resolveActiveStep(status: BatchImportWorkflowStatus): number {
  switch (status) {
    case 'idle':
      return 1;
    case 'selected':
    case 'error':
      return 2;
    case 'uploading':
      return 2;
    case 'uploaded':
    case 'triggering':
    case 'aborting':
    case 'done':
      return 3;
    default:
      return 1;
  }
}

function resolveVisualState(
  status: BatchImportWorkflowStatus,
  isBusy: boolean
): UploadVisualState {
  if (status === 'uploading') return 'uploading';
  if (status === 'uploaded') return 'uploaded';
  if (isBusy && status !== 'selected' && status !== 'error') return 'disabled';
  return 'idle';
}

function ImportStepper({ activeStep }: { activeStep: number }) {
  return (
    <ol className="flex w-full min-w-0 items-center gap-2">
      {STEPS.map((step, index) => {
        const isActive = step.id === activeStep;
        const isCompleted = step.id < activeStep;

        return (
          <li key={step.id} className="flex min-w-0 flex-1 items-center gap-2">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                  isCompleted && 'bg-primary text-primary-foreground',
                  isActive &&
                    !isCompleted &&
                    'bg-primary/15 text-primary ring-2 ring-primary/30',
                  !isActive &&
                    !isCompleted &&
                    'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={cn(
                  'max-w-full truncate text-[11px] font-medium',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  'mb-5 h-px min-w-4 flex-1',
                  step.id < activeStep ? 'bg-primary/50' : 'bg-border'
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function BatchImportDialog({
  open,
  onOpenChange,
}: BatchImportDialogProps) {
  const {
    status,
    file,
    uploadProgress,
    errorMessage,
    validationError,
    selectFile,
    upload,
    triggerImport,
    abort,
    abortIfPending,
    reset,
    isUploading,
    isTriggering,
    isAborting,
  } = useBatchImportWorkflow();

  useEffect(() => {
    if (status === 'done') {
      onOpenChange(false);
      reset();
    }
  }, [status, onOpenChange, reset]);

  const handleOpenChange = async (nextOpen: boolean) => {
    if (!nextOpen) {
      await abortIfPending();
    }
    onOpenChange(nextOpen);
  };

  const isBusy =
    isUploading || isTriggering || isAborting || status === 'uploading';

  const activeStep = useMemo(() => resolveActiveStep(status), [status]);
  const visualState = useMemo(
    () => resolveVisualState(status, isBusy),
    [status, isBusy]
  );

  const showUploadButton = status === 'selected' || status === 'error';
  const showPostUploadActions = status === 'uploaded';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-full max-w-lg flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2 pr-8">
            <FileSpreadsheet className="h-5 w-5 shrink-0" />
            Importar CSV
          </DialogTitle>
          <DialogDescription>
            Selecione um arquivo CSV e envie para importar leads em lote.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-0 flex-1 px-6">
          <div className="min-w-0 space-y-4 pb-4">
            <CsvFormatGuide />
            <ImportStepper activeStep={activeStep} />

            <CsvFileUpload
              file={file}
              onFileChange={selectFile}
              disabled={isBusy || status === 'uploaded'}
              error={validationError}
              uploadProgress={uploadProgress}
              visualState={visualState}
            />

            {status === 'uploaded' && (
              <Alert className="border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-100">
                <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" />
                <AlertTitle className="text-emerald-900 dark:text-emerald-100">
                  Upload concluído
                </AlertTitle>
                <AlertDescription className="text-emerald-800/90 dark:text-emerald-200/90">
                  Arquivo enviado com sucesso. Deseja iniciar a importação?
                </AlertDescription>
              </Alert>
            )}

            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Falha na operação</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </div>
        </ScrollArea>

        <div className="shrink-0 border-t px-6 py-4">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {showPostUploadActions && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={abort}
                  disabled={isTriggering || isAborting}
                  className="gap-2"
                >
                  {isAborting && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={triggerImport}
                  disabled={isTriggering || isAborting}
                  className="gap-2"
                >
                  {isTriggering ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  Iniciar importação
                </Button>
              </>
            )}

            {showUploadButton && (
              <Button
                type="button"
                onClick={upload}
                disabled={!file || isBusy}
                className="gap-2 sm:ml-auto"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Enviar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
