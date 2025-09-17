import { Helmet } from 'react-helmet-async';
import ImportPaymentDashboard from './import-payment-dashboard';

export default function ImportPaymentPage() {
  return (
    <>
      <Helmet>
        <title>Import Payment</title>
      </Helmet>
      <ImportPaymentDashboard />
    </>
  );
}
