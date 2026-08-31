import { ApiErrorResponse } from '@/lib/api-response';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type JsonBody = Record<string, unknown> | unknown[];
type ApiFetchBody = JsonBody | FormData | BodyInit;

export type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: ApiFetchBody;
};

function isPlainJsonBody(body: unknown): body is JsonBody {
  return (
    body !== null &&
    typeof body === 'object' &&
    !(body instanceof FormData) &&
    !(body instanceof Blob) &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof ArrayBuffer)
  );
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const url = path.startsWith('http') ? path : `${API_URL}${path}`;
  const finalHeaders = new Headers(headers);
  let finalBody: BodyInit | undefined;

  if (isPlainJsonBody(body)) {
    finalBody = JSON.stringify(body);
    if (!finalHeaders.has('Content-Type')) {
      finalHeaders.set('Content-Type', 'application/json');
    }
  } else {
    // FormData / Blob / URLSearchParams / string: let the browser set Content-Type (e.g. multipart boundary)
    finalBody = body as BodyInit | undefined;
  }

  // Server-side (Server Components/Actions/Route Handlers) fetch has no browser cookie jar,
  // so the visitor's cookies must be forwarded onto the outgoing request manually.
  if (typeof window === 'undefined' && !finalHeaders.has('Cookie')) {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();
      if (cookieHeader) finalHeaders.set('Cookie', cookieHeader);
    } catch {
      // Not in a request context (e.g. build time) — nothing to forward.
    }
  }

  const res = await fetch(url, {
    credentials: 'include',
    ...rest,
    headers: finalHeaders,
    body: finalBody,
  });

  if (!res.ok) {
    const errorPayload: Partial<ApiErrorResponse> = await res.json().catch(() => ({}));

    console.log('error:', errorPayload);

    throw new ApiError(res.status, errorPayload.message ?? res.statusText);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}
