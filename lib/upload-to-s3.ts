export type S3UploadErrorKind = 'network' | 'http' | 'abort';

export class S3UploadError extends Error {
  readonly kind: S3UploadErrorKind;
  readonly status?: number;
  readonly responseBody?: string;
  readonly cause?: unknown;

  constructor(
    message: string,
    kind: S3UploadErrorKind,
    options: {
      status?: number;
      responseBody?: string;
      cause?: unknown;
    } = {}
  ) {
    super(message);
    this.name = 'S3UploadError';
    this.kind = kind;
    this.status = options.status;
    this.responseBody = options.responseBody;
    this.cause = options.cause;
  }
}

export interface UploadToS3Options {
  url: string;
  file: File;
  contentType: string;
  signal?: AbortSignal;
  /** Indeterminado: 0 no início, 100 ao concluir. */
  onProgress?: (progress: number) => void;
}

export async function uploadToS3({
  url,
  file,
  contentType,
  signal,
  onProgress,
}: UploadToS3Options): Promise<void> {
  onProgress?.(0);

  let response: Response;

  try {
    response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: file,
      signal,
    });
  } catch (cause) {
    throw toUploadError(cause, url);
  }

  if (response.ok) {
    onProgress?.(100);
    return;
  }

  const responseBody = await response.text().catch(() => '');
  const s3Message = parseS3XmlError(responseBody);
  const suffix = s3Message ? ` — ${s3Message}` : '';

  throw fail('http', `Falha ao enviar arquivo para o S3 (HTTP ${response.status}${suffix})`, url, {
    status: response.status,
    responseBody: responseBody || undefined,
  });
}

export function isS3UploadError(error: unknown): error is S3UploadError {
  return error instanceof S3UploadError;
}

function toUploadError(cause: unknown, url: string): S3UploadError {
  if (cause instanceof DOMException && cause.name === 'AbortError') {
    return fail('abort', 'Upload cancelado', url, { cause });
  }

  const message =
    cause instanceof TypeError
      ? 'Erro de rede ao enviar arquivo para o S3. Verifique CORS, URL presigned e conectividade.'
      : cause instanceof Error
        ? `Erro de rede ao enviar arquivo para o S3: ${cause.message}`
        : 'Erro de rede ao enviar arquivo para o S3.';

  return fail('network', message, url, { cause });
}

function parseS3XmlError(body: string): string | null {
  const code = body.match(/<Code>([^<]+)<\/Code>/)?.[1];
  const message = body.match(/<Message>([^<]+)<\/Message>/)?.[1];

  if (code || message) {
    return [code, message].filter(Boolean).join(': ');
  }

  const trimmed = body.trim();
  return trimmed || null;
}

function redactPresignedUrl(url: string): string {
  try {
    const { origin, pathname } = new URL(url);
    return `${origin}${pathname}?[redacted]`;
  } catch {
    return '[invalid-url]';
  }
}

function fail(
  kind: S3UploadErrorKind,
  message: string,
  url: string,
  options: { status?: number; responseBody?: string; cause?: unknown } = {}
): S3UploadError {
  const error = new S3UploadError(message, kind, options);

  console.error('[uploadToS3]', {
    kind: error.kind,
    message: error.message,
    status: error.status,
    responseBody: error.responseBody,
    cause: error.cause,
    url: redactPresignedUrl(url),
  });

  return error;
}
