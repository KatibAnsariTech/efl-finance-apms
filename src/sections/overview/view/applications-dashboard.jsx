import React from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'src/routes/hooks';

// Styled components
const DashboardContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
}));

const ApplicationCard = styled(Card)(({ theme, cardColor }) => ({
  height: '280px',
  borderRadius: '16px',
  background: `linear-gradient(135deg, ${cardColor} 0%, ${cardColor}dd 100%)`,
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  },
}));

const CardContentWrapper = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
  zIndex: 2,
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 'bold',
  color: 'white',
  marginBottom: theme.spacing(1),
  fontFamily: 'Arial, sans-serif',
}));

const CardDescription = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: 'rgba(255, 255, 255, 0.9)',
  lineHeight: 1.5,
  marginBottom: theme.spacing(2),
  fontFamily: 'Arial, sans-serif',
}));

const StatusText = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: 'rgba(255, 255, 255, 0.8)',
  fontStyle: 'italic',
  fontFamily: 'Arial, sans-serif',
}));

const PendingButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#dc3545',
  color: 'white',
  borderRadius: '8px',
  padding: '8px 16px',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'none',
  minWidth: '100px',
  '&:hover': {
    backgroundColor: '#c82333',
  },
}));

const BackgroundDecoration = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '120px',
  height: '120px',
  opacity: 0.1,
  zIndex: 1,
}));

// Application data
const applications = [
  {
    id: 'credit-deviation',
    title: 'Credit Deviation',
    description: 'Reduce readmissions by 30% with predictive patient monitoring and intervention alerts',
    status: 'coming-soon',
    color: '#8B4513',
    route: '/credit-deviation'
  },
  {
    id: 'import-payment',
    title: 'Import Payment',
    description: 'Increase practice efficiency by 45% with automated workflows and smart scheduling',
    status: 'coming-soon',
    color: '#2E7D32',
    route: '/import-payment'
  },
  {
    id: 'journal-voucher-manager',
    title: 'Journal Voucher Manager',
    description: 'Find specialist matches 5x faster with AI-powered credentialing and availability data.',
    status: 'pending',
    pendingCount: 23,
    color: '#00695C',
    route: '/jvm'
  },
  {
    id: 'custom-duty',
    title: 'Custom Duty',
    description: 'Track 95% of healthcare network changes to maintain accurate provider directories',
    status: 'pending',
    pendingCount: 20,
    color: '#7B1FA2',
    route: '/custom-duty'
  },
  {
    id: 'vendor-onboarding',
    title: 'Vendor Onboarding',
    description: 'Achieve 99% data accuracy with comprehensive patient record enrichment and validation.',
    status: 'coming-soon',
    color: '#1976D2',
    route: '/vendor-onboarding'
  },
  {
    id: 'petty-cash',
    title: 'Petty Cash',
    description: 'Access clinical evidence 10x faster with AI-curated medical research and guidelines.',
    status: 'coming-soon',
    color: '#9C27B0',
    route: '/petty-cash'
  }
];

export default function ApplicationsDashboard() {
  const router = useRouter();

  const handleCardClick = (route) => {
    if (route) {
      router.push(route);
    }
  };

  return (
    <>
      <Helmet>
        <title>Applications Dashboard</title>
      </Helmet>
      
      <DashboardContainer maxWidth="xl">
        {/* Applications Grid */}
        <Grid container spacing={3}>
          {applications.map((app) => (
            <Grid item xs={12} sm={6} md={4} key={app.id}>
              <ApplicationCard 
                cardColor={app.color}
                onClick={() => handleCardClick(app.route)}
              >
                <CardContentWrapper>
                  <Box>
                    <CardTitle>{app.title}</CardTitle>
                    <CardDescription>{app.description}</CardDescription>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {app.status === 'coming-soon' ? (
                      <StatusText>...Coming Soon</StatusText>
                    ) : (
                      <PendingButton>
                        {app.pendingCount} Pending
                      </PendingButton>
                    )}
                  </Box>
                </CardContentWrapper>
                
                {/* Background Decoration */}
                <BackgroundDecoration>
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                      borderRadius: '50%',
                    }}
                  />
                </BackgroundDecoration>
              </ApplicationCard>
            </Grid>
          ))}
        </Grid>
      </DashboardContainer>
    </>
  );
}
