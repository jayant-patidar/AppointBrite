import { Typography, Container } from '@mui/material';
export default function MyBookingsPage() {
  return (<Container maxWidth="lg" sx={{ py: 3 }}><Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>My Bookings</Typography>{/* TODO: Implement booking list with tabs (upcoming, past, canceled) */}</Container>);
}
