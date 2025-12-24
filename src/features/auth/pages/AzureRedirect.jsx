import { Helmet } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import AzureRedirectHandler from '../components/AzureRedirectHandler';

export default function AzureRedirectPage() {
  return (
    <>
      <Helmet>
        <title>Completing Authentication</title>
      </Helmet>
      <ToastContainer />
      <AzureRedirectHandler />
    </>
  );
}

