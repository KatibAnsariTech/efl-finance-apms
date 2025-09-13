import { Container, Typography, Box, Paper } from '@mui/material';

export default function UserManagementPermissionsPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Permissions
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1">
            Welcome to the Permissions page.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

