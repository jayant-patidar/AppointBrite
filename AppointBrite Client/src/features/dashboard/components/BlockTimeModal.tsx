import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '@/api/endpoints/bookings.api';
import { format, addHours } from 'date-fns';

interface BlockTimeModalProps {
  open: boolean;
  onClose: () => void;
  businessId: string;
  initialStartTime?: Date;
  staffId?: string;
}

export default function BlockTimeModal({ open, onClose, businessId, initialStartTime, staffId }: BlockTimeModalProps) {
  const queryClient = useQueryClient();

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [note, setNote] = useState('Personal time / Unavailable');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      const defaultStart = initialStartTime || new Date();
      const defaultEnd = addHours(defaultStart, 1);
      setStartTime(format(defaultStart, "yyyy-MM-dd'T'HH:mm"));
      setEndTime(format(defaultEnd, "yyyy-MM-dd'T'HH:mm"));
      setNote('Personal time / Unavailable');
      setError('');
    }
  }, [open, initialStartTime]);

  const blockTimeMutation = useMutation({
    mutationFn: (payload: { startTime: string; endTime: string; note: string; staffId?: string }) =>
      bookingsApi.blockTime(businessId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessBookings'] });
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to block time');
    }
  });

  const handleSubmit = () => {
    setError('');
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      setError('End time must be after start time');
      return;
    }

    blockTimeMutation.mutate({
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      note,
      staffId
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Block Out Time</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Use this to mark a specific time slot as unavailable for booking.
        </Typography>

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            label="Start Time"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            fullWidth
            label="End Time"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>

        <TextField
          fullWidth
          label="Reason (Optional)"
          multiline
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Lunch break, Doctor appointment"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={blockTimeMutation.isPending}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={blockTimeMutation.isPending}
        >
          {blockTimeMutation.isPending ? 'Blocking...' : 'Block Time'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
