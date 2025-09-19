import { Helmet } from 'react-helmet-async';
import CustomDutyDashboard from '../components/CustomDutyDashboard';

export default function CustomDutyPage() {
  return (
    <>
      <Helmet>
        <title>Custom Duty</title>
      </Helmet>
      <CustomDutyDashboard />
    </>
  );
}
