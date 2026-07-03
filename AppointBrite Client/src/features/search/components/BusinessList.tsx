import { Grid, Typography, Box, Skeleton } from '@mui/material';
import BusinessCard from './BusinessCard';
import type { Business } from '@/types/business.types';

interface BusinessListProps {
  businesses: Business[];
  isLoading: boolean;
}

export default function BusinessList({ businesses, isLoading }: BusinessListProps) {
  if (isLoading) {
    return (
      <Grid container spacing={4}>
        {Array.from(new Array(6)).map((_, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 4, height: 380 }}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
              <Skeleton variant="text" height={32} width="80%" sx={{ mb: 1 }} />
              <Skeleton variant="text" height={20} width="60%" sx={{ mb: 2 }} />
              <Skeleton variant="text" height={20} width="40%" />
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!businesses || businesses.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, px: 2, textAlign: 'center' }}>
        <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }} gutterBottom>
          No businesses found
        </Typography>
        <Typography color="text.secondary">
          Try adjusting your search criteria or explore other categories.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={4}>
      {businesses.map((business) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={business._id}>
          <BusinessCard business={business} />
        </Grid>
      ))}
    </Grid>
  );
}
