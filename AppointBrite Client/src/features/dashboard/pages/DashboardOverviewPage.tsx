import {
  Box, Typography, Grid, Paper, CircularProgress, Alert, Button, Stack, Chip, Divider, Avatar
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { businessApi } from '@/api/business';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

function StatCard({ title, value, icon, subtitle, color, isCurrency = false }: any) {
  return (
    <Paper sx={{ p: 3, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }} elevation={0} variant="outlined">
      <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.05, transform: 'scale(2.5)' }}>
        {icon}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${color}.50`, color: `${color}.main`, display: 'flex' }}>
          {icon}
        </Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>{title}</Typography>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        {isCurrency ? `$${value.toLocaleString()}` : value}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
        {subtitle}
      </Typography>
    </Paper>
  );
}

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: business } = useQuery({
    queryKey: ['myBusiness'],
    queryFn: businessApi.getMyBusiness,
  });

  const { data: overview, isLoading, error } = useQuery({
    queryKey: ['overview', business?._id],
    queryFn: () => businessApi.getOverview(business._id),
    enabled: !!business?._id
  });

  if (isLoading || !business) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Failed to load overview data.</Alert>;
  }

  if (!overview) return null;

  const { todayStats, pendingBookings, upcomingAppointments } = overview;

  const handleFormatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', pb: 8 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Good morning, {user?.firstName || 'Owner'} 👋
          </Typography>
          <Typography color="text.secondary">Here's what's happening at your business today.</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate(ROUTES.DASHBOARD.BOOKINGS)}>
            Manage Bookings
          </Button>
          <Button variant="outlined" onClick={() => navigate(ROUTES.DASHBOARD.SERVICES)}>
            Services
          </Button>
        </Stack>
      </Box>

      {/* Row 1: Today's Snapshot */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Today's Snapshot</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard 
            title="Appointments Today" 
            value={todayStats.appointmentsCount || 0} 
            icon={<CalendarTodayIcon />} 
            color="primary" 
            subtitle="Scheduled for today"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard 
            title="Expected Revenue" 
            value={todayStats.expectedRevenue || 0} 
            isCurrency 
            icon={<AttachMoneyIcon />} 
            color="success" 
            subtitle="From today's appointments"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard 
            title="New Bookings" 
            value={todayStats.newBookingsCount || 0} 
            icon={<TrendingUpIcon />} 
            color="info" 
            subtitle="Created in the last 24 hours"
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Action Required: Pending Bookings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 4, height: '100%' }} elevation={0} variant="outlined">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <WarningAmberIcon color="warning" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Action Required ({pendingBookings.length})</Typography>
            </Box>
            
            {pendingBookings.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No pending bookings require your attention.</Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {pendingBookings.map((booking: any) => (
                  <Box key={booking._id} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{booking.customerId?.firstName} {booking.customerId?.lastName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {booking.serviceId?.name} • {new Date(booking.startTime).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip label="Pending" color="warning" size="small" />
                  </Box>
                ))}
                {pendingBookings.length > 0 && (
                  <Button sx={{ mt: 1 }} onClick={() => navigate(ROUTES.DASHBOARD.BOOKINGS)}>
                    Review All Pending Bookings
                  </Button>
                )}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Upcoming Agenda */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 4, height: '100%' }} elevation={0} variant="outlined">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <AccessTimeIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Upcoming Today</Typography>
            </Box>

            {upcomingAppointments.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No more appointments scheduled for today.</Typography>
              </Box>
            ) : (
              <Stack spacing={0}>
                {upcomingAppointments.map((booking: any, index: number) => (
                  <Box key={booking._id}>
                    <Box sx={{ py: 2, display: 'flex', gap: 2 }}>
                      <Box sx={{ width: 80, flexShrink: 0, pt: 0.5 }}>
                        <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {handleFormatTime(booking.startTime)}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 600 }}>{booking.customerId?.firstName} {booking.customerId?.lastName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.serviceId?.name}
                        </Typography>
                        {booking.staffId && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <Avatar sx={{ width: 16, height: 16 }} />
                            With {booking.staffId.firstName}
                          </Typography>
                        )}
                      </Box>
                      <Chip label="Confirmed" color="success" size="small" variant="outlined" />
                    </Box>
                    {index < upcomingAppointments.length - 1 && <Divider />}
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
