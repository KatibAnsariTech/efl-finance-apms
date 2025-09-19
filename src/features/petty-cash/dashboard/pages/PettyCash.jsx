import { Helmet } from 'react-helmet-async';
import PettyCashDashboard from '../components/PettyCashDashboard';

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
