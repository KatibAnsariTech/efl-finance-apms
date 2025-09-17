import { Helmet } from 'react-helmet-async';
import PettyCashDashboard from './petty-cash-dashboard';

export default function PettyCashPage() {
  return (
    <>
      <Helmet>
        <title>Petty Cash</title>
      </Helmet>
      <PettyCashDashboard />
    </>
  );
}
