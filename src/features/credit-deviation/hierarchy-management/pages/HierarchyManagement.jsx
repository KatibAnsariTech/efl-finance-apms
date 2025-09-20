import { Helmet } from 'react-helmet-async';
import HierarchyManagementView from '../components/HierarchyManagementView';

export default function HierarchyManagementPage() {
  return (
    <>
      <Helmet>
        <title>Credit Deviation Hierarchy Management</title>
      </Helmet>
      <HierarchyManagementView />
    </>
  );
}
