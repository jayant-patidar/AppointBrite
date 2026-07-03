import { useState } from 'react';
import { 
  Box, Typography, Paper, Stepper, Step, StepLabel, Button,
  TextField, MenuItem, Select, FormControl, InputLabel, CircularProgress, Alert
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import { useAuth } from '@/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/authSlice';
import { ROUTES } from '@/config/routes';
import { authApi } from '@/api/auth';

const categories = ['SALON', 'RESTAURANT', 'CLINIC', 'FITNESS', 'SPA', 'DENTAL', 'TUTORING', 'AUTO_SERVICE', 'HOME_SERVICE', 'EVENT_VENUE', 'CONSULTING'];

const defaultOperatingHours = [1, 2, 3, 4, 5].map((day) => ({
  dayOfWeek: day,
  openTime: '08:00',
  closeTime: '22:00',
  isClosed: false,
}));

const steps = ['Business Details', 'Location', 'Contact & Hours'];

export default function OnboardingWizardPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useAuth();
  const dispatch = useDispatch();

  const methods = useForm({
    defaultValues: {
      category: '',
      shortDescription: '',
      description: '',
      location: { address: '', city: '', state: '', zipCode: '', country: 'US' },
      contact: { businessPhone: '', website: '' },
    }
  });

  const { control, handleSubmit, getValues, setError: setFormError, clearErrors, formState: { errors } } = methods;

  const handleNext = async () => {
    let isValid = true;
    const values = getValues();
    clearErrors();
    
    if (activeStep === 0) {
      if (!values.category) {
        setFormError('category', { type: 'manual', message: 'Category is required' });
        isValid = false;
      }
    }
    
    if (activeStep === 1) {
      if (!values.location.address) {
        setFormError('location.address', { type: 'manual', message: 'Address is required' });
        isValid = false;
      }
      if (!values.location.city) {
        setFormError('location.city', { type: 'manual', message: 'City is required' });
        isValid = false;
      }
      if (!values.location.zipCode) {
        setFormError('location.zipCode', { type: 'manual', message: 'Zip code is required' });
        isValid = false;
      }
    }
    
    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = async (data: any) => {
    if (activeStep !== steps.length - 1) {
      handleNext();
      return;
    }

    if (!data.contact.businessPhone) {
      setFormError('contact.businessPhone', { type: 'manual', message: 'Phone number is required' });
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        ...data,
        operatingHours: defaultOperatingHours,
        onboardingStep: 4,
      };

      await axiosInstance.patch('/businesses/my-business/onboarding', payload);
      
      // Refresh user to get updated businessProfile
      const updatedUser = await authApi.me();
      dispatch(setUser(updatedUser));
      
      navigate(ROUTES.DASHBOARD.OVERVIEW, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update business profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 3 }}>
      <Paper sx={{ p: 5, width: '100%', maxWidth: 700, borderRadius: 4, boxShadow: (t) => t.shadows[10] }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }} gutterBottom align="center">
          Welcome to AppointBrite!
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Let's get your business set up so you can start taking bookings.
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          {activeStep === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Category">
                      {categories.map((c) => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
              <Controller
                name="shortDescription"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Short Tagline (e.g., Best Salon in NYC)" fullWidth error={!!errors.shortDescription} helperText={errors.shortDescription?.message} />
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Full Description" fullWidth multiline rows={4} error={!!errors.description} helperText={errors.description?.message} />
                )}
              />
            </Box>
          )}

          {activeStep === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Controller
                name="location.address"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Street Address" fullWidth error={!!errors.location?.address} helperText={errors.location?.address?.message} />
                )}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="location.city"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="City" fullWidth error={!!errors.location?.city} helperText={errors.location?.city?.message} />
                  )}
                />
                <Controller
                  name="location.state"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="State/Province" fullWidth error={!!errors.location?.state} helperText={errors.location?.state?.message} />
                  )}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="location.zipCode"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Zip Code" fullWidth error={!!errors.location?.zipCode} helperText={errors.location?.zipCode?.message} />
                  )}
                />
                <Controller
                  name="location.country"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Country" fullWidth error={!!errors.location?.country} helperText={errors.location?.country?.message} />
                  )}
                />
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Controller
                name="contact.businessPhone"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Business Phone Number" fullWidth error={!!errors.contact?.businessPhone} helperText={errors.contact?.businessPhone?.message} />
                )}
              />
              <Controller
                name="contact.website"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Website (Optional)" fullWidth error={!!errors.contact?.website} helperText={errors.contact?.website?.message} />
                )}
              />
              <Alert severity="info" sx={{ mt: 2 }}>
                Default operating hours have been set to 8:00 AM - 10:00 PM (Mon-Fri). You can customize these later in your dashboard settings.
              </Alert>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button disabled={activeStep === 0 || isSubmitting} onClick={handleBack} sx={{ borderRadius: 999, px: 3 }}>
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ borderRadius: 999, px: 4 }}>
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Complete Setup'}
              </Button>
            ) : (
              <Button type="button" onClick={handleNext} variant="contained" sx={{ borderRadius: 999, px: 4 }}>
                Next
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
