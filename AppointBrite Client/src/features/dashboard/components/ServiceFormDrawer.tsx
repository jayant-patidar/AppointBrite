import { useEffect } from 'react';
import { 
  Drawer, Box, Typography, IconButton, TextField, 
  Button, Switch, FormControlLabel, Stack, InputAdornment, Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import type { Service, CreateServicePayload, UpdateServicePayload } from '@/types/service.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '@/api/service';

interface ServiceFormDrawerProps {
  open: boolean;
  onClose: () => void;
  service?: Service | null;
}

const defaultValues = {
  name: '',
  category: '',
  description: '',
  price: 0,
  durationMinutes: 30,
  bufferMinutes: 0,
  capacity: 1,
  requiresApproval: true,
  isActive: true,
};

export default function ServiceFormDrawer({ open, onClose, service }: ServiceFormDrawerProps) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues
  });

  useEffect(() => {
    if (service && open) {
      reset({
        name: service.name,
        category: service.category || '',
        description: service.description,
        price: service.price,
        durationMinutes: service.durationMinutes,
        bufferMinutes: service.bufferMinutes,
        capacity: service.capacity,
        requiresApproval: service.requiresApproval,
        isActive: service.isActive,
      });
    } else if (open) {
      reset(defaultValues);
    }
  }, [service, open, reset]);

  const createMutation = useMutation({
    mutationFn: serviceApi.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myServices'] });
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: serviceApi.updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myServices'] });
      onClose();
    }
  });

  const onSubmit = (data: any) => {
    // Convert string numbers to actual numbers
    const payload = {
      ...data,
      price: Number(data.price),
      durationMinutes: Number(data.durationMinutes),
      bufferMinutes: Number(data.bufferMinutes),
      capacity: Number(data.capacity),
    };

    if (service) {
      updateMutation.mutate({ id: service._id, data: payload as UpdateServicePayload });
    } else {
      createMutation.mutate(payload as CreateServicePayload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={onClose}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 500 }, p: 0 } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.default',
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {service ? 'Edit Service' : 'Add New Service'}
          </Typography>
          <IconButton onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
          <Stack spacing={3}>
            
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Service name is required' }}
              render={({ field }) => (
                <TextField 
                  {...field} 
                  label="Service Name" 
                  fullWidth 
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <TextField 
                  {...field} 
                  label="Category (Optional)" 
                  fullWidth 
                  placeholder="e.g. Haircut, Massage, Consultation"
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField 
                  {...field} 
                  label="Description" 
                  fullWidth 
                  multiline 
                  rows={3} 
                />
              )}
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="price"
                  control={control}
                  rules={{ required: 'Price is required', min: { value: 0, message: 'Cannot be negative' } }}
                  render={({ field }) => (
                    <TextField 
                      {...field} 
                      type="number"
                      label="Price" 
                      fullWidth 
                      error={!!errors.price}
                      helperText={errors.price?.message}
                      slotProps={{
                        input: { startAdornment: <InputAdornment position="start">$</InputAdornment> }
                      }}
                    />
                  )}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="durationMinutes"
                  control={control}
                  rules={{ required: 'Duration is required', min: { value: 1, message: 'Must be at least 1 min' } }}
                  render={({ field }) => (
                    <TextField 
                      {...field} 
                      type="number"
                      label="Duration" 
                      fullWidth 
                      error={!!errors.durationMinutes}
                      helperText={errors.durationMinutes?.message}
                      slotProps={{
                        input: { endAdornment: <InputAdornment position="end">min</InputAdornment> }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="bufferMinutes"
                  control={control}
                  rules={{ min: { value: 0, message: 'Cannot be negative' } }}
                  render={({ field }) => (
                    <TextField 
                      {...field} 
                      type="number"
                      label="Buffer Time (Optional)" 
                      fullWidth 
                      error={!!errors.bufferMinutes}
                      helperText={errors.bufferMinutes?.message}
                      slotProps={{
                        input: { endAdornment: <InputAdornment position="end">min</InputAdornment> }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="capacity"
                  control={control}
                  rules={{ required: 'Capacity is required', min: { value: 1, message: 'Must be at least 1' } }}
                  render={({ field }) => (
                    <TextField 
                      {...field} 
                      type="number"
                      label="Max Capacity" 
                      fullWidth 
                      error={!!errors.capacity}
                      helperText={errors.capacity?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Controller
                name="requiresApproval"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    control={<Switch checked={value} onChange={e => onChange(e.target.checked)} />}
                    label={
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>Require Approval</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Customers must wait for you to approve their booking request for this service.
                        </Typography>
                      </Box>
                    }
                  />
                )}
              />
            </Box>

            {service && (
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      control={<Switch checked={value} onChange={e => onChange(e.target.checked)} color="success" />}
                      label={
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>Service is Active</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Turn this off to temporarily hide this service from customers.
                          </Typography>
                        </Box>
                      }
                    />
                  )}
                />
              </Box>
            )}

          </Stack>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={onClose} disabled={isPending} sx={{ borderRadius: 999 }}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit(onSubmit)} 
              disabled={isPending}
              sx={{ borderRadius: 999 }}
            >
              {service ? 'Save Changes' : 'Create Service'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
