import { useState } from 'react';
import { 
  Box, Stepper, Step, StepLabel, Button, Typography, 
  TextField, RadioGroup, FormControlLabel, Radio, 
  FormControl, FormLabel, Checkbox, Select, MenuItem, InputLabel,
  Paper, CircularProgress, Alert
} from '@mui/material';
import { useForm, Controller, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/endpoints/auth.api';
import { ROUTES } from '@/config/routes';

const registerSchema = z.object({
  role: z.enum(['CUSTOMER', 'BUSINESS_OWNER']),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY', '']).optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  preferences: z.object({
    marketingOptIn: z.boolean().default(false),
    preferredCommunication: z.enum(['EMAIL', 'SMS', 'BOTH']).default('EMAIL'),
  }).optional(),
  timezone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const steps = ['Account Type', 'Basic Details', 'Personal Info', 'Preferences'];

const Step1 = () => {
  const { control } = useFormContext<RegisterFormValues>();
  return (
    <Box sx={{ mt: 2 }}>
      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend">What brings you to AppointBrite?</FormLabel>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <RadioGroup {...field} sx={{ mt: 2, gap: 2 }}>
              <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', transition: 'border 0.2s', '&:hover': { borderColor: 'primary.main' } }}>
                <FormControlLabel value="CUSTOMER" control={<Radio />} label="I want to book appointments" sx={{ flexGrow: 1, m: 0 }} />
              </Paper>
              <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', transition: 'border 0.2s', '&:hover': { borderColor: 'primary.main' } }}>
                <FormControlLabel value="BUSINESS_OWNER" control={<Radio />} label="I want to manage my business" sx={{ flexGrow: 1, m: 0 }} />
              </Paper>
            </RadioGroup>
          )}
        />
      </FormControl>
    </Box>
  );
};

const Step2 = () => {
  const { control, formState: { errors } } = useFormContext<RegisterFormValues>();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => <TextField {...field} label="First Name" fullWidth error={!!errors.firstName} helperText={errors.firstName?.message} />}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => <TextField {...field} label="Last Name" fullWidth error={!!errors.lastName} helperText={errors.lastName?.message} />}
        />
      </Box>
      <Controller
        name="email"
        control={control}
        render={({ field }) => <TextField {...field} label="Email" fullWidth type="email" error={!!errors.email} helperText={errors.email?.message} />}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => <TextField {...field} label="Password" fullWidth type="password" error={!!errors.password} helperText={errors.password?.message} />}
      />
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field }) => <TextField {...field} label="Confirm Password" fullWidth type="password" error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />}
      />
    </Box>
  );
};

const Step3 = () => {
  const { control } = useFormContext<RegisterFormValues>();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
      <Typography variant="body2" color="text.secondary">These fields are optional but help us personalize your experience.</Typography>
      <Controller
        name="phoneNumber"
        control={control}
        render={({ field }) => <TextField {...field} label="Phone Number" fullWidth />}
      />
      <Controller
        name="dateOfBirth"
        control={control}
        render={({ field }) => (
          <TextField 
            {...field} 
            label="Date of Birth" 
            type="date" 
            fullWidth 
            slotProps={{ inputLabel: { shrink: true } }} 
          />
        )}
      />
      <FormControl fullWidth>
        <InputLabel>Gender</InputLabel>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select {...field} label="Gender">
              <MenuItem value="PREFER_NOT_TO_SAY">Prefer not to say</MenuItem>
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </Select>
          )}
        />
      </FormControl>
    </Box>
  );
};

const Step4 = () => {
  const { control } = useFormContext<RegisterFormValues>();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
      <Typography variant="subtitle2">Address</Typography>
      <Controller name="address.street" control={control} render={({ field }) => <TextField {...field} label="Street" fullWidth size="small" />} />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Controller name="address.city" control={control} render={({ field }) => <TextField {...field} label="City" fullWidth size="small" />} />
        <Controller name="address.state" control={control} render={({ field }) => <TextField {...field} label="State" fullWidth size="small" />} />
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Controller name="address.zipCode" control={control} render={({ field }) => <TextField {...field} label="Zip Code" fullWidth size="small" />} />
        <Controller name="address.country" control={control} render={({ field }) => <TextField {...field} label="Country" fullWidth size="small" />} />
      </Box>

      <Typography variant="subtitle2" sx={{ mt: 1 }}>Preferences</Typography>
      <FormControl fullWidth size="small">
        <InputLabel>Preferred Communication</InputLabel>
        <Controller
          name="preferences.preferredCommunication"
          control={control}
          render={({ field }) => (
            <Select {...field} label="Preferred Communication">
              <MenuItem value="EMAIL">Email</MenuItem>
              <MenuItem value="SMS">SMS</MenuItem>
              <MenuItem value="BOTH">Both</MenuItem>
            </Select>
          )}
        />
      </FormControl>
      <Controller
        name="preferences.marketingOptIn"
        control={control}
        render={({ field: { onChange, value, ...field } }) => (
          <FormControlLabel
            control={<Checkbox checked={value} onChange={onChange} {...field} />}
            label="I want to receive marketing updates and promotions"
          />
        )}
      />
    </Box>
  );
};

export default function RegisterStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema as any),
    defaultValues: {
      role: 'CUSTOMER',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: 'PREFER_NOT_TO_SAY',
      address: { street: '', city: '', state: '', zipCode: '', country: '' },
      preferences: { marketingOptIn: false, preferredCommunication: 'EMAIL' },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    mode: 'onTouched'
  });

  const { trigger, handleSubmit } = methods;

  const handleNext = async () => {
    let fieldsToValidate: (keyof RegisterFormValues)[] = [];
    if (activeStep === 0) fieldsToValidate = ['role'];
    if (activeStep === 1) fieldsToValidate = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError('');
    setIsSubmitting(true);
    try {
      const payload: any = { ...data };
      if (payload.dateOfBirth) {
        payload.dateOfBirth = new Date(payload.dateOfBirth).toISOString();
      } else {
        delete payload.dateOfBirth;
      }
      if (payload.gender === '' || payload.gender === 'PREFER_NOT_TO_SAY') {
        delete payload.gender;
      }
      delete payload.confirmPassword;

      await authApi.register(payload);
      navigate(ROUTES.LOGIN); 
    } catch (error: any) {
      setServerError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {serverError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {serverError}
        </Alert>
      )}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {activeStep === 0 && <Step1 />}
          {activeStep === 1 && <Step2 />}
          {activeStep === 2 && <Step3 />}
          {activeStep === 3 && <Step4 />}

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0 || isSubmitting}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === steps.length - 1 ? (
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={24} /> : 'Complete'}
              </Button>
            ) : (
              <Button onClick={handleNext} variant="contained">
                Next
              </Button>
            )}
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}
