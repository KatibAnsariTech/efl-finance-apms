import { Helmet } from 'react-helmet-async';
import CreditDeviationDashboard from '../components/CreditDeviationDashboard';

export default function CreditDeviationDashboardPage() {
  return (
    <>
      <Helmet>
        <title>Credit Deviation Dashboard</title>
      </Helmet>
      <CreditDeviationDashboard />
    </>
  );
}
