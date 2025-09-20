import { Helmet } from 'react-helmet-async';
import MasterSheetView from '../components/MasterSheetView';

export default function MasterSheetPage() {
  return (
    <>
      <Helmet>
        <title>Credit Deviation Master Sheet</title>
      </Helmet>
      <MasterSheetView />
    </>
  );
}
