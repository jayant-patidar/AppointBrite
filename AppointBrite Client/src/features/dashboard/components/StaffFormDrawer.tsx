import { useEffect } from 'react';
import { 
  Drawer, Box, Typography, IconButton, TextField, 
  Button, Stack, Autocomplete, Grid,
  FormControlLabel, Checkbox, Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import type { Staff, CreateStaffPayload, UpdateStaffPayload } from '@/types/staff.types';
import { useCreateStaff, useUpdateStaff } from '../hooks/useStaff';
import { useQuery } from '@tanstack/react-query';
import { serviceApi } from '@/api/service';

interface StaffFormDrawerProps {
  open: boolean;
  onClose: () => void;
  staff?: Staff | null;
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  colorCode: '#2563EB',
  providedServices: [] as string[],
  workingHours: DAYS_OF_WEEK.map((_, i) => ({
    dayOfWeek: i,
    openTime: '09:00',
    closeTime: '17:00',
    isClosed: i === 0 || i === 6 // Closed on weekends by default
  }))
};

export default function StaffFormDrawer({ open, onClose, staff }: StaffFormDrawerProps) {
  const { data: services } = useQuery({
    queryKey: ['myServices'],
    queryFn: serviceApi.getMyServices,
    enabled: open
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues
  });

  const { fields } = useFieldArray({
    control,
    name: 'workingHours'
  });

  useEffect(() => {
    if (staff && open) {
      reset({
        firstName: staff.userId?.firstName || '',
        lastName: staff.userId?.lastName || '',
        email: staff.userId?.email || '',
        phoneNumber: staff.userId?.phoneNumber || '',
        colorCode: staff.colorCode || '#2563EB',
        providedServices: staff.providedServices?.map(s => s._id) || [],
        workingHours: staff.workingHours?.length ? staff.workingHours : defaultValues.workingHours
      });
    } else if (open) {
      reset(defaultValues);
    }
  }, [staff, open, reset]);

  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();

  const onSubmit = (data: any) => {
    if (staff) {
      // For updates, we omit email as it's typically read-only after creation in this flow
      const { email, ...updateData } = data;
      updateMutation.mutate(
        { id: staff._id, data: updateData as UpdateStaffPayload },
        { onSuccess: onClose }
      );
    } else {
      createMutation.mutate(
        data as CreateStaffPayload,
        { onSuccess: onClose }
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={onClose}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 600 }, p: 0 } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {staff ? 'Edit Staff Member' : 'Add Staff Member'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Form Body */}
        <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
          <Stack spacing={4}>
            
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: 'First name is required' }}
                    render={({ field }) => (
                      <TextField {...field} label="First Name" fullWidth error={!!errors.firstName} helperText={errors.firstName?.message as string} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: 'Last name is required' }}
                    render={({ field }) => (
                      <TextField {...field} label="Last Name" fullWidth error={!!errors.lastName} helperText={errors.lastName?.message as string} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{ 
                      required: 'Email is required',
                      pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' }
                    }}
                    render={({ field }) => (
                      <TextField 
                        {...field} 
                        label="Email Address" 
                        fullWidth 
                        error={!!errors.email} 
                        helperText={errors.email?.message as string}
                        disabled={!!staff} // Prevent email edit for existing staff
                      />
                    )}
                  />
                  {!staff && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      A secure account will be automatically created for this email address.
                    </Typography>
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Phone Number" fullWidth />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="colorCode"
                    control={control}
                    render={({ field }) => (
                      <TextField 
                        {...field} 
                        label="Calendar Color" 
                        type="color"
                        fullWidth 
                        sx={{ '& .MuiInputBase-input': { p: 1, height: 40 } }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                Services Provided
              </Typography>
              <Controller
                name="providedServices"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    multiple
                    options={services || []}
                    getOptionLabel={(option) => option.name}
                    value={(services || []).filter(s => value.includes(s._id))}
                    onChange={(_, newValue) => onChange(newValue.map(v => v._id))}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Services" placeholder="Add service..." />
                    )}
                  />
                )}
              />
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                Working Hours
              </Typography>
              <Stack spacing={2}>
                {fields.map((field, index) => (
                  <Box key={field.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ width: 100, fontWeight: 500 }}>
                      {DAYS_OF_WEEK[index]}
                    </Typography>
                    
                    <Controller
                      name={`workingHours.${index}.isClosed`}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          control={<Checkbox checked={value} onChange={(e) => onChange(e.target.checked)} />}
                          label="Closed"
                          sx={{ width: 100 }}
                        />
                      )}
                    />

                    <Controller
                      name={`workingHours.${index}.isClosed`}
                      control={control}
                      render={({ field: { value: isClosed } }) => (
                        <>
                          <Controller
                            name={`workingHours.${index}.openTime`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                type="time"
                                size="small"
                                value={value}
                                onChange={onChange}
                                disabled={isClosed}
                              />
                            )}
                          />
                          <Typography color="text.secondary">to</Typography>
                          <Controller
                            name={`workingHours.${index}.closeTime`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                type="time"
                                size="small"
                                value={value}
                                onChange={onChange}
                                disabled={isClosed}
                              />
                            )}
                          />
                        </>
                      )}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>

          </Stack>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider', bgcolor: 'background.default', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save Staff Member'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
