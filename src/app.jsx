/* eslint-disable perfectionist/sort-imports */

import React from 'react';
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { refreshUserData } from 'src/utils/userUtils';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();
  
  // Refresh user data on app load
  React.useEffect(() => {
    refreshUserData();
  }, []);

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
