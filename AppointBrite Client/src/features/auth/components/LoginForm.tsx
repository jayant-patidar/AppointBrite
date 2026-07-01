import { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import type { User } from '@/types/user.types';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const MOCK_USER: User = {
  _id: 'mock-user-001',
  email: 'jane.doe@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
  phoneNumber: '+1 (555) 123-4567',
  role: 'CUSTOMER',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const MOCK_TOKEN = 'mock-jwt-token-abc123';

export default function LoginForm() {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema as any),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (_data: LoginFormValues) => {
    setError('');
    setIsSubmitting(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock Login Process
      // For now, regardless of input, we log in the mock user
      // Optionally we could verify email matches something, but keeping current mock flow
      dispatch(setCredentials({ user: MOCK_USER, accessToken: MOCK_TOKEN }));
      
      // Navigate to home or dashboard
      navigate('/');
    } catch (err: any) {
      setError('An error occurred during login.');
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
          />
        )}
      />
      
      <Button 
        type="submit" 
        variant="contained" 
        size="large" 
        fullWidth 
        disabled={isSubmitting}
        sx={{ mt: 2 }}
      >
        {isSubmitting ? <CircularProgress size={24} /> : 'Sign In'}
      </Button>
    </Box>
  );
}
