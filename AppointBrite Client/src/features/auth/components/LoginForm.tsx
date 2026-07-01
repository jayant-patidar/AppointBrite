import { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Alert, InputAdornment } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  portal?: 'CUSTOMER' | 'BUSINESS';
}

export default function LoginForm({ portal = 'CUSTOMER' }: LoginFormProps) {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema as any),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError('');
    setIsSubmitting(true);
    try {
      const response = await authApi.login({ 
        email: data.email, 
        password: data.password, 
        portal 
      });
      
      dispatch(setCredentials({ user: response.user, accessToken: response.accessToken }));
      
      if (response.user.role === 'BUSINESS_OWNER' || response.user.role === 'STAFF') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/search', { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {error && <Alert severity="error">{error}</Alert>}
      
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email Address"
            type="email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon color="action" />
                  </InputAdornment>
                ),
              }
            }}
          />
        )}
      />
      
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Password"
            type="password"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              }
            }}
          />
        )}
      />
      
      <Button 
        type="submit" 
        variant="contained" 
        size="large" 
        fullWidth 
        disabled={isSubmitting}
        sx={{ mt: 2, py: 1.5, fontSize: '1.1rem' }}
      >
        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
      </Button>
    </Box>
  );
}
