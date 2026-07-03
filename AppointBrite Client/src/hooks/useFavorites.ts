import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/endpoints/users.api';
import { useAuth } from './useAuth';

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favoritesRes, isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: usersApi.getFavorites,
    enabled: !!user,
  });

  const favorites = favoritesRes?.data || [];
  const favoriteIds = new Set(favorites.map(f => typeof f === 'string' ? f : f._id));

  const addFavoriteMutation = useMutation({
    mutationFn: (businessId: string) => usersApi.addFavorite(businessId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (businessId: string) => usersApi.removeFavorite(businessId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const toggleFavorite = (businessId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!user) return; // Optional: could show login prompt
    
    if (favoriteIds.has(businessId)) {
      removeFavoriteMutation.mutate(businessId);
    } else {
      addFavoriteMutation.mutate(businessId);
    }
  };

  return {
    favorites,
    favoriteIds,
    isLoading,
    toggleFavorite,
    isMutating: addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
  };
}
