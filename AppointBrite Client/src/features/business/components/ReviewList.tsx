import { Box, Typography, Avatar, Rating, Paper, Stack } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import type { Review } from '@/types/review.types';
import { formatDate } from '@/utils/formatDate';

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No reviews yet.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <RateReviewIcon color="primary" />
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Reviews
        </Typography>
      </Box>
      
      <Stack spacing={3}>
        {reviews.map((review) => (
          <Paper 
            key={review._id}
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 3,
              bgcolor: 'background.default',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                {/* Mocking user initials for now since Review might not populate user details fully in this scope */}
                U
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Customer
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(review.createdAt)}
                </Typography>
              </Box>
              <Rating value={review.rating} size="small" readOnly />
            </Box>
            
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              {review.comment}
            </Typography>
            
            {review.responseFromBusiness && (
              <Box 
                sx={{ 
                  mt: 2, 
                  p: 2, 
                  bgcolor: 'action.hover', 
                  borderRadius: 2,
                  borderLeft: '4px solid',
                  borderColor: 'primary.main'
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', display: 'block', mb: 0.5 }}>
                  Response from Owner
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {review.responseFromBusiness}
                </Typography>
              </Box>
            )}
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
