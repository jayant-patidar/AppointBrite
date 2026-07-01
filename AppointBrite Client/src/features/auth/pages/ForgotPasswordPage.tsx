/**
 * ForgotPasswordPage — password recovery page.
 */
import { Box, Typography } from '@mui/material';

export default function ForgotPasswordPage() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
      <Box sx={{ maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
          Reset your password
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Enter your email and we'll send you a reset link
        </Typography>
        {/* TODO: Implement ForgotPasswordForm component */}
      </Box>
    </Box>
  );
}
