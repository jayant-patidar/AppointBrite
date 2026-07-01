/**
 * RegisterPage — user registration page.
 */
import { useState } from 'react';
import { Box, Typography, Link as MuiLink, Tabs, Tab } from '@mui/material';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import RegisterStepper from '../components/RegisterStepper';

export default function RegisterPage() {
  const [portal, setPortal] = useState<'CUSTOMER' | 'BUSINESS'>('CUSTOMER');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'CUSTOMER' | 'BUSINESS') => {
    setPortal(newValue);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
      <Box sx={{ maxWidth: 480, width: '100%' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
          Create your account
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Join AppointBrite to book appointments, make reservations, or grow your business
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

        {/* Registration Form Stepper */}
        <RegisterStepper portal={portal} />

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
