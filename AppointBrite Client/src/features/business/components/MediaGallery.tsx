import { Box, Typography, ImageList, ImageListItem } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

interface MediaGalleryProps {
  images: string[];
}

export default function MediaGallery({ images }: MediaGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <PhotoCameraIcon color="primary" />
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Gallery
        </Typography>
      </Box>
      
      <ImageList variant="masonry" cols={3} gap={16}>
        {images.map((img, idx) => (
          <ImageListItem key={idx} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <img
              src={`${img}?w=248&fit=crop&auto=format`}
              srcSet={`${img}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={`Gallery image ${idx + 1}`}
              loading="lazy"
              style={{
                borderRadius: 12,
                transition: 'transform 0.3s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}
