import { Helmet } from 'react-helmet-async';
import { HierarchyView } from 'src/sections/hierarchy/view';

// ----------------------------------------------------------------------
export default function FormsPage() {
  return (
    <>
      <Helmet>
        <title> Hierarchy </title>
      </Helmet>

      <HierarchyView />
    </>
  );
}
