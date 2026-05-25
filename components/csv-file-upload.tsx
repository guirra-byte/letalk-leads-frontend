'use client';

import { useCallback, useRef, useState } from 'react';
import {
  FileSpreadsheet,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export type UploadVisualState = 'idle' | 'uploading' | 'uploaded' | 'disabled';

export interface CsvFileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
  error?: string | null;
  uploadProgress?: number;
  visualState?: UploadVisualState;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CsvFileUpload({
  file,
  onFileChange,
  disabled = false,
  error,
  uploadProgress = 0,
  visualState = 'idle',
}: CsvFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const isInteractionDisabled =
    disabled || visualState === 'disabled' || visualState === 'uploading';

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      onFileChange(files[0] ?? null);
    },
    [onFileChange]
  );

  const openFilePicker = useCallback(() => {
    if (isInteractionDisabled) return;
    inputRef.current?.click();
  }, [isInteractionDisabled]);

  const handleDragEnter = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (isInteractionDisabled) return;
      dragCounterRef.current += 1;
      setIsDragging(true);
    },
    [isInteractionDisabled]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragCounterRef.current = 0;
      setIsDragging(false);
      if (isInteractionDisabled) return;
      handleFiles(event.dataTransfer.files);
    },
    [isInteractionDisabled, handleFiles]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(event.target.files);
      event.target.value = '';
    },
    [handleFiles]
  );

  const handleRemove = useCallback(() => {
    onFileChange(null);
  }, [onFileChange]);

  const isUploading = visualState === 'uploading';
  const isUploaded = visualState === 'uploaded';

  return (
    <div className="min-w-0 space-y-3">
      {!file ? (
        <Empty
            role="button"
            tabIndex={isInteractionDisabled ? -1 : 0}
            onClick={openFilePicker}
            onKeyDown={(event) => {
              if (isInteractionDisabled) return;
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openFilePicker();
              }
            }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'cursor-pointer border-2 border-dashed bg-muted/20 py-8 transition-all duration-200',
              isInteractionDisabled && 'cursor-not-allowed opacity-60',
              !isInteractionDisabled && 'hover:border-primary/40 hover:bg-muted/40',
              isDragging
                ? 'border-primary bg-primary/5 ring-2 ring-primary/30'
                : 'border-border/70'
            )}
          >
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                className="size-14 rounded-full bg-gradient-to-b from-primary/15 to-primary/5 text-primary [&_svg]:size-7"
              >
                <Upload />
              </EmptyMedia>
              <EmptyTitle>Solte seu arquivo aqui</EmptyTitle>
              <EmptyDescription>
                ou clique para selecionar da sua máquina
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge variant="outline">.csv</Badge>
                <Badge variant="outline">máx. 1 arquivo</Badge>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-1"
                disabled={isInteractionDisabled}
                onClick={(event) => {
                  event.stopPropagation();
                  openFilePicker();
                }}
              >
                Selecionar arquivo
              </Button>
            </EmptyContent>
          </Empty>
      ) : (
        <div
          className={cn(
            'relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200',
            isUploaded && 'border-emerald-500/40 ring-1 ring-emerald-500/20',
            isUploading && 'border-primary/40'
          )}
        >
          <div className="flex items-center gap-3 px-4 py-4">
            <div
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg',
                isUploaded
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-primary/10 text-primary'
              )}
            >
              {isUploaded ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <FileSpreadsheet className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  CSV
                </Badge>
                {isUploaded && (
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 text-[10px] text-emerald-700 dark:text-emerald-400"
                  >
                    Pronto para importar
                  </Badge>
                )}
              </div>
            </div>

            {!isInteractionDisabled && !isUploaded && (
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={openFilePicker}
                >
                  <RefreshCw className="mr-1 h-3.5 w-3.5" />
                  Trocar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
                  onClick={handleRemove}
                >
                  Remover
                </Button>
              </div>
            )}
          </div>

          {isUploading && (
            <div className="border-t border-border/60 bg-muted/20 px-4 py-3">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Enviando arquivo...</span>
                <span className="tabular-nums font-medium text-foreground">
                  {uploadProgress}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-1.5" />
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        disabled={isInteractionDisabled}
        onChange={handleInputChange}
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Arquivo inválido</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
