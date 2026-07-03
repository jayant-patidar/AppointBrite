import { useState } from 'react';
import { 
  Container, Typography, Box, Tabs, Tab, CircularProgress, 
  Paper, Button, Chip, Dialog, DialogTitle, DialogContent, 
  DialogActions, DialogContentText, TextField, Rating, Snackbar, Alert, Grid,
  Menu, MenuItem, Skeleton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import { format, addDays, isSameDay } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '@/api/endpoints/bookings.api';
import { reviewsApi } from '@/api/endpoints/reviews.api';
import type { Booking } from '@/types/booking.types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`booking-tabpanel-${index}`}
      aria-labelledby={`booking-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const queryClient = useQueryClient();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState<number | null>(5);
  const [reviewComment, setReviewComment] = useState('');
  
  // Reschedule state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<Date>(new Date());
  const [rescheduleSlot, setRescheduleSlot] = useState<string | null>(null);

  // Support Menu state
  const [supportAnchorEl, setSupportAnchorEl] = useState<null | HTMLElement>(null);
  const [supportBooking, setSupportBooking] = useState<Booking | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const { data: bookingsRes, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: bookingsApi.getMyBookings
  });

  // Availability Query for Rescheduling
  const { data: availabilityRes, isLoading: availabilityLoading } = useQuery({
    queryKey: ['availability', (selectedBooking?.businessId as any)?._id, (selectedBooking?.serviceId as any)?._id, format(rescheduleDate, 'yyyy-MM-dd')],
    queryFn: () => bookingsApi.checkAvailability((selectedBooking?.businessId as any)?._id, { 
      date: format(rescheduleDate, 'yyyy-MM-dd'), 
      serviceId: (selectedBooking?.serviceId as any)?._id 
    }),
    enabled: rescheduleModalOpen && !!selectedBooking
  });

  const availableSlots = availabilityRes?.data || [];
  // For simplicity, allow rescheduling up to 30 days ahead
  const upcomingDays = Array.from({ length: 30 }).map((_, i) => addDays(new Date(), i));

  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingsApi.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      setCancelModalOpen(false);
      setSnackbarMsg('Booking canceled successfully.');
      setSnackbarOpen(true);
    }
  });

  const reviewMutation = useMutation({
    mutationFn: (payload: { bookingId: string, rating: number, comment: string }) => reviewsApi.submit(payload),
    onSuccess: () => {
      setReviewModalOpen(false);
      setSnackbarMsg('Feedback submitted! Thank you.');
      setSnackbarOpen(true);
    }
  });

  const rescheduleMutation = useMutation({
    mutationFn: (payload: { id: string, newStartTime: string }) => bookingsApi.rescheduleBooking(payload.id, payload.newStartTime),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      setRescheduleModalOpen(false);
      setSnackbarMsg('Booking rescheduled successfully!');
      setSnackbarOpen(true);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bookingsApi.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      setDeleteModalOpen(false);
      setSnackbarMsg('Booking deleted successfully.');
      setSnackbarOpen(true);
    }
  });

  const bookings = bookingsRes?.data || [];
  
  const upcomingBookings = bookings.filter(b => ['PENDING', 'CONFIRMED'].includes(b.status));
  const pastBookings = bookings.filter(b => b.status === 'COMPLETED');
  const canceledBookings = bookings.filter(b => ['CANCELED', 'NO_SHOW'].includes(b.status));

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelModalOpen(true);
  };

  const handleDeleteClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setDeleteModalOpen(true);
  };

  const handleRescheduleClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setRescheduleDate(new Date(booking.startTime));
    setRescheduleSlot(null);
    setRescheduleModalOpen(true);
  };

  const handleReviewClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setReviewRating(5);
    setReviewComment('');
    setReviewModalOpen(true);
  };

  const handleSupportClick = (event: React.MouseEvent<HTMLElement>, booking: Booking) => {
    setSupportAnchorEl(event.currentTarget);
    setSupportBooking(booking);
  };

  const handleRebookClick = (booking: Booking) => {
    navigate(`/book/${(booking.businessId as any)?._id}`, {
      state: { 
        prefillServiceId: (booking.serviceId as any)?._id,
        prefillStaffId: booking.staffId || ''
      }
    });
  };

  const handleSupportClose = () => {
    setSupportAnchorEl(null);
    setSupportBooking(null);
  };

  const renderBookingCard = (booking: Booking) => {
    const business = booking.businessId as any;
    const service = booking.serviceId as any;
    const businessImage = business?.mediaGallery?.[0] || 'https://via.placeholder.com/150';

    return (
      <Paper key={booking._id} sx={{ p: 2, mb: 2, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }} elevation={2}>
        
        {/* Top Half: Image & Details */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Box 
            component="img"
            src={businessImage}
            sx={{ width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 }, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {service?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {business?.name} - {business?.location?.address}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Date:</strong> {formatInTimeZone(new Date(booking.startTime), 'America/New_York', 'MMM do, yyyy - h:mm a')}
            </Typography>
            <Typography variant="body2">
              <strong>Party Size:</strong> {booking.partySize || 1}
            </Typography>
          </Box>
        </Box>

        {/* Bottom Half: Status & Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Chip 
            label={booking.status} 
            color={
              booking.status === 'CONFIRMED' ? 'success' :
              booking.status === 'PENDING' ? 'warning' :
              booking.status === 'COMPLETED' ? 'primary' : 'error'
            }
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {booking.status === 'CONFIRMED' || booking.status === 'PENDING' ? (
              <>
                <Button size="small" variant="outlined" onClick={() => handleRescheduleClick(booking)}>Reschedule</Button>
                <Button size="small" variant="outlined" color="error" onClick={() => handleCancelClick(booking)}>Cancel</Button>
                <Button size="small" variant="text" onClick={(e) => handleSupportClick(e, booking)}>Get Help</Button>
              </>
            ) : null}
            {booking.status === 'COMPLETED' ? (
              <>
                <Button size="small" variant="contained" onClick={() => handleReviewClick(booking)}>Leave Feedback</Button>
                <Button size="small" variant="outlined" onClick={() => handleRebookClick(booking)}>Re-book</Button>
              </>
            ) : null}
            {['CANCELED', 'NO_SHOW'].includes(booking.status) ? (
              <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteClick(booking)}>Delete</Button>
            ) : null}
          </Box>
        </Box>
      </Paper>
    );
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>My Bookings</Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Skeleton variant="rectangular" height={48} width="100%" />
        </Box>
        {Array.from(new Array(3)).map((_, i) => (
          <Paper key={i} sx={{ p: 2, mb: 2, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 2 }} elevation={2}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Skeleton variant="rectangular" sx={{ width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 }, borderRadius: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" height={32} width="60%" />
                <Skeleton variant="text" height={24} width="40%" />
                <Skeleton variant="text" height={24} width="50%" sx={{ mt: 1 }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
              <Skeleton variant="rectangular" height={24} width={80} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" height={30} width={120} sx={{ borderRadius: 1 }} />
            </Box>
          </Paper>
        ))}
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>My Bookings</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          aria-label="booking tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label={`Upcoming (${upcomingBookings.length})`} />
          <Tab label={`Past (${pastBookings.length})`} />
          <Tab label={`Canceled (${canceledBookings.length})`} />
        </Tabs>
      </Box>

      <CustomTabPanel value={tabIndex} index={0}>
        {upcomingBookings.length === 0 ? (
          <Typography color="text.secondary">No upcoming bookings found.</Typography>
        ) : (
          upcomingBookings.map(renderBookingCard)
        )}
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={1}>
        {pastBookings.length === 0 ? (
          <Typography color="text.secondary">No past bookings found.</Typography>
        ) : (
          pastBookings.map(renderBookingCard)
        )}
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={2}>
        {canceledBookings.length === 0 ? (
          <Typography color="text.secondary">No canceled bookings.</Typography>
        ) : (
          canceledBookings.map(renderBookingCard)
        )}
      </CustomTabPanel>

      {/* Cancel Dialog */}
      <Dialog open={cancelModalOpen} onClose={() => setCancelModalOpen(false)}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your booking for <strong>{(selectedBooking?.serviceId as any)?.name}</strong> on {selectedBooking ? format(new Date(selectedBooking.startTime), 'MMM do') : ''}?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelModalOpen(false)} color="inherit">Keep Booking</Button>
          <Button onClick={() => selectedBooking && cancelMutation.mutate(selectedBooking._id)} color="error" variant="contained" disabled={cancelMutation.isPending}>
            {cancelMutation.isPending ? 'Canceling...' : 'Yes, Cancel'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Delete Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete this canceled booking from your history?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={() => selectedBooking && deleteMutation.mutate(selectedBooking._id)} color="error" variant="contained" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reschedule Modal */}
      <Dialog open={rescheduleModalOpen} onClose={() => setRescheduleModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Reschedule Booking</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Select New Date</Typography>
          <Box sx={{ display: 'flex', overflowX: 'auto', gap: 1, pb: 1, mb: 3 }}>
            {upcomingDays.map((day) => {
              const selected = isSameDay(rescheduleDate, day);
              return (
                <Paper
                  key={day.toISOString()}
                  elevation={selected ? 4 : 0}
                  sx={{
                    minWidth: 70,
                    p: 1,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: selected ? 'primary.main' : 'transparent',
                    color: selected ? 'primary.contrastText' : 'text.primary',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: selected ? 'primary.main' : 'divider',
                  }}
                  onClick={() => {
                    setRescheduleDate(day);
                    setRescheduleSlot(null);
                  }}
                >
                  <Typography variant="caption" sx={{ display: 'block' }}>{format(day, 'MMM')}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{format(day, 'd')}</Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>{format(day, 'EEE')}</Typography>
                </Paper>
              );
            })}
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Available Times</Typography>
          {availabilityLoading ? (
            <CircularProgress size={24} />
          ) : availableSlots.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No slots available on this day.</Typography>
          ) : (
            <Grid container spacing={1}>
              {availableSlots.map((slot: string) => {
                const selected = rescheduleSlot === slot;
                return (
                  <Grid size={{ xs: 4, sm: 3 }} key={slot}>
                    <Chip
                      label={formatInTimeZone(new Date(slot), 'America/New_York', 'h:mm a')}
                      clickable
                      onClick={() => setRescheduleSlot(slot)}
                      color={selected ? 'primary' : 'default'}
                      variant={selected ? 'filled' : 'outlined'}
                      sx={{ width: '100%', fontWeight: selected ? 600 : 400 }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRescheduleModalOpen(false)} color="inherit">Cancel</Button>
          <Button 
            onClick={() => {
              if (selectedBooking && rescheduleSlot) {
                rescheduleMutation.mutate({ id: selectedBooking._id, newStartTime: rescheduleSlot });
              }
            }} 
            color="primary" 
            variant="contained" 
            disabled={rescheduleMutation.isPending || !rescheduleSlot}
          >
            {rescheduleMutation.isPending ? 'Updating...' : 'Confirm Reschedule'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onClose={() => setReviewModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Leave Feedback</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Typography>How was your experience at <strong>{(selectedBooking?.businessId as any)?.name}</strong>?</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Rating
              value={reviewRating}
              onChange={(_, newValue) => setReviewRating(newValue)}
              size="large"
            />
          </Box>
          <TextField
            multiline
            rows={4}
            fullWidth
            label="Write a review"
            variant="outlined"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewModalOpen(false)} color="inherit">Cancel</Button>
          <Button 
            onClick={() => {
              if (selectedBooking && reviewRating) {
                reviewMutation.mutate({ bookingId: selectedBooking._id, rating: reviewRating, comment: reviewComment });
              }
            }} 
            color="primary" 
            variant="contained" 
            disabled={reviewMutation.isPending || !reviewComment.trim()}
          >
            {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Support Menu */}
      <Menu
        anchorEl={supportAnchorEl}
        open={Boolean(supportAnchorEl)}
        onClose={handleSupportClose}
        slotProps={{ paper: { elevation: 3, sx: { minWidth: 200, mt: 1, borderRadius: 2 } } }}
      >
        <MenuItem 
          onClick={() => {
            const email = (supportBooking?.businessId as any)?.contact?.email || 'hello@appointbrite.com';
            window.location.href = `mailto:${email}?subject=Question about my booking`;
            handleSupportClose();
          }}
        >
          <EmailIcon sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} /> Send Email
        </MenuItem>
        <MenuItem 
          onClick={() => {
            const phone = (supportBooking?.businessId as any)?.contact?.phone || '+1234567890';
            window.location.href = `tel:${phone}`;
            handleSupportClose();
          }}
        >
          <PhoneIcon sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} /> Call Business
        </MenuItem>
        <MenuItem 
          onClick={() => {
            setSnackbarMsg('Live Chat feature coming soon!');
            setSnackbarOpen(true);
            handleSupportClose();
          }}
        >
          <ChatIcon sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} /> Live Chat
        </MenuItem>
      </Menu>

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
