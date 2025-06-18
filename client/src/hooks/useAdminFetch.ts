import { useState, useEffect } from 'react';

export function useAdminFetch<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const url = `${apiUrl}${endpoint}`;
        
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (e: any) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Admin fetch error:', e);
        }
        setError(e.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  const refetch = () => {
    setLoading(true);
    setError(null);
    // Re-trigger useEffect
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const url = `${apiUrl}${endpoint}`;
        
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (e: any) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Admin fetch error:', e);
        }
        setError(e.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };

  return { data, loading, error, refetch };
}

export async function adminMutate(endpoint: string, method: 'POST' | 'PUT' | 'DELETE' = 'POST', body?: any) {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const url = `${apiUrl}${endpoint}`;
    
    const response = await fetch(url, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return method === 'DELETE' ? null : await response.json();
  } catch (e: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Admin mutation error:', e);
    }
    throw new Error(e.message || 'Erreur de mutation');
  }
}