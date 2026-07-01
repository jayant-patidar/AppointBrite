import { Box, Typography, Avatar, Rating, Chip, Skeleton, useTheme } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import type { Business } from '@/types/business.types';

interface BusinessHeaderProps {
  business?: Business;
  isLoading: boolean;
}

export default function BusinessHeader({ business, isLoading }: BusinessHeaderProps) {
  const theme = useTheme();
  const coverImage = business?.mediaGallery?.[0] || 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80';
  const logoImage = business?.mediaGallery?.[1] || '';

  if (isLoading) {
    return (
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={250} sx={{ borderRadius: 3 }} />
        <Box sx={{ display: 'flex', mt: -4, px: 3, alignItems: 'flex-end', gap: 2 }}>
          <Skeleton variant="circular" width={100} height={100} sx={{ border: '4px solid', borderColor: 'background.paper' }} />
          <Box sx={{ pb: 1, flex: 1 }}>
            <Skeleton variant="text" width="40%" height={40} />
            <Skeleton variant="text" width="20%" />
          </Box>
        </Box>
      </Box>
    );
  }

  if (!business) return null;

  return (
    <Box sx={{ mb: 6 }}>
      {/* Cover Image */}
      <Box
        sx={{
          height: { xs: 200, md: 300 },
          width: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'grey.200',
        }}
      >
        <Box
          component="img"
          src={coverImage}
          alt={business.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Subtle gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
          }}
        />
      </Box>

      {/* Header Info area */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: { xs: 'center', sm: 'flex-end' },
          mt: { xs: -5, sm: -6 }, 
          px: { xs: 2, md: 4 }, 
          gap: 3,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Avatar
          src={logoImage}
          alt={business.name}
          sx={{
            width: { xs: 100, sm: 120 },
            height: { xs: 100, sm: 120 },
            border: `4px solid ${theme.palette.background.default}`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            bgcolor: 'background.paper',
            fontSize: 40,
            color: 'primary.main',
            fontWeight: 700,
          }}
        >
          {business.name.charAt(0)}
        </Avatar>
        
        <Box sx={{ flex: 1, pb: 1, textAlign: { xs: 'center', sm: 'left' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1.5, mb: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              {business.name}
            </Typography>
            <Chip 
              label={business.category.replace('_', ' ')} 
              size="small" 
              color="primary" 
              sx={{ fontWeight: 700, borderRadius: 2 }} 
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 2, flexWrap: 'wrap' }}>
            {business.rating && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Rating value={business.rating.average} precision={0.5} size="small" readOnly />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {business.rating.average} ({business.rating.count} reviews)
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
              <LocationOnIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {business.location.address}, {business.location.city}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Description */}
      <Box sx={{ mt: 4, px: { xs: 2, md: 4 } }}>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {business.description}
        </Typography>
      </Box>
    </Box>
  );
}
