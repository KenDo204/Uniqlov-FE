import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { roleService } from '@/services/roleService';
import type { 
  RoleResponse, 
  CreateRoleRequest, 
  UpdateRoleRequest 
} from '@/types/role';

// --- ĐỊNH NGHĨA STATE ---
interface RoleState {
  rolesList: RoleResponse[];
  currentRoleDetail: RoleResponse | null;
  isFetching: boolean;   // Loading khi gọi GET (List, Detail)
  isSubmitting: boolean; // Loading khi gọi POST, PUT, DELETE
  error: string | null;
}

const initialState: RoleState = {
  rolesList: [],
  currentRoleDetail: null,
  isFetching: false,
  isSubmitting: false,
  error: null,
};

// --- CÁC ASYNC THUNKS ---

export const fetchAllRolesThunk = createAsyncThunk(
  'role/fetchAllRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await roleService.getAllRoles();
      return response.result; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải danh sách vai trò');
    }
  }
);

export const fetchRoleByIdThunk = createAsyncThunk(
  'role/fetchRoleById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await roleService.getRoleById(id);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải chi tiết vai trò');
    }
  }
);

export const createRoleThunk = createAsyncThunk(
  'role/createRole',
  async (payload: CreateRoleRequest, { rejectWithValue }) => {
    try {
      const response = await roleService.createRole(payload);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Thêm mới vai trò thất bại');
    }
  }
);

export const updateRoleThunk = createAsyncThunk(
  'role/updateRole',
  async ({ id, data }: { id: number; data: UpdateRoleRequest }, { rejectWithValue }) => {
    try {
      const response = await roleService.updateRole(id, data);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Cập nhật vai trò thất bại');
    }
  }
);

export const deleteRoleThunk = createAsyncThunk(
  'role/deleteRole',
  async (id: number, { rejectWithValue }) => {
    try {
      await roleService.deleteRole(id);
      return id; // Trả về ID để xóa khỏi state local
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Xóa vai trò thất bại');
    }
  }
);

// --- SLICE CONFIGURATION ---

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    clearCurrentRoleDetail: (state) => {
      state.currentRoleDetail = null;
    },
    clearRoleError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // --- Lấy danh sách Roles ---
    builder
      .addCase(fetchAllRolesThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchAllRolesThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload) state.rolesList = action.payload;
      })
      .addCase(fetchAllRolesThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });

    // --- Lấy chi tiết Role ---
    builder
      .addCase(fetchRoleByIdThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchRoleByIdThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload) state.currentRoleDetail = action.payload;
      })
      .addCase(fetchRoleByIdThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });

    // --- Tạo mới Role ---
    builder
      .addCase(createRoleThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createRoleThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // Optimistic update: Thêm luôn vào danh sách
        if (action.payload) {
          state.rolesList.push(action.payload);
        }
      })
      .addCase(createRoleThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // --- Cập nhật Role ---
    builder
      .addCase(updateRoleThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateRoleThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (action.payload) {
          // Cập nhật trong list
          const index = state.rolesList.findIndex(r => r.roleId === action.payload?.roleId);
          if (index !== -1) {
            state.rolesList[index] = action.payload;
          }
          // Cập nhật trong detail nếu đang xem chính role đó
          if (state.currentRoleDetail?.roleId === action.payload.roleId) {
            state.currentRoleDetail = action.payload;
          }
        }
      })
      .addCase(updateRoleThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // --- Xóa Role ---
    builder
      .addCase(deleteRoleThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteRoleThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // Lọc bỏ Role đã xóa khỏi danh sách
        state.rolesList = state.rolesList.filter(r => r.roleId !== action.payload);
      })
      .addCase(deleteRoleThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentRoleDetail, clearRoleError } = roleSlice.actions;
export default roleSlice.reducer;