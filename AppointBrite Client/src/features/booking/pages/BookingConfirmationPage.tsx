/**
 * BookingConfirmationPage — success page after booking.
 */
import { Typography, Container, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

export default function BookingConfirmationPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 6, textAlign: 'center' }}>
      <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        Booking Confirmed!
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Your appointment or reservation has been successfully booked. You'll receive a confirmation email shortly.
      </Typography>
      {/* TODO: Implement ConfettiAnimation */}
      <Button variant="contained" size="large" onClick={() => navigate(ROUTES.CUSTOMER.BOOKINGS)}>
        View My Bookings & Reservations
      </Button>
    </Container>
  );
}
