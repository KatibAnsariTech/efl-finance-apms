import { Helmet } from 'react-helmet-async';
import ApprovalView from '../components/ApprovalView';

export default function ApprovalsPage() {
  return (
    <>
      <Helmet>
        <title>Credit Deviation Approvals</title>
      </Helmet>
      <ApprovalView />
    </>
  );
}
