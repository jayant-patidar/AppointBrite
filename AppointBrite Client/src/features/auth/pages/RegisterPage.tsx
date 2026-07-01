/**
 * RegisterPage — user registration page.
 */
import { Box, Typography } from '@mui/material';

export default function RegisterPage() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
      <Box sx={{ maxWidth: 480, width: '100%' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
          Create your account
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Join AppointBrite as a customer or business owner
        </Typography>
        {/* TODO: Implement RegisterForm component */}
      </Box>
    </Box>
  );
}
