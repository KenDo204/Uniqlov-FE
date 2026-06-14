import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  (config) => {
    // Retrieve local JWT token or Clerk token if manual injection is needed
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add client security header if necessary (e.g. simple fraud avoidance fingerprint)
    config.headers['X-Client-Signature'] = 'unilo-sec-v1';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    // Detect custom headers or flags for security threats / fraud status
    const fraudRisk = response.headers['x-fraud-risk'];
    if (fraudRisk === 'high') {
      console.warn('CRITICAL WARNING: Request processed under high fraud risk alert.');
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          console.error('Unauthorized: Please check credentials.');
          break;
        case 403:
          if (data?.reason === 'FRAUD_DETECTION' || data?.message?.toLowerCase().includes('fraud')) {
            console.error('Suspicious behavior detected. Transaction blocked by Fraud Prevention engine.');
          } else {
            console.error('Forbidden: Access denied.');
          }
          break;
        case 429:
          console.error('Rate limit exceeded. Please try again later.');
          break;
        case 500:
          console.error('Internal Server Error. Please contact administrator.');
          break;
        default:
          console.error(data?.message || 'Server returned an error.');
      }
    } else {
      console.error('Network Error or server is offline.');
    }
    return Promise.reject(error);
  }
);
