/* eslint-disable perfectionist/sort-imports */
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import { AccountProvider } from './contexts/AccountContext';
import { JVMProvider } from './contexts/JVMContext';
import { CustomCountProvider } from './contexts/CustomCountContext';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <Suspense>
        <AccountProvider>
            <JVMProvider>
              <CustomCountProvider>
                <App />
              </CustomCountProvider>
            </JVMProvider>
        </AccountProvider>
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
);
