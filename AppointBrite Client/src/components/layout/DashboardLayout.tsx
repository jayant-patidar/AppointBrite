/**
 * DashboardLayout — desktop-first layout for business owners.
 * Left sidebar + main content (per Doc 06).
 */
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { setSidebarOpen } from '@/store/slices/uiSlice';
import { useResponsive } from '@/hooks/useMediaQuery';

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 72;

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);
  const { isMobile } = useResponsive();
  
  // On desktop, we collapse the sidebar when 'open' is false.
  // On mobile, the sidebar is a Drawer that slides in, so it takes full width when open.
  const desktopWidth = sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header />
      
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Mobile Sidebar (Temporary Drawer) */}
        {isMobile && (
          <Sidebar 
            width={SIDEBAR_WIDTH} 
            open={sidebarOpen} 
            variant="temporary"
            onClose={() => dispatch(setSidebarOpen(false))}
          />
        )}

        {/* Desktop Sidebar (Permanent Drawer) */}
        {!isMobile && (
          <Sidebar 
            width={desktopWidth} 
            open={sidebarOpen} 
            variant="permanent"
          />
        )}

        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: { xs: 2, sm: 3 },
            bgcolor: 'background.default'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
