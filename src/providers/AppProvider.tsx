import React from 'react';
// import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';

// XÓA: Bỏ dòng import BrowserRouter ở đây

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { muiTheme } from '@/theme/muiTheme';

import { store } from '../stores/store';
import { queryClient } from '../lib/queryClient';
import 'react-toastify/dist/ReactToastify.css';

// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_cGxlYXNlLXVwZGF0ZS1jbGVyay1rZXktY29uZmlnLmNsZXJrLmFjY291bnRzLmRldiQ';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {/* <ClerkProvider publishableKey={PUBLISHABLE_KEY}> */}
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={muiTheme}>
              <CssBaseline />
              
              {/* SỬA: Đã bỏ thẻ <BrowserRouter> bọc ngoài children */}
              {children}
              
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
        {/* </ClerkProvider> */}
      </GoogleOAuthProvider>
    </Provider>
  );
}