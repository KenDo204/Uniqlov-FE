import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sliderService } from '@/services/sliderService';
import type { SliderResponse, SliderCreateRequest, SliderUpdateRequest } from '@/types/slider';
import type { PageResponse } from '@/types/common/apiResponse';

interface SliderState {
  sliders: PageResponse<SliderResponse> | null;
  publicSliders: SliderResponse[];
  isFetching: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: SliderState = {
  sliders: null,
  publicSliders: [],
  isFetching: false,
  isSubmitting: false,
  error: null,
};

export const fetchPublicSliders = createAsyncThunk(
  'slider/fetchPublic',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sliderService.getPublicSliders();
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải danh sách slider');
    }
  }
);

export const fetchAdminSliders = createAsyncThunk(
  'slider/fetchAdmin',
  async (params: { page?: number; size?: number; sort?: string }, { rejectWithValue }) => {
    try {
      const response = await sliderService.getAllSliders(params.page, params.size, params.sort);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải danh sách slider quản trị');
    }
  }
);

export const createSlider = createAsyncThunk(
  'slider/create',
  async (data: SliderCreateRequest, { rejectWithValue }) => {
    try {
      const response = await sliderService.createSlider(data);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tạo slider');
    }
  }
);

export const updateSlider = createAsyncThunk(
  'slider/update',
  async ({ sliderId, data }: { sliderId: number; data: SliderUpdateRequest }, { rejectWithValue }) => {
    try {
      const response = await sliderService.updateSlider(sliderId, data);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật slider');
    }
  }
);

export const deleteSlider = createAsyncThunk(
  'slider/delete',
  async (sliderId: number, { rejectWithValue }) => {
    try {
      await sliderService.deleteSlider(sliderId);
      return sliderId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa slider');
    }
  }
);

const sliderSlice = createSlice({
  name: 'slider',
  initialState,
  reducers: {
    clearSliderError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Public Sliders
    builder.addCase(fetchPublicSliders.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(fetchPublicSliders.fulfilled, (state, action) => {
      state.isFetching = false;
      state.publicSliders = action.payload || [];
    });
    builder.addCase(fetchPublicSliders.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.payload as string;
    });

    // Fetch Admin Sliders
    builder.addCase(fetchAdminSliders.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(fetchAdminSliders.fulfilled, (state, action) => {
      state.isFetching = false;
      state.sliders = action.payload || null;
    });
    builder.addCase(fetchAdminSliders.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.payload as string;
    });

    // Create Slider
    builder.addCase(createSlider.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(createSlider.fulfilled, (state) => {
      state.isSubmitting = false;
      // We don't automatically append to pagination since it might break order/pagination
      // Best practice is to refetch
    });
    builder.addCase(createSlider.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload as string;
    });

    // Update Slider
    builder.addCase(updateSlider.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(updateSlider.fulfilled, (state, action) => {
      state.isSubmitting = false;
      if (state.sliders && state.sliders.content) {
        state.sliders.content = state.sliders.content.map(slider =>
          slider.sliderId === action.payload?.sliderId ? action.payload : slider
        );
      }
    });
    builder.addCase(updateSlider.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload as string;
    });

    // Delete Slider
    builder.addCase(deleteSlider.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(deleteSlider.fulfilled, (state, action) => {
      state.isSubmitting = false;
      if (state.sliders && state.sliders.content) {
        state.sliders.content = state.sliders.content.filter(s => s.sliderId !== action.payload);
        state.sliders.totalElements -= 1;
      }
    });
    builder.addCase(deleteSlider.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload as string;
    });
  }
});

export const { clearSliderError } = sliderSlice.actions;
export default sliderSlice.reducer;
