/* eslint-disable perfectionist/sort-imports */
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import { CountsProvider } from './contexts/CountsContext';
import { JVMProvider } from './contexts/JVMContext';
import { CustomCountProvider } from './contexts/CustomCountContext';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <Suspense>
        <CountsProvider>
          <JVMProvider>
            <CustomCountProvider>
              <App />
            </CustomCountProvider>
          </JVMProvider>
        </CountsProvider>
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
);
