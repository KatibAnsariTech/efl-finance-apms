import { Helmet } from 'react-helmet-async';
import JVMDashboard from './jvm-dashboard';

export default function JVMPage() {
  return (
    <>
      <Helmet>
        <title>JVM</title>
      </Helmet>
      <JVMDashboard />
    </>
  );
}
