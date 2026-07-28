import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { muiTheme } from '@/theme/muiTheme';

import { store } from '../stores/store';
import { queryClient } from '../lib/queryClient';
import { TrackingProvider } from '@/components/customer/TrackingProvider';
import 'react-toastify/dist/ReactToastify.css';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />

          <TrackingProvider>
            {children}
          </TrackingProvider>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}



