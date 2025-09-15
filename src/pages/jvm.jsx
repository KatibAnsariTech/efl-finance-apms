import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

export default function JVMPage() {
  return (
    <>
      <Helmet>
        <title>JVM</title>
      </Helmet>
      <Navigate to="/jvm/dashboard" replace />
    </>
  );
}
