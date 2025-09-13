import { Container, Typography, Box, Paper } from '@mui/material';

export default function PettyCashReportsPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Petty Cash Reports
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1">
            Welcome to the Petty Cash Reports page.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

