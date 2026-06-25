import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@/services/userService';
import type { PageResponse } from '@/types/common/apiResponse';
import type { 
  UserDetailResponse, 
  CreateUserRequest, 
  UpdateUserRequest 
} from '@/types/user';

// --- ĐỊNH NGHĨA STATE ---
interface UserState {
  usersList: PageResponse<UserDetailResponse> | null;
  currentUserDetail: UserDetailResponse | null;
  isFetching: boolean;   // Loading cho GET (Table, Detail)
  isSubmitting: boolean; // Loading cho POST, PUT, DELETE (Button)
  error: string | null;
}

const initialState: UserState = {
  usersList: null,
  currentUserDetail: null,
  isFetching: false,
  isSubmitting: false,
  error: null,
};

// --- CÁC ASYNC THUNKS ---

export const fetchAllUsersThunk = createAsyncThunk(
  'user/fetchAllUsers',
  async (params: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await userService.getAllUsers(params.page, params.size);
      return response.result; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải danh sách người dùng');
    }
  }
);

export const fetchUserByIdThunk = createAsyncThunk(
  'user/fetchUserById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await userService.getUserById(id);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải thông tin chi tiết');
    }
  }
);

export const createUserThunk = createAsyncThunk(
  'user/createUser',
  async (payload: CreateUserRequest, { rejectWithValue }) => {
    try {
      const response = await userService.createUser(payload);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Thêm mới người dùng thất bại');
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  'user/updateUser',
  async ({ id, data }: { id: number; data: UpdateUserRequest }, { rejectWithValue }) => {
    try {
      const response = await userService.updateUser(id, data);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Cập nhật người dùng thất bại');
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  'user/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return id; // Trả về ID để xóa khỏi state local
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Xóa người dùng thất bại');
    }
  }
);

// --- SLICE CONFIGURATION ---

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Dùng để clear data khi rời khỏi trang (unmount component)
    clearCurrentUserDetail: (state) => {
      state.currentUserDetail = null;
    },
    clearUserError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // --- Lấy danh sách users ---
    builder
      .addCase(fetchAllUsersThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchAllUsersThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload) state.usersList = action.payload;
      })
      .addCase(fetchAllUsersThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });

    // --- Lấy chi tiết user ---
    builder
      .addCase(fetchUserByIdThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchUserByIdThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload) state.currentUserDetail = action.payload;
      })
      .addCase(fetchUserByIdThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });

    // --- Tạo mới user ---
    builder
      .addCase(createUserThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createUserThunk.fulfilled, (state) => {
        state.isSubmitting = false;
        // Thực tế khi tạo thành công, ta thường gọi lại hàm fetchAllUsersThunk ở Component 
        // để cập nhật lại list và pagination, nên không cần push tay vào state ở đây.
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // --- Cập nhật user ---
    builder
      .addCase(updateUserThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // Cập nhật lại thông tin trong list nếu user đang nằm trong list hiện tại
        if (state.usersList && action.payload) {
          const index = state.usersList.content.findIndex(u => u.userId === action.payload?.userId);
          if (index !== -1) {
            state.usersList.content[index] = action.payload;
          }
        }
        // Cập nhật cả ở detail view nếu đang xem người đó
        if (state.currentUserDetail?.userId === action.payload?.userId) {
          state.currentUserDetail = action.payload || null;
        }
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // --- Xóa user ---
    builder
      .addCase(deleteUserThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // Xóa tạm trên UI để tạo cảm giác mượt mà (Optimistic Update)
        if (state.usersList) {
          state.usersList.content = state.usersList.content.filter(u => u.userId !== action.payload);
          state.usersList.totalElements -= 1;
        }
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentUserDetail, clearUserError } = userSlice.actions;
export default userSlice.reducer;