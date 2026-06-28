import axios, { type InternalAxiosRequestConfig } from 'axios';
import { clearAuth, updateTokens } from '@/stores/slices/authSlice';

const REFRESH_URL = '/auth/refresh';

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. Đồng bộ key với authSlice
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Chữ ký bảo mật client
    config.headers['X-Client-Signature'] = 'easymall-sec-v1';

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    // Cảnh báo Fraud Risk
    const fraudRisk = response.headers['x-fraud-risk'];
    if (fraudRisk === 'high') {
      console.warn('CRITICAL WARNING: Request processed under high fraud risk alert.');
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const { store } = await import('@/stores/store');

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
        case 403:
          // Tránh lặp vô hạn nếu API refresh cũng trả về 401 hoặc 403
          if (originalRequest.url === REFRESH_URL) {
            store.dispatch(clearAuth());
            return Promise.reject(error);
          }

          // Đối với 403, loại trừ trường hợp Fraud Detection
          if (status === 403 && (data?.reason === 'FRAUD_DETECTION' || data?.message?.toLowerCase().includes('fraud'))) {
            console.error('Suspicious behavior detected. Transaction blocked by Fraud Prevention engine.');
            return Promise.reject(error);
          }

          // Chỉ cố gắng refresh token nếu chưa từng retry và request ban đầu có gửi Authorization header
          if (!originalRequest._retry && originalRequest.headers?.Authorization) {
            originalRequest._retry = true;

            if (isRefreshing) {
              // Nếu đang refresh dở, các request khác phải xếp hàng chờ
              return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
              })
                .then((token) => {
                  originalRequest.headers.Authorization = 'Bearer ' + token;
                  return axiosClient(originalRequest);
                })
                .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
              store.dispatch(clearAuth());
              return Promise.reject(error);
            }

            try {
              // Gọi API cấp lại token
              const rs = await axios.post(`${import.meta.env.VITE_API_BASE_URL}${REFRESH_URL}`, {
                token: refreshToken,
              });

              const newAccessToken = rs.data.result.accessToken;
              const newRefreshToken = rs.data.result.refreshToken;

              // Cập nhật Redux store và LocalStorage thông qua action updateTokens
              store.dispatch(updateTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken }));

              axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

              processQueue(null, newAccessToken);
              
              // Gọi lại request ban đầu bị fail
              return axiosClient(originalRequest);
            } catch (_error) {
              processQueue(_error, null);
              store.dispatch(clearAuth());
              return Promise.reject(_error);
            } finally {
              isRefreshing = false;
            }
          }

          // Nếu đã retry rồi hoặc không có Authorization header (thực sự không có quyền)
          if (status === 403) {
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