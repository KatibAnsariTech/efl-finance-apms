import { Helmet } from 'react-helmet-async';
import HierarchyManagementView from '../components/HierarchyManagementView';

export default function HierarchyManagementPage() {
  return (
    <>
      <Helmet>
        <title>Import Payment Hierarchy Management</title>
      </Helmet>
      <HierarchyManagementView />
    </>
  );
}
