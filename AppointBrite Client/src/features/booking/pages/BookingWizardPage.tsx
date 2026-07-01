/**
 * BookingWizardPage — step-by-step booking flow.
 */
import { Typography, Container } from '@mui/material';

export default function BookingWizardPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        Book Appointment or Reservation
      </Typography>
      {/* TODO: Implement ServiceSelector, StaffSelector, TimeSlotPicker, BookingSummary */}
    </Container>
  );
}
