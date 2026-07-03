/**
 * CustomerLayout — mobile-first layout for customer-facing pages.
 * Bottom nav on mobile, top nav on desktop (per Doc 06).
 */
import { Box } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import { useResponsive } from '@/hooks/useMediaQuery';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';

export default function CustomerLayout() {
  const { isMobile } = useResponsive();
  const { user } = useAuth();

  // Strict role segregation: Business owners should use the Business Dashboard.
  if (user?.role === 'BUSINESS_OWNER') {
    return <Navigate to={ROUTES.DASHBOARD.OVERVIEW} replace />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <Box
        component="main"
        sx={{
          flex: 1,
          pb: isMobile ? '72px' : 0, // Space for bottom nav
        }}
      >
        <Outlet />
      </Box>

      {!isMobile && <Footer />}

      {isMobile && <BottomNav />}
    </Box>
  );
}
