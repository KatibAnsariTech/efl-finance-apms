import { Helmet } from 'react-helmet-async';

import { LoginView } from 'src/features/auth/pages';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Login </title>
      </Helmet>

      <LoginView />
    </>
  );
}
