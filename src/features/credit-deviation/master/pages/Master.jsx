import { Helmet } from 'react-helmet-async';
import MasterView from '../components/MasterView';

export default function MasterPage() {
  return (
    <>
      <Helmet>
        <title>Credit Deviation Master</title>
      </Helmet>
      <MasterView />
    </>
  );
}
