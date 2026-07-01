/**
 * CustomerDashboardPage — customer's overview page.
 */
import { Typography, Container } from '@mui/material';

export default function CustomerDashboardPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        My Dashboard
      </Typography>
      {/* TODO: Implement UpcomingBookingCard, quick re-book */}
    </Container>
  );
}
