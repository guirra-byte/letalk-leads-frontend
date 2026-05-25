import axios, { AxiosError, type AxiosInstance } from 'axios';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export interface ApiErrorBody {
  message: string;
  source?: string;
  issues?: { path: string; message: string; code: string }[];
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly body: ApiErrorBody;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message || `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response) {
      const body: ApiErrorBody =
        error.response.data ??
        ({ message: error.message } as ApiErrorBody);
      return Promise.reject(new ApiError(error.response.status, body));
    }

    return Promise.reject(
      new ApiError(0, {
        message: error.message || 'Network error: API is unreachable',
      })
    );
  }
);
