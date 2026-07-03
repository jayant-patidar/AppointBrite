import { useState } from 'react';
import { 
  Box, Typography, Button, CircularProgress, 
  Grid, Card, CardContent, IconButton, Menu, MenuItem, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '@/api/service';
import type { Service } from '@/types/service.types';
import ServiceFormDrawer from '../components/ServiceFormDrawer';

export default function ServiceManagementPage() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeMenuService, setActiveMenuService] = useState<Service | null>(null);

  const { data: services, isLoading } = useQuery({
    queryKey: ['myServices'],
    queryFn: serviceApi.getMyServices,
  });

  const deleteMutation = useMutation({
    mutationFn: serviceApi.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myServices'] });
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: serviceApi.updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myServices'] });
    }
  });

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, service: Service) => {
    setAnchorEl(event.currentTarget);
    setActiveMenuService(service);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setActiveMenuService(null);
  };

  const handleEdit = () => {
    setSelectedService(activeMenuService);
    setIsDrawerOpen(true);
    handleCloseMenu();
  };

  const handleDelete = () => {
    if (activeMenuService && window.confirm(`Are you sure you want to delete ${activeMenuService.name}?`)) {
      deleteMutation.mutate(activeMenuService._id);
    }
    handleCloseMenu();
  };

  const handleToggleStatus = () => {
    if (activeMenuService) {
      toggleStatusMutation.mutate({ 
        id: activeMenuService._id, 
        data: { isActive: !activeMenuService.isActive } 
      });
    }
    handleCloseMenu();
  };

  const handleOpenDrawerForCreate = () => {
    setSelectedService(null);
    setIsDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Services</Typography>
          <Typography color="text.secondary">Manage what you offer, prices, and booking rules.</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleOpenDrawerForCreate}
          sx={{ borderRadius: 999, fontWeight: 700, px: 3 }}
        >
          Add Service
        </Button>
      </Box>

      {/* Services Grid */}
      {!services || services.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 8, bgcolor: 'background.paper', borderRadius: 4, border: '1px dashed', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>No Services Yet</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>Add your first service to start accepting bookings.</Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenDrawerForCreate} sx={{ borderRadius: 999 }}>
            Add Service
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {services.map((service: Service) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={service._id}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative',
                  bgcolor: service.isActive ? 'background.paper' : 'action.hover',
                  opacity: service.isActive ? 1 : 0.8,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 2
                  }
                }}
              >
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}>
                        {service.name}
                      </Typography>
                      {service.category && (
                        <Chip label={service.category} size="small" variant="outlined" sx={{ mb: 1 }} />
                      )}
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={(e) => handleOpenMenu(e, service)}
                      sx={{ mr: -1, mt: -1 }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {service.description || 'No description provided.'}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AttachMoneyIcon fontSize="small" color="primary" />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>${service.price.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon fontSize="small" color="primary" />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {service.durationMinutes} min {service.bufferMinutes > 0 ? `(+${service.bufferMinutes}m buffer)` : ''}
                      </Typography>
                    </Box>
                    {service.capacity > 1 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PeopleIcon fontSize="small" color="primary" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Up to {service.capacity}</Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Status Badges */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                    {!service.isActive && (
                      <Chip label="Suspended" size="small" color="warning" sx={{ fontWeight: 600 }} />
                    )}
                    {service.requiresApproval && (
                      <Chip label="Requires Approval" size="small" color="info" variant="outlined" />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{ '& .MuiMenu-paper': { minWidth: 150, borderRadius: 2, mt: 1, boxShadow: 3 } }}
      >
        <MenuItem onClick={handleEdit}>Edit Service</MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          {activeMenuService?.isActive ? 'Suspend Service' : 'Activate Service'}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>Delete</MenuItem>
      </Menu>

      {/* Slide-out Drawer */}
      <ServiceFormDrawer 
        open={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        service={selectedService}
      />
    </Box>
  );
}
