import { Box, Typography, Grid, Paper } from '@mui/material';
import type { ReactNode } from 'react';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* LEFT SIDEBAR - VISUAL */}
      <Grid 
        size={{ xs: 12, md: 5, lg: 6 }}
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          p: { md: 4, lg: 6 },
          overflow: 'hidden'
        }}
      >
        {/* Animated Background Overlay */}
        <Box 
          sx={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
            filter: 'blur(40px)',
          }}
        />
        <Box 
          sx={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '50%',
            height: '50%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Logo area */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Link to={ROUTES.HOME} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoAwesomeIcon /> AppointBrite
            </Typography>
          </Link>
        </Box>

        {/* Central Motive / Tagline */}
        <Box sx={{ position: 'relative', zIndex: 1, my: 'auto', py: 4 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, lineHeight: 1.1 }}>
            Your Time,<br/>Managed Beautifully
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, maxWidth: 400, mb: 6 }}>
            The all-in-one platform for seamless scheduling, customer management, and business growth.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { icon: <EventAvailableIcon />, title: 'Effortless Booking', desc: 'Allow clients to book 24/7 with a beautiful interface.' },
              { icon: <SpeedIcon />, title: 'Save Hours Weekly', desc: 'Automate reminders and reduce no-shows instantly.' },
              { icon: <TrendingUpIcon />, title: 'Grow Your Business', desc: 'Gain insights and retain customers effortlessly.' }
            ].map((feature, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 3, 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(10px)',
                  display: 'flex'
                }}>
                  {feature.icon}
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{feature.title}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>{feature.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* Footer quote */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 4, 
              bgcolor: 'rgba(255,255,255,0.1)', 
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white'
            }}
          >
            <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
              "AppointBrite completely transformed the way we handle appointments. It's so elegant and intuitive, our clients love it!"
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                JD
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Jane Doe</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Salon Owner</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Grid>

      {/* RIGHT SIDE - FORM */}
      <Grid 
        size={{ xs: 12, md: 7, lg: 6 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          position: 'relative',
          overflowY: 'auto'
        }}
      >
        {/* Mobile Logo */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, p: 3, alignItems: 'center' }}>
          <Link to={ROUTES.HOME} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AutoAwesomeIcon color="primary" /> 
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
              AppointBrite
            </Typography>
          </Link>
        </Box>

        <Box 
          sx={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            p: { xs: 3, sm: 6, md: 8 }
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 480 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
              {title}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              {subtitle}
            </Typography>
            
            {children}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
