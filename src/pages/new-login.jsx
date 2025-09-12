import { Helmet } from 'react-helmet-async';

import { NewLoginView } from 'src/sections/login';

// ----------------------------------------------------------------------

export default function NewLoginPage() {
  return (
    <>
      <Helmet>
        <title> Login </title>
      </Helmet>

      <NewLoginView />
    </>
  );
}
