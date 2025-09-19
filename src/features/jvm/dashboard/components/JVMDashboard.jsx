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

export default function JVMDashboard() {
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
        router.push('/jvm/overview');
        break;
      case 'completedRequests':
      case 'pendingRequests':
        router.push('/jvm/overview');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Helmet>
        <title>JVM Dashboard</title>
      </Helmet>
      
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Today JVM Entries"
              total={cardData && cardData.todayForms}
              color="success"
              icon={<img alt="icon" src="/assets/icons/glass/today-requests.svg" />}
              onClick={() => handleCardClick('todayRequests')}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total JVM Entries"
              total={cardData && cardData.totalForms}
              color="info"
              icon={<img alt="icon" src="/assets/icons/glass/total-requests.svg" />}
              onClick={() => handleCardClick('totalRequests')}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Completed Entries"
              total={cardData && cardData.completedForms}
              color="warning"
              icon={<img alt="icon" src="/assets/icons/glass/completed-requests.svg" />}
              onClick={() => handleCardClick('completedRequests')}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Pending Entries"
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
                title="JVM Entries Overview"
                setFilter={setFilter}
                filter={filter}
                chart={{
                  labels:
                    chartData && chartData.length > 0 ? chartData.map((data) => getLabel(data)) : [],
                  series: [
                    {
                      name: 'Total Entries',
                      type: 'area',
                      fill: 'gradient',
                      data:
                        chartData && chartData.length > 0
                          ? chartData.map((data) => data?.totalRequests)
                          : [],
                    },
                    {
                      name: 'Completed Entries',
                      type: 'area',
                      fill: 'gradient',
                      data:
                        chartData && chartData.length > 0
                          ? chartData.map((data) => data?.completedRequests)
                          : [],
                    },
                    {
                      name: 'Pending Entries',
                      type: 'area',
                      fill: 'gradient',
                      data:
                        chartData && chartData.length > 0
                          ? chartData.map((data) => data?.pendingRequests)
                          : [],
                    },
                  ],
                  colors: ['#00695C', '#00a65e', '#da0000'],
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
                title="JVM Entries by Region"
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
              title="JVM Processing Rates"
              subheader="Entry processing rates by category"
              chart={{
                series: [
                  { name: 'Processed', data: [90, 85, 95, 88, 92] },
                  { name: 'Pending', data: [10, 15, 5, 12, 8] }
                ],
                categories: ['Finance', 'Operations', 'IT', 'HR', 'Management']
              }}
            />
          </Grid>

          <Grid xs={12} md={6} lg={6}>
            <AnalyticsWebsiteVisits
              title="JVM Entry Trends"
              subheader="Weekly entry volume"
              chart={{
                series: [
                  { name: 'This Week', data: [15, 8, 12, 18, 10, 15, 22] },
                  { name: 'Last Week', data: [20, 15, 18, 25, 12, 20, 28] }
                ],
                categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              }}
            />
          </Grid>

          <Grid xs={12} md={6} lg={6}>
            <AnalyticsCurrentSubject
              title="JVM Department Performance"
              subheader="Entry processing efficiency by department"
              chart={{
                series: [
                  { name: 'Finance', data: [85, 60, 40, 50, 95, 30] },
                  { name: 'Operations', data: [25, 40, 50, 85, 25, 85] },
                  { name: 'IT', data: [50, 80, 85, 20, 50, 15] }
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
