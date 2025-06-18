import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { authService } from "./auth";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const headers: Record<string, string> = {};
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Always include cookies for HttpOnly JWT
  });

  // If we get a 401 with TOKEN_EXPIRED, try to refresh
  if (res.status === 401) {
    try {
      const errorData = await res.clone().json();
      if (errorData.code === 'TOKEN_EXPIRED') {
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include'
        });
        
        if (refreshResponse.ok) {
          // Retry the original request
          const retryRes = await fetch(url, {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined,
            credentials: "include",
          });
          await throwIfResNotOk(retryRes);
          return retryRes;
        }
      }
    } catch (refreshError) {
      // If refresh fails, continue with original error
      console.log('Token refresh failed:', refreshError);
    }
  }

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include", // Always include cookies for HttpOnly JWT
    });

    // Handle token refresh for queries
    if (res.status === 401) {
      try {
        const errorData = await res.clone().json();
        if (errorData.code === 'TOKEN_EXPIRED') {
          const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include'
          });
          
          if (refreshResponse.ok) {
            // Retry the original request
            const retryRes = await fetch(queryKey[0] as string, {
              credentials: "include",
            });
            
            if (unauthorizedBehavior === "returnNull" && retryRes.status === 401) {
              return null;
            }
            
            await throwIfResNotOk(retryRes);
            return await retryRes.json();
          }
        }
      } catch (refreshError) {
        console.log('Token refresh failed in query:', refreshError);
      }
      
      if (unauthorizedBehavior === "returnNull") {
        return null;
      }
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
