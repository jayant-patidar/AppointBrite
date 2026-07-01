import { Card, CardMedia, CardContent, Typography, Box, Rating, Chip, alpha, useTheme } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import type { Business } from '@/types/business.types';

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const theme = useTheme();
  // Use a nice unsplash fallback if media gallery is empty
  const defaultImage = 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&w=600&q=80';
  const imageUrl = business.mediaGallery && business.mediaGallery.length > 0 
    ? business.mediaGallery[0] 
    : defaultImage;

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        // Make sure image zooms without scaling the card too much, the card itself scales slightly due to theme
        '&:hover .MuiCardMedia-root': {
          transform: 'scale(1.08)',
        },
        '&:hover .gradient-overlay': {
          opacity: 0.8
        }
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden', height: 200 }}>
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt={business.name}
          sx={{
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            objectFit: 'cover'
          }}
        />
        {/* Gradient Overlay for premium feel */}
        <Box 
          className="gradient-overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to top, ${theme.palette.background.paper} 0%, transparent 100%)`,
            opacity: 0.4,
            transition: 'opacity 0.3s ease'
          }}
        />
        {/* Category Chip Floating on Image */}
        <Chip 
          label={business.category.replace('_', ' ')} 
          size="small" 
          sx={{ 
            position: 'absolute',
            top: 16,
            right: 16,
            fontWeight: 700, 
            fontSize: '0.7rem',
            backdropFilter: 'blur(8px)',
            backgroundColor: alpha(theme.palette.background.paper, 0.85),
            color: theme.palette.text.primary,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
              color: '#fff',
            }
          }} 
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3, pt: 2, position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h5" sx={{ lineHeight: 1.2, fontWeight: 800, letterSpacing: '-0.02em' }}>
            {business.name}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating 
            value={business.rating?.average || 0} 
            precision={0.5} 
            readOnly 
            size="small" 
            sx={{ 
              color: '#F59E0B', 
              filter: 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))' 
            }} 
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 600 }}>
            {business.rating?.average || 0} ({business.rating?.count || 0} reviews)
          </Typography>
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2.5,
            fontWeight: 500
          }}
        >
          <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.primary.main }} />
          {business.location?.address}, {business.location?.city}
        </Typography>

        <Typography 
          variant="body2" 
          color="text.primary" 
          sx={{ 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden',
            lineHeight: 1.6,
            opacity: 0.9
          }}
        >
          {business.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
