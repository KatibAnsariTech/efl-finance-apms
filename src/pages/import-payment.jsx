import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

export default function ImportPaymentPage() {
  return (
    <>
      <Helmet>
        <title>Import Payment</title>
      </Helmet>
      <Navigate to="/import-payment/dashboard" replace />
    </>
  );
}
