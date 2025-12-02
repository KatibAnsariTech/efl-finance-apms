import { Container, Typography, Box, Paper } from '@mui/material';

export default function ImportPaymentHierarchyPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Hierarchy Flow
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1">
            Welcome to the Hierarchy Flow page.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
