import { Helmet } from 'react-helmet-async';
import { HierarchyManagementView } from 'src/sections/hierarchy-management/view';

// ----------------------------------------------------------------------
export default function HierarchyManagementPage() {
  return (
    <>
      <Helmet>
        <title>Hierarchy Management</title>
      </Helmet>

      <HierarchyManagementView />
    </>
  );
}
