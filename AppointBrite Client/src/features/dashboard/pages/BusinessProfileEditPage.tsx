import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Tabs, Tab, TextField, Button, Grid,
  FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch,
  CircularProgress, Alert, Divider
} from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { businessApi } from '@/api/business';

// Categories copied from OnboardingWizard
const categories = ['SALON', 'RESTAURANT', 'CLINIC', 'FITNESS', 'SPA', 'DENTAL', 'TUTORING', 'AUTO_SERVICE', 'HOME_SERVICE', 'EVENT_VENUE', 'CONSULTING'];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BusinessProfileEditPage() {
  const [tabValue, setTabValue] = useState(0);
  const queryClient = useQueryClient();

  const { data: business, isLoading: isFetching, error: fetchError } = useQuery({
    queryKey: ['myBusiness'],
    queryFn: businessApi.getMyBusiness,
  });

  const methods = useForm({
    defaultValues: {
      name: '',
      category: '',
      description: '',
      shortDescription: '',
      location: { address: '', city: '', state: '', zipCode: '', country: 'US' },
      contact: { businessPhone: '', businessEmail: '', website: '' },
      operatingHours: [] as any[],
      socialLinks: { instagram: '', facebook: '', twitter: '', yelp: '' },
      cancellationPolicy: { type: 'FLEXIBLE', feePercentage: 0, cutoffHours: 24 },
      bookingSettings: { autoApproveBookings: true, depositRequired: false, depositPercentage: 0 },
      brandColors: { primaryColor: '#2563eb' }
    }
  });

  const { control, handleSubmit, reset, formState: { isDirty } } = methods;

  const { fields: hoursFields } = useFieldArray({
    control,
    name: 'operatingHours'
  });

  useEffect(() => {
    if (business) {
      reset({
        name: business.name || '',
        category: business.category || '',
        description: business.description || '',
        shortDescription: business.shortDescription || '',
        location: {
          address: business.location?.address || '',
          city: business.location?.city || '',
          state: business.location?.state || '',
          zipCode: business.location?.zipCode || '',
          country: business.location?.country || 'US'
        },
        contact: {
          businessPhone: business.contact?.businessPhone || '',
          businessEmail: business.contact?.businessEmail || '',
          website: business.contact?.website || ''
        },
        operatingHours: Array.from({ length: 7 }, (_, i) => {
          const existing = business.operatingHours?.find((h: any) => h.dayOfWeek === i);
          return existing || {
            dayOfWeek: i,
            openTime: '09:00',
            closeTime: '17:00',
            isClosed: true,
          };
        }),
        socialLinks: {
          instagram: business.socialLinks?.instagram || '',
          facebook: business.socialLinks?.facebook || '',
          twitter: business.socialLinks?.twitter || '',
          yelp: business.socialLinks?.yelp || ''
        },
        cancellationPolicy: {
          type: business.cancellationPolicy?.type || 'FLEXIBLE',
          feePercentage: business.cancellationPolicy?.feePercentage || 0,
          cutoffHours: business.cancellationPolicy?.cutoffHours || 24
        },
        bookingSettings: {
          autoApproveBookings: business.bookingSettings?.autoApproveBookings ?? true,
          depositRequired: business.depositRequired ?? false,
          depositPercentage: business.depositPercentage || 0
        },
        brandColors: {
          primaryColor: business.brandColors?.primaryColor || '#2563eb'
        }
      });
    }
  }, [business, reset]);

  const updateMutation = useMutation({
    mutationFn: businessApi.updateMyBusiness,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBusiness'] });
    }
  });

  const onSubmit = (data: any) => {
    // Flatten depositRequired to root level as per schema
    const payload = {
      ...data,
      depositRequired: data.bookingSettings.depositRequired,
      depositPercentage: data.bookingSettings.depositPercentage,
    };
    updateMutation.mutate(payload);
  };

  if (isFetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError) {
    return <Alert severity="error">Failed to load business profile.</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Business Settings</Typography>
          <Typography color="text.secondary">Manage your public profile and platform configurations.</Typography>
        </Box>
        <Button 
          variant="contained" 
          onClick={handleSubmit(onSubmit)}
          disabled={!isDirty || updateMutation.isPending}
          sx={{ minWidth: 120, borderRadius: 2, fontWeight: 700 }}
        >
          {updateMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
        </Button>
      </Box>

      {updateMutation.isSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>Settings updated successfully!</Alert>
      )}

      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>Failed to update settings.</Alert>
      )}

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Tabs 
            value={tabValue} 
            onChange={(_, val) => setTabValue(val)} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{ ml: 2 }}
          >
            <Tab label="Basic Info" />
            <Tab label="Location" />
            <Tab label="Contact & Links" />
            <Tab label="Operating Hours" />
            <Tab label="Booking Rules" />
          </Tabs>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 4 } }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            
            {/* TAB 0: Basic Info */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Business Name" fullWidth variant="outlined" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Category</InputLabel>
                        <Select {...field} label="Category">
                          {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="shortDescription"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Short Tagline" fullWidth variant="outlined" helperText="1-2 sentences for search cards." />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Detailed Description" fullWidth variant="outlined" multiline rows={4} />
                    )}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* TAB 1: Location */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="location.address"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Street Address" fullWidth variant="outlined" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Controller
                    name="location.city"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="City" fullWidth variant="outlined" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Controller
                    name="location.state"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="State / Province" fullWidth variant="outlined" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Controller
                    name="location.zipCode"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="ZIP / Postal Code" fullWidth variant="outlined" />
                    )}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* TAB 2: Contact & Links */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Controller
                    name="contact.businessPhone"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Business Phone" fullWidth variant="outlined" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Controller
                    name="contact.businessEmail"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Public Email" fullWidth variant="outlined" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Controller
                    name="contact.website"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Website URL" fullWidth variant="outlined" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>Social Links</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="socialLinks.instagram"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Instagram Handle or URL" fullWidth variant="outlined" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="socialLinks.facebook"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Facebook URL" fullWidth variant="outlined" />
                    )}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* TAB 3: Operating Hours */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Define your weekly schedule. Mark days as closed if you do not operate on those days.
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {hoursFields.map((field, index) => {
                  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                  return (
                    <Grid size={{ xs: 12 }} key={field.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Typography sx={{ width: 100, fontWeight: 600 }}>{dayNames[index]}</Typography>
                        
                        <Controller
                          name={`operatingHours.${index}.isClosed`}
                          control={control}
                          render={({ field: { onChange, value: isClosed } }) => (
                            <>
                              <FormControlLabel
                                control={<Switch checked={isClosed} onChange={e => onChange(e.target.checked)} />}
                                label="Closed"
                                sx={{ width: 100 }}
                              />
                              <Controller
                                name={`operatingHours.${index}.openTime`}
                                control={control}
                                render={({ field: { onChange: onTimeChange, value: timeValue } }) => (
                                  <TextField
                                    type="time"
                                    label="Open"
                                    value={timeValue}
                                    onChange={onTimeChange}
                                    size="small"
                                    disabled={isClosed}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                  />
                                )}
                              />
                              <Controller
                                name={`operatingHours.${index}.closeTime`}
                                control={control}
                                render={({ field: { onChange: onTimeChange, value: timeValue } }) => (
                                  <TextField
                                    type="time"
                                    label="Close"
                                    value={timeValue}
                                    onChange={onTimeChange}
                                    size="small"
                                    disabled={isClosed}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                  />
                                )}
                              />
                            </>
                          )}
                        />
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </TabPanel>

            {/* TAB 4: Booking Rules */}
            <TabPanel value={tabValue} index={4}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="bookingSettings.autoApproveBookings"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <FormControlLabel
                        control={<Switch checked={value} onChange={e => onChange(e.target.checked)} />}
                        label="Auto-Approve Bookings"
                      />
                    )}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    If disabled, you will need to manually review and approve appointment requests.
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>Cancellation Policy</Typography>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Controller
                    name="cancellationPolicy.type"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Policy Type</InputLabel>
                        <Select {...field} label="Policy Type">
                          <MenuItem value="FLEXIBLE">Flexible (Free)</MenuItem>
                          <MenuItem value="MODERATE">Moderate (Fee applies)</MenuItem>
                          <MenuItem value="STRICT">Strict (High Fee)</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Controller
                    name="cancellationPolicy.feePercentage"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} type="number" label="Fee Percentage (%)" fullWidth variant="outlined" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Controller
                    name="cancellationPolicy.cutoffHours"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} type="number" label="Cutoff Hours" fullWidth variant="outlined" helperText="Hours before start time." />
                    )}
                  />
                </Grid>
              </Grid>
            </TabPanel>

          </form>
        </Box>
      </Paper>
    </Box>
  );
}
