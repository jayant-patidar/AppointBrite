/**
 * BusinessProfilePage — public business profile with services, reviews, and booking/reservation entry.
 */
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Box, Typography, Skeleton, Button } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import BusinessHeader from '../components/BusinessHeader';
import ServiceMenu from '../components/ServiceMenu';
import OperatingHoursDisplay from '../components/OperatingHoursDisplay';
import MediaGallery from '../components/MediaGallery';
import ReviewList from '../components/ReviewList';
import StickyBookingWidget from '../components/StickyBookingWidget';
import BusinessDetails from '../components/BusinessDetails';
import { useBusiness, useBusinessServices, useBusinessReviews, useBusinessPromotions } from '../hooks/useBusiness';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


export default function BusinessProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: business, isLoading: isBusinessLoading, isError: isBusinessError } = useBusiness(id);
  const { data: services, isLoading: isServicesLoading } = useBusinessServices(id);
  const { data: reviews, isLoading: isReviewsLoading } = useBusinessReviews(id);
  const { data: promotions, isLoading: isPromotionsLoading } = useBusinessPromotions(id);

  const isLoading = isBusinessLoading || isServicesLoading || isReviewsLoading || isPromotionsLoading;

  if (isLoading && (!business || !services || !reviews)) {
    return (
      <Box sx={{ pb: { xs: 12, md: 8 } }}>
        <BusinessHeader isLoading={true} />
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              {/* Service Skeletons */}
              {Array.from(new Array(3)).map((_, i) => (
                <Box key={i} sx={{ mb: 3 }}>
                  <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 3 }} />
                </Box>
              ))}
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (isBusinessError || !business) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" color="error">Failed to load business profile.</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ pb: { xs: 12, md: 8 } }}>
      <BusinessHeader business={business} isLoading={isLoading} />
      
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Main Content (Left column on Desktop) */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Promotions Banner */}
            {promotions && promotions.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalOfferIcon color="primary" /> Active Offers
                </Typography>
                <Grid container spacing={2}>
                  {promotions.map((promo: any) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={promo.code}>
                      <Box sx={{
                        p: 2.5,
                        borderRadius: 3,
                        bgcolor: 'primary.50',
                        border: '1px solid',
                        borderColor: 'primary.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2
                      }}>
                        <Box>
                          <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800 }}>
                            {promo.type === 'PERCENTAGE' ? `${promo.value}% OFF` : `$${promo.value} OFF`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Use code at checkout
                          </Typography>
                        </Box>
                        <Box sx={{
                          px: 2, py: 1,
                          bgcolor: 'background.paper',
                          borderRadius: 2,
                          border: '1px dashed',
                          borderColor: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'primary.50' }
                        }}
                        onClick={() => {
                          navigator.clipboard.writeText(promo.code);
                          // We could use a snackbar here, but simple alert for now
                          alert(`Code ${promo.code} copied to clipboard!`);
                        }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                            {promo.code}
                          </Typography>
                          <ContentCopyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <ServiceMenu services={services || []} />
            <MediaGallery images={business.mediaGallery?.length ? business.mediaGallery : []} />
            <ReviewList reviews={reviews || []} />
            <Box sx={{ mt: 2 }}>
              <BusinessDetails business={business} />
            </Box>
          </Grid>
          
          {/* Sidebar (Right column on Desktop) */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Box sx={{ mb: 4, position: 'relative', zIndex: 10 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  startIcon={<EventAvailableIcon />}
                  onClick={() => navigate(`/book/${business._id}`)}
                  sx={{
                    mb: 3,
                    py: 1.5,
                    borderRadius: 9999,
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
                    '&:hover': {
                      boxShadow: '0 12px 28px rgba(37, 99, 235, 0.4)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease-in-out',
                    display: { xs: 'none', md: 'flex' }
                  }}
                >
                  Book Appointment or Reservation
                </Button>
                <OperatingHoursDisplay hours={business.operatingHours} />
              </Box>
              {/* Sticky Booking Widget handles its own sticky positioning on mobile/desktop */}
              <StickyBookingWidget businessId={business._id} businessName={business.name} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
