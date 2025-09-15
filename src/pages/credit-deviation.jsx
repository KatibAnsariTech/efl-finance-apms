import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box } from '@mui/material';

export default function CreditDeviationPage() {
  return (
    <>
      <Helmet>
        <title>Credit Deviation</title>
      </Helmet>

      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Credit Deviation
          </Typography>
          <Typography variant="body1">
            Welcome to the Credit Deviation section. This is where you can access all credit deviation related features.
          </Typography>
        </Box>
      </Container>
    </>
  );
}
