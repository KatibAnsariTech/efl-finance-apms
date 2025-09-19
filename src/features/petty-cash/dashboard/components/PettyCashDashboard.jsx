import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import AppCurrentVisits from 'src/sections/overview/app-current-visits';
import AppWebsiteVisits from 'src/sections/overview/app-website-visits';
import AppWidgetSummary from 'src/sections/overview/app-widget-summary';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { BACKEND_URL } from 'src/config/config';
import { userRequest } from 'src/requestMethod';
import { useRouter } from 'src/routes/hooks';
import ReportTable from 'src/sections/overview/app-report-table';
import { AnalyticsConversionRates } from 'src/sections/overview/analytics-conversion-rates';
import { AnalyticsWebsiteVisits } from 'src/sections/overview/analytics-website-visits';
import { AnalyticsCurrentSubject } from 'src/sections/overview/analytics-current-subject';
import swal from 'sweetalert';
import { showErrorMessage } from 'src/utils/errorUtils';
import { Helmet } from 'react-helmet-async';

export default function PettyCashDashboard() {
  const [cardData, setCardData] = useState();
  const [filter, setFilter] = useState('weekly');
  const [pieFilter, setPieFilter] = useState('weekly');
  const [chartData, setChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pieLoading, setPieLoading] = useState(true);
  const router = useRouter();

  const getData = async () => {
    try {
      const response = await userRequest.get('/admin/getFormStatistics');
      setCardData(response.data?.data);
    } catch (error) {
      console.log('error:', error);
      // showErrorMessage(error, "Failed to fetch form statistics. Please try again later.", swal);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getChartData = async () => {
    try {
      setLoading(true);
      const response = await userRequest.get('/admin/getFormBarChartData', {
        params: { period: filter },
      });
      setChartData(response.data?.data?.reverse());
    } catch (error) {
      console.log('error:', error);
      // showErrorMessage(error, "Failed to fetch chart data. Please try again later.", swal);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChartData();
  }, [filter]);

  const getPieChartData = async () => {
    try {
      setPieLoading(true);
      const response = await userRequest.get('/admin/getRegionPieChartData', {
        params: { period: pieFilter },
      });
      setPieChartData(response.data?.data);
    } catch (error) {
      console.log('error:', error);
      // showErrorMessage(error, "Failed to fetch pie chart data. Please try again later.", swal);
    } finally {
      setPieLoading(false);
    }
  };

  console.log(pieChartData, 'pieChartData');

  useEffect(() => {
    getPieChartData();
  }, [pieFilter]);

  const getLabel = (data) => {
    switch (filter) {
      case 'yearly':
        return data && data.year;
      case 'monthly':
        return data && data.month;
      case 'weekly':
        return data && data.date;
      default:
        return '';
    }
  };

  const handleCardClick = (cardType) => {
    switch (cardType) {
      case 'todayRequests':
      case 'totalRequests':
        router.push('/petty-cash/request');
        break;
      case 'completedRequests':
      case 'pendingRequests':
        router.push('/petty-cash/request');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Helmet>
        <title>Petty Cash Dashboard</title>
      </Helmet>
      
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Today Requests"
              total={cardData && cardData.todayForms}
              color="success"
              icon={<img alt="icon" src="/assets/icons/glass/today-requests.svg" />}
              onClick={() => handleCardClick('todayRequests')}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Requests"
              total={cardData && cardData.totalForms}
              color="info"
              icon={<img alt="icon" src="/assets/icons/glass/total-requests.svg" />}
              onClick={() => handleCardClick('totalRequests')}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Approved Requests"
              total={cardData && cardData.completedForms}
              color="warning"
              icon={<img alt="icon" src="/assets/icons/glass/completed-requests.svg" />}
              onClick={() => handleCardClick('completedRequests')}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Pending Requests"
              total={cardData && cardData.pendingForms}
              color="info"
              icon={<img alt="icon" src="/assets/icons/glass/pending-requests.svg" />}
              onClick={() => handleCardClick('pendingRequests')}
            />
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                }}
              >
                <CircularProgress />
              </div>
            ) : (
              <AppWebsiteVisits
                style={{ height: '100%' }}
                title="Petty Cash Overview"
                setFilter={setFilter}
                filter={filter}
                chart={{
                  labels:
                    chartData && chartData.length > 0 ? chartData.map((data) => getLabel(data)) : [],
                  series: [
                    {
                      name: 'Total Requests',
                      type: 'area',
                      fill: 'gradient',
                      data:
                        chartData && chartData.length > 0
                          ? chartData.map((data) => data?.totalRequests)
                          : [],
                    },
                    {
                      name: 'Approved Requests',
                      type: 'area',
                      fill: 'gradient',
                      data:
                        chartData && chartData.length > 0
                          ? chartData.map((data) => data?.completedRequests)
                          : [],
                    },
                    {
                      name: 'Pending Requests',
                      type: 'area',
                      fill: 'gradient',
                      data:
                        chartData && chartData.length > 0
                          ? chartData.map((data) => data?.pendingRequests)
                          : [],
                    },
                  ],
                  colors: ['#2E7D32', '#00a65e', '#da0000'],
                }}
              />
            )}
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            {pieLoading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                }}
              >
                <CircularProgress />
              </div>
            ) : (
              <AppCurrentVisits
                title="Requests by Department"
                setFilter={setPieFilter}
                filter={pieFilter}
                chart={{
                  series: pieChartData.map((item) => ({
                    label: item.region.charAt(0) + item.region.slice(1).toLowerCase(),
                    value: Number(item.count),
                  })),
                }}
              />
            )}
          </Grid>
        </Grid>

        {/* Analytics Components Section */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid xs={12} md={6} lg={6}>
            <AnalyticsConversionRates
              title="Request Approval Rates"
              subheader="Request approval rates by category"
              chart={{
                series: [
                  { name: 'Approved', data: [88, 82, 92, 85, 90] },
                  { name: 'Pending', data: [12, 18, 8, 15, 10] }
                ],
                categories: ['Office Supplies', 'Travel', 'Meals', 'Transport', 'Miscellaneous']
              }}
            />
          </Grid>

          <Grid xs={12} md={6} lg={6}>
            <AnalyticsWebsiteVisits
              title="Request Trends"
              subheader="Weekly request volume"
              chart={{
                series: [
                  { name: 'This Week', data: [18, 12, 15, 20, 14, 18, 25] },
                  { name: 'Last Week', data: [22, 18, 20, 28, 16, 22, 30] }
                ],
                categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              }}
            />
          </Grid>

          <Grid xs={12} md={6} lg={6}>
            <AnalyticsCurrentSubject
              title="Department Performance"
              subheader="Request processing efficiency by department"
              chart={{
                series: [
                  { name: 'Finance', data: [90, 70, 50, 60, 100, 40] },
                  { name: 'Operations', data: [30, 50, 60, 90, 30, 90] },
                  { name: 'HR', data: [60, 85, 90, 25, 60, 20] }
                ],
                categories: ['Speed', 'Accuracy', 'Processing', 'Follow-up', 'Resolution', 'Satisfaction']
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} >
          <Grid xs={12}>
            <ReportTable style={{ height: '100%' }}/>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
