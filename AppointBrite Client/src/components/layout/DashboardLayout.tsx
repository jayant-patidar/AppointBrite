/**
 * DashboardLayout — desktop-first layout for business owners.
 * Left sidebar + main content (per Doc 06).
 */
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 72;

export default function DashboardLayout() {
  // TODO: Connect to Redux uiSlice.sidebarOpen
  const sidebarOpen = true;
  const currentWidth = sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header />
      
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar width={currentWidth} open={sidebarOpen} />

        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 3,
            bgcolor: 'background.default'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
