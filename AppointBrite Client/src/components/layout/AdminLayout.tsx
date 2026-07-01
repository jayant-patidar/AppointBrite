/**
 * AdminLayout — layout for super admin portal.
 */
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar width={260} open={true} />

      <Box
        sx={{
          flex: 1,
          ml: '260px',
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
