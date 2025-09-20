import { Helmet } from 'react-helmet-async';
import UserManagementView from '../components/UserManagementView';

export default function UserManagementPage() {
  return (
    <>
      <Helmet>
        <title>Credit Deviation User Management</title>
      </Helmet>
      <UserManagementView />
    </>
  );
}
