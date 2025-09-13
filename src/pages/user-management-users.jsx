import { Container, Typography, Box, Paper } from '@mui/material';

export default function UserManagementUsersPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Users
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1">
            Welcome to the Users page.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

