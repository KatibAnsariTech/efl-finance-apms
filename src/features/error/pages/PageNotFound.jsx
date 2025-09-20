import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography, Button } from '@mui/material';
import { useRouter } from 'src/routes/hooks';

export default function PageNotFound() {
  const router = useRouter();

  return (
    <>
      <Helmet>
        <title>404 Page Not Found</title>
      </Helmet>
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
          }}
        >
          <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', color: 'primary.main' }}>
            404
          </Typography>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Page Not Found
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            Sorry, we couldn't find the page you're looking for.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/')}
            size="large"
          >
            Go Home
          </Button>
        </Box>
      </Container>
    </>
  );
}
