import { Helmet } from 'react-helmet-async';
import CustomDutyDashboard from './custom-duty-dashboard';

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
