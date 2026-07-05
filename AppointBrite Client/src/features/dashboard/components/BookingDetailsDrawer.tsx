import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  Stack,
  Button,
  Link
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import type { Booking } from '@/types/booking.types';
import { format } from 'date-fns';

interface BookingDetailsDrawerProps {
  open: boolean;
  booking: Booking | null;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  isUpdating: boolean;
}

export default function BookingDetailsDrawer({ open, booking, onClose, onStatusChange, isUpdating }: BookingDetailsDrawerProps) {
  if (!booking) return null;

  const b = booking as any;

  const isGuest = !b.customerId && b.guestDetails;
  const customerName = isGuest
    ? `${b.guestDetails?.firstName} ${b.guestDetails?.lastName} (Guest)`
    : `${b.customerId?.firstName} ${b.customerId?.lastName}`;
  const customerEmail = isGuest ? b.guestDetails?.email : b.customerId?.email;
  const customerPhone = isGuest ? b.guestDetails?.phone : b.customerId?.phone;

  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 400 } } }}>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Booking Details</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </Box>
      <Divider />

      <Box sx={{ p: 3, overflowY: 'auto', flex: 1 }}>
        <Stack spacing={4}>
          {/* Customer Info */}
          <Box>
            <Typography variant="overline" color="text.secondary">Customer</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{customerName}</Typography>
                {customerEmail && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <EmailIcon fontSize="small" color="action" sx={{ fontSize: 16 }} />
                    <Link href={`mailto:${customerEmail}`} underline="hover" color="text.secondary" variant="body2">
                      {customerEmail}
                    </Link>
                  </Box>
                )}
                {customerPhone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <PhoneIcon fontSize="small" color="action" sx={{ fontSize: 16 }} />
                    <Link href={`tel:${customerPhone}`} underline="hover" color="text.secondary" variant="body2">
                      {customerPhone}
                    </Link>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Booking Info */}
          <Box>
            <Typography variant="overline" color="text.secondary">Appointment Details</Typography>
            <List disablePadding>
              <ListItem disableGutters>
                <ListItemText primary="Service" secondary={b.serviceId?.name || 'Unknown Service'} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText 
                  primary="Staff Assigned" 
                  secondary={b.staffId ? `${b.staffId.firstName} ${b.staffId.lastName}` : 'Any Available Staff'} 
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary="Party Size" secondary={b.partySize || 1} />
              </ListItem>
              <ListItem disableGutters>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', color: 'text.secondary', mt: 1 }}>
                  <CalendarTodayIcon fontSize="small" />
                  <Typography variant="body2">{format(new Date(b.startTime), 'EEEE, MMMM d, yyyy')}</Typography>
                </Box>
              </ListItem>
              <ListItem disableGutters>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', color: 'text.secondary' }}>
                  <AccessTimeIcon fontSize="small" />
                  <Typography variant="body2">
                    {format(new Date(b.startTime), 'h:mm a')} - {format(new Date(b.endTime), 'h:mm a')}
                  </Typography>
                </Box>
              </ListItem>
            </List>
          </Box>

          {/* Payment Info */}
          <Box>
            <Typography variant="overline" color="text.secondary">Payment</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
                <AttachMoneyIcon fontSize="small" />
                {b.totalAmount?.toLocaleString() || b.estimatedCost?.toLocaleString() || '0'}
              </Typography>
              <Chip 
                label={b.paymentStatus} 
                size="small" 
                color={b.paymentStatus === 'COMPLETED' ? 'success' : 'default'} 
              />
            </Box>
          </Box>

          {/* Special Requests */}
          {b.specialRequests && (
            <Box>
              <Typography variant="overline" color="text.secondary">Special Requests</Typography>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, mt: 1 }}>
                <Typography variant="body2">{b.specialRequests}</Typography>
              </Box>
            </Box>
          )}

          {/* Status Actions */}
          <Box>
            <Typography variant="overline" color="text.secondary">Actions</Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {b.status === 'PENDING' && (
                <>
                  <Button variant="contained" color="primary" onClick={() => onStatusChange('CONFIRMED')} disabled={isUpdating}>
                    Approve Booking
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => onStatusChange('CANCELED')} disabled={isUpdating}>
                    Reject Booking
                  </Button>
                </>
              )}
              {b.status === 'CONFIRMED' && (
                <>
                  <Button variant="contained" color="success" onClick={() => onStatusChange('COMPLETED')} disabled={isUpdating}>
                    Mark as Completed
                  </Button>
                  <Button variant="outlined" color="warning" onClick={() => onStatusChange('NO_SHOW')} disabled={isUpdating}>
                    Mark as No-Show
                  </Button>
                  <Button variant="text" color="error" onClick={() => onStatusChange('CANCELED')} disabled={isUpdating}>
                    Cancel Booking
                  </Button>
                </>
              )}
              {['COMPLETED', 'CANCELED', 'NO_SHOW'].includes(b.status) && (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  No actions available for {b.status.toLowerCase()} bookings.
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
}