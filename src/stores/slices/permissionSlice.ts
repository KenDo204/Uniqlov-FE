import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { permissionService } from '@/services/permissionService';
import type { 
  PermissionResponse, 
  CreatePermissionRequest, 
  UpdatePermissionRequest 
} from '@/types/permission';

// --- ĐỊNH NGHĨA STATE ---
interface PermissionState {
  permissionsList: PermissionResponse[];
  isFetching: boolean;   // Loading khi GET danh sách
  isSubmitting: boolean; // Loading khi POST, PUT, DELETE
  error: string | null;
}

const initialState: PermissionState = {
  permissionsList: [],
  isFetching: false,
  isSubmitting: false,
  error: null,
};

// --- CÁC ASYNC THUNKS ---

export const fetchAllPermissionsThunk = createAsyncThunk(
  'permission/fetchAllPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await permissionService.getAllPermissions();
      return response.result; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải danh sách quyền');
    }
  }
);

export const createPermissionThunk = createAsyncThunk(
  'permission/createPermission',
  async (payload: CreatePermissionRequest, { rejectWithValue }) => {
    try {
      const response = await permissionService.createPermission(payload);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Thêm mới quyền thất bại');
    }
  }
);

export const updatePermissionThunk = createAsyncThunk(
  'permission/updatePermission',
  async ({ id, data }: { id: number; data: UpdatePermissionRequest }, { rejectWithValue }) => {
    try {
      const response = await permissionService.updatePermission(id, data);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Cập nhật quyền thất bại');
    }
  }
);

export const deletePermissionThunk = createAsyncThunk(
  'permission/deletePermission',
  async (id: number, { rejectWithValue }) => {
    try {
      await permissionService.deletePermission(id);
      return id; // Trả về ID để xóa khỏi store local
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Xóa quyền thất bại');
    }
  }
);

// --- SLICE CONFIGURATION ---

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    clearPermissionError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // --- Lấy danh sách Permissions ---
    builder
      .addCase(fetchAllPermissionsThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchAllPermissionsThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload) state.permissionsList = action.payload;
      })
      .addCase(fetchAllPermissionsThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });

    // --- Tạo mới Permission ---
    builder
      .addCase(createPermissionThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createPermissionThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // Push thẳng item mới vào danh sách hiện tại
        if (action.payload) {
          state.permissionsList.push(action.payload);
        }
      })
      .addCase(createPermissionThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // --- Cập nhật Permission ---
    builder
      .addCase(updatePermissionThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updatePermissionThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // Cập nhật lại item trong mảng
        if (action.payload) {
          const index = state.permissionsList.findIndex(p => p.permissionId === action.payload?.permissionId);
          if (index !== -1) {
            state.permissionsList[index] = action.payload;
          }
        }
      })
      .addCase(updatePermissionThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // --- Xóa Permission ---
    builder
      .addCase(deletePermissionThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deletePermissionThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // Xóa item khỏi mảng
        state.permissionsList = state.permissionsList.filter(p => p.permissionId !== action.payload);
      })
      .addCase(deletePermissionThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPermissionError } = permissionSlice.actions;
export default permissionSlice.reducer;