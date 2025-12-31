import { Helmet } from 'react-helmet-async';
import APMSUserManagementView from '../components/APMSUserManagementView';

export default function APMSUserManagementPage() {
  return (
    <>
      <Helmet>
        <title>JVM User Management</title>
      </Helmet>
      <APMSUserManagementView />
    </>
  );
}
