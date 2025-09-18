import { Helmet } from 'react-helmet-async';

import { ResetPasswordView } from 'src/features/auth/pages';

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Reset Password </title>
      </Helmet>

      <ResetPasswordView />
    </>
  );
}
