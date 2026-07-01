/**
 * RegisterPage — user registration page.
 */
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import RegisterStepper from '../components/RegisterStepper';

export default function RegisterPage() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
      <Box sx={{ maxWidth: 480, width: '100%' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
          Create your account
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Join AppointBrite to book appointments, make reservations, or grow your business
        </Typography>
        {/* Registration Form Stepper */}
        <RegisterStepper />

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <MuiLink component={Link} to={ROUTES.LOGIN} sx={{ fontWeight: 600 }}>
              Sign in
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
