import { Box, Typography, Paper, Chip, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import type { Business } from '@/types/business.types';

export default function BusinessDetails({ business }: { business: Business }) {
  const hasTrustInfo = business.establishedYear || business.insuranceInfo?.providerName || (business.licenses && business.licenses.length > 0);
  const hasServiceArea = business.serviceArea && (business.serviceArea.maxRadiusMiles || (business.serviceArea.coveredZipCodes && business.serviceArea.coveredZipCodes.length > 0));

  if (!hasTrustInfo && !hasServiceArea) {
    return null;
  }

  return (
    <Paper 
      sx={{ 
        p: { xs: 3, sm: 4 }, 
        mb: 4, 
        borderRadius: 4, 
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ position: 'absolute', top: 0, left: 0, w: '100%', h: '4px', bgcolor: 'primary.main', width: '100%' }} />
      
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.primary' }}>
        <InfoOutlinedIcon color="primary" fontSize="medium" /> 
        About the Business
      </Typography>
      
      <Grid container spacing={4}>
        {/* Trust & Verification Section */}
        {hasTrustInfo && (
          <Grid size={{ xs: 12, sm: hasServiceArea ? 6 : 12 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              
              {business.establishedYear && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 2, color: 'text.secondary' }}>
                    <CalendarTodayOutlinedIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}>Established</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{business.establishedYear}</Typography>
                  </Box>
                </Box>
              )}

              {business.insuranceInfo?.providerName && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 2, color: 'text.secondary' }}>
                    <ShieldOutlinedIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}>Insurance Provider</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{business.insuranceInfo.providerName}</Typography>
                    {business.insuranceInfo.coverageAmount && (
                      <Typography variant="body2" color="text.secondary">Coverage: {business.insuranceInfo.coverageAmount}</Typography>
                    )}
                  </Box>
                </Box>
              )}

              {business.licenses && business.licenses.length > 0 && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 2, color: 'text.secondary' }}>
                    <WorkspacePremiumOutlinedIcon fontSize="small" />
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem', mb: 0.5 }}>Licenses</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {business.licenses.map((license, index) => (
                        <Chip 
                          key={index} 
                          label={`${license.licenseType || 'License'} - ${license.licenseNumber || 'Verified'}`}
                          size="small"
                          color="success"
                          variant="outlined"
                          sx={{ borderRadius: '8px', fontWeight: 600, bgcolor: 'success.50' }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}
              
            </Box>
          </Grid>
        )}

        {/* Service Area Section */}
        {hasServiceArea && (
          <Grid size={{ xs: 12, sm: hasTrustInfo ? 6 : 12 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              
              {business.serviceArea?.maxRadiusMiles ? (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 2, color: 'text.secondary' }}>
                    <DirectionsCarOutlinedIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}>Travel Radius</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Up to {business.serviceArea.maxRadiusMiles} miles</Typography>
                  </Box>
                </Box>
              ) : null}

              {business.serviceArea?.coveredZipCodes && business.serviceArea.coveredZipCodes.length > 0 && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 2, color: 'text.secondary' }}>
                    <LocationCityOutlinedIcon fontSize="small" />
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem', mb: 0.5 }}>Service Areas (ZIPs)</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {business.serviceArea.coveredZipCodes.map((zip, i) => (
                        <Chip 
                          key={i} 
                          label={zip} 
                          size="small" 
                          sx={{ bgcolor: 'grey.100', color: 'text.primary', fontWeight: 500, borderRadius: '8px' }} 
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}
              
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
