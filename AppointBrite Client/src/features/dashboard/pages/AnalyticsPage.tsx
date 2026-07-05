import {
  Box, Typography, Paper, Grid, CircularProgress, Alert, Stack, Avatar, Rating, Divider, useTheme
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { businessApi } from '@/api/business';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import StarIcon from '@mui/icons-material/Star';
import BlockIcon from '@mui/icons-material/Block';
import { formatInTimeZone } from 'date-fns-tz';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

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

export default function AnalyticsPage() {
  const theme = useTheme();
  
  const { data: business } = useQuery({
    queryKey: ['myBusiness'],
    queryFn: businessApi.getMyBusiness,
  });

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['analytics', business?._id],
    queryFn: () => businessApi.getAnalytics(business._id),
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
    return <Alert severity="error">Failed to load analytics data.</Alert>;
  }

  if (!analytics) return null;

  const {
    keyMetrics, revenueTrend, serviceDistribution, staffPerformance,
    dayWisePattern, timeWisePattern, recentFeedback
  } = analytics;

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', pb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Analytics Dashboard</Typography>
        <Typography color="text.secondary">Track your business performance, revenue, and customer feedback.</Typography>
      </Box>

      {/* Row 1: Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard 
            title="Total Earnings" 
            value={keyMetrics.totalRevenue || 0} 
            isCurrency 
            icon={<TrendingUpIcon />} 
            color="success" 
            subtitle="From completed bookings"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard 
            title="Completed Bookings" 
            value={keyMetrics.completedBookings || 0} 
            icon={<BookOnlineIcon />} 
            color="primary" 
            subtitle="Successfully serviced"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard 
            title="Canceled / No-Show" 
            value={keyMetrics.canceledBookings || 0} 
            icon={<BlockIcon />} 
            color="error" 
            subtitle="Lost opportunities"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard 
            title="Average Rating" 
            value={keyMetrics.averageRating || 'N/A'} 
            icon={<StarIcon />} 
            color="warning" 
            subtitle={`Based on ${keyMetrics.totalReviews || 0} reviews`}
          />
        </Grid>
      </Grid>

      {/* Row 2: Revenue Trend */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 4 }} elevation={0} variant="outlined">
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Revenue Trend (Last 30 Days)</Typography>
        <Box sx={{ height: 350, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
              <RechartsTooltip formatter={(value) => [`$${value}`, 'Revenue']} labelFormatter={(label) => `Date: ${label}`} />
              <Area type="monotone" dataKey="revenue" stroke={theme.palette.primary.main} strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Row 3: Distribution (Services & Staff) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 4, height: '100%' }} elevation={0} variant="outlined">
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Top Services</Typography>
            {serviceDistribution.length > 0 ? (
              <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={serviceDistribution} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {serviceDistribution.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => [value, 'Bookings']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>No service data available yet.</Alert>
            )}
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 4, height: '100%' }} elevation={0} variant="outlined">
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Staff Performance</Typography>
            {staffPerformance.length > 0 ? (
              <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={staffPerformance} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />
                    <RechartsTooltip formatter={(value) => [value, 'Bookings']} />
                    <Bar dataKey="count" fill={theme.palette.secondary.main} radius={[0, 4, 4, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>No staff data available yet.</Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Row 4: Time Patterns */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 4, height: '100%' }} elevation={0} variant="outlined">
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Busiest Days</Typography>
            <Box sx={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayWisePattern} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} tickFormatter={(val) => val.slice(0, 3)} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip formatter={(value) => [value, 'Bookings']} />
                  <Bar dataKey="count" fill={theme.palette.info.main} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 4, height: '100%' }} elevation={0} variant="outlined">
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Busiest Hours</Typography>
            <Box sx={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeWisePattern} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.warning.main} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={theme.palette.warning.main} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip formatter={(value) => [value, 'Bookings']} />
                  <Area type="monotone" dataKey="count" stroke={theme.palette.warning.main} strokeWidth={3} fillOpacity={1} fill="url(#colorTime)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Row 5: Recent Feedback */}
      <Paper sx={{ p: 3, borderRadius: 4 }} elevation={0} variant="outlined">
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Recent Feedback</Typography>
        {recentFeedback.length > 0 ? (
          <Stack divider={<Divider />} spacing={2}>
            {recentFeedback.map((review: any) => (
              <Box key={review._id} sx={{ py: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                    {review.customerId?.firstName?.[0] || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {review.customerId?.firstName} {review.customerId?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatInTimeZone(new Date(review.createdAt), 'America/New_York', 'MMM do, yyyy')}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 'auto' }}>
                    <Rating value={review.rating} size="small" readOnly />
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ ml: 6.5 }}>
                  "{review.comment}"
                </Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <Alert severity="info">No feedback available yet.</Alert>
        )}
      </Paper>
    </Box>
  );
}
