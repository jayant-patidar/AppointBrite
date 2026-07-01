import { Box, Chip } from '@mui/material';

const CATEGORIES = [
  'SALON', 'RESTAURANT', 'CLINIC', 'FITNESS', 'SPA', 
  'DENTAL', 'TUTORING', 'AUTO_SERVICE', 'HOME_SERVICE', 
  'EVENT_VENUE', 'CONSULTING'
];

interface CategoryFilterProps {
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onSelect }: CategoryFilterProps) {
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4, justifyContent: 'center' }}>
      <Chip 
        label="ALL" 
        onClick={() => onSelect('')} 
        color={selectedCategory === '' ? 'primary' : 'default'}
        variant={selectedCategory === '' ? 'filled' : 'outlined'}
        sx={{ fontWeight: 600, px: 1, '&:hover': { transform: 'scale(1.05)' }, transition: '0.2s' }}
      />
      {CATEGORIES.map((cat) => (
        <Chip
          key={cat}
          label={cat.replace('_', ' ')}
          onClick={() => onSelect(cat)}
          color={selectedCategory === cat ? 'primary' : 'default'}
          variant={selectedCategory === cat ? 'filled' : 'outlined'}
          sx={{ fontWeight: 600, px: 1, '&:hover': { transform: 'scale(1.05)' }, transition: '0.2s' }}
        />
      ))}
    </Box>
  );
}
