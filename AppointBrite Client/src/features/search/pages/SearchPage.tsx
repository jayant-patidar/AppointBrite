import { useState } from 'react';
import { Typography, Container, Box, useTheme, alpha } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { businessesApi } from '@/api/endpoints/businesses.api';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import BusinessList from '../components/BusinessList';

export default function SearchPage() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['businesses', activeSearch, category],
    queryFn: () => businessesApi.search({ q: activeSearch, category, limit: 12, page: 1 }),
  });

  const handleSearch = () => {
    setActiveSearch(searchQuery);
  };

  return (
    <Box sx={{ pb: 12, minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          pt: { xs: 10, md: 16 }, 
          pb: { xs: 8, md: 12 },
          px: 2,
          position: 'relative',
          overflow: 'hidden',
          background: theme.palette.mode === 'dark' 
            ? 'radial-gradient(circle at 50% -20%, #1D4ED8 0%, #090E17 60%)'
            : 'radial-gradient(circle at 50% -20%, rgba(37, 99, 235, 0.15) 0%, #F4F7F9 60%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          textAlign: 'center'
        }}
      >
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(${alpha(theme.palette.text.primary, 0.05)} 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
            pointerEvents: 'none'
          }}
        />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800, 
              mb: 3,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, #60A5FA 0%, #FFFFFF 100%)'
                : 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Book Appointments & Reservations
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              mb: 5, 
              fontWeight: 500,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Instantly book appointments or make reservations with top-rated local businesses near you. Your next experience is just a tap away.
          </Typography>
          
          <Box sx={{ maxWidth: '700px', mx: 'auto', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))' }}>
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery} 
              onSearch={handleSearch} 
            />
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box sx={{ mb: 6 }}>
          <CategoryFilter selectedCategory={category} onSelect={setCategory} />
        </Box>
        
        <Box sx={{ mt: 4 }}>
          <BusinessList 
            businesses={data?.data || []} 
            isLoading={isLoading} 
          />
        </Box>
      </Container>
    </Box>
  );
}
