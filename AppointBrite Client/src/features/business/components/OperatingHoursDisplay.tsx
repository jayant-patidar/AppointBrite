import { Box, Typography, Paper, Stack } from '@mui/material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import type { OperatingHours } from '@/types/business.types';

interface OperatingHoursDisplayProps {
  hours: OperatingHours[];
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function OperatingHoursDisplay({ hours }: OperatingHoursDisplayProps) {
  const currentDay = new Date().getDay();

  if (!hours || hours.length === 0) {
    return null;
  }

  // Sort hours to ensure 0-6 order
  const sortedHours = [...hours].sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        borderRadius: 4, 
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <AccessTimeFilledIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Operating Hours
        </Typography>
      </Box>

      <Stack spacing={1.5}>
        {sortedHours.map((h) => {
          const isToday = h.dayOfWeek === currentDay;
          return (
            <Box 
              key={h.dayOfWeek}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                p: 1.5,
                borderRadius: 2,
                bgcolor: isToday ? 'primary.50' : 'transparent',
                color: isToday ? 'primary.900' : 'text.primary',
                ...(isToday && {
                   border: '1px solid',
                   borderColor: 'primary.100',
                })
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ fontWeight: isToday ? 700 : 600 }}
              >
                {DAYS[h.dayOfWeek]}
                {isToday && ' (Today)'}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: isToday ? 700 : 500,
                  color: h.isClosed ? 'error.main' : 'inherit'
                }}
              >
                {h.isClosed ? 'Closed' : `${h.openTime} - ${h.closeTime}`}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}
