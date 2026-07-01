/**
 * useSearchBusinesses — query hook for searching businesses.
 */
import { useQuery } from '@tanstack/react-query';
import { businessesApi } from '@/api/endpoints/businesses.api';
import { useDebounce } from '@/hooks/useDebounce';

interface UseSearchBusinessesParams {
  query: string;
  lat?: number;
  lng?: number;
  category?: string;
}

export function useSearchBusinesses({ query, lat, lng, category }: UseSearchBusinessesParams) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ['businesses', 'search', debouncedQuery, lat, lng, category],
    queryFn: () =>
      businessesApi.search({
        q: debouncedQuery,
        lat,
        lng,
        category,
      }),
    enabled: debouncedQuery.length > 0 || !!category || (!!lat && !!lng),
  });
}
