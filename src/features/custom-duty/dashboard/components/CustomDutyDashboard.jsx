import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { AppCurrentVisits, AppWebsiteVisits, AppWidgetSummary } from 'src/components/overview';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { BACKEND_URL } from 'src/config/config';
import { userRequest } from 'src/requestMethod';
import { useRouter } from 'src/routes/hooks';
import { AppReportTable as ReportTable, AnalyticsConversionRates, AnalyticsWebsiteVisits, AnalyticsCurrentSubject } from 'src/components/overview';
import swal from 'sweetalert';
import { showErrorMessage } from 'src/utils/errorUtils';
import { Helmet } from 'react-helmet-async';

export default function CustomDutyDashboard() {
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
      const response = await userRequest.get('/custom/getFormStatistics');
      setCardData(response.data?.data);
    } catch (error) {
      // showErrorMessage(error, "Failed to fetch form statistics. Please try again later.", swal);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getChartData = async () => {
    try {
      setLoading(true);
      const response = await userRequest.get('/custom/getFormBarChartData', {
        params: { period: filter },
      });
      setChartData(response.data?.data?.reverse());
    } catch (error) {
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
      const response = await userRequest.get('/custom/getRegionPieChartData', {
        params: { period: pieFilter },
      });
      setPieChartData(response.data?.data);
    } catch (error) {
      // showErrorMessage(error, "Failed to fetch pie chart data. Please try again later.", swal);
    } finally {
      setPieLoading(false);
    }
  };


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
        router.push('/custom-duty/raise-request');
        break;
      case 'completedRequests':
      case 'pendingRequests':
        router.push('/custom-duty/raise-request');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Helmet>
        <title>Custom Duty Dashboard</title>
      </Helmet>
      
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Today Requests"
              total={cardData && cardData.todayCustomEntries}
              color="success"
              icon={<img alt="icon" src="/assets/icons/glass/today-requests.svg" />}
              onClick={() => handleCardClick('todayRequests')}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Requests"
              total={cardData && cardData.totalCustomEntries}
              color="info"
              icon={<img alt="icon" src="/assets/icons/glass/total-requests.svg" />}
              onClick={() => handleCardClick('totalRequests')}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Approved Requests"
              total={cardData && cardData.completedEntries}
              color="warning"
              icon={<img alt="icon" src="/assets/icons/glass/completed-requests.svg" />}
              onClick={() => handleCardClick('completedRequests')}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Pending Requests"
              total={cardData && cardData.pendingEntries}
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
                title="Requests Overview"
                setFilter={setFilter}
                filter={filter}
                chart={{
                  labels:
                    chartData && chartData.length > 0 ? chartData.map((data) => getLabel(data)) : [],
                  series: [
                    {
                      name: 'Total Duty Payments',
                      type: 'area',
                      fill: 'gradient',
                      data:
                        chartData && chartData.length > 0
                          ? chartData.map((data) => data?.totalRequests)
                          : [],
                    },
                    {
                      name: 'Processed Payments',
                      type: 'area',
                      fill: 'gradient',
                      data:
                        chartData && chartData.length > 0
                          ? chartData.map((data) => data?.completedRequests)
                          : [],
                    },
                    {
                      name: 'Pending Payments',
                      type: 'area',
                      fill: 'gradient',
                      data:
                        chartData && chartData.length > 0
                          ? chartData.map((data) => data?.pendingRequests)
                          : [],
                    },
                  ],
                  colors: ['#7B1FA2', '#00a65e', '#da0000'],
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
                title="Duty Payments by Region"
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
      </Container>
    </>
  );
}
