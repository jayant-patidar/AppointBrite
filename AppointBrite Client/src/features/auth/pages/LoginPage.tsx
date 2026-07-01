/**
 * LoginPage — user authentication page.
 */
import { Box, Typography } from '@mui/material';

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
        {/* TODO: Implement LoginForm component */}
      </Box>
    </Box>
  );
}
