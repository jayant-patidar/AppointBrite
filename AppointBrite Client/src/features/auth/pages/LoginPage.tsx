/**
 * LoginPage — user authentication page.
 */
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
      <Box sx={{ maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
          Welcome back
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Sign in to your AppointBrite account
        </Typography>

        <LoginForm />
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <MuiLink component={Link} to={ROUTES.REGISTER} sx={{ fontWeight: 600 }}>
              Sign up
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
