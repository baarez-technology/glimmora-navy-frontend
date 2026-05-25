import type { ApiEnvelope } from "./types";

let activeSignal: AbortSignal | undefined = undefined;

export function setActiveSignal(signal: AbortSignal | undefined) {
  activeSignal = signal;
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_BASE_URL || "ws://localhost:8000";

const ACCESS_TOKEN_KEY = "aegis-access-token";
const REFRESH_TOKEN_KEY = "aegis-refresh-token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(access: string, refresh?: string | null) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) window.localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  detail: unknown;
  constructor(status: number, message: string, detail?: unknown) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

export interface RequestOpts {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
  // Skip Authorization header (e.g. login endpoint).
  skipAuth?: boolean;
  // For endpoints whose response is NOT wrapped in GenericResponse (e.g. t2v).
  raw?: boolean;
}

function buildUrl(path: string, query?: RequestOpts["query"]): string {
  const url = new URL(path.startsWith("http") ? path : `${API_BASE_URL}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function rawFetch(path: string, opts: RequestOpts = {}): Promise<Response> {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";

  if (!opts.skipAuth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(buildUrl(path, opts.query), {
    method: opts.method ?? "GET",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal ?? activeSignal,
  });
}

export async function apiRequest<T>(path: string, opts: RequestOpts = {}): Promise<T> {
  const res = await rawFetch(path, opts);

  if (res.status === 401 && !opts.skipAuth) {
    clearTokens();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("aegis:unauthenticated"));
    }
  }

  if (!res.ok) {
    let detail: unknown = undefined;
    let message = `Request failed: ${res.status}`;
    try {
      const text = await res.text();
      if (text) {
        try {
          const json = JSON.parse(text);
          detail = json;
          message = json.detail || json.message || message;
        } catch {
          message = text;
        }
      }
    } catch {
      // ignore
    }
    throw new ApiError(res.status, message, detail);
  }

  if (opts.raw) {
    return (await res.json()) as T;
  }

  const envelope = (await res.json()) as ApiEnvelope<T>;
  if (!envelope.success) {
    throw new ApiError(res.status, envelope.message || "API error", envelope);
  }
  return envelope.data as T;
}

export const api = {
  get: <T,>(path: string, opts: Omit<RequestOpts, "method" | "body"> = {}) =>
    apiRequest<T>(path, { ...opts, method: "GET" }),
  post: <T,>(path: string, body?: unknown, opts: Omit<RequestOpts, "method" | "body"> = {}) =>
    apiRequest<T>(path, { ...opts, method: "POST", body }),
  put: <T,>(path: string, body?: unknown, opts: Omit<RequestOpts, "method" | "body"> = {}) =>
    apiRequest<T>(path, { ...opts, method: "PUT", body }),
  patch: <T,>(path: string, body?: unknown, opts: Omit<RequestOpts, "method" | "body"> = {}) =>
    apiRequest<T>(path, { ...opts, method: "PATCH", body }),
  del: <T,>(path: string, opts: Omit<RequestOpts, "method" | "body"> = {}) =>
    apiRequest<T>(path, { ...opts, method: "DELETE" }),
};
