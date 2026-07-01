/**
 * Footer component.
 */
import { Box, Typography, Link, useTheme } from '@mui/material';

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 4,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
        textAlign: 'center',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(to bottom, transparent, rgba(37, 99, 235, 0.05))'
          : 'linear-gradient(to bottom, transparent, rgba(37, 99, 235, 0.03))',
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
        © {new Date().getFullYear()}{' '}
        <Link 
          href="/" 
          underline="none" 
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            transition: 'color 0.2s',
            '&:hover': {
              color: 'primary.dark',
              textDecoration: 'none'
            }
          }}
        >
          AppointBrite
        </Link>
        . All rights reserved.
      </Typography>
    </Box>
  );
}
