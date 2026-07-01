import { Grid, Typography, Box } from '@mui/material';
import BusinessCard from './BusinessCard';
import type { Business } from '@/types/business.types';

interface BusinessListProps {
  businesses: Business[];
  isLoading: boolean;
}

export default function BusinessList({ businesses, isLoading }: BusinessListProps) {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <Typography color="text.secondary" variant="h6">Loading local services...</Typography>
      </Box>
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
