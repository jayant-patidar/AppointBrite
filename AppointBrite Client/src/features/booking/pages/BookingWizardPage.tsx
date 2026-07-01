import { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Stepper, Step, StepLabel, Button, 
  Paper, CircularProgress, Divider, TextField, Chip, Grid
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format, addDays } from 'date-fns';
import { businessesApi } from '@/api/endpoints/businesses.api';
import { bookingsApi } from '@/api/endpoints/bookings.api';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/hooks/useAuth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const steps = ['Select Service', 'Date & Time', 'Your Details', 'Confirm'];

export default function BookingWizardPage() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  
  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(''); // ISO string
  const [partySize, setPartySize] = useState<number>(1);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [guestDetails, setGuestDetails] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
  });

  // Queries
  const { data: businessRes, isLoading: businessLoading } = useQuery({
    queryKey: ['business', businessId],
    queryFn: () => businessesApi.getById(businessId!),
    enabled: !!businessId
  });

  const { data: servicesRes, isLoading: servicesLoading } = useQuery({
    queryKey: ['business-services', businessId],
    queryFn: () => businessesApi.getServices(businessId!),
    enabled: !!businessId
  });

  const { data: availabilityRes, isLoading: availabilityLoading, refetch: fetchSlots } = useQuery({
    queryKey: ['availability', businessId, selectedServiceId, format(selectedDate, 'yyyy-MM-dd')],
    queryFn: () => bookingsApi.checkAvailability(businessId!, { 
      date: format(selectedDate, 'yyyy-MM-dd'), 
      serviceId: selectedServiceId 
    }),
    enabled: false
  });

  // Fetch availability when date or service changes
  useEffect(() => {
    if (businessId && selectedServiceId && selectedDate) {
      fetchSlots();
    }
  }, [businessId, selectedServiceId, selectedDate, fetchSlots]);

  const createBookingMutation = useMutation({
    mutationFn: (payload: any) => bookingsApi.createBooking(payload),
    onSuccess: (res) => {
      navigate(ROUTES.BOOKING_CONFIRMATION.replace(':bookingId', res.data._id));
    }
  });

  const handleNext = () => {
    if (activeStep === 3) {
      // Submit booking
      createBookingMutation.mutate({
        businessId,
        serviceId: selectedServiceId,
        startTime: selectedTimeSlot,
        partySize,
        specialRequests,
        guestDetails: user ? undefined : guestDetails
      });
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const business = businessRes?.data;
  const services = servicesRes?.data || [];
  const availableSlots = availabilityRes?.data || [];

  const selectedService = services.find(s => s._id === selectedServiceId);

  // Generate upcoming days based on business's maxAdvanceBookingDays setting
  const advanceDays = business?.maxAdvanceBookingDays || 30;
  const upcomingDays = Array.from({ length: advanceDays }).map((_, i) => addDays(new Date(), i));

  if (businessLoading || servicesLoading) {
    return (
      <Container sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!business) return null;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Book with {business.name}
        </Typography>
        <Typography color="text.secondary">
          Complete the steps below to secure your reservation.
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, md: 5 }, 
          borderRadius: 4, 
          border: '1px solid', 
          borderColor: 'divider',
          minHeight: 400
        }}
      >
        {/* STEP 0: SERVICES */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Select a Service</Typography>
            <Grid container spacing={2}>
              {services.map((service) => (
                <Grid size={{ xs: 12, sm: 6 }} key={service._id}>
                  <Paper
                    elevation={0}
                    onClick={() => setSelectedServiceId(service._id)}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: '2px solid',
                      borderColor: selectedServiceId === service._id ? 'primary.main' : 'divider',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      bgcolor: selectedServiceId === service._id ? 'primary.50' : 'transparent',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {service.name}
                      </Typography>
                      {selectedServiceId === service._id && <CheckCircleIcon color="primary" />}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {service.durationMinutes} mins • {service.capacity > 1 && `Up to ${service.capacity} people`}
                    </Typography>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
                      ${service.price}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* STEP 1: DATE & TIME */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Choose Date & Time</Typography>
            
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
              Select a Day
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 2, 
                overflowX: 'auto', 
                pb: 2,
                '::-webkit-scrollbar': { height: 6 },
                '::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 3 }
              }}
            >
              {upcomingDays.map((date) => {
                const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                return (
                  <Box
                    key={date.toISOString()}
                    onClick={() => { setSelectedDate(date); setSelectedTimeSlot(''); }}
                    sx={{
                      minWidth: 70,
                      p: 1.5,
                      borderRadius: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      bgcolor: isSelected ? 'primary.main' : 'transparent',
                      color: isSelected ? 'primary.contrastText' : 'text.primary',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <Typography variant="caption" sx={{ display: 'block', textTransform: 'uppercase', opacity: 0.8 }}>
                      {format(date, 'EEE')}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {format(date, 'd')}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
              Available Times
            </Typography>
            {availabilityLoading ? (
              <CircularProgress size={24} />
            ) : availableSlots.length === 0 ? (
              <Typography color="error">No slots available on this day.</Typography>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {availableSlots.map((slot) => {
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <Chip
                      key={slot}
                      label={format(new Date(slot), 'h:mm a')}
                      onClick={() => setSelectedTimeSlot(slot)}
                      color={isSelected ? 'primary' : 'default'}
                      variant={isSelected ? 'filled' : 'outlined'}
                      sx={{ borderRadius: 2, px: 1, py: 2.5, fontWeight: isSelected ? 700 : 500 }}
                    />
                  );
                })}
              </Box>
            )}
          </Box>
        )}

        {/* STEP 2: DETAILS */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Your Details</Typography>
            
            <Grid container spacing={3}>
              {!user && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField 
                      fullWidth label="First Name" 
                      value={guestDetails.firstName}
                      onChange={(e) => setGuestDetails({...guestDetails, firstName: e.target.value})}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField 
                      fullWidth label="Last Name"
                      value={guestDetails.lastName}
                      onChange={(e) => setGuestDetails({...guestDetails, lastName: e.target.value})}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField 
                      fullWidth label="Email" type="email"
                      value={guestDetails.email}
                      onChange={(e) => setGuestDetails({...guestDetails, email: e.target.value})}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField 
                      fullWidth label="Phone Number"
                      value={guestDetails.phone}
                      onChange={(e) => setGuestDetails({...guestDetails, phone: e.target.value})}
                    />
                  </Grid>
                </>
              )}

              {selectedService?.capacity && selectedService.capacity > 1 && (
                <Grid size={{ xs: 12 }}>
                  <TextField 
                    fullWidth 
                    type="number" 
                    label="Party Size" 
                    value={partySize}
                    onChange={(e) => setPartySize(Number(e.target.value))}
                    slotProps={{ htmlInput: { min: 1, max: selectedService.capacity } }}
                  />
                </Grid>
              )}

              <Grid size={{ xs: 12 }}>
                <TextField 
                  fullWidth 
                  multiline 
                  rows={3} 
                  label="Special Requests (Optional)" 
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any allergies, preferences, or notes for the staff?"
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* STEP 3: CONFIRM */}
        {activeStep === 3 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Review Booking</Typography>
            
            <Box sx={{ bgcolor: 'background.default', p: 3, borderRadius: 3, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Business</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{business.name}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Service</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedService?.name}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Date</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedTimeSlot ? format(new Date(selectedTimeSlot), 'EEEE, MMMM do, yyyy') : ''}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Time</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedTimeSlot ? format(new Date(selectedTimeSlot), 'h:mm a') : ''}
                  </Typography>
                </Grid>
                {selectedService?.capacity && selectedService.capacity > 1 && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">Party Size</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{partySize} people</Typography>
                  </Grid>
                )}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Total Estimated Cost</Typography>
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
                    ${(selectedService?.price || 0) * partySize}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Pay at the venue</Typography>
                </Grid>
              </Grid>
            </Box>

            {createBookingMutation.isError && (
              <Typography color="error" sx={{ mb: 2 }}>
                Failed to create booking. Please try again.
              </Typography>
            )}
          </Box>
        )}

      </Paper>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button 
          disabled={activeStep === 0 || createBookingMutation.isPending} 
          onClick={handleBack}
        >
          Back
        </Button>
        <Button 
          variant="contained" 
          onClick={handleNext}
          disabled={
            (activeStep === 0 && !selectedServiceId) ||
            (activeStep === 1 && !selectedTimeSlot) ||
            (activeStep === 2 && !user && (!guestDetails.firstName || !guestDetails.email)) ||
            createBookingMutation.isPending
          }
          sx={{ borderRadius: 9999, px: 4, fontWeight: 700 }}
        >
          {createBookingMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 
           activeStep === 3 ? 'Confirm Booking' : 'Next'}
        </Button>
      </Box>
    </Container>
  );
}
