/**
 * LoginPage — user authentication page.
 */
import { useState } from 'react';
import { Box, Typography, Link as MuiLink, Tabs, Tab } from '@mui/material';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const [portal, setPortal] = useState<'CUSTOMER' | 'BUSINESS'>('CUSTOMER');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'CUSTOMER' | 'BUSINESS') => {
    setPortal(newValue);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
      <Box sx={{ maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
          Welcome back
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Sign in to your AppointBrite account
        </Typography>

        <Tabs 
          value={portal} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          sx={{ mb: 4 }}
        >
          <Tab label="Customer" value="CUSTOMER" />
          <Tab label="Business Owner" value="BUSINESS" />
        </Tabs>

        <LoginForm portal={portal} />
        
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
