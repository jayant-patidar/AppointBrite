import React, { useState } from 'react';
import { 
  Drawer, Box, Typography, IconButton, TextField, 
  Button, MenuItem, FormControl, InputLabel, Select,
  Stack, CircularProgress,
  OutlinedInput, InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { businessApi } from '@/api/business';
import { useSnackbar } from 'notistack';

interface CreatePromotionDrawerProps {
  open: boolean;
  onClose: () => void;
  businessId: string;
  onSuccess: () => void;
  promotion?: any;
}

export default function CreatePromotionDrawer({ open, onClose, businessId, onSuccess, promotion }: CreatePromotionDrawerProps) {
  const { enqueueSnackbar } = useSnackbar();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: '',
    maxUses: '',
    validUntil: ''
  });

  React.useEffect(() => {
    if (open) {
      if (promotion) {
        setFormData({
          code: promotion.code || '',
          type: promotion.type || 'PERCENTAGE',
          value: promotion.value || '',
          maxUses: promotion.maxUses || '',
          validUntil: promotion.validUntil ? new Date(promotion.validUntil).toISOString().split('T')[0] : ''
        });
      } else {
        setFormData({
          code: '',
          type: 'PERCENTAGE',
          value: '',
          maxUses: '',
          validUntil: ''
        });
      }
    }
  }, [open, promotion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as string]: value }));
  };

  const handleGenerateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.value) {
      enqueueSnackbar('Please fill in all required fields.', { variant: 'error' });
      return;
    }

    try {
      setLoading(true);
      const payload: any = {
        code: formData.code,
        type: formData.type,
        value: Number(formData.value)
      };

      if (formData.maxUses) payload.maxUses = Number(formData.maxUses);
      if (formData.validUntil) payload.validUntil = formData.validUntil;

      if (promotion) {
        await businessApi.updatePromotion(businessId, promotion._id, payload);
        enqueueSnackbar('Promotion updated successfully!', { variant: 'success' });
      } else {
        await businessApi.createPromotion(businessId, payload);
        enqueueSnackbar('Promotion created successfully!', { variant: 'success' });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || `Failed to ${promotion ? 'update' : 'create'} promotion`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={onClose}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 450 }, p: 0, bgcolor: 'background.default' } }}
    >
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.paper' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon color="primary" /> {promotion ? 'Update' : 'Create'} Promotion
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3, height: 'calc(100% - 140px)', overflowY: 'auto' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Offer discounts to attract new customers or reward your loyal clients.
        </Typography>

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Promo Code</Typography>
          <OutlinedInput
            fullWidth
            size="small"
            name="code"
            placeholder="e.g. SUMMER20"
            value={formData.code}
            onChange={handleChange}
            inputProps={{ style: { textTransform: 'uppercase' } }}
            endAdornment={
              <InputAdornment position="end">
                <Button size="small" onClick={handleGenerateCode}>Generate</Button>
              </InputAdornment>
            }
          />
        </Box>

        <Stack direction="row" spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Discount Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              label="Discount Type"
              onChange={handleChange as any}
            >
              <MenuItem value="PERCENTAGE">Percentage (%)</MenuItem>
              <MenuItem value="FIXED">Fixed Amount ($)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            label="Discount Value"
            name="value"
            type="number"
            placeholder={formData.type === 'PERCENTAGE' ? '20' : '15'}
            value={formData.value}
            onChange={handleChange}
          />
        </Stack>

        <TextField
          fullWidth
          size="small"
          label="Valid Until (Optional)"
          name="validUntil"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={formData.validUntil}
          onChange={handleChange}
          helperText="Leave blank for a never-expiring code."
        />

        <TextField
          fullWidth
          size="small"
          label="Maximum Uses (Optional)"
          name="maxUses"
          type="number"
          placeholder="e.g. 50"
          value={formData.maxUses}
          onChange={handleChange}
          helperText="Limit how many times this code can be redeemed globally."
        />
        
        {/* We can add service restrictions here later based on user requirement */}
      </Box>

      <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', gap: 2 }}>
        <Button variant="outlined" fullWidth onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" fullWidth type="submit" onClick={handleSubmit} disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}>
          {loading ? (promotion ? 'Updating...' : 'Creating...') : (promotion ? 'Update Promo' : 'Create Promo')}
        </Button>
      </Box>
    </Drawer>
  );
}
