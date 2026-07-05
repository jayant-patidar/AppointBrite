import { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Button, IconButton, 
  Chip, Switch, CircularProgress, Tooltip, Stack,
  Card, CardContent, Divider
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import CreatePromotionDrawer from '../components/CreatePromotionDrawer';
import { businessApi } from '@/api/business';
import { useSnackbar } from 'notistack';

export default function PromotionsPage() {
  const { enqueueSnackbar } = useSnackbar();
  
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);

  const fetchPromotions = async (id: string) => {
    try {
      setLoading(true);
      const data = await businessApi.getPromotions(id);
      setPromotions(data);
    } catch (error) {
      console.error('Failed to fetch promotions', error);
      enqueueSnackbar('Failed to load promotions', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const myBusiness = await businessApi.getMyBusiness();
        if (myBusiness && myBusiness._id) {
          setBusinessId(myBusiness._id);
          await fetchPromotions(myBusiness._id);
        }
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, [enqueueSnackbar]);

  const handleToggle = async (promotionId: string) => {
    if (!businessId) return;
    try {
      await businessApi.togglePromotion(businessId, promotionId);
      enqueueSnackbar('Promotion status updated', { variant: 'success' });
      fetchPromotions(businessId);
    } catch (_error) {
      enqueueSnackbar('Failed to update status', { variant: 'error' });
    }
  };

  const handleDelete = async (promotionId: string) => {
    if (!businessId) return;
    if (!window.confirm('Are you sure you want to delete this promotion?')) return;
    try {
      await businessApi.deletePromotion(businessId, promotionId);
      enqueueSnackbar('Promotion deleted', { variant: 'success' });
      fetchPromotions(businessId);
    } catch (_error) {
      enqueueSnackbar('Failed to delete promotion', { variant: 'error' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar('Code copied to clipboard!', { variant: 'success' });
  };

  const renderEmptyState = () => (
    <Box sx={{ 
      textAlign: 'center', 
      py: 10, 
      bgcolor: 'background.paper', 
      borderRadius: 4, 
      border: '1px dashed',
      borderColor: 'divider',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
    }}>
      <LocalOfferIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>No Promotions Yet</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
        Attract more customers by offering exclusive discounts. Create your first promotion to get started!
      </Typography>
        <Button 
          variant="contained" 
          size="large" 
          startIcon={<AddIcon />}
          onClick={() => setDrawerOpen(true)}
          sx={{ borderRadius: 8, px: 4 }}
        >
          Create Promotion
        </Button>
    </Box>
  );

  return (
    <>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
        
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoAwesomeIcon color="primary" /> Promotions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your active discounts, track usage, and boost sales.
            </Typography>
          </Box>
          {promotions.length > 0 && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setDrawerOpen(true)}
              sx={{ borderRadius: 2 }}
            >
              New Promo
            </Button>
          )}
        </Box>

        {/* Content */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : promotions.length === 0 ? (
          renderEmptyState()
        ) : (
          <Grid container spacing={3}>
            {promotions.map((promo) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={promo._id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 3, 
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.08)'
                    },
                    border: '1px solid',
                    borderColor: promo.isActive ? 'primary.light' : 'divider',
                    bgcolor: promo.isActive ? 'background.paper' : 'action.hover'
                  }}
                >
                  {/* Status Indicator Bar */}
                  <Box sx={{ 
                    height: 4, 
                    width: '100%', 
                    bgcolor: promo.isActive ? 'primary.main' : 'text.disabled',
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }} />

                  <CardContent sx={{ p: 3, pt: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Chip 
                          label={promo.isActive ? 'Active' : 'Paused'} 
                          size="small" 
                          color={promo.isActive ? 'success' : 'default'}
                          sx={{ fontWeight: 600, mb: 1 }}
                        />
                        <Typography variant="h5" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                          {promo.code}
                          <Tooltip title="Copy Code">
                            <IconButton size="small" onClick={() => copyToClipboard(promo.code)}>
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Typography>
                      </Box>
                      <Switch 
                        checked={promo.isActive} 
                        onChange={() => handleToggle(promo._id)} 
                        color="primary"
                      />
                    </Box>

                    <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>
                      {promo.type === 'PERCENTAGE' ? `${promo.value}%` : `$${promo.value}`} <Typography component="span" variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>OFF</Typography>
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Uses</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {promo.currentUses} {promo.maxUses ? `/ ${promo.maxUses}` : ''}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Revenue Gen.</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                          ${promo.totalRevenueGenerated?.toFixed(2) || '0.00'}
                        </Typography>
                      </Box>

                      {promo.validUntil && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Expires</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
                            {new Date(promo.validUntil).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}
                    </Stack>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <Tooltip title="Delete Promotion">
                        <IconButton size="small" color="error" onClick={() => handleDelete(promo._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

      </Box>

      {/* Drawer */}
      {businessId && (
        <CreatePromotionDrawer 
          open={drawerOpen} 
          onClose={() => setDrawerOpen(false)} 
          businessId={businessId}
          onSuccess={() => fetchPromotions(businessId)}
        />
      )}
    </>
  );
}
