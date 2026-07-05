import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, 
  Typography, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Collapse,
  IconButton,
  Tooltip,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import BlockIcon from '@mui/icons-material/Block';
import FilterListIcon from '@mui/icons-material/FilterList';
import { businessApi } from '@/api/business';
import { format } from 'date-fns';
import CustomerDetailsDrawer from '../components/CustomerDetailsDrawer';

export default function CustomerCRMPage() {
  // Assuming business is fetched and we have its ID somewhere, but we'll get it from a query if needed.
  // Actually, we can fetch myBusiness first
  const { data: business } = useQuery({
    queryKey: ['myBusiness'],
    queryFn: businessApi.getMyBusiness,
    staleTime: 5 * 60 * 1000,
  });

  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ['businessCustomers', business?._id],
    queryFn: () => businessApi.getCustomers(business._id),
    enabled: !!business?._id
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [sortBy, setSortBy] = useState('revenue_desc');
  const [minBookings, setMinBookings] = useState<number | ''>('');
  const [maxBookings, setMaxBookings] = useState<number | ''>('');
  const [minSpent, setMinSpent] = useState<number | ''>('');
  const [maxSpent, setMaxSpent] = useState<number | ''>('');
  const [visitAfter, setVisitAfter] = useState<string>('');
  const [visitBefore, setVisitBefore] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredCustomers = customers.filter((c: any) => {
    // Search Filter
    const fullName = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
    const email = (c.email || '').toLowerCase();
    const phone = (c.phone || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = fullName.includes(query) || email.includes(query) || phone.includes(query);

    // Status Filter
    const matchesStatus = filterStatus === 'ALL' 
      ? true 
      : filterStatus === 'BANNED' ? c.isBanned : !c.isBanned;

    // Type Filter
    const matchesType = filterType === 'ALL'
      ? true
      : filterType === 'GUEST' ? c.isGuest : !c.isGuest;

    // Advanced Numeric & Date Filters
    if (minBookings !== '' && (c.totalBookings || 0) < Number(minBookings)) return false;
    if (maxBookings !== '' && (c.totalBookings || 0) > Number(maxBookings)) return false;
    if (minSpent !== '' && (c.totalRevenue || 0) < Number(minSpent)) return false;
    if (maxSpent !== '' && (c.totalRevenue || 0) > Number(maxSpent)) return false;
    
    if (visitAfter) {
      if (!c.lastVisitDate) return false;
      const visitDate = new Date(c.lastVisitDate).setHours(0,0,0,0);
      const afterDate = new Date(visitAfter).setHours(0,0,0,0);
      if (visitDate < afterDate) return false;
    }
    if (visitBefore) {
      if (!c.lastVisitDate) return false;
      const visitDate = new Date(c.lastVisitDate).setHours(0,0,0,0);
      const beforeDate = new Date(visitBefore).setHours(23,59,59,999);
      if (visitDate > beforeDate) return false;
    }

    return matchesSearch && matchesStatus && matchesType;
  }).sort((a: any, b: any) => {
    switch (sortBy) {
      case 'revenue_desc':
        return (b.totalRevenue || 0) - (a.totalRevenue || 0);
      case 'revenue_asc':
        return (a.totalRevenue || 0) - (b.totalRevenue || 0);
      case 'bookings_desc':
        return (b.totalBookings || 0) - (a.totalBookings || 0);
      case 'bookings_asc':
        return (a.totalBookings || 0) - (b.totalBookings || 0);
      case 'name_asc':
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      case 'name_desc':
        return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
      case 'visit_desc':
        return new Date(b.lastVisitDate || 0).getTime() - new Date(a.lastVisitDate || 0).getTime();
      case 'visit_asc':
        return new Date(a.lastVisitDate || 0).getTime() - new Date(b.lastVisitDate || 0).getTime();
      default:
        return 0;
    }
  });

  const handleRowClick = (customer: any) => {
    setSelectedCustomer(customer);
    setDrawerOpen(true);
  };

  const handleExportCSV = () => {
    if (!filteredCustomers.length) return;

    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Total Bookings', 'Total Spent', 'Last Visit', 'Status'];
    const rows = filteredCustomers.map((c: any) => [
      c.firstName || '',
      c.lastName || '',
      c.email || '',
      c.phone || '',
      c.totalBookings || 0,
      c.totalRevenue || 0,
      c.lastVisitDate ? format(new Date(c.lastVisitDate), 'yyyy-MM-dd') : '',
      c.isBanned ? 'Banned' : 'Active'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row: any[]) => row.map((item: any) => `"${item}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading || !business) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">Failed to load customers.</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', pb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Customers
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<FileDownloadIcon />}
          onClick={handleExportCSV}
          disabled={!filteredCustomers.length}
        >
          Export CSV
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }} variant="outlined">
        <TextField
          fullWidth
          placeholder="Search customers by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }
          }}
          size="medium"
          sx={{ mb: 3 }}
        />

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="ALL">All Statuses</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="BANNED">Banned</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={filterType}
              label="Type"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="ALL">All Types</MenuItem>
              <MenuItem value="REGISTERED">Registered Users</MenuItem>
              <MenuItem value="GUEST">Guest Users</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200, ml: { md: 'auto' } }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="revenue_desc">Total Spent (High to Low)</MenuItem>
              <MenuItem value="revenue_asc">Total Spent (Low to High)</MenuItem>
              <MenuItem value="bookings_desc">Total Bookings (High to Low)</MenuItem>
              <MenuItem value="bookings_asc">Total Bookings (Low to High)</MenuItem>
              <MenuItem value="name_asc">Name (A-Z)</MenuItem>
              <MenuItem value="name_desc">Name (Z-A)</MenuItem>
              <MenuItem value="visit_desc">Last Visit (Newest First)</MenuItem>
              <MenuItem value="visit_asc">Last Visit (Oldest First)</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Advanced Filters">
            <IconButton onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
              <FilterListIcon color={showAdvancedFilters ? 'primary' : 'inherit'} />
            </IconButton>
          </Tooltip>
        </Stack>

        <Collapse in={showAdvancedFilters}>
          <Box sx={{ p: 2, mb: 3, bgcolor: 'background.default', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>Advanced Filters</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField 
                  fullWidth 
                  size="small" 
                  label="Min Bookings" 
                  type="number"
                  value={minBookings}
                  onChange={(e) => setMinBookings(e.target.value ? Number(e.target.value) : '')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField 
                  fullWidth 
                  size="small" 
                  label="Max Bookings" 
                  type="number"
                  value={maxBookings}
                  onChange={(e) => setMaxBookings(e.target.value ? Number(e.target.value) : '')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField 
                  fullWidth 
                  size="small" 
                  label="Min Spent ($)" 
                  type="number"
                  value={minSpent}
                  onChange={(e) => setMinSpent(e.target.value ? Number(e.target.value) : '')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField 
                  fullWidth 
                  size="small" 
                  label="Max Spent ($)" 
                  type="number"
                  value={maxSpent}
                  onChange={(e) => setMaxSpent(e.target.value ? Number(e.target.value) : '')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField 
                  fullWidth 
                  size="small" 
                  label="Last Visit After" 
                  type="date"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={visitAfter}
                  onChange={(e) => setVisitAfter(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField 
                  fullWidth 
                  size="small" 
                  label="Last Visit Before" 
                  type="date"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={visitBefore}
                  onChange={(e) => setVisitBefore(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Button 
                  size="small" 
                  color="inherit"
                  onClick={() => {
                    setMinBookings('');
                    setMaxBookings('');
                    setMinSpent('');
                    setMaxSpent('');
                    setVisitAfter('');
                    setVisitBefore('');
                  }}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Collapse>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="customers table">
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell align="center">Total Bookings</TableCell>
                <TableCell align="right">Total Spent</TableCell>
                <TableCell align="right">Last Visit</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">No customers found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer: any, index: number) => (
                  <TableRow
                    key={customer.customerId || `guest-${index}`}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={() => handleRowClick(customer)}
                  >
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                          {customer.firstName?.charAt(0) || 'G'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {customer.firstName} {customer.lastName}
                          </Typography>
                          {customer.isGuest && (
                            <Chip size="small" label="Guest" sx={{ height: 20, fontSize: '0.7rem', mt: 0.5 }} />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {customer.email && <Typography variant="body2">{customer.email}</Typography>}
                      {customer.phone && <Typography variant="body2" color="text.secondary">{customer.phone}</Typography>}
                      {!customer.email && !customer.phone && <Typography variant="body2" color="text.secondary">N/A</Typography>}
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{customer.totalBookings}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                        ${customer.totalRevenue?.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {customer.lastVisitDate ? format(new Date(customer.lastVisitDate), 'MMM d, yyyy') : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {customer.isBanned ? (
                        <Chip size="small" color="error" icon={<BlockIcon />} label="Banned" />
                      ) : (
                        <Chip size="small" color="success" label="Active" />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <CustomerDetailsDrawer 
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        customer={selectedCustomer}
        businessId={business._id}
      />
    </Box>
  );
}
