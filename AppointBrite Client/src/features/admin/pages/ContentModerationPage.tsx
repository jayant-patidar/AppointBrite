import { Typography, Container } from '@mui/material';
export default function ContentModerationPage() {
  return (<Container maxWidth="lg" sx={{ py: 3 }}><Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>Content Moderation</Typography>{/* TODO: Implement review/image moderation queue */}</Container>);
}
