import { Container, Typography, Box, Paper } from "@mui/material";

export default function JVMOverviewPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          JVM Overview
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1" paragraph>
            Welcome to the JVM Overview page
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
