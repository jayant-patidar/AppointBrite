import { useState } from 'react';
import { 
  Box, Typography, Button, CircularProgress, 
  Grid, Card, CardContent, IconButton, Menu, MenuItem,
  Avatar, Stack, Chip, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { useStaff, useDeleteStaff } from '../hooks/useStaff';
import StaffFormDrawer from '../components/StaffFormDrawer';
import type { Staff } from '@/types/staff.types';

export default function StaffManagementPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeMenuStaff, setActiveMenuStaff] = useState<Staff | null>(null);

  const { data: staffList, isLoading } = useStaff();
  const deleteMutation = useDeleteStaff();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, staff: Staff) => {
    setAnchorEl(event.currentTarget);
    setActiveMenuStaff(staff);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setActiveMenuStaff(null);
  };

  const handleEdit = () => {
    setSelectedStaff(activeMenuStaff);
    setIsDrawerOpen(true);
    handleCloseMenu();
  };

  const handleDelete = () => {
    if (activeMenuStaff && window.confirm(`Are you sure you want to remove ${activeMenuStaff.userId.firstName} from your business?`)) {
      deleteMutation.mutate(activeMenuStaff._id);
    }
    handleCloseMenu();
  };

  const handleOpenDrawerForCreate = () => {
    setSelectedStaff(null);
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
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Staff Members</Typography>
          <Typography color="text.secondary">Manage your team, their services, and working hours.</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleOpenDrawerForCreate}
          sx={{ borderRadius: 999 }}
        >
          Add Staff
        </Button>
      </Box>

      {/* Staff Grid */}
      {staffList?.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8, borderRadius: 4, bgcolor: 'background.default' }} variant="outlined">
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No staff members added yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Add staff to start assigning services and appointments to them.
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenDrawerForCreate}>
            Add First Staff Member
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {staffList?.map((staff) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={staff._id}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: 4, 
                transition: 'all 0.2s',
                borderTop: `4px solid ${staff.colorCode || '#2563EB'}`,
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' } 
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                      <Avatar 
                        src={staff.userId.profileImage}
                        sx={{ 
                          width: 56, 
                          height: 56, 
                          bgcolor: `${staff.colorCode}20`,
                          color: staff.colorCode,
                          fontWeight: 700
                        }}
                      >
                        {staff.userId.firstName.charAt(0)}{staff.userId.lastName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                          {staff.userId.firstName} {staff.userId.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          Staff Member
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <IconButton size="small" onClick={(e) => handleOpenMenu(e, staff)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>
                      <EmailIcon fontSize="small" />
                      <Typography variant="body2">{staff.userId.email}</Typography>
                    </Box>
                    {staff.userId.phoneNumber && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>
                        <PhoneIcon fontSize="small" />
                        <Typography variant="body2">{staff.userId.phoneNumber}</Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, color: 'text.secondary' }}>
                      <LocalOfferIcon fontSize="small" sx={{ mt: 0.3 }} />
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {staff.providedServices?.length > 0 ? (
                          staff.providedServices.map(srv => (
                            <Chip key={srv._id} label={srv.name} size="small" variant="outlined" />
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>No services assigned</Typography>
                        )}
                      </Box>
                    </Box>
                  </Stack>
                  
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEdit}>Edit Staff Details</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>Remove from Business</MenuItem>
      </Menu>

      <StaffFormDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        staff={selectedStaff}
      />
    </Box>
  );
}
