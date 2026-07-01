import { Box, Paper, Typography, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

interface StickyBookingWidgetProps {
  businessId: string;
  businessName: string;
}

export default function StickyBookingWidget({ businessId, businessName }: StickyBookingWidgetProps) {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        top: { md: 100 },
        bottom: { xs: 0, md: 'auto' },
        left: { xs: 0, md: 'auto' },
        right: { xs: 0, md: 'auto' },
        width: '100%',
        p: { xs: 2, md: 3 },
        borderRadius: { xs: '16px 16px 0 0', md: 4 },
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        zIndex: 1000,
        boxShadow: { xs: '0 -8px 24px rgba(0,0,0,0.1)', md: '0 8px 32px rgba(0,0,0,0.08)' },
      }}
    >
      <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          Ready to Book?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Secure your spot at {businessName} today.
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        startIcon={<EventAvailableIcon />}
        onClick={() => navigate(`/book/${businessId}`)}
        sx={{
          py: 1.5,
          borderRadius: 9999,
          fontWeight: 700,
          fontSize: '1rem',
          textTransform: 'none',
          boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
          '&:hover': {
            boxShadow: '0 12px 28px rgba(37, 99, 235, 0.4)',
            transform: 'translateY(-2px)'
          },
          transition: 'all 0.2s ease-in-out'
        }}
      >
        Book Appointment or Reservation
      </Button>
    </Paper>
  );
}
