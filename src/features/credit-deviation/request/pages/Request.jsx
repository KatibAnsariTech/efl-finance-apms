import { Helmet } from 'react-helmet-async';
import RaiseTicket from '../components/RaiseTicket';

export default function RequestPage() {
  return (
    <>
      <Helmet>
        <title>Credit Deviation Request</title>
      </Helmet>
      <RaiseTicket />
    </>
  );
}
