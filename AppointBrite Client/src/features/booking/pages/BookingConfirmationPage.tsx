import { useEffect } from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ROUTES } from '@/config/routes';

export default function BookingConfirmationPage() {
  const { bookingId } = useParams();

  useEffect(() => {
    // Fire confetti on load
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#2563EB', '#60A5FA', '#3B82F6', '#93C5FD', '#FFFFFF']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#2563EB', '#60A5FA', '#3B82F6', '#93C5FD', '#FFFFFF']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
      >
        <CheckCircleIcon color="success" sx={{ fontSize: 100, mb: 2 }} />
      </motion.div>

      <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
        Booking Confirmed!
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
        Your reservation has been successfully placed. We've sent a confirmation email with all the details.
      </Typography>

      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          bgcolor: 'success.50', 
          border: '1px solid', 
          borderColor: 'success.200', 
          borderRadius: 4,
          mb: 6
        }}
      >
        <Typography variant="caption" color="success.dark" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
          Booking Reference
        </Typography>
        <Typography variant="h6" color="success.dark" sx={{ fontFamily: 'monospace', letterSpacing: 2 }}>
          {bookingId?.slice(-8).toUpperCase()}
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button 
          variant="outlined" 
          component={Link}
          to={ROUTES.SEARCH}
          sx={{ borderRadius: 9999, px: 4, py: 1.5, fontWeight: 700 }}
        >
          Explore More
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          component={Link}
          to={ROUTES.CUSTOMER.BOOKINGS}
          sx={{ borderRadius: 9999, px: 4, py: 1.5, fontWeight: 700, boxShadow: '0 8px 20px rgba(37,99,235,0.3)' }}
        >
          View My Bookings
        </Button>
      </Box>
    </Container>
  );
}
