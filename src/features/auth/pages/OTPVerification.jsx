import { Helmet } from 'react-helmet-async';
import { OTPVerificationView } from '../components';

export default function OTPVerificationPage() {
  return (
    <>
      <Helmet>
        <title>OTP Verification</title>
      </Helmet>
      <OTPVerificationView />
    </>
  );
}
