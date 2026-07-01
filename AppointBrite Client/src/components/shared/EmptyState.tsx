/**
 * Empty state — shown when a list or search has no results.
 */
import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export default function EmptyState({
  title = 'No results found',
  description = 'Try adjusting your search or filters.',
  icon,
  sx,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 4,
        textAlign: 'center',
        ...sx,
      }}
    >
      <Box sx={{ color: 'text.secondary', mb: 2 }}>
        {icon || <SearchOffIcon sx={{ fontSize: 64, opacity: 0.5 }} />}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
        {description}
      </Typography>
    </Box>
  );
}
