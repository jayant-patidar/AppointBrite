import { Typography, Container, Box } from '@mui/material';
import { useFavorites } from '@/hooks/useFavorites';
import BusinessList from '@/features/search/components/BusinessList';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function FavoritesPage() {
  const { favorites, isLoading } = useFavorites();

  return (
    <Container maxWidth="lg" sx={{ py: 6, minHeight: '80vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <FavoriteIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, m: 0 }}>
          Your Favorites
        </Typography>
      </Box>

      {!isLoading && favorites.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'background.paper', borderRadius: 4, border: '1px dashed', borderColor: 'divider' }}>
          <FavoriteIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            You haven't saved any favorites yet.
          </Typography>
        </Box>
      ) : (
        <BusinessList businesses={favorites} isLoading={isLoading} />
      )}
    </Container>
  );
}
