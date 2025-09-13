import { Container, Typography, Box, Paper } from '@mui/material';

export default function PettyCashApprovalPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Approve Petty Cash
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1">
            Welcome to the Approve Petty Cash page.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

