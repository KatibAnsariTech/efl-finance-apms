import { Helmet } from 'react-helmet-async';
import ImportPaymentDashboard from '../components/ImportPaymentDashboard';

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
