import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Stack,
  Chip,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { businessApi } from '@/api/business';

interface CustomerDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  customer: any | null;
  businessId: string;
}

export default function CustomerDetailsDrawer({ open, onClose, customer, businessId }: CustomerDetailsDrawerProps) {
  const queryClient = useQueryClient();

  const banMutation = useMutation({
    mutationFn: (action: 'BAN' | 'UNBAN') =>
      businessApi.banCustomer(businessId, {
        email: customer?.email,
        phone: customer?.phone,
        customerId: customer?.customerId,
        action
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessCustomers'] });
      onClose();
    }
  });

  if (!customer) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 400 }, p: 3 } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Customer Profile
        </Typography>
        <IconButton onClick={onClose} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Avatar 
          sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main', fontSize: '2rem' }}
        >
          {customer.firstName?.charAt(0) || 'G'}
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {customer.firstName} {customer.lastName}
        </Typography>
        {customer.isGuest && (
          <Chip label="Guest User" size="small" color="default" sx={{ mt: 1 }} />
        )}
        {customer.isBanned && (
          <Chip label="Banned" size="small" color="error" sx={{ mt: 1 }} icon={<BlockIcon />} />
        )}
      </Box>

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase' }}>
        Contact Info
      </Typography>
      <Stack spacing={2} sx={{ mb: 4 }}>
        {customer.email && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon color="action" fontSize="small" />
            <Typography variant="body2">{customer.email}</Typography>
          </Box>
        )}
        {customer.phone && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon color="action" fontSize="small" />
            <Typography variant="body2">{customer.phone}</Typography>
          </Box>
        )}
        {!customer.email && !customer.phone && (
          <Typography variant="body2" color="text.secondary">No contact info available</Typography>
        )}
      </Stack>

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase' }}>
        Lifetime Value
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: 'background.default', p: 2, borderRadius: 2, mb: 4 }}>
        <Box>
          <Typography variant="body2" color="text.secondary">Total Bookings</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{customer.totalBookings}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>${customer.totalRevenue?.toFixed(2)}</Typography>
        </Box>
      </Box>

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase' }}>
        Activity
      </Typography>
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">Last Visit</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {customer.lastVisitDate ? format(new Date(customer.lastVisitDate), 'MMM d, yyyy') : 'Never'}
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ my: 2 }} />
        {customer.isBanned ? (
          <Button 
            fullWidth 
            variant="outlined" 
            color="success" 
            startIcon={<CheckCircleIcon />}
            onClick={() => banMutation.mutate('UNBAN')}
            disabled={banMutation.isPending}
          >
            Unban Customer
          </Button>
        ) : (
          <Button 
            fullWidth 
            variant="outlined" 
            color="error" 
            startIcon={<BlockIcon />}
            onClick={() => {
              if (confirm('Are you sure you want to ban this customer? They will not be able to book with you.')) {
                banMutation.mutate('BAN');
              }
            }}
            disabled={banMutation.isPending}
          >
            Ban Customer
          </Button>
        )}
      </Box>
    </Drawer>
  );
}
