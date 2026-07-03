/**
 * BottomNav — mobile bottom navigation for customers (per Doc 06).
 */
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useAuth } from '@/hooks/useAuth';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const getNavItems = () => {
    const base = [{ label: 'Search', icon: <SearchIcon />, path: ROUTES.SEARCH }];
    
    if (user?.role === 'BUSINESS_OWNER') {
      return [
        { label: 'My Business', icon: <StorefrontIcon />, path: ROUTES.DASHBOARD.OVERVIEW },
        { label: 'Profile', icon: <PersonIcon />, path: ROUTES.CUSTOMER.PROFILE },
      ];
    }
    
    return [
      ...base,
      { label: 'Bookings', icon: <CalendarTodayIcon />, path: ROUTES.CUSTOMER.BOOKINGS },
      { label: 'Favorites', icon: <FavoriteIcon />, path: ROUTES.CUSTOMER.FAVORITES },
      { label: 'Profile', icon: <PersonIcon />, path: ROUTES.CUSTOMER.PROFILE },
    ];
  };

  const currentNavItems = getNavItems();
  const currentIndex = currentNavItems.findIndex((item) => location.pathname.startsWith(item.path));

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        borderTop: 1,
        borderColor: 'divider',
      }}
      elevation={3}
    >
      <BottomNavigation
        value={currentIndex === -1 ? 0 : currentIndex}
        onChange={(_event, newValue) => navigate(currentNavItems[newValue].path)}
        showLabels
      >
        {currentNavItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
