import { Helmet } from 'react-helmet-async';
import CreditDeviationDashboard from './credit-deviation-dashboard';

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
