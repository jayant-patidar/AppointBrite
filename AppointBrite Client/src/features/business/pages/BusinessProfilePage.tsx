/**
 * BusinessProfilePage — public business profile with services, reviews, and booking entry.
 */
import { Typography, Container } from '@mui/material';

export default function BusinessProfilePage() {
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        Business Profile
      </Typography>
      {/* TODO: Implement BusinessHeader, ServiceMenu, MediaGallery, ReviewList, OperatingHoursDisplay */}
    </Container>
  );
}
