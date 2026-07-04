import { Box, Typography, Avatar, Rating, Chip, Skeleton, useTheme, IconButton, alpha } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { Business } from '@/types/business.types';
import { useFavorites } from '@/hooks/useFavorites';
import { getDefaultImageForCategory } from '@/utils/categoryImages';
interface BusinessHeaderProps {
  business?: Business;
  isLoading: boolean;
}

export default function BusinessHeader({ business, isLoading }: BusinessHeaderProps) {
  const theme = useTheme();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFavorite = business ? favoriteIds.has(business._id) : false;
  const defaultImage = getDefaultImageForCategory(business?.category);
  const coverImage = business?.mediaGallery && business.mediaGallery.length > 0 && business.mediaGallery[0] !== ''
    ? business.mediaGallery[0]
    : defaultImage;
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
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', sm: 'flex-start' }, gap: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1.5, mb: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                  {business.name}
                </Typography>
                {business.category && (
                  <Chip 
                    label={business.category.replace('_', ' ')} 
                    size="small" 
                    color="primary" 
                    sx={{ fontWeight: 700, borderRadius: 2 }} 
                  />
                )}
                {business._id && (
                  <IconButton 
                    onClick={(e) => toggleFavorite(business._id, e)}
                    sx={{
                      color: isFavorite ? '#FF6B6B' : 'text.secondary',
                      bgcolor: 'background.paper',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      '&:hover': { transform: 'scale(1.1)', bgcolor: 'background.paper' },
                      transition: 'all 0.2s'
                    }}
                  >
                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                )}
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
                {business.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                    <LocationOnIcon fontSize="small" />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {business.location.address}, {business.location.city}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Description */}
          <Box sx={{ mt: 2, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6, maxWidth: 800, mx: { xs: 'auto', sm: 0 } }}>
              {business.description}
            </Typography>
          </Box>

          {/* Sub-categories & Amenities */}
          <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            {business.subCategories?.map((sub, i) => (
              <Chip 
                key={`sub-${i}`} 
                label={sub} 
                size="small" 
                sx={{ 
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  fontWeight: 700,
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                  px: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                    transform: 'translateY(-1px)',
                  }
                }} 
              />
            ))}
            {business.amenities?.map((amenity, i) => (
              <Chip 
                key={`am-${i}`} 
                icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: 'text.secondary' }} />}
                label={amenity} 
                size="small" 
                sx={{ 
                  bgcolor: 'background.paper', 
                  color: 'text.secondary', 
                  fontWeight: 600, 
                  borderRadius: '12px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                  border: '1px solid',
                  borderColor: 'divider',
                  px: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
                    transform: 'translateY(-1px)',
                  }
                }} 
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
