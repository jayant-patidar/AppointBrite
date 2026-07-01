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
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar width={currentWidth} open={sidebarOpen} />

      <Box
        sx={{
          flex: 1,
          ml: `${currentWidth}px`,
          transition: 'margin-left 200ms ease-in-out',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header />
        <Box component="main" sx={{ flex: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
