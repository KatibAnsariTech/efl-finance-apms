import { Helmet } from 'react-helmet-async';
import { FormView } from 'src/sections/forms/view';

// ----------------------------------------------------------------------
export default function FormsPage() {
  return (
    <>
      <Helmet>
        <title> Requests </title>
      </Helmet>

      <FormView />
    </>
  );
}
