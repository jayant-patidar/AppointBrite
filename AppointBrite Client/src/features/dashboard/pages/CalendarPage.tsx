import { useState, useRef, useMemo } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, useTheme } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { bookingsApi } from '@/api/endpoints/bookings.api';
import { businessApi } from '@/api/business';
import type { Booking } from '@/types/booking.types';
import BookingDetailsDrawer from '../components/BookingDetailsDrawer';
import BlockTimeModal from '../components/BlockTimeModal';

export default function CalendarPage() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const calendarRef = useRef<FullCalendar>(null);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Fetch business info
  const { data: business } = useQuery({
    queryKey: ['myBusiness'],
    queryFn: businessApi.getMyBusiness,
  });

  // Fetch bookings
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['businessBookings', business?._id],
    queryFn: () => bookingsApi.getBusinessBookings(business!._id),
    enabled: !!business?._id,
  });

  // Reschedule mutation
  const rescheduleMutation = useMutation({
    mutationFn: ({ bookingId, newStartTime }: { bookingId: string; newStartTime: string }) =>
      bookingsApi.rescheduleBusinessBooking(business!._id, bookingId, newStartTime),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessBookings'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to reschedule booking.');
      queryClient.invalidateQueries({ queryKey: ['businessBookings'] });
    }
  });

  // Update status mutation (for drawer)
  const updateStatusMutation = useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: string }) =>
      bookingsApi.updateBookingStatus(business!._id, bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessBookings'] });
      setDrawerOpen(false);
    }
  });

  const getEventColor = (status: string) => {
    switch (status) {
      case 'PENDING': return theme.palette.warning.main;
      case 'CONFIRMED': return theme.palette.info.main;
      case 'COMPLETED': return theme.palette.success.main;
      case 'CANCELED':
      case 'NO_SHOW': return theme.palette.error.main;
      case 'BLOCKED': return theme.palette.grey[700];
      default: return theme.palette.primary.main;
    }
  };

  const events = useMemo(() => {
    if (!bookings?.data) return [];
    
    return bookings.data.map((b: any) => {
      const isGuest = !b.customerId && b.guestDetails;
      const customerName = isGuest
        ? `${b.guestDetails?.firstName} ${b.guestDetails?.lastName} (Guest)`
        : b.customerId
          ? `${b.customerId.firstName} ${b.customerId.lastName}`
          : 'Unknown Customer';
          
      let title = b.status === 'BLOCKED' 
        ? `Blocked: ${b.specialRequests || 'Unavailable'}`
        : `${customerName} - ${b.serviceId?.name || 'Service'}`;

      return {
        id: b._id,
        title,
        start: b.startTime,
        end: b.endTime,
        backgroundColor: getEventColor(b.status),
        borderColor: getEventColor(b.status),
        extendedProps: { ...b }
      };
    });
  }, [bookings, theme]);

  const handleEventDrop = (info: any) => {
    const booking = info.event.extendedProps as Booking;
    
    if (['CANCELED', 'COMPLETED', 'NO_SHOW'].includes(booking.status)) {
      alert(`Cannot reschedule a ${booking.status.toLowerCase()} booking.`);
      info.revert();
      return;
    }
    
    if (!confirm(`Are you sure you want to reschedule this booking to ${info.event.start?.toLocaleString()}?`)) {
      info.revert();
      return;
    }

    rescheduleMutation.mutate(
      { 
        bookingId: info.event.id, 
        newStartTime: info.event.start!.toISOString() 
      },
      {
        onError: () => info.revert()
      }
    );
  };

  const handleEventClick = (info: any) => {
    const booking = info.event.extendedProps as Booking;
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const handleDateSelect = (selectInfo: any) => {
    setSelectedDate(selectInfo.start);
    setBlockModalOpen(true);
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear selection
  };

  if (isLoading || !business) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">Failed to load calendar.</Alert>;
  }

  const { minTime, maxTime } = useMemo(() => {
    if (!business?.operatingHours) return { minTime: '06:00:00', maxTime: '23:00:00' };

    let min = '24:00';
    let max = '00:00';

    business.operatingHours.forEach((oh: any) => {
      if (!oh.isClosed && oh.openTime && oh.closeTime) {
        if (oh.openTime < min) min = oh.openTime;
        if (oh.closeTime > max) max = oh.closeTime;
      }
    });

    if (min === '24:00' || max === '00:00') {
      return { minTime: '06:00:00', maxTime: '23:00:00' }; // fallback
    }

    // Append seconds for FullCalendar format (HH:mm:ss)
    return { minTime: `${min}:00`, maxTime: `${max}:00` };
  }, [business]);

  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto', pb: 8, height: 'calc(100vh - 150px)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Calendar
        </Typography>
      </Box>

      <Paper 
        sx={{ 
          p: 2, 
          borderRadius: 2, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          '& .fc': { flex: 1, fontFamily: theme.typography.fontFamily },
          '& .fc-theme-standard td, .fc-theme-standard th': { borderColor: theme.palette.divider },
          '& .fc-toolbar-title': { fontWeight: 700, fontSize: '1.25rem' },
          '& .fc-button-primary': { 
            backgroundColor: theme.palette.primary.main, 
            borderColor: theme.palette.primary.main,
            textTransform: 'capitalize'
          },
          '& .fc-event': {
            cursor: 'pointer',
            padding: '2px 4px',
            borderRadius: '4px',
            border: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }
        }} 
        variant="outlined"
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          displayEventTime={false}
          events={events}
          eventDrop={handleEventDrop}
          eventClick={handleEventClick}
          select={handleDateSelect}
          slotMinTime={minTime}
          slotMaxTime={maxTime}
          height="100%"
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
          }}
        />
      </Paper>

      <BookingDetailsDrawer 
        open={drawerOpen}
        booking={selectedBooking}
        onClose={() => setDrawerOpen(false)}
        onStatusChange={(status) => {
          if (selectedBooking) {
            updateStatusMutation.mutate({ bookingId: selectedBooking._id, status });
          }
        }}
        isUpdating={updateStatusMutation.isPending}
      />

      <BlockTimeModal
        open={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        businessId={business._id}
        initialStartTime={selectedDate}
      />
    </Box>
  );
}
