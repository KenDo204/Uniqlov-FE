import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { productService } from '@/services/productService';
import type { 
  ProductResponse, 
  ProductCreateRequest, 
  ProductUpdateRequest 
} from '@/types/product';

// --- ĐỊNH NGHĨA STATE ---
interface ProductState {
  productsList: ProductResponse[];
  currentProductDetail: ProductResponse | null;
  isFetching: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: ProductState = {
  productsList: [],
  currentProductDetail: null,
  isFetching: false,
  isSubmitting: false,
  error: null,
};

// --- CÁC ASYNC THUNKS (PUBLIC) ---

export const fetchPublicProductsThunk = createAsyncThunk(
  'product/fetchPublicProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getPublicProducts();
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải danh sách sản phẩm');
    }
  }
);

export const fetchPublicProductBySlugThunk = createAsyncThunk(
  'product/fetchPublicProductBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await productService.getPublicProductBySlug(slug);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải chi tiết sản phẩm');
    }
  }
);

// --- CÁC ASYNC THUNKS (ADMIN) ---

export const fetchAdminProductsThunk = createAsyncThunk(
  'product/fetchAdminProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getAdminProducts();
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải danh sách sản phẩm admin');
    }
  }
);

export const fetchAdminProductByIdThunk = createAsyncThunk(
  'product/fetchAdminProductById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await productService.getAdminProductById(id);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải chi tiết sản phẩm admin');
    }
  }
);

export const createProductThunk = createAsyncThunk(
  'product/createProduct',
  async (payload: ProductCreateRequest, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(payload);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Thêm mới sản phẩm thất bại');
    }
  }
);

export const updateProductThunk = createAsyncThunk(
  'product/updateProduct',
  async ({ id, data }: { id: number; data: ProductUpdateRequest }, { rejectWithValue }) => {
    try {
      const response = await productService.updateProduct(id, data);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Cập nhật sản phẩm thất bại');
    }
  }
);

export const deleteProductThunk = createAsyncThunk(
  'product/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id);
      return id; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Xóa sản phẩm thất bại');
    }
  }
);

// --- SLICE CONFIGURATION ---

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearCurrentProductDetail: (state) => {
      state.currentProductDetail = null;
    },
    clearProductError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Helper function gộp logic fetching list
    const handleFetchListPending = (state: ProductState) => {
      state.isFetching = true;
      state.error = null;
    };
    const handleFetchListFulfilled = (state: ProductState, action: PayloadAction<ProductResponse[] | undefined>) => {
      state.isFetching = false;
      if (action.payload) state.productsList = action.payload;
    };
    const handleFetchListRejected = (state: ProductState, action: any) => {
      state.isFetching = false;
      state.error = action.payload as string;
    };

    // Handle Public & Admin List
    builder
      .addCase(fetchPublicProductsThunk.pending, handleFetchListPending)
      .addCase(fetchPublicProductsThunk.fulfilled, handleFetchListFulfilled)
      .addCase(fetchPublicProductsThunk.rejected, handleFetchListRejected)
      .addCase(fetchAdminProductsThunk.pending, handleFetchListPending)
      .addCase(fetchAdminProductsThunk.fulfilled, handleFetchListFulfilled)
      .addCase(fetchAdminProductsThunk.rejected, handleFetchListRejected);

    // Helper function gộp logic fetching detail
    const handleFetchDetailPending = (state: ProductState) => {
      state.isFetching = true;
      state.error = null;
    };
    const handleFetchDetailFulfilled = (state: ProductState, action: PayloadAction<ProductResponse | undefined>) => {
      state.isFetching = false;
      if (action.payload) state.currentProductDetail = action.payload;
    };
    const handleFetchDetailRejected = (state: ProductState, action: any) => {
      state.isFetching = false;
      state.error = action.payload as string;
    };

    // Handle Public & Admin Detail
    builder
      .addCase(fetchPublicProductBySlugThunk.pending, handleFetchDetailPending)
      .addCase(fetchPublicProductBySlugThunk.fulfilled, handleFetchDetailFulfilled)
      .addCase(fetchPublicProductBySlugThunk.rejected, handleFetchDetailRejected)
      .addCase(fetchAdminProductByIdThunk.pending, handleFetchDetailPending)
      .addCase(fetchAdminProductByIdThunk.fulfilled, handleFetchDetailFulfilled)
      .addCase(fetchAdminProductByIdThunk.rejected, handleFetchDetailRejected);

    // --- CREATE ---
    builder
      .addCase(createProductThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (action.payload) {
          state.productsList.unshift(action.payload); // Thêm lên đầu danh sách
        }
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // --- UPDATE ---
    builder
      .addCase(updateProductThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (action.payload) {
          const index = state.productsList.findIndex(p => p.productId === action.payload?.productId);
          if (index !== -1) {
            state.productsList[index] = action.payload;
          }
          if (state.currentProductDetail?.productId === action.payload.productId) {
            state.currentProductDetail = action.payload;
          }
        }
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // --- DELETE ---
    builder
      .addCase(deleteProductThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // Controller ghi chú là soft-delete (set inStock=false). 
        // Thay vì xóa hẳn khỏi mảng, ta cập nhật lại trạng thái inStock của sản phẩm đó để UI hiển thị.
        const index = state.productsList.findIndex(p => p.productId === action.payload);
        if (index !== -1) {
          state.productsList[index].inStock = false;
        }
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentProductDetail, clearProductError } = productSlice.actions;
export default productSlice.reducer;