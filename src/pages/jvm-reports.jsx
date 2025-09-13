import { Container, Typography, Box, Paper } from '@mui/material';

export default function JVMReportsPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          JVM Reports
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1" paragraph>
            Welcome to the JVM Reports page. This section provides detailed reports and analytics for Journal Voucher Management.
          </Typography>
          <Typography variant="body1" paragraph>
            Generate comprehensive reports on JV transactions, approvals, and financial summaries.
          </Typography>
          <Typography variant="body1">
            This page is currently under development. More reporting features will be added soon.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

