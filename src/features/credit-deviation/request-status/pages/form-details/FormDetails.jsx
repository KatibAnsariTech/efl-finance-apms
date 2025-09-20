import { Helmet } from 'react-helmet-async';
import FormDetailsView from '../../components/form-details/FormDetailsView';

export default function FormDetailsPage() {
  return (
    <>
      <Helmet>
        <title>Request Status Form Details</title>
      </Helmet>
      <FormDetailsView />
    </>
  );
}
