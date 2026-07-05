/**
 * RegisterPage — user registration page.
 */
import { useState } from 'react';
import { Box, Typography, Link as MuiLink, Tabs, Tab } from '@mui/material';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import RegisterStepper from '../components/RegisterStepper';
import AuthLayout from '../components/AuthLayout';

import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function RegisterPage() {
  const [portal, setPortal] = useState<'CUSTOMER' | 'BUSINESS'>('CUSTOMER');
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'CUSTOMER' | 'BUSINESS') => {
    setPortal(newValue);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join AppointBrite to book appointments, make reservations, or grow your business."
    >
      <Tabs 
        value={portal} 
        onChange={handleTabChange} 
        variant="fullWidth" 
        sx={{ mb: 4, '& .MuiTab-root': { fontWeight: 600 } }}
      >
        <Tab label="Customer" value="CUSTOMER" />
        <Tab label="Business Owner" value="BUSINESS" />
      </Tabs>

      {/* Registration Form Stepper */}
      <RegisterStepper portal={portal} />

      <Box sx={{ mt: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <MuiLink component={Link} to={ROUTES.LOGIN} sx={{ fontWeight: 600, color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Sign in
          </MuiLink>
        </Typography>
        
        <MuiLink component={Link} to={ROUTES.HOME} sx={{ fontWeight: 600, color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
          Continue as guest &rarr;
        </MuiLink>
      </Box>
    </AuthLayout>
  );
}
