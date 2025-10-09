/* eslint-disable perfectionist/sort-imports */
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import { CountsProvider } from './contexts/CountsContext';
import { JVMProvider } from './contexts/JVMContext';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <Suspense>
        <CountsProvider>
          <JVMProvider>
            <App />
          </JVMProvider>
        </CountsProvider>
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
);
