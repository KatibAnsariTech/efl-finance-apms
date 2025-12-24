import { Helmet } from 'react-helmet-async';
import OTPVerificationView from '../components/otp-verification-view';

export default function TwoFactorOTPPage() {
  return (
    <>
      <Helmet>
        <title>OTP Verification</title>
      </Helmet>
      <OTPVerificationView mode="2fa" />
    </>
  );
}

