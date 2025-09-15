import { Helmet } from 'react-helmet-async';

import { OTPVerificationView } from 'src/sections/login';

// ----------------------------------------------------------------------

export default function OTPVerificationPage() {
  return (
    <>
      <Helmet>
        <title> OTP Verification </title>
      </Helmet>

      <OTPVerificationView />
    </>
  );
}
