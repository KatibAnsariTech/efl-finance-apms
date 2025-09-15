import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

export default function PettyCashPage() {
  return (
    <>
      <Helmet>
        <title>Petty Cash</title>
      </Helmet>
      <Navigate to="/petty-cash/dashboard" replace />
    </>
  );
}
