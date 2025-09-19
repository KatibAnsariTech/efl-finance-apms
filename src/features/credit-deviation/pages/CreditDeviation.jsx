import { Helmet } from 'react-helmet-async';
import CreditDeviationDashboard from '../components/CreditDeviationDashboard';

export default function CreditDeviationPage() {
  return (
    <>
      <Helmet>
        <title>Credit Deviation</title>
      </Helmet>
      <CreditDeviationDashboard />
    </>
  );
}
