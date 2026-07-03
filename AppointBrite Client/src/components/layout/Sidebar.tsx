/**
 * Sidebar — collapsible left navigation for dashboard/admin (per Doc 06).
 */
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Toolbar,
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
  variant?: 'permanent' | 'temporary';
  onClose?: () => void;
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

export default function Sidebar({ width, open, variant = 'permanent', onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (variant === 'temporary' && onClose) {
      onClose();
    }
  };

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          transition: 'width 200ms ease-in-out',
          overflowX: 'hidden',
          ...(variant === 'permanent' && {
            position: 'static', // override fixed position for permanent drawer
          }),
        },
        ...(variant === 'permanent' && {
          display: { xs: 'none', md: 'block' },
        }),
      }}
    >
      {/* Spacer to push content down below the Header */}
      <Toolbar />
      <List sx={{ px: 1, mt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigate(item.path)}
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
