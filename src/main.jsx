/* eslint-disable perfectionist/sort-imports */
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import { AccountProvider } from './contexts/AccountContext';
import { CRDCountProvider } from './contexts/CRDCountContext';
import { JVMProvider } from './contexts/JVMContext';
import { CustomCountProvider } from './contexts/CustomCountContext';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <Suspense>
        <AccountProvider>
          <CRDCountProvider>
            <JVMProvider>
              <CustomCountProvider>
                <App />
              </CustomCountProvider>
            </JVMProvider>
          </CRDCountProvider>
        </AccountProvider>
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
);
