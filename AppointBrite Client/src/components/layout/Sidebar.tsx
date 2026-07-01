/**
 * Sidebar — collapsible left navigation for dashboard/admin (per Doc 06).
 */
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

interface SidebarProps {
  width: number;
  open: boolean;
}

const menuItems = [
  { label: 'Overview', icon: <DashboardIcon />, path: ROUTES.DASHBOARD.OVERVIEW },
  { label: 'Calendar', icon: <CalendarMonthIcon />, path: ROUTES.DASHBOARD.CALENDAR },
  { label: 'Bookings & Reservations', icon: <BookOnlineIcon />, path: ROUTES.DASHBOARD.BOOKINGS },
  { label: 'Services', icon: <MiscellaneousServicesIcon />, path: ROUTES.DASHBOARD.SERVICES },
  { label: 'Staff', icon: <PeopleIcon />, path: ROUTES.DASHBOARD.STAFF },
  { label: 'Customers', icon: <PeopleIcon />, path: ROUTES.DASHBOARD.CUSTOMERS },
  { label: 'Analytics', icon: <BarChartIcon />, path: ROUTES.DASHBOARD.ANALYTICS },
  { label: 'Profile', icon: <StorefrontIcon />, path: ROUTES.DASHBOARD.PROFILE },
  { label: 'Promotions', icon: <LocalOfferIcon />, path: ROUTES.DASHBOARD.PROMOTIONS },
];

export default function Sidebar({ width, open }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          borderRight: 1,
          borderColor: 'divider',
          transition: 'width 200ms ease-in-out',
          overflowX: 'hidden',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontFamily: '"Outfit", sans-serif',
            background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            whiteSpace: 'nowrap',
          }}
        >
          {open ? 'AppointBrite' : 'AB'}
        </Typography>
      </Box>

      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': { color: 'inherit' },
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              {open && <ListItemText primary={item.label} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
