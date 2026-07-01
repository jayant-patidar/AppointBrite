/**
 * Header — top navigation bar.
 */
import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Box, Avatar,
  Tooltip, Button, Menu, MenuItem, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { toggleTheme } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { authApi } from '@/api/auth';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';


export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const { user } = useAuth();

  // Menu anchor for avatar dropdown
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    try {
      await authApi.logout();
    } catch (e) { /* ignore error on logout */ }
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box 
          component={Link} 
          to="/" 
          sx={{ 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.02)' }
          }}
        >
          <Box
            component="img"
            src="/headerlogo.png"
            alt="AppointBrite"
            sx={{ height: 40, width: 'auto' }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2, md: 3 } }}>
          {/* — Labeled nav link helper — hidden on mobile since we have BottomNav — */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: { sm: 2, md: 3 } }}>
            {/* Search */}
            <Box
              component={Link}
              to={ROUTES.SEARCH}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'text.secondary',
                px: 1,
                py: 0.5,
                borderRadius: 2,
                transition: 'color 0.2s, background-color 0.2s, transform 0.2s',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'action.hover',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <SearchIcon sx={{ fontSize: 22 }} />
              <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600, mt: 0.25, lineHeight: 1 }}>
                Search
              </Typography>
            </Box>

            {user && (
              <>
                {/* Bookings */}
                <Box
                  component={Link}
                  to={ROUTES.CUSTOMER.BOOKINGS}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'text.secondary',
                    px: 1,
                    py: 0.5,
                    borderRadius: 2,
                    transition: 'color 0.2s, background-color 0.2s, transform 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'action.hover',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CalendarMonthIcon sx={{ fontSize: 22 }} />
                  <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600, mt: 0.25, lineHeight: 1 }}>
                    Bookings
                  </Typography>
                </Box>

                {/* Favorites */}
                <Box
                  component={Link}
                  to={ROUTES.CUSTOMER.FAVORITES}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'text.secondary',
                    px: 1,
                    py: 0.5,
                    borderRadius: 2,
                    transition: 'color 0.2s, background-color 0.2s, transform 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'action.hover',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <FavoriteBorderIcon sx={{ fontSize: 22 }} />
                  <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600, mt: 0.25, lineHeight: 1 }}>
                    Favorites
                  </Typography>
                </Box>

                {/* Notifications */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    color: 'text.secondary',
                    px: 1,
                    py: 0.5,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'color 0.2s, background-color 0.2s, transform 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'action.hover',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <NotificationsNoneIcon sx={{ fontSize: 22 }} />
                  <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600, mt: 0.25, lineHeight: 1 }}>
                    Alerts
                  </Typography>
                </Box>
              </>
            )}
          </Box>

          {/* Divider between nav items and actions (hidden on mobile) */}
          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 0.5, my: 1 }} />

          {/* Theme toggle — icon only, no label needed */}
          <Tooltip title={themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
            <IconButton 
              onClick={() => dispatch(toggleTheme())} 
              size="small"
              sx={{
                transition: 'transform 0.2s, background-color 0.2s',
                '&:hover': { transform: 'rotate(15deg) scale(1.1)', bgcolor: 'action.hover' }
              }}
            >
              {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {user ? (
            <>
              <Tooltip title="Account">
                <Avatar
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{ 
                    width: 36, 
                    height: 36, 
                    bgcolor: 'primary.main', 
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
                    }
                  }}
                >
                  {user.firstName[0]}
                  {user.lastName[0]}
                </Avatar>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={() => setAnchorEl(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: 3,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    }
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem
                  component={Link}
                  to={ROUTES.CUSTOMER.PROFILE}
                  onClick={() => setAnchorEl(null)}
                >
                  <ListItemIcon><PersonOutlineIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>My Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>
                  <ListItemIcon><SettingsOutlinedIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                  <ListItemText sx={{ color: 'error.main' }}>Log Out</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              to={ROUTES.LOGIN}
              variant="contained"
              color="primary"
              sx={{ 
                ml: 1, 
                borderRadius: 9999, 
                textTransform: 'none', 
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' }
              }}
            >
              Log In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
