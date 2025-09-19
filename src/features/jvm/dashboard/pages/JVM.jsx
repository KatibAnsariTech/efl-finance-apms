import { Helmet } from 'react-helmet-async';
import JVMDashboard from '../components/JVMDashboard';

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
