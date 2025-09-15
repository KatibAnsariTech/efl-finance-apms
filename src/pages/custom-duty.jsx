import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

export default function CustomDutyPage() {
  return (
    <>
      <Helmet>
        <title>Custom Duty</title>
      </Helmet>
      <Navigate to="/custom-duty/dashboard" replace />
    </>
  );
}
