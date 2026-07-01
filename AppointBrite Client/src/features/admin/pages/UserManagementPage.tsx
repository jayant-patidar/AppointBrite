import { Typography, Container } from '@mui/material';
export default function UserManagementPage() {
  return (<Container maxWidth="lg" sx={{ py: 3 }}><Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>User Management</Typography>{/* TODO: Implement UserTable with suspend/activate */}</Container>);
}
