import { TextField, InputAdornment, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
}

export default function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  return (
    <Box sx={{ display: 'flex', justifyItems: 'center', justifyContent: 'center', my: 4 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for services, businesses..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch();
        }}
        sx={{
          maxWidth: 600,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          '& fieldset': { border: 'none' },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={onSearch} color="primary">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }
        }}
      />
    </Box>
  );
}
