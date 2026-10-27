import type { ApiResponse } from "@/lib/types/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/v1";
const CSRF_KEY = "thegrowthhealth_csrf";

export function getCsrfToken() {
  if (typeof window === "undefined") return null;

  const sessionToken = sessionStorage.getItem(CSRF_KEY);
  if (sessionToken) return sessionToken;

  const cookieToken = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("csrfToken="));

  if (!cookieToken) return null;
  return decodeURIComponent(cookieToken.slice("csrfToken=".length));
}

export function setCsrfToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    sessionStorage.setItem(CSRF_KEY, token);
    document.cookie = `csrfToken=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
  } else {
    sessionStorage.removeItem(CSRF_KEY);
    document.cookie = "csrfToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details: string[] = [],
    public payload: unknown = null,
  ) {
    super(message);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function parse<T>(res: Response): Promise<ApiResponse<T>> {
  const text = await res.text();
  let value: unknown;
  try {
    value = text ? JSON.parse(text) : null;
  } catch {
    throw new ApiError(
      res.status,
      "INVALID_RESPONSE",
      `API returned a non-JSON response (HTTP ${res.status}).`,
    );
  }
  if (!isRecord(value)) {
    throw new ApiError(
      res.status,
      "INVALID_RESPONSE",
      `API returned an unexpected response (HTTP ${res.status}).`,
    );
  }
  const error = isRecord(value.error) ? value.error : null;
  return {
    success: value.success === true,
    message: typeof value.message === "string" ? value.message : "",
    data: (value.data ?? null) as T | null,
    error: error
      ? {
          code: typeof error.code === "string" ? error.code : "ERROR",
          details: Array.isArray(error.details)
            ? error.details.filter((detail): detail is string => typeof detail === "string")
            : [],
        }
      : null,
  };
}

export async function apiFetch<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (method !== "GET" && method !== "HEAD") {
    const csrf = getCsrfToken();
    if (csrf) headers.set("X-CSRF-Token", csrf);
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      method,
      headers,
      credentials: "include",
    });
  } catch (error) {
    const cause = error instanceof Error ? `: ${error.message}` : "";
    throw new ApiError(0, "NETWORK_ERROR", `Unable to reach the API server${cause}`);
  }

  if (res.status === 401 && retry && path !== "/api/auth/refresh" && path !== "/api/auth/login") {
    let refreshed: Response;
    try {
      refreshed = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      const cause = error instanceof Error ? `: ${error.message}` : "";
      throw new ApiError(0, "NETWORK_ERROR", `Unable to reach the API server${cause}`);
    }
    if (refreshed.ok) {
      const body = await parse<{ csrfToken?: string }>(refreshed);
      if (!body.success || !body.data) {
        throw new ApiError(
          refreshed.status,
          body.error?.code ?? "INVALID_RESPONSE",
          body.message || `API returned an unexpected refresh response (HTTP ${refreshed.status}).`,
          body.error?.details ?? [],
          body.data,
        );
      }
      if (body.data?.csrfToken) setCsrfToken(body.data.csrfToken);
      return apiFetch<T>(path, init, false);
    }
  }

  const body = await parse<T>(res);
  if (body.data && typeof body.data === "object" && body.data && "csrfToken" in (body.data as object)) {
    const token = (body.data as { csrfToken?: string }).csrfToken;
    if (token) setCsrfToken(token);
  }
  if (!res.ok || !body.success) {
    throw new ApiError(
      res.status,
      body.error?.code ?? "ERROR",
      body.message || `API request failed (HTTP ${res.status})`,
      Array.isArray(body.error?.details) ? body.error.details : [],
      body.data,
    );
  }
  if (body.data === null) {
    throw new ApiError(
      res.status,
      "INVALID_RESPONSE",
      `API returned no data for a successful response (HTTP ${res.status}).`,
    );
  }
  return body.data as T;
}
