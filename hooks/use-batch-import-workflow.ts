'use client';

import { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cnpjService } from '@/lib/services/cnpj-service';
import { uploadToS3, isS3UploadError } from '@/lib/upload-to-s3';
import { queryKeys } from '@/lib/query-keys';
import type { BatchImportWorkflowStatus } from '@/lib/types';
import type { ApiError } from '@/lib/api/client';

const CSV_EXTENSION = '.csv';
const CSV_MIME_TYPES = new Set(['text/csv', 'application/vnd.ms-excel', '']);

function isCsvFile(file: File): boolean {
  const hasCsvExtension = file.name.toLowerCase().endsWith(CSV_EXTENSION);
  const hasValidMime =
    CSV_MIME_TYPES.has(file.type) || file.type.endsWith('csv');

  return hasCsvExtension && hasValidMime;
}

export function useBatchImportWorkflow() {
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<BatchImportWorkflowStatus>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [batchImportId, setBatchImportId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setFile(null);
    setBatchImportId(null);
    setUploadProgress(0);
    setErrorMessage(null);
    setValidationError(null);
  }, []);

  const selectFile = useCallback((nextFile: File | null) => {
    setErrorMessage(null);
    setValidationError(null);

    if (!nextFile) {
      setFile(null);
      setStatus('idle');
      return;
    }

    if (!isCsvFile(nextFile)) {
      setValidationError('Apenas arquivos .csv são permitidos.');
      return;
    }

    setFile(nextFile);
    setStatus('selected');
  }, []);

  const uploadMutation = useMutation({
    mutationFn: async (selectedFile: File) => {
      const mimetype = selectedFile.type || 'text/csv';
      const { uploadPresignedUrl, batchImportId: id } =
        await cnpjService.requestPresignedUploadUrl({
          fileName: selectedFile.name,
          mimetype,
        });

      setBatchImportId(id);

      await uploadToS3({
        url: uploadPresignedUrl,
        file: selectedFile,
        contentType: mimetype,
        onProgress: setUploadProgress,
      });

      return id;
    },
    onMutate: () => {
      setStatus('uploading');
      setUploadProgress(0);
      setErrorMessage(null);
    },
    onSuccess: (id) => {
      setBatchImportId(id);
      setStatus('uploaded');
      setUploadProgress(100);
    },
    onError: (error: ApiError | Error) => {
      setStatus('error');

      if (isS3UploadError(error)) {
        console.error('[batch-import] upload failed', {
          kind: error.kind,
          status: error.status,
          responseBody: error.responseBody,
        });
      }

      setErrorMessage(error.message || 'Erro ao enviar arquivo. Tente novamente.');
    },
  });

  const triggerMutation = useMutation({
    mutationFn: (id: string) => cnpjService.triggerBatchImport(id),
    onMutate: () => {
      setStatus('triggering');
      setErrorMessage(null);
    },
    onSuccess: async () => {
      setStatus('done');
      await queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
    },
    onError: (error: ApiError | Error) => {
      setStatus('error');
      setErrorMessage(
        error.message || 'Erro ao iniciar importação. Tente novamente.'
      );
    },
  });

  const abortMutation = useMutation({
    mutationFn: (id: string) => cnpjService.abortBatchImport(id),
    onMutate: () => {
      setStatus('aborting');
      setErrorMessage(null);
    },
    onSuccess: () => {
      reset();
    },
    onError: (error: ApiError | Error) => {
      setStatus('error');
      setErrorMessage(error.message || 'Erro ao cancelar importação.');
    },
  });

  const upload = useCallback(() => {
    if (!file) return;
    uploadMutation.mutate(file);
  }, [file, uploadMutation]);

  const triggerImport = useCallback(() => {
    if (!batchImportId) return;
    triggerMutation.mutate(batchImportId);
  }, [batchImportId, triggerMutation]);

  const abort = useCallback(() => {
    if (!batchImportId) {
      reset();
      return;
    }
    abortMutation.mutate(batchImportId);
  }, [batchImportId, abortMutation, reset]);

  const abortIfPending = useCallback(async () => {
    const shouldAbort =
      batchImportId &&
      (status === 'uploaded' || status === 'uploading' || status === 'error');

    if (shouldAbort) {
      try {
        await cnpjService.abortBatchImport(batchImportId);
      } catch {
        // Best-effort cleanup when closing dialog
      }
    }
    reset();
  }, [status, batchImportId, reset]);

  return {
    status,
    file,
    batchImportId,
    uploadProgress,
    errorMessage,
    validationError,
    selectFile,
    upload,
    triggerImport,
    abort,
    abortIfPending,
    reset,
    isUploading: uploadMutation.isPending,
    isTriggering: triggerMutation.isPending,
    isAborting: abortMutation.isPending,
  };
}
