import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Container, Grid, 
  Paper, CircularProgress, Divider, TextField, Chip, IconButton,
  Stepper, Step, StepLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addDays } from 'date-fns';
import { businessesApi } from '@/api/endpoints/businesses.api';
import { bookingsApi } from '@/api/endpoints/bookings.api';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/hooks/useAuth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const steps = ['Select Service', 'Choose Staff', 'Date & Time', 'Your Details', 'Confirm'];

export default function BookingWizardPage() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const prefillServiceId = location.state?.prefillServiceId;
  const prefillStaffId = location.state?.prefillStaffId;

  const [activeStep, setActiveStep] = useState(prefillServiceId ? 2 : 0);
  
  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(prefillServiceId || '');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(''); // ISO string
  const [selectedStaffId, setSelectedStaffId] = useState<string>(prefillStaffId || ''); // empty means "Any Available"
  const [partySize, setPartySize] = useState<number>(1);
  const [partyMembers, setPartyMembers] = useState([{ name: '', phone: '' }]);
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

  const { data: staffRes } = useQuery({
    queryKey: ['business-staff', businessId],
    queryFn: () => businessesApi.getStaff(businessId!),
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

  const queryClient = useQueryClient();

  const createBookingMutation = useMutation({
    mutationFn: (payload: any) => bookingsApi.createBooking(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      navigate(ROUTES.BOOKING_CONFIRMATION.replace(':bookingId', res.data._id));
    }
  });

  const handleNext = () => {
    if (activeStep === 4) {
      // Submit booking
      createBookingMutation.mutate({
        businessId,
        serviceId: selectedServiceId,
        staffId: selectedStaffId || undefined,
        startTime: selectedTimeSlot,
        partySize,
        partyMembers: partySize > 1 ? partyMembers : undefined,
        specialRequests,
        guestDetails: user ? undefined : guestDetails
      });
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    createBookingMutation.reset();
  };

  const business = businessRes?.data;
  const services = servicesRes?.data || [];
  const staff = staffRes?.data || [];
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

        {/* STEP 1: STAFF */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Choose Staff</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  elevation={0}
                  onClick={() => setSelectedStaffId('')}
                  sx={{
                    p: 3, borderRadius: 3, border: '2px solid',
                    borderColor: selectedStaffId === '' ? 'primary.main' : 'divider',
                    cursor: 'pointer', bgcolor: selectedStaffId === '' ? 'primary.50' : 'transparent',
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Any Available Staff</Typography>
                </Paper>
              </Grid>
              {staff.map((member) => (
                <Grid size={{ xs: 12, sm: 6 }} key={member._id}>
                  <Paper
                    elevation={0}
                    onClick={() => setSelectedStaffId(member._id)}
                    sx={{
                      p: 3, borderRadius: 3, border: '2px solid',
                      borderColor: selectedStaffId === member._id ? 'primary.main' : 'divider',
                      cursor: 'pointer', bgcolor: selectedStaffId === member._id ? 'primary.50' : 'transparent',
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {member.userId?.firstName} {member.userId?.lastName}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* STEP 2: DATE & TIME */}
        {activeStep === 2 && (
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

        {/* STEP 3: DETAILS */}
        {activeStep === 3 && (
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

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                      Party Size
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <IconButton 
                        onClick={() => {
                          const num = Math.max(1, partySize - 1);
                          setPartySize(num);
                          setPartyMembers(Array.from({ length: num }).map((_, i) => partyMembers[i] || { name: '', phone: '' }));
                        }}
                        disabled={partySize <= 1}
                        sx={{ bgcolor: 'action.hover' }}
                      >
                        <RemoveIcon />
                      </IconButton>
                      
                      <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center', fontWeight: 600 }}>
                        {partySize}
                      </Typography>
                      
                      <IconButton 
                        onClick={() => {
                          const maxCap = selectedService?.capacity || 1;
                          const num = Math.min(maxCap, partySize + 1);
                          setPartySize(num);
                          setPartyMembers(Array.from({ length: num }).map((_, i) => partyMembers[i] || { name: '', phone: '' }));
                        }}
                        disabled={partySize >= (selectedService?.capacity || 1)}
                        sx={{ bgcolor: 'action.hover' }}
                      >
                        <AddIcon />
                      </IconButton>
                      
                      {selectedService?.capacity && (
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                          Max capacity: {selectedService.capacity}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  {partySize > 1 && (
                    <Box sx={{ pl: 2, borderLeft: '2px solid', borderColor: 'primary.main', mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>Party Member Details (Optional)</Typography>
                      {partyMembers.map((member, i) => (
                        <Grid container spacing={2} sx={{ mb: 2 }} key={i}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField 
                              fullWidth size="small" label={`Member ${i + 1} Name`}
                              value={member.name}
                              onChange={(e) => {
                                const newMembers = [...partyMembers];
                                newMembers[i].name = e.target.value;
                                setPartyMembers(newMembers);
                              }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField 
                              fullWidth size="small" label={`Member ${i + 1} Phone`}
                              value={member.phone}
                              onChange={(e) => {
                                const newMembers = [...partyMembers];
                                newMembers[i].phone = e.target.value;
                                setPartyMembers(newMembers);
                              }}
                            />
                          </Grid>
                        </Grid>
                      ))}
                    </Box>
                  )}
                </Grid>

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

        {/* STEP 4: CONFIRM */}
        {activeStep === 4 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Review Booking</Typography>
            
            <Box sx={{ bgcolor: 'background.default', p: 3, borderRadius: 3, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Business</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{business?.name}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Service</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedService?.name}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Staff</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedStaffId 
                      ? `${staff.find(s => s._id === selectedStaffId)?.userId?.firstName} ${staff.find(s => s._id === selectedStaffId)?.userId?.lastName}`
                      : 'Any Available'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Date & Time</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedTimeSlot ? format(new Date(selectedTimeSlot), 'MMM do, yyyy - h:mm a') : ''}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Party Size</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{partySize} people</Typography>
                </Grid>
                {partySize > 1 && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary">Party Members</Typography>
                    {partyMembers.map((member, i) => (
                      <Typography key={i} variant="body2" sx={{ fontWeight: 500 }}>
                        {i + 1}. {member.name || 'Unnamed'} {member.phone ? `(${member.phone})` : ''}
                      </Typography>
                    ))}
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
                {(createBookingMutation.error as any)?.response?.data?.message || 'Failed to create booking. Please try again.'}
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
            (activeStep === 2 && !selectedTimeSlot) ||
            (activeStep === 3 && !user && (!guestDetails.firstName || !guestDetails.email)) ||
            createBookingMutation.isPending
          }
          sx={{ borderRadius: 9999, px: 4, fontWeight: 700 }}
        >
          {createBookingMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 
           activeStep === 4 ? 'Confirm Booking' : 'Next'}
        </Button>
      </Box>
    </Container>
  );
}
