import { Box, Typography, Card, CardContent, Divider, Stack } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatCurrency } from '@/utils/formatCurrency';
import type { Service } from '@/types/service.types';

interface ServiceMenuProps {
  services: Service[];
}

export default function ServiceMenu({ services }: ServiceMenuProps) {
  if (!services || services.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No services available at this time.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
        Services & Pricing
      </Typography>
      
      <Stack spacing={2}>
        {services.map((service) => (
          <Card 
            key={service._id} 
            elevation={0}
            sx={{ 
              borderRadius: 3, 
              border: '1px solid',
              borderColor: 'divider',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                borderColor: 'primary.main',
              }
            }}
          >
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {service.name}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {formatCurrency(service.price)}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, pr: { sm: 10 } }}>
                {service.description}
              </Typography>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, color: 'text.secondary' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeIcon fontSize="small" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {service.durationMinutes} mins
                  </Typography>
                </Box>
                {/* Could add more info here if needed */}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
