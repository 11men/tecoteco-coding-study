import { useState, useEffect } from 'react';
import { strikesApi } from '../api/strikes';
import type { Strike } from '../types/strike';

export function useStrikes(activeOnly: boolean = true) {
  const [strikes, setStrikes] = useState<Strike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchStrikes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = activeOnly
          ? await strikesApi.getActiveStrikes()
          : await strikesApi.getAllStrikes();

        if (mounted) {
          setStrikes(response.strikes);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch strikes');
          console.error('Error fetching strikes:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchStrikes();

    return () => {
      mounted = false;
    };
  }, [activeOnly]);

  return { strikes, loading, error };
}
