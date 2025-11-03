import { Helmet } from 'react-helmet-async';
import CAPEXDashboard from '../components/CAPEXDashboard';

export default function CAPEXPage() {
  return (
    <>
      <Helmet>
        <title>CAPEX</title>
      </Helmet>
      <CAPEXDashboard />
    </>
  );
}
