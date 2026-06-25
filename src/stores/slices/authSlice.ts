import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/services/authService';
import type {
  LoginRequest,
  RegisterRequest,
  ActivateAccountRequest,
  ResendOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  LogoutRequest,
  UserResponse,
  IntrospectRequest
} from '@/types/auth';

interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Khởi tạo state ban đầu, lấy token từ localStorage nếu có
const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,
};

// --- CÁC ASYNC THUNKS ---

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(payload);
      return response.result; // Trả về AuthResponse
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);

export const getCurrentUserThunk = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response.result; // Trả về UserResponse
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy thông tin người dùng');
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken') || '';
      const refreshToken = localStorage.getItem('refreshToken') || '';
      const payload: LogoutRequest = { accessToken, refreshToken };
      
      await authService.logout(payload);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Đăng xuất thất bại');
    }
  }
);

// Các thunk cho flow đăng ký / quên mật khẩu (không thay đổi state toàn cục nhưng để UI bắt trạng thái loading/error)
export const registerThunk = createAsyncThunk('auth/register', async (payload: RegisterRequest, { rejectWithValue }) => {
  try { return await authService.register(payload); } 
  catch (error: any) { return rejectWithValue(error.response?.data?.message || 'Đăng ký thất bại'); }
});

export const activateAccountThunk = createAsyncThunk('auth/active', async (payload: ActivateAccountRequest, { rejectWithValue }) => {
  try { return await authService.activateAccount(payload); } 
  catch (error: any) { return rejectWithValue(error.response?.data?.message || 'Kích hoạt thất bại'); }
});

export const resendOtpThunk = createAsyncThunk('auth/resendOtp', async (payload: ResendOtpRequest, { rejectWithValue }) => {
  try { return await authService.resendOtp(payload); } 
  catch (error: any) { return rejectWithValue(error.response?.data?.message || 'Gửi lại OTP thất bại'); }
});

export const forgotPasswordThunk = createAsyncThunk('auth/forgotPassword', async (payload: ForgotPasswordRequest, { rejectWithValue }) => {
  try { return await authService.forgotPassword(payload); } 
  catch (error: any) { return rejectWithValue(error.response?.data?.message || 'Yêu cầu quên mật khẩu thất bại'); }
});

export const resetPasswordThunk = createAsyncThunk('auth/resetPassword', async (payload: ResetPasswordRequest, { rejectWithValue }) => {
  try { return await authService.resetPassword(payload); } 
  catch (error: any) { return rejectWithValue(error.response?.data?.message || 'Đặt lại mật khẩu thất bại'); }
});

export const introspectThunk = createAsyncThunk(
  'auth/introspect',
  async (payload: IntrospectRequest, { rejectWithValue }) => {
    try {
      const response = await authService.introspect(payload);
      return response.result ? response.result.valid : false; // Giả định Backend trả về { result: { valid: true } }
    } catch (error: any) {
      return rejectWithValue(false); 
    }
  }
);

// --- SLICE CONFIGURATION ---

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Reducer chạy tay (nếu cần dọn dẹp state nhanh không qua API)
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    // Xử lý Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        if (action.payload) {
          state.accessToken = action.payload.accessToken;
          // Lưu vào LocalStorage
          localStorage.setItem('accessToken', action.payload.accessToken);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // Xử lý Get Current User
    builder
      .addCase(getCurrentUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
        }
      })
      .addCase(getCurrentUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Xử lý Logout
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(logoutThunk.rejected, (state) => {
        // Kể cả lỗi API thì cũng nên xóa token ở client để ép user về trang login
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;