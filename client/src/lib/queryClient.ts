import { QueryClient, QueryFunction } from "@tanstack/react-query";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").trim();

const normalizeBaseUrl = (baseUrl: string) =>
  baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

export const buildApiUrl = (path: string) => {
  if (!API_BASE_URL) return path;
  const base = normalizeBaseUrl(API_BASE_URL);

  if (path.startsWith("/api/") && base.endsWith("/api")) {
    return `${base}${path.slice(4)}`;
  }

  if (path.startsWith("/")) {
    return `${base}${path}`;
  }

  return `${base}/${path}`;
};

async function getErrorMessage(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  const rawText = await res.text();
  const trimmed = rawText.trim();

  if (contentType.includes("application/json")) {
    try {
      const data = JSON.parse(trimmed || "{}");
      if (typeof data === "string") return data;
      if (data?.error) return String(data.error);
      if (data?.message) return String(data.message);
    } catch {
      // Fall through to text handling
    }
  }

  if (!trimmed) return res.statusText || "Request failed";
  if (/<(html|!doctype)/i.test(trimmed)) {
    return res.statusText || "Request failed";
  }

  const collapsed = trimmed.replace(/\s+/g, " ");
  return collapsed.length > 200 ? `${collapsed.slice(0, 200)}…` : collapsed;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const message = await getErrorMessage(res);
    throw new Error(`${res.status}: ${message}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const sessionId = localStorage.getItem("sessionId");
  const headers: Record<string, string> = {};
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  if (sessionId) {
    headers["Authorization"] = `Bearer ${sessionId}`;
  }
  
  const res = await fetch(buildApiUrl(url), {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const sessionId = localStorage.getItem("sessionId");
    const headers: Record<string, string> = {};
    
    if (sessionId) {
      headers["Authorization"] = `Bearer ${sessionId}`;
    }
    
    const res = await fetch(buildApiUrl(queryKey.join("/") as string), {
      credentials: "include",
      headers,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
