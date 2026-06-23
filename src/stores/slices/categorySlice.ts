import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { categoryService } from '@/services/categoryService';
import type { 
  CategoryResponse, 
  CategoryCreateRequest, 
  CategoryUpdateRequest 
} from '@/types/category';

// --- HÀM TIỆN ÍCH XỬ LÝ CÂY ĐỆ QUY ---

const addNodeToTree = (tree: CategoryResponse[], newNode: CategoryResponse): CategoryResponse[] => {
  if (!newNode.parentId) return [...tree, newNode]; // Là node gốc
  return tree.map(node => {
    if (node.categoryId === newNode.parentId) {
      return { ...node, children: [...(node.children || []), newNode] };
    }
    if (node.children && node.children.length > 0) {
      return { ...node, children: addNodeToTree(node.children, newNode) };
    }
    return node;
  });
};

const updateNodeInTree = (tree: CategoryResponse[], updatedNode: CategoryResponse): CategoryResponse[] => {
  return tree.map(node => {
    if (node.categoryId === updatedNode.categoryId) {
      // Giữ nguyên children cũ, chỉ cập nhật thông tin node hiện tại
      return { ...updatedNode, children: node.children };
    }
    if (node.children && node.children.length > 0) {
      return { ...node, children: updateNodeInTree(node.children, updatedNode) };
    }
    return node;
  });
};

const deleteNodeFromTree = (tree: CategoryResponse[], categoryIdToRemove: number): CategoryResponse[] => {
  return tree
    .filter(node => node.categoryId !== categoryIdToRemove) // Lọc bỏ node nếu nó ở level hiện tại
    .map(node => ({
      ...node,
      children: node.children && node.children.length > 0 
        ? deleteNodeFromTree(node.children, categoryIdToRemove) // Đệ quy tìm và xóa ở level con
        : []
    }));
};

// --- ĐỊNH NGHĨA STATE ---

interface CategoryState {
  categoryTree: CategoryResponse[]; // Dùng chung cho cả Public và Admin tùy context gọi
  isFetching: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categoryTree: [],
  isFetching: false,
  isSubmitting: false,
  error: null,
};

// --- CÁC ASYNC THUNKS ---

export const fetchAdminCategoriesThunk = createAsyncThunk(
  'category/fetchAdminCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getAdminCategoryTree();
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải danh mục Admin');
    }
  }
);

export const fetchPublicCategoriesThunk = createAsyncThunk(
  'category/fetchPublicCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getPublicCategoryTree();
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải danh mục cửa hàng');
    }
  }
);

export const createCategoryThunk = createAsyncThunk(
  'category/createCategory',
  async (payload: CategoryCreateRequest, { rejectWithValue }) => {
    try {
      const response = await categoryService.createCategory(payload);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Tạo danh mục thất bại');
    }
  }
);

export const updateCategoryThunk = createAsyncThunk(
  'category/updateCategory',
  async ({ id, data }: { id: number; data: CategoryUpdateRequest }, { rejectWithValue }) => {
    try {
      const response = await categoryService.updateCategory(id, data);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Cập nhật danh mục thất bại');
    }
  }
);

export const deleteCategoryThunk = createAsyncThunk(
  'category/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await categoryService.deleteCategory(id);
      return id; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Xóa danh mục thất bại');
    }
  }
);

// --- SLICE CONFIGURATION ---

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Logic gộp chung cho việc fetch dữ liệu (cả Public và Admin đều ghi đè tree)
    const handleFetchPending = (state: CategoryState) => {
      state.isFetching = true;
      state.error = null;
    };
    const handleFetchFulfilled = (state: CategoryState, action: PayloadAction<CategoryResponse[] | undefined>) => {
      state.isFetching = false;
      if (action.payload) state.categoryTree = action.payload;
    };
    const handleFetchRejected = (state: CategoryState, action: any) => {
      state.isFetching = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(fetchAdminCategoriesThunk.pending, handleFetchPending)
      .addCase(fetchAdminCategoriesThunk.fulfilled, handleFetchFulfilled)
      .addCase(fetchAdminCategoriesThunk.rejected, handleFetchRejected)
      .addCase(fetchPublicCategoriesThunk.pending, handleFetchPending)
      .addCase(fetchPublicCategoriesThunk.fulfilled, handleFetchFulfilled)
      .addCase(fetchPublicCategoriesThunk.rejected, handleFetchRejected);

    // --- Tạo mới Category ---
    builder
      .addCase(createCategoryThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (action.payload) {
          state.categoryTree = addNodeToTree(state.categoryTree, action.payload);
        }
      })
      .addCase(createCategoryThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // --- Cập nhật Category ---
    builder
      .addCase(updateCategoryThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (action.payload) {
          state.categoryTree = updateNodeInTree(state.categoryTree, action.payload);
        }
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // --- Xóa Category ---
    builder
      .addCase(deleteCategoryThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.categoryTree = deleteNodeFromTree(state.categoryTree, action.payload);
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;