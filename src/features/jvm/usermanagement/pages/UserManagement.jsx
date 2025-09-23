import { Helmet } from 'react-helmet-async';
import UserManagementView from '../components/UserManagementView';

export default function UserManagementPage() {
  return (
    <>
      <Helmet>
        <title>JVM User Management</title>
      </Helmet>
      <UserManagementView />
    </>
  );
}
