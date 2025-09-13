import { Container, Typography, Box, Paper } from '@mui/material';

export default function JVMOverviewPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          JVM Overview
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1" paragraph>
            Welcome to the JVM Overview page. This page provides a comprehensive view of all Journal Voucher (JV) activities and metrics.
          </Typography>
          <Typography variant="body1" paragraph>
            Here you can monitor JV performance, track key metrics, and get insights into your financial operations.
          </Typography>
          <Typography variant="body1">
            This page is currently under development. More features will be added soon.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

