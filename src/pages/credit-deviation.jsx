import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

export default function CreditDeviationPage() {
  return (
    <>
      <Helmet>
        <title>Credit Deviation</title>
      </Helmet>
      <Navigate to="/credit-deviation/dashboard" replace />
    </>
  );
}
