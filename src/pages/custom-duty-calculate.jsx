import { Container, Typography, Box, Paper } from '@mui/material';

export default function CustomDutyCalculatePage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Calculate Duty
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1">
            Welcome to the Calculate Duty page.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

