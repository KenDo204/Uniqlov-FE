import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { queryClient } from '../lib/queryClient';
import 'react-toastify/dist/ReactToastify.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_cGxlYXNlLXVwZGF0ZS1jbGVyay1rZXktY29uZmlnLmNsZXJrLmFjY291bnRzLmRldiQ';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </ClerkProvider>
  );
}
