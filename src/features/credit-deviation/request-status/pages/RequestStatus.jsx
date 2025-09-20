import { Helmet } from 'react-helmet-async';
import FormsView from '../components/FormsView';

export default function RequestStatusPage() {
  return (
    <>
      <Helmet>
        <title>Credit Deviation Request Status</title>
      </Helmet>
      <FormsView />
    </>
  );
}
