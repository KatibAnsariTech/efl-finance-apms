import React from 'react';
import { Container, Typography, Box, Paper, Grid, Card, CardContent } from '@mui/material';
import { BarChart, TrendingUp, Assessment } from '@mui/icons-material';

const JVMPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          JVM Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your JVM (Journal Voucher Management) system
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BarChart color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">JVM Overview</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                View comprehensive JVM statistics and analytics
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">JVM Reports</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Generate and view detailed JVM reports
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Analytics</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Advanced JVM analytics and insights
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent JVM Activities
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No recent activities to display.
        </Typography>
      </Paper>
    </Container>
  );
};

export default JVMPage;
