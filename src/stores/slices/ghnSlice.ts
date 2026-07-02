import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ghnService } from '@/services/ghnService';
import type {
  GhnProvinceResponse,
  GhnDistrictResponse,
  GhnWardResponse,
  GhnShippingFeeResponse,
  ShippingFeeRequest,
} from '@/types/ghn';
import axios from 'axios';

interface GhnState {
  provinces: GhnProvinceResponse[];
  districts: GhnDistrictResponse[];
  wards: GhnWardResponse[];
  shippingFee: GhnShippingFeeResponse | null;
  isFetching: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: GhnState = {
  provinces: [],
  districts: [],
  wards: [],
  shippingFee: null,
  isFetching: false,
  isSubmitting: false,
  error: null,
};

export const fetchProvincesThunk = createAsyncThunk(
  'ghn/fetchProvinces',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ghnService.getProvinces();
      return response.result;
    } catch (error) {
      let message = 'Lỗi tải danh sách Tỉnh/Thành phố';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchDistrictsThunk = createAsyncThunk(
  'ghn/fetchDistricts',
  async (provinceId: number, { rejectWithValue }) => {
    try {
      const response = await ghnService.getDistricts(provinceId);
      return response.result;
    } catch (error) {
      let message = 'Lỗi tải danh sách Quận/Huyện';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchWardsThunk = createAsyncThunk(
  'ghn/fetchWards',
  async (districtId: number, { rejectWithValue }) => {
    try {
      const response = await ghnService.getWards(districtId);
      return response.result;
    } catch (error) {
      let message = 'Lỗi tải danh sách Phường/Xã';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return rejectWithValue(message);
    }
  }
);

export const calculateShippingFeeThunk = createAsyncThunk(
  'ghn/calculateShippingFee',
  async (payload: ShippingFeeRequest, { rejectWithValue }) => {
    try {
      const response = await ghnService.calculateFee(payload);
      return response.result;
    } catch (error) {
      let message = 'Lỗi tính phí vận chuyển';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return rejectWithValue(message);
    }
  }
);

const ghnSlice = createSlice({
  name: 'ghn',
  initialState,
  reducers: {
    clearGhnError: (state) => {
      state.error = null;
    },
    clearDistrictsAndWards: (state) => {
      state.districts = [];
      state.wards = [];
    },
    clearWards: (state) => {
      state.wards = [];
    },
    clearShippingFee: (state) => {
      state.shippingFee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Provinces
      .addCase(fetchProvincesThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchProvincesThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload) state.provinces = action.payload;
      })
      .addCase(fetchProvincesThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      })
      // Fetch Districts
      .addCase(fetchDistrictsThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchDistrictsThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload) state.districts = action.payload;
      })
      .addCase(fetchDistrictsThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      })
      // Fetch Wards
      .addCase(fetchWardsThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchWardsThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload) state.wards = action.payload;
      })
      .addCase(fetchWardsThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      })
      // Calculate Shipping Fee
      .addCase(calculateShippingFeeThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(calculateShippingFeeThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (action.payload) state.shippingFee = action.payload;
      })
      .addCase(calculateShippingFeeThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearGhnError,
  clearDistrictsAndWards,
  clearWards,
  clearShippingFee,
} = ghnSlice.actions;
export default ghnSlice.reducer;
