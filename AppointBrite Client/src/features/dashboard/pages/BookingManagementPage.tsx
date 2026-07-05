import { useState, useMemo } from 'react';
import {
  Box, Typography, Paper, Tabs, Tab, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Chip, IconButton, Button, Tooltip, Stack, Avatar
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '@/api/endpoints/bookings.api';
import { businessApi } from '@/api/business';
import type { Booking } from '@/types/booking.types';
import { format, isToday, isFuture, isPast } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BookingDetailsDrawer from '../components/BookingDetailsDrawer';

export default function BookingManagementPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch business info to get business ID
  const { data: business } = useQuery({
    queryKey: ['myBusiness'],
    queryFn: businessApi.getMyBusiness,
  });

  // Fetch bookings
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['businessBookings', business?._id],
    queryFn: () => bookingsApi.getBusinessBookings(business._id),
    enabled: !!business?._id,
  });

  // Mutation for updating status
  const updateStatusMutation = useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: string }) =>
      bookingsApi.updateBookingStatus(business._id, bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessBookings'] });
      setDrawerOpen(false);
    },
  });

  const handleStatusChange = (bookingId: string, status: string) => {
    updateStatusMutation.mutate({ bookingId, status });
  };

  // Filter bookings based on active tab
  const filteredBookings = useMemo(() => {
    if (!bookings?.data) return [];
    
    return bookings.data.filter((b: any) => {
      const startTime = new Date(b.startTime);
      switch (activeTab) {
        case 0: // Pending
          return b.status === 'PENDING';
        case 1: // Today
          return isToday(startTime) && ['CONFIRMED', 'PENDING'].includes(b.status);
        case 2: // Upcoming
          return isFuture(startTime) && !isToday(startTime) && ['CONFIRMED'].includes(b.status);
        case 3: // Completed & Past
          return ['COMPLETED', 'CANCELED', 'NO_SHOW'].includes(b.status) || isPast(startTime);
        case 4: // All
        default:
          return true;
      }
    }).sort((a: any, b: any) => {
      if (activeTab === 1 || activeTab === 2) {
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      }
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    });
  }, [bookings, activeTab]);

  const paginatedBookings = useMemo(() => {
    return filteredBookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredBookings, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setPage(0); // Reset page on tab change
  };

  const handleOpenDrawer = (booking: Booking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'success';
      case 'PENDING': return 'warning';
      case 'COMPLETED': return 'default';
      case 'CANCELED': return 'error';
      case 'NO_SHOW': return 'error';
      default: return 'default';
    }
  };

  if (isLoading || !business) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">Failed to load bookings.</Alert>;
  }

  const pendingCount = bookings?.data?.filter((b: any) => b.status === 'PENDING').length || 0;

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', pb: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Booking Management
      </Typography>

      <Paper sx={{ mb: 4, borderRadius: 2 }} variant="outlined">
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Pending Requests
                {pendingCount > 0 && (
                  <Chip label={pendingCount} size="small" color="warning" sx={{ height: 20, fontSize: '0.75rem' }} />
                )}
              </Box>
            } 
          />
          <Tab label="Today's Agenda" />
          <Tab label="Upcoming" />
          <Tab label="Completed & Past" />
          <Tab label="All Bookings" />
        </Tabs>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date & Time</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No bookings found in this category.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBookings.map((booking: any) => {
                  const isGuest = !booking.customerId && booking.guestDetails;
                  const customerName = isGuest
                    ? `${booking.guestDetails?.firstName} ${booking.guestDetails?.lastName} (Guest)`
                    : `${booking.customerId?.firstName} ${booking.customerId?.lastName}`;
                  
                  return (
                    <TableRow key={booking._id} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>
                          {format(new Date(booking.startTime), 'MMM d, yyyy')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(booking.startTime), 'h:mm a')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32 }}>{customerName.charAt(0)}</Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 500 }}>{customerName}</Typography>
                            <Typography variant="caption" color="text.secondary">Party of {booking.partySize || 1}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography>{booking.serviceId?.name || 'Unknown'}</Typography>
                        {booking.staffId && (
                          <Typography variant="caption" color="text.secondary">
                            Staff: {booking.staffId.firstName}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={booking.status} 
                          color={getStatusColor(booking.status) as any} 
                          size="small" 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                          {booking.status === 'PENDING' && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton 
                                  color="success" 
                                  size="small"
                                  onClick={() => handleStatusChange(booking._id, 'CONFIRMED')}
                                  disabled={updateStatusMutation.isPending}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton 
                                  color="error" 
                                  size="small"
                                  onClick={() => handleStatusChange(booking._id, 'CANCELED')}
                                  disabled={updateStatusMutation.isPending}
                                >
                                  <CancelIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          <Button size="small" variant="outlined" onClick={() => handleOpenDrawer(booking)}>
                            Details
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredBookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <BookingDetailsDrawer 
        open={drawerOpen}
        booking={selectedBooking}
        onClose={() => setDrawerOpen(false)}
        onStatusChange={(status) => {
          if (selectedBooking) {
            handleStatusChange(selectedBooking._id, status);
          }
        }}
        isUpdating={updateStatusMutation.isPending}
      />
    </Box>
  );
}
